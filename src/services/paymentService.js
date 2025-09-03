import { withPaymentInterceptor, decodeXPaymentResponse } from "x402-axios";
import axios from "axios";
import { addCredits } from "./userService";

// Credit package options
export const CREDIT_PACKAGES = [
  { id: 'basic', name: 'Basic', credits: 10, price: 2.5, pricePerCredit: 0.25 },
  { id: 'standard', name: 'Standard', credits: 50, price: 10, pricePerCredit: 0.20, popular: true },
  { id: 'premium', name: 'Premium', credits: 100, price: 15, pricePerCredit: 0.15 },
  { id: 'unlimited', name: 'Pro', credits: 500, price: 50, pricePerCredit: 0.10 }
];

// Create a payment session
export const createPaymentSession = async (walletClient, packageId) => {
  if (!walletClient || !walletClient.account) {
    throw new Error("Please connect your wallet");
  }
  
  // Find the selected package
  const selectedPackage = CREDIT_PACKAGES.find(pkg => pkg.id === packageId);
  if (!selectedPackage) {
    throw new Error("Invalid package selected");
  }
  
  // Format amount as string with dollar sign
  const amount = `$${selectedPackage.price.toFixed(2)}`;
  
  try {
    const baseClient = axios.create({
      baseURL: "https://payments.vistara.dev",
      headers: {
        "Content-Type": "application/json",
      },
    });
    
    const apiClient = withPaymentInterceptor(baseClient, walletClient);
    const response = await apiClient.post("/api/payment", { 
      amount,
      metadata: {
        packageId: selectedPackage.id,
        credits: selectedPackage.credits
      }
    });
    
    const paymentResponse = response.config.headers["X-PAYMENT"];
    
    if (!paymentResponse) {
      throw new Error("Payment response is absent");
    }
    
    const decoded = decodeXPaymentResponse(paymentResponse);
    console.log(`Payment successful: ${JSON.stringify(decoded)}`);
    
    return {
      success: true,
      transactionId: decoded.id,
      amount: selectedPackage.price,
      credits: selectedPackage.credits,
      timestamp: new Date().toISOString()
    };
  } catch (error) {
    console.error("Payment error:", error);
    throw error;
  }
};

// Process successful payment and add credits to user
export const processSuccessfulPayment = async (userId, transactionData) => {
  try {
    // Add credits to user account
    await addCredits(userId, transactionData.credits);
    
    return {
      success: true,
      credits: transactionData.credits,
      newTransaction: {
        id: transactionData.transactionId,
        amount: transactionData.amount,
        credits: transactionData.credits,
        timestamp: transactionData.timestamp,
        type: 'purchase'
      }
    };
  } catch (error) {
    console.error("Error processing payment:", error);
    throw error;
  }
};

// Calculate bulk discount
export const calculateBulkDiscount = (basePrice, quantity) => {
  let discountPercentage = 0;
  
  if (quantity >= 100) {
    discountPercentage = 0.25; // 25% discount for 100+ credits
  } else if (quantity >= 50) {
    discountPercentage = 0.20; // 20% discount for 50+ credits
  } else if (quantity >= 20) {
    discountPercentage = 0.15; // 15% discount for 20+ credits
  } else if (quantity >= 10) {
    discountPercentage = 0.10; // 10% discount for 10+ credits
  }
  
  const discountAmount = basePrice * quantity * discountPercentage;
  const finalPrice = (basePrice * quantity) - discountAmount;
  
  return {
    originalPrice: basePrice * quantity,
    discountPercentage,
    discountAmount,
    finalPrice
  };
};


# MemeWarpAI Payment System Documentation

This document provides detailed information about the payment system used in MemeWarpAI, including credit packages, payment processing, and transaction management.

## Table of Contents

1. [Credit System Overview](#credit-system-overview)
2. [Credit Packages](#credit-packages)
3. [Payment Processing](#payment-processing)
4. [Transaction Management](#transaction-management)
5. [Wallet Integration](#wallet-integration)
6. [Security Considerations](#security-considerations)

## Credit System Overview

MemeWarpAI uses a credit-based system for monetization. Users purchase credits that can be spent on various features, primarily AI-powered meme generation. This system allows for flexible pricing and usage patterns.

### Key Concepts

- **Credits**: The virtual currency used within MemeWarpAI
- **Credit Packages**: Bundles of credits available for purchase at different price points
- **Micro-transactions**: Small payments for individual features or actions
- **Bulk Discounts**: Discounts applied when purchasing larger credit packages

## Credit Packages

MemeWarpAI offers several credit packages to accommodate different user needs:

| Package | Credits | Price | Price Per Credit | Savings |
|---------|---------|-------|------------------|---------|
| Basic   | 10      | $2.50 | $0.25            | 0%      |
| Standard| 50      | $10.00| $0.20            | 20%     |
| Premium | 100     | $15.00| $0.15            | 40%     |
| Pro     | 500     | $50.00| $0.10            | 60%     |

### Credit Usage

- Generating AI captions: 1 credit
- Analyzing image content: 1 credit
- Saving a meme to your gallery: 0 credits (free)
- Sharing a meme: 0 credits (free)

## Payment Processing

MemeWarpAI uses a secure payment processing system that supports cryptocurrency payments through Web3 wallets.

### Payment Flow

1. User selects a credit package
2. System creates a payment session with the specified amount
3. User approves the transaction in their wallet
4. Payment is processed and verified
5. Credits are added to the user's account
6. Transaction is recorded in the user's payment history

### Implementation Details

The payment system is implemented using the following components:

- **x402-axios**: A library for handling payment interceptors
- **Wallet Integration**: Using wagmi and RainbowKit for wallet connections
- **Transaction Verification**: Server-side verification of payment transactions
- **Credit Management**: Database operations to manage user credit balances

## Transaction Management

All payment transactions are recorded and managed to ensure transparency and accountability.

### Transaction Types

- **Credit Purchase**: Adding credits to a user's account through payment
- **Credit Usage**: Spending credits on features or actions

### Transaction Data

Each transaction includes the following information:

- Transaction ID
- User ID
- Amount (in credits)
- Transaction type
- Timestamp
- Related metadata (e.g., payment method, feature used)

### Transaction History

Users can view their complete transaction history in their dashboard, including:

- Date and time of each transaction
- Transaction type (purchase or usage)
- Amount of credits added or used
- Running balance

## Wallet Integration

MemeWarpAI integrates with Web3 wallets for payment processing.

### Supported Wallets

Through RainbowKit and wagmi, MemeWarpAI supports a wide range of wallets:

- MetaMask
- WalletConnect
- Coinbase Wallet
- Rainbow
- And many others

### Integration Code

The wallet integration is implemented as follows:

```javascript
import { useWalletClient } from "wagmi";
import { withPaymentInterceptor, decodeXPaymentResponse } from "x402-axios";
import axios from "axios";

// In your payment service
export const createPaymentSession = async (walletClient, packageId) => {
  if (!walletClient || !walletClient.account) {
    throw new Error("Please connect your wallet");
  }
  
  // Find the selected package
  const selectedPackage = CREDIT_PACKAGES.find(pkg => pkg.id === packageId);
  
  // Format amount as string with dollar sign
  const amount = `$${selectedPackage.price.toFixed(2)}`;
  
  // Create payment client with interceptor
  const baseClient = axios.create({
    baseURL: "https://payments.vistara.dev",
    headers: {
      "Content-Type": "application/json",
    },
  });
  
  const apiClient = withPaymentInterceptor(baseClient, walletClient);
  
  // Make payment request
  const response = await apiClient.post("/api/payment", { 
    amount,
    metadata: {
      packageId: selectedPackage.id,
      credits: selectedPackage.credits
    }
  });
  
  // Process payment response
  const paymentResponse = response.config.headers["X-PAYMENT"];
  const decoded = decodeXPaymentResponse(paymentResponse);
  
  return {
    success: true,
    transactionId: decoded.id,
    amount: selectedPackage.price,
    credits: selectedPackage.credits,
    timestamp: new Date().toISOString()
  };
};
```

## Security Considerations

The payment system is designed with security as a top priority.

### Payment Data Security

- Payment data is never stored on the client side
- All payment communications use HTTPS
- Sensitive payment information is handled by secure payment processors
- No credit card information is stored in the application database

### Transaction Verification

- All transactions are verified on the server side
- Cryptographic signatures ensure transaction integrity
- Transaction IDs are unique and tamper-proof
- Double-spending prevention is implemented

### Fraud Prevention

- Rate limiting prevents abuse of the payment system
- Suspicious activity monitoring is in place
- IP-based restrictions for high-risk regions
- Account verification requirements for large transactions


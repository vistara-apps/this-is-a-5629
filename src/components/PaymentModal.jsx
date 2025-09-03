import { useState } from 'react';
import { X, CreditCard, AlertCircle, Wallet, Loader2 } from 'lucide-react';
import { CreditPackages, CreditBalance } from './CreditPackages';
import { CREDIT_PACKAGES, createPaymentSession } from '../services/paymentService';
import { useWalletClient } from 'wagmi';
import { useAuth } from '../hooks/useAuth';

export function PaymentModal({ isOpen, onClose, onPaymentSuccess, memeCount = 1 }) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState('standard');
  const [error, setError] = useState(null);
  const { data: walletClient } = useWalletClient();
  const { currentUser, userData, purchaseCredits } = useAuth();
  
  const pricePerMeme = 0.25;
  const singleMemePrice = (pricePerMeme * memeCount).toFixed(2);
  const selectedPkg = CREDIT_PACKAGES.find(pkg => pkg.id === selectedPackage);

  const handlePayment = async () => {
    setIsProcessing(true);
    setError(null);
    
    try {
      // Create payment session
      const paymentResult = await createPaymentSession(walletClient, selectedPackage);
      
      // Process the payment and add credits to user account
      if (paymentResult.success && currentUser) {
        await purchaseCredits(paymentResult.credits);
        
        // Close modal and notify parent component
        onClose();
        if (onPaymentSuccess) {
          onPaymentSuccess(paymentResult);
        }
      }
    } catch (err) {
      console.error('Payment failed:', err);
      setError(err.message || 'Payment failed. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="glass-card rounded-lg max-w-md w-full p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-white text-xl font-bold">Purchase Credits</h2>
          <button
            onClick={onClose}
            className="text-white/60 hover:text-white transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {userData && (
          <div className="mb-6">
            <CreditBalance credits={userData.credits || 0} />
          </div>
        )}

        <div className="space-y-6 mb-6">
          <div className="glass-card bg-white/5 rounded-lg p-4">
            <div className="flex justify-between text-white">
              <span>Memes to generate:</span>
              <span>{memeCount}</span>
            </div>
            <div className="flex justify-between text-white">
              <span>Price per meme:</span>
              <span>${pricePerMeme}</span>
            </div>
            <hr className="border-white/20 my-2" />
            <div className="flex justify-between text-white font-bold">
              <span>Single purchase:</span>
              <span>${singleMemePrice}</span>
            </div>
          </div>
          
          <div>
            <p className="text-white mb-2">Save by purchasing credit packages:</p>
            <CreditPackages 
              onSelectPackage={setSelectedPackage} 
              selectedPackage={selectedPackage}
            />
          </div>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-500/20 border border-red-500/30 rounded-lg flex items-center space-x-2 text-red-200">
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <p className="text-sm">{error}</p>
          </div>
        )}

        <div className="space-y-3">
          <button
            onClick={handlePayment}
            disabled={isProcessing || !walletClient}
            className="w-full flex items-center justify-center space-x-2 bg-accent text-white px-6 py-3 rounded-lg hover:bg-accent/90 transition-colors disabled:opacity-50"
          >
            {isProcessing ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Processing...</span>
              </>
            ) : (
              <>
                <Wallet className="w-5 h-5" />
                <span>
                  {selectedPkg ? `Pay $${selectedPkg.price} for ${selectedPkg.credits} Credits` : 'Pay with Wallet'}
                </span>
              </>
            )}
          </button>
          
          <p className="text-purple-200 text-xs text-center">
            Secure payment powered by blockchain technology
          </p>
        </div>
      </div>
    </div>
  );
}

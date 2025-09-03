import { useState } from 'react';
import { X, CreditCard } from 'lucide-react';

export function PaymentModal({ isOpen, onClose, onPayment, memeCount = 1 }) {
  const [isProcessing, setIsProcessing] = useState(false);
  
  const pricePerMeme = 0.25;
  const totalPrice = (pricePerMeme * memeCount).toFixed(2);

  const handlePayment = async () => {
    setIsProcessing(true);
    try {
      await onPayment(`$${totalPrice}`);
      onClose();
    } catch (error) {
      alert('Payment failed: ' + error.message);
    } finally {
      setIsProcessing(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="glass-card rounded-lg max-w-md w-full p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-white text-xl font-bold">Generate Meme</h2>
          <button
            onClick={onClose}
            className="text-white/60 hover:text-white transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="space-y-4 mb-6">
          <div className="flex justify-between text-white">
            <span>Memes to generate:</span>
            <span>{memeCount}</span>
          </div>
          <div className="flex justify-between text-white">
            <span>Price per meme:</span>
            <span>${pricePerMeme}</span>
          </div>
          <hr className="border-white/20" />
          <div className="flex justify-between text-white font-bold text-lg">
            <span>Total:</span>
            <span>${totalPrice}</span>
          </div>
        </div>

        <div className="space-y-3">
          <button
            onClick={handlePayment}
            disabled={isProcessing}
            className="w-full flex items-center justify-center space-x-2 bg-accent text-white px-6 py-3 rounded-lg hover:bg-accent/90 transition-colors disabled:opacity-50"
          >
            <CreditCard className="w-5 h-5" />
            <span>{isProcessing ? 'Processing...' : 'Pay with Wallet'}</span>
          </button>
          
          <p className="text-purple-200 text-xs text-center">
            Secure payment powered by blockchain technology
          </p>
        </div>
      </div>
    </div>
  );
}
import { useState } from 'react';
import { Check, CreditCard, Sparkles } from 'lucide-react';
import { CREDIT_PACKAGES } from '../services/paymentService';

export function CreditPackages({ onSelectPackage, selectedPackage, className = '' }) {
  return (
    <div className={`space-y-4 ${className}`}>
      <h3 className="text-white font-semibold text-lg">Choose a Credit Package</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {CREDIT_PACKAGES.map((pkg) => (
          <div
            key={pkg.id}
            className={`glass-card rounded-lg p-4 cursor-pointer transition-all duration-200 relative overflow-hidden ${
              selectedPackage === pkg.id
                ? 'ring-2 ring-accent'
                : 'hover:bg-white/20'
            }`}
            onClick={() => onSelectPackage(pkg.id)}
          >
            {pkg.popular && (
              <div className="absolute top-0 right-0">
                <div className="bg-accent text-white text-xs font-bold px-3 py-1 transform rotate-45 translate-x-2 -translate-y-1">
                  POPULAR
                </div>
              </div>
            )}
            
            <div className="flex items-start justify-between">
              <div>
                <h4 className="text-white font-semibold">{pkg.name}</h4>
                <p className="text-purple-200 text-sm">{pkg.credits} credits</p>
              </div>
              
              {selectedPackage === pkg.id && (
                <div className="w-6 h-6 bg-accent rounded-full flex items-center justify-center">
                  <Check className="w-4 h-4 text-white" />
                </div>
              )}
            </div>
            
            <div className="mt-4 flex items-baseline space-x-1">
              <span className="text-white text-2xl font-bold">${pkg.price}</span>
              <span className="text-purple-200 text-sm">
                (${pkg.pricePerCredit.toFixed(2)}/credit)
              </span>
            </div>
            
            {pkg.pricePerCredit < 0.25 && (
              <div className="mt-2 flex items-center space-x-1 text-green-400 text-xs">
                <Sparkles className="w-3 h-3" />
                <span>Save {Math.round((1 - pkg.pricePerCredit / 0.25) * 100)}%</span>
              </div>
            )}
          </div>
        ))}
      </div>
      
      <div className="text-purple-200 text-sm">
        <p>Credits never expire and can be used for any meme generation.</p>
      </div>
    </div>
  );
}

export function CreditBalance({ credits, className = '' }) {
  return (
    <div className={`flex items-center space-x-2 ${className}`}>
      <div className="w-8 h-8 bg-accent/20 rounded-full flex items-center justify-center">
        <CreditCard className="w-4 h-4 text-accent" />
      </div>
      <div>
        <p className="text-white text-sm">Credit Balance</p>
        <p className="text-white font-bold">{credits || 0}</p>
      </div>
    </div>
  );
}


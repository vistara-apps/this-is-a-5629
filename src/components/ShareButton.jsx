import { Share2, Twitter, Facebook, Instagram, Download, Clipboard, MessageCircle, AlertCircle, CheckCircle } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useSocialShare } from '../hooks/useSocialShare';

export function ShareButton({ memeCanvas, memeId, className = '' }) {
  const { share, isSharing, error, lastSharedPlatform } = useSocialShare();
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  // Handle success message display
  useEffect(() => {
    if (lastSharedPlatform) {
      const messages = {
        twitter: 'Shared to Twitter!',
        facebook: 'Shared to Facebook!',
        instagram: 'Image downloaded for Instagram!',
        farcaster: 'Shared to Farcaster!',
        clipboard: 'Copied to clipboard!',
        download: 'Meme downloaded!'
      };
      
      setSuccessMessage(messages[lastSharedPlatform] || 'Shared successfully!');
      setShowSuccessMessage(true);
      
      const timer = setTimeout(() => {
        setShowSuccessMessage(false);
      }, 3000);
      
      return () => clearTimeout(timer);
    }
  }, [lastSharedPlatform]);

  const handleShare = async (platform) => {
    try {
      if (platform === 'twitter') {
        await share.twitter(memeCanvas, memeId, 'Check out this meme I made with MemeWarpAI! 🔥');
      } else if (platform === 'facebook') {
        await share.facebook(memeCanvas, memeId);
      } else if (platform === 'instagram') {
        await share.instagram(memeCanvas, memeId);
      } else if (platform === 'farcaster') {
        await share.farcaster(memeCanvas, memeId, 'Created with MemeWarpAI 🔥');
      } else if (platform === 'clipboard') {
        await share.clipboard(memeCanvas, memeId);
      } else if (platform === 'download') {
        await share.download(memeCanvas, memeId);
      }
    } catch (err) {
      console.error(`Failed to share to ${platform}:`, err);
    }
  };

  return (
    <div className={`space-y-3 ${className}`}>
      <div className="flex items-center justify-between">
        <h3 className="text-white font-semibold">Share your meme</h3>
        
        {/* Success/Error message */}
        {showSuccessMessage && (
          <div className="flex items-center space-x-1 text-green-400 text-sm">
            <CheckCircle className="w-4 h-4" />
            <span>{successMessage}</span>
          </div>
        )}
        
        {error && (
          <div className="flex items-center space-x-1 text-red-400 text-sm">
            <AlertCircle className="w-4 h-4" />
            <span>Sharing failed</span>
          </div>
        )}
      </div>
      
      <div className="grid grid-cols-3 gap-3">
        <button
          onClick={() => handleShare('twitter')}
          disabled={isSharing}
          className="flex items-center justify-center space-x-2 bg-blue-500 text-white px-4 py-3 rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50"
        >
          <Twitter className="w-4 h-4" />
          <span className="text-sm font-medium">Twitter</span>
        </button>

        <button
          onClick={() => handleShare('facebook')}
          disabled={isSharing}
          className="flex items-center justify-center space-x-2 bg-blue-700 text-white px-4 py-3 rounded-lg hover:bg-blue-800 transition-colors disabled:opacity-50"
        >
          <Facebook className="w-4 h-4" />
          <span className="text-sm font-medium">Facebook</span>
        </button>

        <button
          onClick={() => handleShare('instagram')}
          disabled={isSharing}
          className="flex items-center justify-center space-x-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-3 rounded-lg hover:opacity-90 transition-colors disabled:opacity-50"
        >
          <Instagram className="w-4 h-4" />
          <span className="text-sm font-medium">Instagram</span>
        </button>

        <button
          onClick={() => handleShare('farcaster')}
          disabled={isSharing}
          className="flex items-center justify-center space-x-2 bg-purple-600 text-white px-4 py-3 rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50"
        >
          <MessageCircle className="w-4 h-4" />
          <span className="text-sm font-medium">Farcaster</span>
        </button>

        <button
          onClick={() => handleShare('clipboard')}
          disabled={isSharing}
          className="flex items-center justify-center space-x-2 glass-card text-white px-4 py-3 rounded-lg hover:bg-white/20 transition-colors disabled:opacity-50"
        >
          <Clipboard className="w-4 h-4" />
          <span className="text-sm font-medium">Copy</span>
        </button>

        <button
          onClick={() => handleShare('download')}
          disabled={isSharing}
          className="flex items-center justify-center space-x-2 glass-card text-white px-4 py-3 rounded-lg hover:bg-white/20 transition-colors disabled:opacity-50"
        >
          <Download className="w-4 h-4" />
          <span className="text-sm font-medium">Download</span>
        </button>
      </div>
    </div>
  );
}

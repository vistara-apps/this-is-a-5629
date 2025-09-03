import { Share2, Twitter, Facebook, Instagram } from 'lucide-react';
import { useState } from 'react';

export function ShareButton({ memeCanvas, className = '' }) {
  const [isSharing, setIsSharing] = useState(false);

  const shareToTwitter = () => {
    const text = encodeURIComponent('Check out this meme I made with MemeWarpAI! 🔥');
    const url = `https://twitter.com/intent/tweet?text=${text}`;
    window.open(url, '_blank');
  };

  const shareToFacebook = () => {
    const url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`;
    window.open(url, '_blank');
  };

  const copyToClipboard = async () => {
    try {
      if (memeCanvas) {
        const blob = await new Promise(resolve => memeCanvas.toBlob(resolve));
        await navigator.clipboard.write([
          new ClipboardItem({ 'image/png': blob })
        ]);
        alert('Meme copied to clipboard!');
      }
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  return (
    <div className={`space-y-3 ${className}`}>
      <h3 className="text-white font-semibold">Share your meme</h3>
      
      <div className="grid grid-cols-2 gap-3">
        <button
          onClick={shareToTwitter}
          className="flex items-center justify-center space-x-2 bg-blue-500 text-white px-4 py-3 rounded-lg hover:bg-blue-600 transition-colors"
        >
          <Twitter className="w-4 h-4" />
          <span className="text-sm font-medium">Twitter</span>
        </button>

        <button
          onClick={shareToFacebook}
          className="flex items-center justify-center space-x-2 bg-blue-700 text-white px-4 py-3 rounded-lg hover:bg-blue-800 transition-colors"
        >
          <Facebook className="w-4 h-4" />
          <span className="text-sm font-medium">Facebook</span>
        </button>

        <button
          onClick={copyToClipboard}
          className="flex items-center justify-center space-x-2 glass-card text-white px-4 py-3 rounded-lg hover:bg-white/20 transition-colors col-span-2"
        >
          <Share2 className="w-4 h-4" />
          <span className="text-sm font-medium">Copy to Clipboard</span>
        </button>
      </div>
    </div>
  );
}
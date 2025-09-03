import { useState } from 'react';
import { 
  shareToTwitter, 
  shareToFacebook, 
  shareToInstagram, 
  shareToFarcaster,
  copyToClipboard,
  downloadMeme,
  trackShare
} from '../services/socialSharingService';

export function useSocialShare() {
  const [isSharing, setIsSharing] = useState(false);
  const [error, setError] = useState(null);
  const [lastSharedPlatform, setLastSharedPlatform] = useState(null);

  // Share to a specific platform
  const shareToSocialPlatform = async (platform, canvas, memeId, text) => {
    setIsSharing(true);
    setError(null);
    
    try {
      let success = false;
      
      switch (platform) {
        case 'twitter':
          success = await shareToTwitter(canvas, text);
          break;
        case 'facebook':
          success = await shareToFacebook(canvas);
          break;
        case 'instagram':
          success = await shareToInstagram(canvas);
          break;
        case 'farcaster':
          success = await shareToFarcaster(canvas, text);
          break;
        case 'clipboard':
          success = await copyToClipboard(canvas);
          break;
        case 'download':
          success = await downloadMeme(canvas);
          break;
        default:
          throw new Error(`Unsupported platform: ${platform}`);
      }
      
      if (success) {
        await trackShare(memeId, platform);
        setLastSharedPlatform(platform);
      }
      
      return success;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setIsSharing(false);
    }
  };

  // Share to Twitter
  const share = {
    twitter: async (canvas, memeId, text) => shareToSocialPlatform('twitter', canvas, memeId, text),
    facebook: async (canvas, memeId) => shareToSocialPlatform('facebook', canvas, memeId),
    instagram: async (canvas, memeId) => shareToSocialPlatform('instagram', canvas, memeId),
    farcaster: async (canvas, memeId, text) => shareToSocialPlatform('farcaster', canvas, memeId, text),
    clipboard: async (canvas, memeId) => shareToSocialPlatform('clipboard', canvas, memeId),
    download: async (canvas, memeId) => shareToSocialPlatform('download', canvas, memeId)
  };

  return {
    share,
    isSharing,
    error,
    lastSharedPlatform
  };
}


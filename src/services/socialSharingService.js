import { incrementShareCount } from './memeService';

// Helper function to convert canvas to blob
const canvasToBlob = (canvas) => {
  return new Promise((resolve) => {
    canvas.toBlob((blob) => {
      resolve(blob);
    }, 'image/png');
  });
};

// Helper function to convert blob to base64
const blobToBase64 = (blob) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
};

// Share to Twitter
export const shareToTwitter = async (canvas, text = '') => {
  try {
    const defaultText = 'Check out this meme I made with MemeWarpAI! 🔥';
    const shareText = text || defaultText;
    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}`;
    window.open(url, '_blank');
    return true;
  } catch (error) {
    console.error('Error sharing to Twitter:', error);
    throw error;
  }
};

// Share to Facebook
export const shareToFacebook = async (canvas) => {
  try {
    const url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`;
    window.open(url, '_blank');
    return true;
  } catch (error) {
    console.error('Error sharing to Facebook:', error);
    throw error;
  }
};

// Share to Instagram (opens instructions since direct sharing is limited)
export const shareToInstagram = async (canvas) => {
  try {
    // Instagram doesn't have a direct web sharing API, so we download the image
    // and show instructions to the user
    const blob = await canvasToBlob(canvas);
    const url = URL.createObjectURL(blob);
    
    // Create a temporary link to download the image
    const link = document.createElement('a');
    link.href = url;
    link.download = 'meme-for-instagram.png';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    // Show instructions in an alert
    alert('Image downloaded! To share on Instagram:\n1. Open Instagram app\n2. Create a new post\n3. Select the downloaded image\n4. Add your caption and share!');
    
    return true;
  } catch (error) {
    console.error('Error preparing for Instagram share:', error);
    throw error;
  }
};

// Share to Farcaster (if Warpcast is available)
export const shareToFarcaster = async (canvas, text = '') => {
  try {
    const blob = await canvasToBlob(canvas);
    const base64Image = await blobToBase64(blob);
    
    // Check if Warpcast is available in the browser
    if (window.warpcast) {
      await window.warpcast.publishCast({
        text: text || 'Created with MemeWarpAI 🔥',
        embeds: [{ url: base64Image }]
      });
      return true;
    } else {
      // If Warpcast is not available, open Warpcast in a new tab
      const warpcastUrl = 'https://warpcast.com/~/compose';
      window.open(warpcastUrl, '_blank');
      
      // Download the image for manual upload
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'meme-for-farcaster.png';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      alert('Image downloaded! To share on Farcaster:\n1. Upload the downloaded image in the Warpcast tab\n2. Add your caption and share!');
      
      return true;
    }
  } catch (error) {
    console.error('Error sharing to Farcaster:', error);
    throw error;
  }
};

// Copy to clipboard
export const copyToClipboard = async (canvas) => {
  try {
    const blob = await canvasToBlob(canvas);
    await navigator.clipboard.write([
      new ClipboardItem({ 'image/png': blob })
    ]);
    return true;
  } catch (error) {
    console.error('Error copying to clipboard:', error);
    throw error;
  }
};

// Download meme
export const downloadMeme = async (canvas, filename = 'meme.png') => {
  try {
    const url = canvas.toDataURL('image/png');
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    return true;
  } catch (error) {
    console.error('Error downloading meme:', error);
    throw error;
  }
};

// Track share event
export const trackShare = async (memeId, platform) => {
  try {
    if (memeId) {
      await incrementShareCount(memeId);
    }
    
    // Here you could also add analytics tracking
    console.log(`Meme shared on ${platform}`);
    
    return true;
  } catch (error) {
    console.error('Error tracking share:', error);
    // Don't throw here, as this is a non-critical operation
    return false;
  }
};


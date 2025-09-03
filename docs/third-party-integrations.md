# MemeWarpAI Third-Party Integrations Documentation

This document provides detailed information about the third-party services and APIs integrated with MemeWarpAI, including configuration, usage, and alternatives.

## Table of Contents

1. [OpenAI Integration](#openai-integration)
2. [Social Media Sharing](#social-media-sharing)
3. [Firebase Services](#firebase-services)
4. [Web3 and Blockchain Services](#web3-and-blockchain-services)
5. [Image Processing Services](#image-processing-services)

## OpenAI Integration

MemeWarpAI uses OpenAI's API for AI-powered caption generation and image analysis.

### Configuration

The OpenAI integration is configured in `src/services/imageAnalysisService.js` and `src/hooks/useAIGeneration.js`:

```javascript
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY || '',
  baseURL: "https://openrouter.ai/api/v1",
  dangerouslyAllowBrowser: true,
});
```

### API Usage

#### Caption Generation

```javascript
const generateCaption = async (imageDescription, style = 'funny') => {
  const prompt = `Generate a witty, viral meme caption for an image described as: "${imageDescription}". 
  Style: ${style}. 
  Make it punchy, relatable, and perfect for social media sharing. 
  Return only the caption text, no quotes or explanations.`;

  const completion = await openai.chat.completions.create({
    model: 'google/gemini-2.0-flash-001',
    messages: [
      {
        role: 'system',
        content: 'You are an expert meme creator who generates viral, witty captions that resonate with internet culture.'
      },
      {
        role: 'user',
        content: prompt
      }
    ],
    max_tokens: 100,
    temperature: 0.9,
  });

  return completion.choices[0]?.message?.content?.trim();
};
```

#### Image Analysis

```javascript
const analyzeImage = async (imageFile) => {
  // Convert image to base64
  const base64Image = await imageToBase64(imageFile);
  
  // Call OpenAI API with vision capabilities
  const response = await openai.chat.completions.create({
    model: 'anthropic/claude-3-haiku-20240307',
    messages: [
      {
        role: 'system',
        content: 'You are an expert at analyzing images and describing their content for meme creation.'
      },
      {
        role: 'user',
        content: [
          { type: 'text', text: 'Analyze this image and describe what you see.' },
          { type: 'image_url', image_url: { url: `data:image/jpeg;base64,${base64Image}` } }
        ]
      }
    ],
    max_tokens: 300,
  });
  
  return response.choices[0]?.message?.content;
};
```

### Rate Limits and Quotas

- OpenAI API has rate limits based on the subscription tier
- Default rate limits: 60 requests per minute, 3,500 requests per day
- Token limits vary by model (e.g., 4,096 tokens for GPT-3.5-turbo)

### Alternative Services

- Google Generative AI (Gemini)
- Anthropic Claude
- Cohere
- Local models (e.g., Llama, Mistral)

## Social Media Sharing

MemeWarpAI integrates with various social media platforms for direct sharing of memes.

### Supported Platforms

- Twitter (X)
- Facebook
- Instagram
- Farcaster

### Implementation

The social media sharing functionality is implemented in `src/services/socialSharingService.js`:

#### Twitter Sharing

```javascript
export const shareToTwitter = async (canvas, text = '') => {
  const defaultText = 'Check out this meme I made with MemeWarpAI! 🔥';
  const shareText = text || defaultText;
  const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}`;
  window.open(url, '_blank');
  return true;
};
```

#### Facebook Sharing

```javascript
export const shareToFacebook = async (canvas) => {
  const url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`;
  window.open(url, '_blank');
  return true;
};
```

#### Farcaster Sharing

```javascript
export const shareToFarcaster = async (canvas, text = '') => {
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
};
```

### Limitations

- Direct sharing to Instagram is limited due to API restrictions
- Some platforms require authentication for programmatic posting
- Image quality may be affected by platform-specific compression

## Firebase Services

MemeWarpAI uses Firebase for backend services, including authentication, database, and storage.

### Firebase Authentication

Used for user management, including:
- Email/password authentication
- JWT token generation and validation
- User session management

### Firestore Database

Used for storing:
- User profiles
- Meme metadata
- Transaction history
- Application settings

### Firebase Storage

Used for storing:
- User-uploaded images
- Generated memes
- Temporary files

### Configuration

Firebase is configured in `src/services/firebase.js`:

```javascript
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);
```

## Web3 and Blockchain Services

MemeWarpAI integrates with Web3 technologies for wallet authentication and payments.

### Wallet Connection

RainbowKit and wagmi are used for wallet connections:

```javascript
import {
  getDefaultConfig,
  RainbowKitProvider,
} from '@rainbow-me/rainbowkit';
import { WagmiProvider } from 'wagmi';
import {
  mainnet,
  polygon,
  optimism,
  arbitrum,
  base,
} from 'wagmi/chains';

const wagmiConfig = getDefaultConfig({
  appName: "MemeWarpAI",
  projectId: "9f4bd472c01ba49282b42e5e1874c2af",
  chains: [mainnet, polygon, optimism, arbitrum, base],
});
```

### Payment Processing

The x402-axios library is used for payment processing:

```javascript
import { withPaymentInterceptor, decodeXPaymentResponse } from "x402-axios";
import axios from "axios";

const baseClient = axios.create({
  baseURL: "https://payments.vistara.dev",
  headers: {
    "Content-Type": "application/json",
  },
});

const apiClient = withPaymentInterceptor(baseClient, walletClient);
const response = await apiClient.post("/api/payment", { amount });
```

### Supported Networks

- Ethereum Mainnet
- Polygon
- Optimism
- Arbitrum
- Base

## Image Processing Services

MemeWarpAI uses browser-based image processing for meme generation.

### Canvas API

The HTML5 Canvas API is used for:
- Drawing text on images
- Applying effects and transformations
- Generating downloadable meme images

```javascript
const canvas = document.createElement('canvas');
const ctx = canvas.getContext('2d');
const img = new Image();

img.onload = () => {
  canvas.width = img.width;
  canvas.height = img.height;
  ctx.drawImage(img, 0, 0);
  
  // Draw text
  ctx.fillStyle = 'white';
  ctx.strokeStyle = 'black';
  ctx.lineWidth = 3;
  ctx.textAlign = 'center';
  ctx.font = `bold ${Math.max(20, img.width / 20)}px Arial`;
  
  // Top text
  ctx.strokeText(topText, img.width / 2, 50);
  ctx.fillText(topText, img.width / 2, 50);
  
  // Bottom text
  ctx.strokeText(bottomText, img.width / 2, img.height - 30);
  ctx.fillText(bottomText, img.width / 2, img.height - 30);
};

img.src = imageUrl;
```

### Image Conversion

Functions for converting between different image formats:

```javascript
// Convert canvas to blob
const canvasToBlob = (canvas) => {
  return new Promise((resolve) => {
    canvas.toBlob((blob) => {
      resolve(blob);
    }, 'image/png');
  });
};

// Convert blob to base64
const blobToBase64 = (blob) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
};
```

### Future Enhancements

Planned enhancements for image processing:
- Server-side image processing for better quality
- Advanced text effects (shadows, gradients, etc.)
- Image filters and effects
- Template customization options


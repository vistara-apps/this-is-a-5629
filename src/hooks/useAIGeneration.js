import { useState } from 'react';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY || '',
  baseURL: "https://openrouter.ai/api/v1",
  dangerouslyAllowBrowser: true,
});

export function useAIGeneration() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState(null);

  const generateCaption = async (imageDescription, style = 'funny') => {
    setIsGenerating(true);
    setError(null);

    try {
      const prompt = `Generate a witty, viral meme caption for an image described as: "${imageDescription}". 
      Style: ${style}. 
      Make it punchy, relatable, and perfect for social media sharing. 
      Return only the caption text, no quotes or explanations.`;

      const completion = await openai.chat.completions.create({
        model: 'google/gemini-2.0-flash-001',
        messages: [
          {
            role: 'system',
            content: 'You are a expert meme creator who generates viral, witty captions that resonate with internet culture.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        max_tokens: 100,
        temperature: 0.9,
      });

      return completion.choices[0]?.message?.content?.trim() || 'Something went wrong, but it\'s probably fine';
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setIsGenerating(false);
    }
  };

  const generateMultipleCaptions = async (imageDescription, count = 3) => {
    const captions = [];
    for (let i = 0; i < count; i++) {
      try {
        const caption = await generateCaption(imageDescription);
        captions.push(caption);
      } catch (err) {
        console.error(`Failed to generate caption ${i + 1}:`, err);
      }
    }
    return captions;
  };

  return {
    generateCaption,
    generateMultipleCaptions,
    isGenerating,
    error
  };
}
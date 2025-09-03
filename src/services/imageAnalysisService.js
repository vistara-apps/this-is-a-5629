import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY || '',
  baseURL: "https://openrouter.ai/api/v1",
  dangerouslyAllowBrowser: true,
});

// Convert image to base64
const imageToBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const base64String = reader.result.split(',')[1];
      resolve(base64String);
    };
    reader.onerror = (error) => reject(error);
  });
};

// Analyze image content using OpenAI's vision capabilities
export const analyzeImage = async (imageFile) => {
  try {
    if (!imageFile) {
      throw new Error('No image provided');
    }
    
    // Convert image to base64
    const base64Image = await imageToBase64(imageFile);
    
    // Call OpenAI API with vision capabilities
    const response = await openai.chat.completions.create({
      model: 'anthropic/claude-3-haiku-20240307',
      messages: [
        {
          role: 'system',
          content: 'You are an expert at analyzing images and describing their content for meme creation. Provide a detailed but concise description of the image, focusing on elements that would be relevant for creating a funny meme.'
        },
        {
          role: 'user',
          content: [
            { type: 'text', text: 'Analyze this image and describe what you see. Focus on elements that would make good meme material.' },
            { type: 'image_url', image_url: { url: `data:image/jpeg;base64,${base64Image}` } }
          ]
        }
      ],
      max_tokens: 300,
    });
    
    return response.choices[0]?.message?.content || 'Unable to analyze image';
  } catch (error) {
    console.error('Error analyzing image:', error);
    throw error;
  }
};

// Generate captions based on image analysis
export const generateCaptionsFromAnalysis = async (imageAnalysis, style = 'funny', count = 3) => {
  try {
    const styles = {
      funny: 'humorous and witty',
      sarcastic: 'sarcastic and ironic',
      wholesome: 'positive and wholesome',
      dark: 'dark humor (but appropriate)',
      nerdy: 'geeky and nerdy references',
      motivational: 'inspirational and motivational'
    };
    
    const styleDescription = styles[style] || styles.funny;
    
    const prompt = `Based on this image description: "${imageAnalysis}", 
    generate ${count} different meme captions that are ${styleDescription}.
    Make them punchy, relatable, and perfect for social media sharing.
    Format your response as a JSON array of strings, with each caption as a separate item.`;
    
    const response = await openai.chat.completions.create({
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
      max_tokens: 500,
      temperature: 0.9,
      response_format: { type: 'json_object' }
    });
    
    const content = response.choices[0]?.message?.content || '{"captions": []}';
    
    try {
      const parsedResponse = JSON.parse(content);
      return Array.isArray(parsedResponse.captions) ? parsedResponse.captions : [];
    } catch (e) {
      console.error('Error parsing JSON response:', e);
      // Fallback: try to extract array-like content from the string
      const matches = content.match(/\\[([^\\]]+)\\]/);
      if (matches && matches[1]) {
        return matches[1].split(',').map(item => item.trim().replace(/"/g, ''));
      }
      return [];
    }
  } catch (error) {
    console.error('Error generating captions:', error);
    throw error;
  }
};

// Main function to analyze image and generate captions
export const analyzeImageAndGenerateCaptions = async (imageFile, style = 'funny', count = 3) => {
  try {
    const analysis = await analyzeImage(imageFile);
    const captions = await generateCaptionsFromAnalysis(analysis, style, count);
    return {
      analysis,
      captions
    };
  } catch (error) {
    console.error('Error in image analysis and caption generation:', error);
    throw error;
  }
};


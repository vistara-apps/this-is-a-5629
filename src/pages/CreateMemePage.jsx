import { useState, useRef, useEffect } from 'react';
import { Header } from '../components/Header';
import { ImageUploader } from '../components/ImageUploader';
import { TemplateSelector } from '../components/TemplateSelector';
import { CaptionInput } from '../components/CaptionInput';
import { MemePreview } from '../components/MemePreview';
import { ShareButton } from '../components/ShareButton';
import { PaymentModal } from '../components/PaymentModal';
import { useAIGeneration } from '../hooks/useAIGeneration';
import { useAuth } from '../hooks/useAuth';
import { createMeme } from '../services/memeService';
import { useNavigate } from 'react-router-dom';
import { AlertCircle } from 'lucide-react';

export function CreateMemePage() {
  const [currentImage, setCurrentImage] = useState(null);
  const [currentImageFile, setCurrentImageFile] = useState(null);
  const [topText, setTopText] = useState('');
  const [bottomText, setBottomText] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [memeId, setMemeId] = useState(null);
  const [error, setError] = useState(null);
  const memeCanvasRef = useRef(null);
  const navigate = useNavigate();

  const { 
    generateCaptionsFromImage, 
    generateCaptionsWithStyles, 
    isGenerating, 
    imageAnalysis 
  } = useAIGeneration();
  
  const { 
    currentUser, 
    userData, 
    hasEnoughCredits, 
    spendCredits 
  } = useAuth();

  // Check if user is logged in
  useEffect(() => {
    if (!currentUser && !localStorage.getItem('allowAnonymous')) {
      navigate('/login', { state: { returnTo: '/create' } });
    }
  }, [currentUser, navigate]);

  const handleImageUpload = (imageUrl, file) => {
    setCurrentImage(imageUrl);
    setCurrentImageFile(file);
    setTopText('');
    setBottomText('');
    setSuggestions([]);
    setMemeId(null);
  };

  const handleTemplateSelect = (template) => {
    setCurrentImage(template.url);
    setCurrentImageFile(null);
    setTopText(template.topText || '');
    setBottomText(template.bottomText || '');
    setSuggestions([]);
    setMemeId(null);
  };

  const handleGenerateCaption = async () => {
    if (!currentImage) {
      setError('Please upload an image or select a template first');
      return;
    }

    if (!hasEnoughCredits(1) && currentUser) {
      setShowPaymentModal(true);
      return;
    }

    try {
      setError(null);
      
      // If we have an image file, use AI to analyze it
      if (currentImageFile) {
        const captions = await generateCaptionsFromImage(currentImageFile);
        setSuggestions(captions);
        
        if (captions.length > 0) {
          setTopText(captions[0] || '');
          setBottomText(captions[1] || '');
        }
      } else {
        // Otherwise, generate based on template name
        const templateName = currentImage.split('/').pop().split('.')[0];
        const captions = await generateCaptionsWithStyles(
          `A meme with template: ${templateName}`, 
          ['funny', 'sarcastic']
        );
        
        const allCaptions = Object.values(captions).flat();
        setSuggestions(allCaptions);
        
        if (allCaptions.length > 0) {
          setTopText(allCaptions[0] || '');
          setBottomText(allCaptions[1] || '');
        }
      }
      
      // Spend credits if user is logged in
      if (currentUser) {
        await spendCredits(1);
      }
    } catch (error) {
      setError('Failed to generate captions: ' + error.message);
    }
  };

  const handleGenerateWithStyle = async (style) => {
    if (!currentImage) {
      setError('Please upload an image or select a template first');
      return;
    }

    if (!hasEnoughCredits(1) && currentUser) {
      setShowPaymentModal(true);
      return;
    }

    try {
      setError(null);
      
      // If we have an image file, use AI to analyze it
      if (currentImageFile) {
        const captions = await generateCaptionsFromImage(currentImageFile, style);
        setSuggestions(captions);
        
        if (captions.length > 0) {
          setTopText(captions[0] || '');
          setBottomText(captions[1] || '');
        }
      } else {
        // Otherwise, generate based on template name
        const templateName = currentImage.split('/').pop().split('.')[0];
        const captions = await generateCaptionsWithStyles(
          `A meme with template: ${templateName}`, 
          [style]
        );
        
        const allCaptions = Object.values(captions).flat();
        setSuggestions(allCaptions);
        
        if (allCaptions.length > 0) {
          setTopText(allCaptions[0] || '');
          setBottomText(allCaptions[1] || '');
        }
      }
      
      // Spend credits if user is logged in
      if (currentUser) {
        await spendCredits(1);
      }
    } catch (error) {
      setError('Failed to generate captions: ' + error.message);
    }
  };

  const handlePaymentSuccess = () => {
    // After successful payment, generate captions
    handleGenerateCaption();
  };

  const handleSaveMeme = async () => {
    if (!currentUser) {
      navigate('/login', { state: { returnTo: '/create' } });
      return;
    }

    if (!currentImage || (!topText && !bottomText)) {
      setError('Please add an image and at least one caption');
      return;
    }

    try {
      setError(null);
      
      // Create meme in database
      const newMemeId = await createMeme(currentUser.uid, {
        imageUrl: currentImage,
        imageFile: currentImageFile,
        topText,
        bottomText,
        isPublic: true
      });
      
      setMemeId(newMemeId);
      
      // Navigate to the meme page
      // navigate(`/meme/${newMemeId}`);
    } catch (error) {
      setError('Failed to save meme: ' + error.message);
    }
  };

  return (
    <div className="min-h-screen gradient-bg">
      <Header />
      
      <main className="container mx-auto px-4 pb-8 pt-4">
        {error && (
          <div className="mb-6 p-3 bg-red-500/20 border border-red-500/30 rounded-lg flex items-center space-x-2 text-red-200 max-w-6xl mx-auto">
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <p>{error}</p>
          </div>
        )}
        
        {currentUser && userData && (
          <div className="mb-6 max-w-6xl mx-auto">
            <div className="glass-card rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-accent/20 rounded-full flex items-center justify-center">
                    <span className="text-accent font-bold">{userData.credits || 0}</span>
                  </div>
                  <span className="text-white">credits remaining</span>
                </div>
                
                <button
                  onClick={() => setShowPaymentModal(true)}
                  className="bg-accent/20 hover:bg-accent/30 text-accent px-4 py-2 rounded-lg text-sm transition-colors"
                >
                  Buy Credits
                </button>
              </div>
            </div>
          </div>
        )}
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 max-w-6xl mx-auto">
          {/* Left Column - Input */}
          <div className="space-y-6">
            <ImageUploader onImageUpload={handleImageUpload} />
            
            <TemplateSelector onTemplateSelect={handleTemplateSelect} />
            
            <CaptionInput
              topText={topText}
              bottomText={bottomText}
              onTopTextChange={setTopText}
              onBottomTextChange={setBottomText}
              onGenerateCaption={handleGenerateCaption}
              onGenerateWithStyle={handleGenerateWithStyle}
              isGenerating={isGenerating}
              suggestions={suggestions}
            />
            
            {imageAnalysis && (
              <div className="glass-card rounded-lg p-4">
                <h3 className="text-white font-semibold mb-2">Image Analysis</h3>
                <p className="text-purple-200 text-sm">{imageAnalysis}</p>
              </div>
            )}
          </div>

          {/* Right Column - Preview & Share */}
          <div className="space-y-6">
            <MemePreview
              imageUrl={currentImage}
              topText={topText}
              bottomText={bottomText}
              canvasRef={memeCanvasRef}
            />
            
            {currentImage && (topText || bottomText) && (
              <>
                <ShareButton 
                  memeCanvas={memeCanvasRef.current} 
                  memeId={memeId}
                />
                
                <div className="flex justify-center">
                  <button
                    onClick={handleSaveMeme}
                    className="bg-primary hover:bg-primary/90 text-white px-6 py-2 rounded-lg transition-colors"
                  >
                    Save to My Memes
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </main>

      <PaymentModal
        isOpen={showPaymentModal}
        onClose={() => setShowPaymentModal(false)}
        onPaymentSuccess={handlePaymentSuccess}
        memeCount={1}
      />
    </div>
  );
}


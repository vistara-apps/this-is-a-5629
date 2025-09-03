import { useState, useRef } from 'react';
import { Header } from './components/Header';
import { ImageUploader } from './components/ImageUploader';
import { TemplateSelector } from './components/TemplateSelector';
import { CaptionInput } from './components/CaptionInput';
import { MemePreview } from './components/MemePreview';
import { ShareButton } from './components/ShareButton';
import { PaymentModal } from './components/PaymentModal';
import { useAIGeneration } from './hooks/useAIGeneration';
import { usePaymentContext } from './hooks/usePaymentContext';

function App() {
  const [currentImage, setCurrentImage] = useState(null);
  const [topText, setTopText] = useState('');
  const [bottomText, setBottomText] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [hasPaid, setHasPaid] = useState(false);
  const memeCanvasRef = useRef(null);

  const { generateMultipleCaptions, isGenerating } = useAIGeneration();
  const { createSession } = usePaymentContext();

  const handleImageUpload = (imageUrl, file) => {
    setCurrentImage(imageUrl);
    setTopText('');
    setBottomText('');
    setSuggestions([]);
  };

  const handleTemplateSelect = (template) => {
    setCurrentImage(template.url);
    setTopText(template.topText || '');
    setBottomText(template.bottomText || '');
    setSuggestions([]);
  };

  const handleGenerateCaption = async () => {
    if (!currentImage) {
      alert('Please upload an image or select a template first');
      return;
    }

    if (!hasPaid) {
      setShowPaymentModal(true);
      return;
    }

    try {
      const imageDescription = 'A meme image that needs funny captions';
      const newSuggestions = await generateMultipleCaptions(imageDescription, 3);
      setSuggestions(newSuggestions);
      
      if (newSuggestions.length > 0) {
        setTopText(newSuggestions[0] || '');
        setBottomText(newSuggestions[1] || '');
      }
    } catch (error) {
      alert('Failed to generate captions: ' + error.message);
    }
  };

  const handlePayment = async (amount) => {
    try {
      await createSession(amount);
      setHasPaid(true);
      // Automatically generate captions after successful payment
      setTimeout(() => {
        handleGenerateCaption();
      }, 500);
    } catch (error) {
      throw error;
    }
  };

  return (
    <div className="min-h-screen gradient-bg">
      <Header />
      
      <main className="container mx-auto px-4 pb-8">
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
              isGenerating={isGenerating}
              suggestions={suggestions}
            />
          </div>

          {/* Right Column - Preview & Share */}
          <div className="space-y-6">
            <MemePreview
              imageUrl={currentImage}
              topText={topText}
              bottomText={bottomText}
            />
            
            {currentImage && (topText || bottomText) && (
              <ShareButton memeCanvas={memeCanvasRef.current} />
            )}
          </div>
        </div>
      </main>

      <PaymentModal
        isOpen={showPaymentModal}
        onClose={() => setShowPaymentModal(false)}
        onPayment={handlePayment}
        memeCount={1}
      />
    </div>
  );
}

export default App;
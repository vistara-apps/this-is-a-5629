import { useState } from 'react';
import { Wand2, RefreshCw, Sparkles, Zap, Heart, Skull, Code, Award } from 'lucide-react';

export function CaptionInput({
  topText,
  bottomText,
  onTopTextChange,
  onBottomTextChange,
  onGenerateCaption,
  onGenerateWithStyle,
  isGenerating,
  suggestions = [],
  className = ''
}) {
  const [selectedStyle, setSelectedStyle] = useState('funny');
  const [showStyleSelector, setShowStyleSelector] = useState(false);

  const captionStyles = [
    { id: 'funny', name: 'Funny', icon: <Sparkles className="w-4 h-4" /> },
    { id: 'sarcastic', name: 'Sarcastic', icon: <Zap className="w-4 h-4" /> },
    { id: 'wholesome', name: 'Wholesome', icon: <Heart className="w-4 h-4" /> },
    { id: 'dark', name: 'Dark', icon: <Skull className="w-4 h-4" /> },
    { id: 'nerdy', name: 'Nerdy', icon: <Code className="w-4 h-4" /> },
    { id: 'motivational', name: 'Motivational', icon: <Award className="w-4 h-4" /> }
  ];

  const handleGenerateClick = () => {
    if (onGenerateWithStyle) {
      onGenerateWithStyle(selectedStyle);
    } else {
      onGenerateCaption();
    }
  };

  const handleStyleSelect = (styleId) => {
    setSelectedStyle(styleId);
    setShowStyleSelector(false);
  };

  return (
    <div className={`space-y-4 ${className}`}>
      <div className="flex items-center justify-between">
        <h3 className="text-white font-semibold">Add your caption</h3>
        <div className="flex items-center space-x-2">
          <div className="relative">
            <button
              onClick={() => setShowStyleSelector(!showStyleSelector)}
              className="flex items-center space-x-1 bg-white/10 text-white px-3 py-2 rounded-lg hover:bg-white/20 transition-colors"
            >
              {captionStyles.find(s => s.id === selectedStyle)?.icon}
              <span className="text-sm">{captionStyles.find(s => s.id === selectedStyle)?.name}</span>
            </button>
            
            {showStyleSelector && (
              <div className="absolute right-0 mt-2 w-48 bg-white/10 backdrop-blur-lg border border-white/20 rounded-lg shadow-lg z-10">
                <div className="p-2 space-y-1">
                  {captionStyles.map((style) => (
                    <button
                      key={style.id}
                      onClick={() => handleStyleSelect(style.id)}
                      className={`w-full flex items-center space-x-2 px-3 py-2 rounded-md text-left text-sm ${
                        selectedStyle === style.id ? 'bg-accent text-white' : 'text-white hover:bg-white/10'
                      }`}
                    >
                      {style.icon}
                      <span>{style.name}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
          
          <button
            onClick={handleGenerateClick}
            disabled={isGenerating}
            className="flex items-center space-x-2 bg-accent text-white px-4 py-2 rounded-lg hover:bg-accent/90 transition-colors disabled:opacity-50"
          >
            {isGenerating ? (
              <RefreshCw className="w-4 h-4 animate-spin" />
            ) : (
              <Wand2 className="w-4 h-4" />
            )}
            <span>{isGenerating ? 'Generating...' : 'AI Generate'}</span>
          </button>
        </div>
      </div>

      <div className="space-y-3">
        <div>
          <label className="block text-purple-200 text-sm mb-1">Top Text</label>
          <textarea
            value={topText}
            onChange={(e) => onTopTextChange(e.target.value)}
            placeholder="Enter top text..."
            className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white placeholder-purple-200 resize-none focus:outline-none focus:ring-2 focus:ring-accent"
            rows={2}
          />
        </div>

        <div>
          <label className="block text-purple-200 text-sm mb-1">Bottom Text</label>
          <textarea
            value={bottomText}
            onChange={(e) => onBottomTextChange(e.target.value)}
            placeholder="Enter bottom text..."
            className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white placeholder-purple-200 resize-none focus:outline-none focus:ring-2 focus:ring-accent"
            rows={2}
          />
        </div>
      </div>

      {suggestions.length > 0 && (
        <div>
          <h4 className="text-purple-200 text-sm mb-2">AI Suggestions</h4>
          <div className="space-y-2">
            {suggestions.map((suggestion, index) => (
              <button
                key={index}
                onClick={() => {
                  if (index % 2 === 0) onTopTextChange(suggestion);
                  else onBottomTextChange(suggestion);
                }}
                className="w-full text-left bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-purple-100 hover:bg-white/10 transition-colors text-sm"
              >
                {suggestion}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

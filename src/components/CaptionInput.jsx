import { useState } from 'react';
import { Wand2, RefreshCw } from 'lucide-react';

export function CaptionInput({
  topText,
  bottomText,
  onTopTextChange,
  onBottomTextChange,
  onGenerateCaption,
  isGenerating,
  suggestions = [],
  className = ''
}) {
  return (
    <div className={`space-y-4 ${className}`}>
      <div className="flex items-center justify-between">
        <h3 className="text-white font-semibold">Add your caption</h3>
        <button
          onClick={onGenerateCaption}
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
                  if (index === 0) onTopTextChange(suggestion);
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
import { useRef, useEffect } from 'react';

export function MemePreview({ imageUrl, topText, bottomText, canvasRef, className = '' }) {
  // Use provided canvasRef or create a local one
  const localCanvasRef = useRef(null);
  const actualCanvasRef = canvasRef || localCanvasRef;

  useEffect(() => {
    if (!imageUrl || !actualCanvasRef.current) return;

    const canvas = actualCanvasRef.current;
    const ctx = canvas.getContext('2d');
    const img = new Image();

    img.onload = () => {
      // Set canvas size to image size
      canvas.width = img.width;
      canvas.height = img.height;

      // Draw image
      ctx.drawImage(img, 0, 0);

      // Set text properties
      ctx.fillStyle = 'white';
      ctx.strokeStyle = 'black';
      ctx.lineWidth = 3;
      ctx.textAlign = 'center';
      ctx.font = `bold ${Math.max(20, img.width / 20)}px Arial`;

      // Draw top text
      if (topText) {
        const lines = wrapText(ctx, topText.toUpperCase(), img.width - 40);
        lines.forEach((line, index) => {
          const y = 50 + (index * parseInt(ctx.font));
          ctx.strokeText(line, img.width / 2, y);
          ctx.fillText(line, img.width / 2, y);
        });
      }

      // Draw bottom text
      if (bottomText) {
        const lines = wrapText(ctx, bottomText.toUpperCase(), img.width - 40);
        lines.forEach((line, index) => {
          const y = img.height - 30 - ((lines.length - 1 - index) * parseInt(ctx.font));
          ctx.strokeText(line, img.width / 2, y);
          ctx.fillText(line, img.width / 2, y);
        });
      }
    };

    img.src = imageUrl;
  }, [imageUrl, topText, bottomText, actualCanvasRef]);

  const wrapText = (ctx, text, maxWidth) => {
    const words = text.split(' ');
    const lines = [];
    let currentLine = words[0];

    for (let i = 1; i < words.length; i++) {
      const word = words[i];
      const width = ctx.measureText(currentLine + ' ' + word).width;
      if (width < maxWidth) {
        currentLine += ' ' + word;
      } else {
        lines.push(currentLine);
        currentLine = word;
      }
    }
    lines.push(currentLine);
    return lines;
  };

  const downloadMeme = () => {
    const canvas = actualCanvasRef.current;
    if (!canvas) return;
    
    const link = document.createElement('a');
    link.download = 'meme.png';
    link.href = canvas.toDataURL();
    link.click();
  };

  return (
    <div className={className}>
      <div className="glass-card rounded-lg p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-white font-semibold">Preview</h3>
          <button
            onClick={downloadMeme}
            className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors text-sm"
            disabled={!imageUrl}
          >
            Download
          </button>
        </div>
        
        {imageUrl ? (
          <div className="relative bg-gray-100 rounded-lg overflow-hidden">
            <canvas
              ref={actualCanvasRef}
              className="w-full h-auto max-h-96 object-contain"
            />
          </div>
        ) : (
          <div className="bg-gray-200 rounded-lg h-64 flex items-center justify-center">
            <p className="text-gray-500">Upload an image to see preview</p>
          </div>
        )}
      </div>
    </div>
  );
}

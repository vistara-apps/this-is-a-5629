import { useState, useRef } from 'react';
import { Upload, Image as ImageIcon } from 'lucide-react';

export function ImageUploader({ onImageUpload, className = '' }) {
  const [dragActive, setDragActive] = useState(false);
  const [uploadedImage, setUploadedImage] = useState(null);
  const fileInputRef = useRef(null);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileInput = (e) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleFile = (file) => {
    if (file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const imageUrl = e.target.result;
        setUploadedImage(imageUrl);
        onImageUpload(imageUrl, file);
      };
      reader.readAsDataURL(file);
    }
  };

  const openFileDialog = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className={className}>
      <div
        className={`glass-card rounded-lg border-2 border-dashed transition-all duration-200 ${
          dragActive ? 'border-accent bg-accent/10' : 'border-white/30'
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        {uploadedImage ? (
          <div className="relative">
            <img
              src={uploadedImage}
              alt="Uploaded"
              className="w-full h-64 object-cover rounded-lg"
            />
            <button
              onClick={openFileDialog}
              className="absolute inset-0 bg-black/50 opacity-0 hover:opacity-100 transition-opacity duration-200 rounded-lg flex items-center justify-center"
            >
              <span className="text-white font-medium">Change Image</span>
            </button>
          </div>
        ) : (
          <div
            className="p-8 text-center cursor-pointer"
            onClick={openFileDialog}
          >
            <div className="flex flex-col items-center space-y-4">
              <div className="w-16 h-16 bg-white/20 rounded-lg flex items-center justify-center">
                <Upload className="w-8 h-8 text-white" />
              </div>
              <div>
                <p className="text-white font-medium mb-2">
                  Drop your image here or click to browse
                </p>
                <p className="text-purple-200 text-sm">
                  Supports JPG, PNG, GIF up to 10MB
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileInput}
        className="hidden"
      />
    </div>
  );
}
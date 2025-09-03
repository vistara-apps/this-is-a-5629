import { useState } from 'react';

const MEME_TEMPLATES = [
  {
    id: 'drake',
    name: 'Drake Pointing',
    url: 'https://i.imgflip.com/30b1gx.jpg',
    topText: '',
    bottomText: ''
  },
  {
    id: 'distracted',
    name: 'Distracted Boyfriend',
    url: 'https://i.imgflip.com/1ur9b0.jpg',
    topText: '',
    bottomText: ''
  },
  {
    id: 'woman-yelling',
    name: 'Woman Yelling at Cat',
    url: 'https://i.imgflip.com/345v97.jpg',
    topText: '',
    bottomText: ''
  },
  {
    id: 'change-my-mind',
    name: 'Change My Mind',
    url: 'https://i.imgflip.com/24y43o.jpg',
    topText: '',
    bottomText: ''
  },
  {
    id: 'two-buttons',
    name: 'Two Buttons',
    url: 'https://i.imgflip.com/1g8my4.jpg',
    topText: '',
    bottomText: ''
  },
  {
    id: 'mocking',
    name: 'Mocking SpongeBob',
    url: 'https://i.imgflip.com/1otk96.jpg',
    topText: '',
    bottomText: ''
  }
];

export function TemplateSelector({ onTemplateSelect, className = '' }) {
  const [selectedTemplate, setSelectedTemplate] = useState(null);

  const handleTemplateClick = (template) => {
    setSelectedTemplate(template.id);
    onTemplateSelect(template);
  };

  return (
    <div className={className}>
      <h3 className="text-white font-semibold mb-4">Or choose a popular template</h3>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {MEME_TEMPLATES.map((template) => (
          <div
            key={template.id}
            className={`glass-card rounded-lg overflow-hidden cursor-pointer transition-all duration-200 hover:scale-105 ${
              selectedTemplate === template.id ? 'ring-2 ring-accent' : ''
            }`}
            onClick={() => handleTemplateClick(template)}
          >
            <img
              src={template.url}
              alt={template.name}
              className="w-full h-32 object-cover"
            />
            <div className="p-3">
              <p className="text-white text-sm font-medium">{template.name}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
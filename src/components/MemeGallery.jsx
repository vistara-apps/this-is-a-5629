import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Share2, Pencil, Trash2, Eye } from 'lucide-react';
import { deleteMeme } from '../services/memeService';
import { useAuth } from '../hooks/useAuth';

export function MemeGallery({ memes, className = '' }) {
  const [selectedMeme, setSelectedMeme] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  const handleEdit = (meme) => {
    navigate(`/edit/${meme.memeId}`);
  };

  const handleView = (meme) => {
    navigate(`/meme/${meme.memeId}`);
  };

  const handleShare = (meme) => {
    navigate(`/meme/${meme.memeId}?share=true`);
  };

  const handleDeleteClick = (meme) => {
    setSelectedMeme(meme);
    setShowDeleteConfirm(true);
  };

  const handleDeleteConfirm = async () => {
    if (!selectedMeme || !currentUser) return;
    
    setIsDeleting(true);
    try {
      await deleteMeme(selectedMeme.memeId);
      // Remove the deleted meme from the list
      const updatedMemes = memes.filter(m => m.memeId !== selectedMeme.memeId);
      setMemes(updatedMemes);
      setShowDeleteConfirm(false);
    } catch (error) {
      console.error('Error deleting meme:', error);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className={className}>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {memes.map((meme) => (
          <div key={meme.memeId} className="glass-card rounded-lg overflow-hidden">
            <div className="relative">
              <img 
                src={meme.imageUrl} 
                alt="Meme" 
                className="w-full h-48 object-cover"
              />
              
              {/* Overlay text */}
              <div className="absolute inset-0 flex flex-col justify-between p-3 pointer-events-none">
                {meme.topText && (
                  <div className="meme-text">{meme.topText}</div>
                )}
                {meme.bottomText && (
                  <div className="meme-text">{meme.bottomText}</div>
                )}
              </div>
              
              {/* Hover actions */}
              <div className="absolute inset-0 bg-black/60 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                <button
                  onClick={() => handleView(meme)}
                  className="w-9 h-9 bg-white/20 rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-colors"
                >
                  <Eye className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleEdit(meme)}
                  className="w-9 h-9 bg-white/20 rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-colors"
                >
                  <Pencil className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleShare(meme)}
                  className="w-9 h-9 bg-white/20 rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-colors"
                >
                  <Share2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDeleteClick(meme)}
                  className="w-9 h-9 bg-white/20 rounded-full flex items-center justify-center text-white hover:bg-red-500/80 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
            
            <div className="p-3">
              <div className="flex justify-between items-center">
                <div className="text-sm text-purple-200">
                  {new Date(meme.createdAt?.seconds * 1000 || meme.createdAt || Date.now()).toLocaleDateString()}
                </div>
                <div className="text-sm text-purple-200 flex items-center">
                  <Share2 className="w-3 h-3 mr-1" />
                  {meme.shareCount || 0}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="glass-card rounded-lg max-w-md w-full p-6">
            <h2 className="text-white text-xl font-bold mb-4">Delete Meme</h2>
            <p className="text-purple-200 mb-6">
              Are you sure you want to delete this meme? This action cannot be undone.
            </p>
            
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="px-4 py-2 rounded-lg bg-white/10 text-white hover:bg-white/20 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteConfirm}
                disabled={isDeleting}
                className="px-4 py-2 rounded-lg bg-red-500 text-white hover:bg-red-600 transition-colors disabled:opacity-50"
              >
                {isDeleting ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}


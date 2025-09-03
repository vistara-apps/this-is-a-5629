import { useNavigate } from 'react-router-dom';
import { Header } from '../components/Header';
import { Sparkles, Image, Share2 } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

export function HomePage() {
  const navigate = useNavigate();
  const { currentUser } = useAuth();

  const features = [
    {
      icon: <Sparkles className="w-6 h-6 text-accent" />,
      title: 'AI Caption Generation',
      description: 'Our AI analyzes your images and suggests witty, viral captions that will make your memes stand out.'
    },
    {
      icon: <Image className="w-6 h-6 text-accent" />,
      title: 'Image-to-Meme Transformation',
      description: 'Upload any image and transform it into a meme with customizable text overlays and styles.'
    },
    {
      icon: <Share2 className="w-6 h-6 text-accent" />,
      title: 'Direct Social Sharing',
      description: 'Share your creations directly to Twitter, Facebook, Instagram, and Farcaster with a single click.'
    }
  ];

  const handleGetStarted = () => {
    navigate('/create');
  };

  return (
    <div className="min-h-screen gradient-bg">
      <Header />
      
      <main className="container mx-auto px-4 pb-16">
        {/* Hero Section */}
        <section className="py-16 text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
            Warp Your Images Into <span className="text-accent">Viral Memes</span>
          </h1>
          <p className="text-xl text-purple-200 max-w-2xl mx-auto mb-10">
            Transform any image into a shareable meme with AI-powered captions. Create, customize, and share in seconds.
          </p>
          <button
            onClick={handleGetStarted}
            className="bg-accent hover:bg-accent/90 text-white font-bold py-3 px-8 rounded-lg text-lg transition-colors"
          >
            {currentUser ? 'Create a Meme' : 'Get Started'}
          </button>
        </section>
        
        {/* Features Section */}
        <section className="py-16">
          <h2 className="text-3xl font-bold text-white text-center mb-12">
            Powerful Features
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="glass-card rounded-lg p-6">
                <div className="w-12 h-12 bg-white/10 rounded-lg flex items-center justify-center mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">
                  {feature.title}
                </h3>
                <p className="text-purple-200">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </section>
        
        {/* CTA Section */}
        <section className="py-16">
          <div className="glass-card rounded-lg p-8 text-center">
            <h2 className="text-3xl font-bold text-white mb-4">
              Ready to Create Viral Memes?
            </h2>
            <p className="text-purple-200 mb-8 max-w-2xl mx-auto">
              Join thousands of creators who use MemeWarpAI to generate engaging content for social media.
            </p>
            <button
              onClick={handleGetStarted}
              className="bg-accent hover:bg-accent/90 text-white font-bold py-3 px-8 rounded-lg text-lg transition-colors"
            >
              {currentUser ? 'Create a Meme' : 'Get Started'}
            </button>
          </div>
        </section>
      </main>
      
      <footer className="py-8 border-t border-white/10">
        <div className="container mx-auto px-4 text-center text-purple-200">
          <p>&copy; {new Date().getFullYear()} MemeWarpAI. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}


import { Link } from 'react-router-dom';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { Navigation } from './Navigation';

export function Header() {
  return (
    <header className="w-full p-4 flex justify-between items-center">
      <Link to="/" className="flex items-center space-x-3">
        <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
          <span className="text-purple-600 font-bold text-sm">MW</span>
        </div>
        <div>
          <h1 className="text-white text-xl font-bold">MemeWarpAI</h1>
          <p className="text-purple-200 text-sm">Warp your images into viral memes with AI</p>
        </div>
      </Link>
      
      <div className="flex items-center space-x-4">
        <Navigation />
        <ConnectButton />
      </div>
    </header>
  );
}

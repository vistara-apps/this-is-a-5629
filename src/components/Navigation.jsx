import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Home, PlusCircle, User, LogOut } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

export function Navigation() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { currentUser, logout } = useAuth();
  const location = useLocation();
  
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };
  
  const closeMenu = () => {
    setIsMenuOpen(false);
  };
  
  const handleLogout = async () => {
    try {
      await logout();
      closeMenu();
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };
  
  const isActive = (path) => {
    return location.pathname === path;
  };
  
  return (
    <nav className="flex items-center">
      {/* Desktop Navigation */}
      <div className="hidden md:flex items-center space-x-6">
        <Link
          to="/"
          className={`text-sm font-medium transition-colors ${
            isActive('/') ? 'text-white' : 'text-purple-200 hover:text-white'
          }`}
        >
          Home
        </Link>
        
        <Link
          to="/create"
          className={`text-sm font-medium transition-colors ${
            isActive('/create') ? 'text-white' : 'text-purple-200 hover:text-white'
          }`}
        >
          Create
        </Link>
        
        {currentUser ? (
          <>
            <Link
              to="/dashboard"
              className={`text-sm font-medium transition-colors ${
                isActive('/dashboard') ? 'text-white' : 'text-purple-200 hover:text-white'
              }`}
            >
              Dashboard
            </Link>
            
            <button
              onClick={handleLogout}
              className="text-sm font-medium text-purple-200 hover:text-white transition-colors"
            >
              Logout
            </button>
          </>
        ) : (
          <Link
            to="/login"
            className={`text-sm font-medium transition-colors ${
              isActive('/login') ? 'text-white' : 'text-purple-200 hover:text-white'
            }`}
          >
            Login
          </Link>
        )}
      </div>
      
      {/* Mobile Menu Button */}
      <button
        onClick={toggleMenu}
        className="md:hidden text-white"
        aria-label="Toggle menu"
      >
        {isMenuOpen ? (
          <X className="w-6 h-6" />
        ) : (
          <Menu className="w-6 h-6" />
        )}
      </button>
      
      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div className="fixed inset-0 bg-black/50" onClick={closeMenu}></div>
          <div className="fixed top-0 right-0 bottom-0 w-64 glass-card backdrop-blur-lg p-6 overflow-y-auto">
            <div className="flex justify-end mb-8">
              <button onClick={closeMenu} className="text-white">
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <div className="space-y-6">
              <Link
                to="/"
                className="flex items-center space-x-2 text-white"
                onClick={closeMenu}
              >
                <Home className="w-5 h-5" />
                <span>Home</span>
              </Link>
              
              <Link
                to="/create"
                className="flex items-center space-x-2 text-white"
                onClick={closeMenu}
              >
                <PlusCircle className="w-5 h-5" />
                <span>Create</span>
              </Link>
              
              {currentUser ? (
                <>
                  <Link
                    to="/dashboard"
                    className="flex items-center space-x-2 text-white"
                    onClick={closeMenu}
                  >
                    <User className="w-5 h-5" />
                    <span>Dashboard</span>
                  </Link>
                  
                  <button
                    onClick={handleLogout}
                    className="flex items-center space-x-2 text-white"
                  >
                    <LogOut className="w-5 h-5" />
                    <span>Logout</span>
                  </button>
                </>
              ) : (
                <Link
                  to="/login"
                  className="flex items-center space-x-2 text-white"
                  onClick={closeMenu}
                >
                  <User className="w-5 h-5" />
                  <span>Login</span>
                </Link>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}


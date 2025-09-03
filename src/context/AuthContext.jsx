import { createContext, useContext, useState, useEffect } from 'react';
import { auth } from '../services/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { getUserData, signInWithWallet } from '../services/userService';
import { useWalletClient } from 'wagmi';

// Create the authentication context
const AuthContext = createContext();

// Custom hook to use the auth context
export const useAuth = () => {
  return useContext(AuthContext);
};

// Provider component
export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { data: walletClient } = useWalletClient();

  // Effect for handling Firebase auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      
      if (user) {
        try {
          const data = await getUserData(user.uid);
          setUserData(data);
        } catch (err) {
          console.error('Error fetching user data:', err);
          setError(err.message);
        }
      } else {
        setUserData(null);
      }
      
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  // Effect for handling wallet connection
  useEffect(() => {
    const handleWalletConnection = async () => {
      if (walletClient && walletClient.account && !currentUser) {
        try {
          setLoading(true);
          const user = await signInWithWallet(walletClient);
          setCurrentUser(user);
          const data = await getUserData(user.uid);
          setUserData(data);
        } catch (err) {
          console.error('Error signing in with wallet:', err);
          setError(err.message);
        } finally {
          setLoading(false);
        }
      }
    };

    handleWalletConnection();
  }, [walletClient, currentUser]);

  // Refresh user data
  const refreshUserData = async () => {
    if (currentUser) {
      try {
        const data = await getUserData(currentUser.uid);
        setUserData(data);
        return data;
      } catch (err) {
        console.error('Error refreshing user data:', err);
        setError(err.message);
      }
    }
  };

  const value = {
    currentUser,
    userData,
    loading,
    error,
    refreshUserData
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};


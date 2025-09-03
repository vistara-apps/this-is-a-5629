import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { 
  createUser, 
  signInWithEmail, 
  signOutUser, 
  signInWithWallet,
  addCredits,
  useCredits,
  getPaymentHistory,
  updateUserData
} from '../services/userService';

export function useAuth() {
  const auth = useContext(AuthContext);

  // Register with email and password
  const register = async (email, password, username) => {
    try {
      const user = await createUser(email, password, username);
      return user;
    } catch (error) {
      throw error;
    }
  };

  // Login with email and password
  const login = async (email, password) => {
    try {
      const user = await signInWithEmail(email, password);
      return user;
    } catch (error) {
      throw error;
    }
  };

  // Login with wallet
  const loginWithWallet = async (walletClient) => {
    try {
      const user = await signInWithWallet(walletClient);
      return user;
    } catch (error) {
      throw error;
    }
  };

  // Logout
  const logout = async () => {
    try {
      await signOutUser();
    } catch (error) {
      throw error;
    }
  };

  // Add credits to user account
  const purchaseCredits = async (amount) => {
    if (!auth.currentUser) {
      throw new Error('User not authenticated');
    }
    
    try {
      const newCreditBalance = await addCredits(auth.currentUser.uid, amount);
      await auth.refreshUserData();
      return newCreditBalance;
    } catch (error) {
      throw error;
    }
  };

  // Use credits for meme generation
  const spendCredits = async (amount = 1) => {
    if (!auth.currentUser) {
      throw new Error('User not authenticated');
    }
    
    try {
      const newCreditBalance = await useCredits(auth.currentUser.uid, amount);
      await auth.refreshUserData();
      return newCreditBalance;
    } catch (error) {
      throw error;
    }
  };

  // Get user's payment history
  const getTransactionHistory = async () => {
    if (!auth.currentUser) {
      throw new Error('User not authenticated');
    }
    
    try {
      return await getPaymentHistory(auth.currentUser.uid);
    } catch (error) {
      throw error;
    }
  };

  // Update user profile
  const updateProfile = async (data) => {
    if (!auth.currentUser) {
      throw new Error('User not authenticated');
    }
    
    try {
      await updateUserData(auth.currentUser.uid, data);
      await auth.refreshUserData();
    } catch (error) {
      throw error;
    }
  };

  // Check if user has enough credits
  const hasEnoughCredits = (amount = 1) => {
    if (!auth.userData) return false;
    return (auth.userData.credits || 0) >= amount;
  };

  return {
    ...auth,
    register,
    login,
    loginWithWallet,
    logout,
    purchaseCredits,
    spendCredits,
    getTransactionHistory,
    updateProfile,
    hasEnoughCredits
  };
}


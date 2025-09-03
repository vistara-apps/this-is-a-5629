import { 
  auth, 
  db, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut,
  doc,
  setDoc,
  getDoc,
  updateDoc,
  serverTimestamp
} from './firebase';
import { getAddress } from 'viem';

// Create a new user with email and password
export const createUser = async (email, password, username) => {
  try {
    // Create user in Firebase Auth
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    
    // Create user document in Firestore
    await setDoc(doc(db, 'users', user.uid), {
      userId: user.uid,
      username: username || email.split('@')[0],
      email: email,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      credits: 0,
      paymentHistory: [],
      memeCount: 0
    });
    
    return user;
  } catch (error) {
    console.error('Error creating user:', error);
    throw error;
  }
};

// Sign in with email and password
export const signInWithEmail = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return userCredential.user;
  } catch (error) {
    console.error('Error signing in:', error);
    throw error;
  }
};

// Sign in with wallet
export const signInWithWallet = async (walletClient) => {
  try {
    if (!walletClient || !walletClient.account) {
      throw new Error('Wallet not connected');
    }
    
    const address = getAddress(walletClient.account.address);
    
    // Check if user exists
    const userDoc = await getDoc(doc(db, 'users', address));
    
    if (!userDoc.exists()) {
      // Create new user if doesn't exist
      await setDoc(doc(db, 'users', address), {
        userId: address,
        username: `user_${address.substring(2, 8)}`,
        walletAddress: address,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        credits: 0,
        paymentHistory: [],
        memeCount: 0
      });
    }
    
    return { uid: address, walletAddress: address };
  } catch (error) {
    console.error('Error signing in with wallet:', error);
    throw error;
  }
};

// Sign out
export const signOutUser = async () => {
  try {
    await signOut(auth);
  } catch (error) {
    console.error('Error signing out:', error);
    throw error;
  }
};

// Get user data
export const getUserData = async (userId) => {
  try {
    const userDoc = await getDoc(doc(db, 'users', userId));
    if (userDoc.exists()) {
      return userDoc.data();
    } else {
      throw new Error('User not found');
    }
  } catch (error) {
    console.error('Error getting user data:', error);
    throw error;
  }
};

// Update user data
export const updateUserData = async (userId, data) => {
  try {
    await updateDoc(doc(db, 'users', userId), {
      ...data,
      updatedAt: serverTimestamp()
    });
  } catch (error) {
    console.error('Error updating user data:', error);
    throw error;
  }
};

// Add credits to user
export const addCredits = async (userId, amount) => {
  try {
    const userDoc = await getDoc(doc(db, 'users', userId));
    if (!userDoc.exists()) {
      throw new Error('User not found');
    }
    
    const userData = userDoc.data();
    const currentCredits = userData.credits || 0;
    
    await updateDoc(doc(db, 'users', userId), {
      credits: currentCredits + amount,
      updatedAt: serverTimestamp(),
      paymentHistory: [
        ...(userData.paymentHistory || []),
        {
          amount: amount,
          type: 'credit_purchase',
          timestamp: new Date().toISOString()
        }
      ]
    });
    
    return currentCredits + amount;
  } catch (error) {
    console.error('Error adding credits:', error);
    throw error;
  }
};

// Use credits
export const useCredits = async (userId, amount = 1) => {
  try {
    const userDoc = await getDoc(doc(db, 'users', userId));
    if (!userDoc.exists()) {
      throw new Error('User not found');
    }
    
    const userData = userDoc.data();
    const currentCredits = userData.credits || 0;
    
    if (currentCredits < amount) {
      throw new Error('Not enough credits');
    }
    
    await updateDoc(doc(db, 'users', userId), {
      credits: currentCredits - amount,
      updatedAt: serverTimestamp(),
      paymentHistory: [
        ...(userData.paymentHistory || []),
        {
          amount: amount,
          type: 'credit_usage',
          timestamp: new Date().toISOString()
        }
      ]
    });
    
    return currentCredits - amount;
  } catch (error) {
    console.error('Error using credits:', error);
    throw error;
  }
};

// Get user's payment history
export const getPaymentHistory = async (userId) => {
  try {
    const userDoc = await getDoc(doc(db, 'users', userId));
    if (!userDoc.exists()) {
      throw new Error('User not found');
    }
    
    return userDoc.data().paymentHistory || [];
  } catch (error) {
    console.error('Error getting payment history:', error);
    throw error;
  }
};


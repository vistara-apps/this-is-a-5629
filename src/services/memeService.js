import { 
  db, 
  storage, 
  collection, 
  doc, 
  setDoc, 
  getDoc, 
  getDocs, 
  query, 
  where, 
  orderBy, 
  limit, 
  updateDoc, 
  deleteDoc, 
  serverTimestamp,
  uploadImage,
  generateId
} from './firebase';

// Create a new meme
export const createMeme = async (userId, memeData) => {
  try {
    const memeId = generateId();
    const memeRef = doc(db, 'memes', memeId);
    
    // Upload image if it's a File object
    let imageUrl = memeData.imageUrl;
    if (memeData.imageFile) {
      imageUrl = await uploadImage(memeData.imageFile, `memes/${userId}/${memeId}`);
    }
    
    // Create meme document
    await setDoc(memeRef, {
      memeId,
      userId,
      imageUrl,
      topText: memeData.topText || '',
      bottomText: memeData.bottomText || '',
      templateId: memeData.templateId || null,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      shareCount: 0,
      isPublic: memeData.isPublic || false,
      tags: memeData.tags || []
    });
    
    // Update user's meme count
    const userRef = doc(db, 'users', userId);
    const userDoc = await getDoc(userRef);
    if (userDoc.exists()) {
      const userData = userDoc.data();
      await updateDoc(userRef, {
        memeCount: (userData.memeCount || 0) + 1,
        updatedAt: serverTimestamp()
      });
    }
    
    return memeId;
  } catch (error) {
    console.error('Error creating meme:', error);
    throw error;
  }
};

// Get a meme by ID
export const getMeme = async (memeId) => {
  try {
    const memeDoc = await getDoc(doc(db, 'memes', memeId));
    if (memeDoc.exists()) {
      return memeDoc.data();
    } else {
      throw new Error('Meme not found');
    }
  } catch (error) {
    console.error('Error getting meme:', error);
    throw error;
  }
};

// Get all memes for a user
export const getUserMemes = async (userId, limitCount = 50) => {
  try {
    const memesQuery = query(
      collection(db, 'memes'),
      where('userId', '==', userId),
      orderBy('createdAt', 'desc'),
      limit(limitCount)
    );
    
    const querySnapshot = await getDocs(memesQuery);
    return querySnapshot.docs.map(doc => doc.data());
  } catch (error) {
    console.error('Error getting user memes:', error);
    throw error;
  }
};

// Update a meme
export const updateMeme = async (memeId, updateData) => {
  try {
    const memeRef = doc(db, 'memes', memeId);
    
    // Upload new image if provided
    if (updateData.imageFile) {
      const memeDoc = await getDoc(memeRef);
      if (!memeDoc.exists()) {
        throw new Error('Meme not found');
      }
      
      const userId = memeDoc.data().userId;
      updateData.imageUrl = await uploadImage(updateData.imageFile, `memes/${userId}/${memeId}`);
      delete updateData.imageFile;
    }
    
    await updateDoc(memeRef, {
      ...updateData,
      updatedAt: serverTimestamp()
    });
    
    return memeId;
  } catch (error) {
    console.error('Error updating meme:', error);
    throw error;
  }
};

// Delete a meme
export const deleteMeme = async (memeId) => {
  try {
    await deleteDoc(doc(db, 'memes', memeId));
  } catch (error) {
    console.error('Error deleting meme:', error);
    throw error;
  }
};

// Increment share count
export const incrementShareCount = async (memeId) => {
  try {
    const memeRef = doc(db, 'memes', memeId);
    const memeDoc = await getDoc(memeRef);
    
    if (!memeDoc.exists()) {
      throw new Error('Meme not found');
    }
    
    const currentShareCount = memeDoc.data().shareCount || 0;
    
    await updateDoc(memeRef, {
      shareCount: currentShareCount + 1,
      updatedAt: serverTimestamp()
    });
    
    return currentShareCount + 1;
  } catch (error) {
    console.error('Error incrementing share count:', error);
    throw error;
  }
};

// Get popular memes
export const getPopularMemes = async (limitCount = 10) => {
  try {
    const memesQuery = query(
      collection(db, 'memes'),
      where('isPublic', '==', true),
      orderBy('shareCount', 'desc'),
      limit(limitCount)
    );
    
    const querySnapshot = await getDocs(memesQuery);
    return querySnapshot.docs.map(doc => doc.data());
  } catch (error) {
    console.error('Error getting popular memes:', error);
    throw error;
  }
};

// Get recent memes
export const getRecentMemes = async (limitCount = 10) => {
  try {
    const memesQuery = query(
      collection(db, 'memes'),
      where('isPublic', '==', true),
      orderBy('createdAt', 'desc'),
      limit(limitCount)
    );
    
    const querySnapshot = await getDocs(memesQuery);
    return querySnapshot.docs.map(doc => doc.data());
  } catch (error) {
    console.error('Error getting recent memes:', error);
    throw error;
  }
};


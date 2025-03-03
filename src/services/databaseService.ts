
import { 
  collection, 
  doc, 
  setDoc, 
  getDoc, 
  getDocs, 
  updateDoc, 
  deleteDoc, 
  query, 
  where, 
  orderBy, 
  limit,
  QueryConstraint,
  DocumentData
} from "firebase/firestore";
import { db, isInDemoMode } from "../lib/firebase";
import { toast } from "sonner";
import { Product, SkinProfile } from "@/context/ProductContext";

// Mock in-memory database for demo mode
const mockDatabase: Record<string, Record<string, any>> = {
  users: {},
  products: {},
  skinProfiles: {}
};

// Generic function to add a document to a collection
export const addDocument = async <T extends DocumentData>(
  collectionName: string, 
  documentId: string, 
  data: T
): Promise<void> => {
  if (isInDemoMode) {
    if (!mockDatabase[collectionName]) {
      mockDatabase[collectionName] = {};
    }
    mockDatabase[collectionName][documentId] = { ...data, id: documentId };
    console.log(`[DEMO] Added document to ${collectionName}:`, documentId, data);
    return;
  }

  try {
    const docRef = doc(db, collectionName, documentId);
    await setDoc(docRef, data);
  } catch (error: any) {
    console.error(`Error adding document to ${collectionName}:`, error);
    toast.error(error.message || `Failed to save to ${collectionName}`);
    throw error;
  }
};

// Generic function to get a document from a collection
export const getDocument = async <T>(
  collectionName: string, 
  documentId: string
): Promise<T | null> => {
  if (isInDemoMode) {
    const result = mockDatabase[collectionName]?.[documentId] || null;
    console.log(`[DEMO] Retrieved document from ${collectionName}:`, documentId, result);
    return result;
  }

  try {
    const docRef = doc(db, collectionName, documentId);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() } as T;
    } else {
      return null;
    }
  } catch (error: any) {
    console.error(`Error getting document from ${collectionName}:`, error);
    toast.error(error.message || `Failed to retrieve from ${collectionName}`);
    throw error;
  }
};

// Generic function to update a document in a collection
export const updateDocument = async <T extends Partial<DocumentData>>(
  collectionName: string, 
  documentId: string, 
  data: T
): Promise<void> => {
  if (isInDemoMode) {
    if (mockDatabase[collectionName]?.[documentId]) {
      mockDatabase[collectionName][documentId] = { 
        ...mockDatabase[collectionName][documentId], 
        ...data 
      };
      console.log(`[DEMO] Updated document in ${collectionName}:`, documentId, data);
    }
    return;
  }

  try {
    const docRef = doc(db, collectionName, documentId);
    await updateDoc(docRef, data);
  } catch (error: any) {
    console.error(`Error updating document in ${collectionName}:`, error);
    toast.error(error.message || `Failed to update in ${collectionName}`);
    throw error;
  }
};

// Generic function to delete a document from a collection
export const deleteDocument = async (
  collectionName: string, 
  documentId: string
): Promise<void> => {
  if (isInDemoMode) {
    if (mockDatabase[collectionName]?.[documentId]) {
      delete mockDatabase[collectionName][documentId];
      console.log(`[DEMO] Deleted document from ${collectionName}:`, documentId);
    }
    return;
  }

  try {
    const docRef = doc(db, collectionName, documentId);
    await deleteDoc(docRef);
  } catch (error: any) {
    console.error(`Error deleting document from ${collectionName}:`, error);
    toast.error(error.message || `Failed to delete from ${collectionName}`);
    throw error;
  }
};

// Generic function to query documents from a collection
export const queryDocuments = async <T>(
  collectionName: string,
  constraints: QueryConstraint[] = []
): Promise<T[]> => {
  if (isInDemoMode) {
    const results = Object.values(mockDatabase[collectionName] || {});
    console.log(`[DEMO] Queried documents from ${collectionName}:`, results);
    return results as T[];
  }

  try {
    const collectionRef = collection(db, collectionName);
    const q = query(collectionRef, ...constraints);
    const querySnapshot = await getDocs(q);
    
    const results: T[] = [];
    querySnapshot.forEach((doc) => {
      results.push({ id: doc.id, ...doc.data() } as T);
    });
    
    return results;
  } catch (error: any) {
    console.error(`Error querying documents from ${collectionName}:`, error);
    toast.error(error.message || `Failed to query from ${collectionName}`);
    throw error;
  }
};

// User-specific functions

export const saveUserProfile = async (
  userId: string, 
  profileData: Record<string, any>
): Promise<void> => {
  return addDocument('users', userId, {
    ...profileData,
    updatedAt: new Date().toISOString()
  });
};

export const getUserProfile = async (
  userId: string
): Promise<Record<string, any> | null> => {
  return getDocument('users', userId);
};

// Product-specific functions

export const saveUserProducts = async (
  userId: string, 
  products: Product[]
): Promise<void> => {
  return addDocument('userProducts', userId, {
    products,
    updatedAt: new Date().toISOString()
  });
};

export const getUserProducts = async (
  userId: string
): Promise<{ products: Product[] } | null> => {
  return getDocument('userProducts', userId);
};

// Skin profile functions

export const saveSkinProfile = async (
  userId: string, 
  skinProfile: SkinProfile
): Promise<void> => {
  return addDocument('skinProfiles', userId, {
    ...skinProfile,
    updatedAt: new Date().toISOString()
  });
};

export const getSkinProfile = async (
  userId: string
): Promise<SkinProfile | null> => {
  return getDocument('skinProfiles', userId);
};

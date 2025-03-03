import { collection, addDoc, getDocs, query, where, doc, updateDoc, deleteDoc } from "firebase/firestore";
import { db } from "../lib/firebase";

// Add a new document to a collection
export const addDocument = async (collectionName: string, data: any): Promise<void> => {
  try {
    const docRef = await addDoc(collection(db, collectionName), data);
    console.log("Document written with ID: ", docRef.id);
  } catch (error) {
    console.error("Error adding document: ", error);
    throw error;
  }
};

// Get documents from a collection with optional filters
export const getDocuments = async (collectionName: string, filters: any[] = []) => {
  try {
    const q = query(collection(db, collectionName), ...filters.map(filter => where(...filter)));
    const querySnapshot = await getDocs(q);
    console.log("Documents fetched: ", querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error("Error getting documents: ", error);
    throw error;
  }
};

// Update a document in a collection
export const updateDocument = async (collectionName: string, docId: string, data: any) => {
  try {
    const docRef = doc(db, collectionName, docId);
    await updateDoc(docRef, data);
    console.log("Document updated with ID: ", docId);
  } catch (error) {
    console.error("Error updating document: ", error);
    throw error;
  }
};

// Delete a document from a collection
export const deleteDocument = async (collectionName: string, docId: string) => {
  try {
    const docRef = doc(db, collectionName, docId);
    await deleteDoc(docRef);
    console.log("Document deleted with ID: ", docId);
  } catch (error) {
    console.error("Error deleting document: ", error);
    throw error;
  }
};
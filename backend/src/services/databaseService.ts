import { db } from "../config/firebase";

export const createDocument = async (collectionName: string, data: any) => {
  const docRef = db.collection(collectionName).doc();
  await docRef.set(data);
  return docRef.id;
};

export const getDocument = async (collectionName: string, docId: string) => {
  const docRef = await db.collection(collectionName).doc(docId).get();
  if (!docRef.exists) {
    return null;
  }
  return { id: docRef.id, ...docRef.data() };
};

export const updateDocument = async (collectionName: string, docId: string, data: any) => {
  const docRef = db.collection(collectionName).doc(docId);
  await docRef.update(data);
};

export const deleteDocument = async (collectionName: string, docId: string) => {
  await db.collection(collectionName).doc(docId).delete();
};

export const getAllDocuments = async (collectionName: string) => {
  const snapshot = await db.collection(collectionName).get();
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
};

export const queryDocuments = async (
  collectionName: string,
  field: string,
  operator: any,
  value: any,
) => {
  const snapshot = await db.collection(collectionName).where(field, operator, value).get();
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
};

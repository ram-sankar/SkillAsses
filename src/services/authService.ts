import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { auth, db } from "../config/firebase";
import { UserType } from "constants/models/User";

export const registerUser = async (
  email: string,
  password: string,
  username: string,
  role: UserType,
): Promise<{ userId?: string; error?: string }> => {
  try {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password,
    );
    const user = userCredential.user;

    // Store additional info in Firestore
    await setDoc(doc(db, "users", user.uid), {
      uid: user.uid,
      email,
      username,
      role,
      createdAt: new Date(),
    });

    return { userId: user.uid };
  } catch (error: any) {
    throw error;
  }
};

export const loginUser = async (email: string, password: string) => {
  try {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password,
    );
    return userCredential.user;
  } catch (error) {
    throw error; // Re-throw the error to be handled in Login.tsx
  }
};

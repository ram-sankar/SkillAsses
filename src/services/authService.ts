import {
  createUserWithEmailAndPassword,
  getIdToken,
  signInWithEmailAndPassword,
  signOut,
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

export const loginUser = async (
  email: string,
  password: string,
  userType: UserType,
) => {
  try {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password,
    );
    const user = userCredential.user;
    const idToken = await getIdToken(user);
    await storeToken(idToken, user.uid, userType);
    return { user, idToken };
  } catch (error) {
    throw error;
  }
};

export const logoutUser = async () => {
  try {
    await signOut(auth);
    clearToken();
  } catch (error) {
    console.error("Error during logout:", error);
    throw error;
  }
};

const storeToken = async (token: string, uid: string, userType: UserType) => {
  sessionStorage.setItem("token", token);
  sessionStorage.setItem("uid", uid);
  sessionStorage.setItem("userType", userType);
};

const clearToken = () => {
  sessionStorage.removeItem("token");
  sessionStorage.removeItem("uid");
  sessionStorage.removeItem("userType");
};

export const isLoggedIn = () => {
  return !!sessionStorage.getItem("token");
};

export const getUserDetails = () => {
  const userType = typeof (sessionStorage.getItem("userType"), UserType)
    ? (sessionStorage.getItem("userType") as UserType)
    : null;
  return {
    token: sessionStorage.getItem("token"),
    uid: sessionStorage.getItem("uid"),
    userType,
  };
};

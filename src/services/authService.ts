import { createUserWithEmailAndPassword, getIdToken, signInWithEmailAndPassword, signOut } from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { auth, db, TABLES } from "../config/firebase";
import { UserDetails, UserType } from "common/models/User";

export const registerUser = async (email: string, password: string, username: string, role: UserType): Promise<{ userId?: string; error?: string }> => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Store additional info in Firestore
    await setDoc(doc(db, TABLES.USERS, user.uid), {
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

export const loginUser = async (email: string, password: string, expectedUserType: UserType) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    const userDocRef = doc(db, TABLES.USERS, user.uid);
    const userSnapshot = await getDoc(userDocRef);

    if (!userSnapshot.exists()) {
      throw new Error("User data not found in database.");
    }
    const userData = userSnapshot.data();

    if (userData.role !== expectedUserType) {
      await signOut(auth);
      throw new Error(`Invalid role. Expected ${expectedUserType}, found ${userData.role}`);
    }

    const idToken = await getIdToken(user);
    await storeToken(idToken, user.uid, userData.role, userData.email);

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

const storeToken = async (token: string, uid: string, userType: UserType, email: string) => {
  sessionStorage.setItem("token", token);
  sessionStorage.setItem("uid", uid);
  sessionStorage.setItem("userType", userType);
  sessionStorage.setItem("email", email);
};

const clearToken = () => {
  sessionStorage.removeItem("token");
  sessionStorage.removeItem("uid");
  sessionStorage.removeItem("userType");
  sessionStorage.removeItem("email");
};

export const isLoggedIn = () => {
  return !!sessionStorage.getItem("token");
};

export const getUserDetails = (): UserDetails => {
  const token = sessionStorage.getItem("token");
  const uid = sessionStorage.getItem("uid");
  const email = sessionStorage.getItem("email");
  const userType = sessionStorage.getItem("userType") as UserType | undefined;

  return {
    token: token || "",
    uid: uid || "",
    email: email || "",
    userType: userType || UserType.CANDIDATE,
  };
};

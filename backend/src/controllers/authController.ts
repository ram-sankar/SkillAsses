import { Request, Response } from "express";
import { auth, db } from "../config/firebase";

const USERS_COLLECTION = "users";

export const registerUser = async (req: Request, res: Response): Promise<void> => {
  const { email, password, username, role } = req.body;

  if (!email || !password || !username || !role) {
    res.status(400).json({ error: "Missing required fields" });
    return;
  }

  try {
    const userRecord = await auth.createUser({ email, password });
    await db.collection(USERS_COLLECTION).doc(userRecord.uid).set({
      uid: userRecord.uid,
      email,
      username,
      role,
      createdAt: new Date(),
    });

    res.status(201).json({ userId: userRecord.uid });
  } catch (error: any) {
    res.status(400).json({ error: error.message || "Registration failed" });
  }
};

import axios from "axios";

export const loginUser = async (req: Request, res: Response): Promise<void> => {
  const { email, password, expectedUserType } = req.body;

  if (!email || !password || !expectedUserType) {
    res.status(400).json({ error: "Missing email, password, or expectedUserType" });
    return;
  }

  try {
    // 1. Authenticate using Firebase Auth REST API
    const firebaseApiKey = process.env.FIREBASE_API_KEY;
    const signInUrl = `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${firebaseApiKey}`;

    const response = await axios.post(signInUrl, {
      email,
      password,
      returnSecureToken: true,
    });

    const { idToken, localId: uid } = response.data;

    // 2. Validate user role from Firestore
    const userDoc = await db.collection(USERS_COLLECTION).doc(uid).get();
    if (!userDoc.exists) {
      res.status(404).json({ error: "User data not found" });
      return;
    }

    const userData = userDoc.data();
    if (userData?.role !== expectedUserType) {
      res
        .status(403)
        .json({ error: `Invalid role. Expected ${expectedUserType}, found ${userData?.role}` });
      return;
    }

    // 3. Return ID token and user info
    res.status(200).json({
      uid,
      idToken,
      email: userData?.email,
      username: userData?.username,
      role: userData?.role,
    });
  } catch (error: any) {
    const message = error?.response?.data?.error?.message || error.message;
    res.status(401).json({ error: `Login failed: ${message}` });
  }
};

export const logoutUser = async (_req: Request, res: Response): Promise<void> => {
  // With token-based auth, logout is handled client-side by deleting tokens.
  res.status(200).json({ message: "Logout handled client-side by clearing tokens" });
};

export const getUserDetails = async (req: Request, res: Response): Promise<void> => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    res.status(401).json({ error: "Missing or invalid authorization header" });
    return;
  }

  const token = authHeader.split("Bearer ")[1];

  try {
    const decodedToken = await auth.verifyIdToken(token);
    const userDoc = await db.collection(USERS_COLLECTION).doc(decodedToken.uid).get();

    if (!userDoc.exists) {
      res.status(404).json({ error: "User not found" });
      return;
    }

    res.status(200).json({ uid: decodedToken.uid, ...userDoc.data() });
  } catch (error: any) {
    res.status(401).json({ error: error.message || "Invalid token" });
  }
};

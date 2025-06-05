import { Request, Response } from "express";
import { auth, db } from "../config/firebase";
import { sendError, sendSuccess } from "../utils/response";
import { FIREBASE_TABLES } from "../constants/firebaseTables";
import { AUTH_MESSAGES, COMMON_STRINGS, ERROR_MESSAGES } from "../constants/messages";

const BEARER = "Bearer ";
export const registerUser = async (req: Request, res: Response): Promise<void> => {
  const { email, password, username, role } = req.body;

  if (!email || !password || !username || !role) {
    sendError(res, COMMON_STRINGS.MISSING_REQUIRED_FIELDS, 400);
    return;
  }

  try {
    const userRecord = await auth.createUser({ email, password });
    await db.collection(FIREBASE_TABLES.USERS).doc(userRecord.uid).set({
      uid: userRecord.uid,
      email,
      username,
      role,
      createdAt: new Date(),
    });

    sendSuccess(res, { userId: userRecord.uid }, AUTH_MESSAGES.USER_REGISTERED, 201);
  } catch (error: any) {
    sendError(res, error.message || AUTH_MESSAGES.REGISTRATION_FAILED, 400);
  }
};

import axios from "axios";

export const loginUser = async (req: Request, res: Response): Promise<void> => {
  const { email, password, expectedUserType } = req.body;

  if (!email || !password || !expectedUserType) {
    sendError(res, COMMON_STRINGS.MISSING_REQUIRED_FIELDS, 400);
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
    const userDoc = await db.collection(FIREBASE_TABLES.USERS).doc(uid).get();
    if (!userDoc.exists) {
      sendError(res, AUTH_MESSAGES.USER_DATA_NOT_FOUND, 404);
      return;
    }

    const userData = userDoc.data();
    if (userData?.role !== expectedUserType) {
      sendError(
        res,
        AUTH_MESSAGES.INVALID_ROLE.replace("{expectedUserType}", expectedUserType).replace(
          "{actualUserType}",
          userData?.role,
        ),
        403,
      );
      return;
    }

    // 3. Return ID token and user info
    sendSuccess(
      res,
      {
        uid,
        idToken,
        email: userData?.email,
        username: userData?.username,
        role: userData?.role,
      },
      AUTH_MESSAGES.LOGIN_SUCCESSFUL,
      200,
    );
  } catch (error: any) {
    const message = error?.response?.data?.error?.message || error.message;
    sendError(res, `${AUTH_MESSAGES.LOGIN_FAILED}: ${message}`, 401);
  }
};

export const logoutUser = async (_req: Request, res: Response): Promise<void> => {
  // With token-based auth, logout is handled client-side by deleting tokens.
  sendSuccess(
    res,
    { message: COMMON_STRINGS.LOGOUT_MESSAGE },
    AUTH_MESSAGES.LOGOUT_SUCCESSFUL,
    200,
  );
};

export const getUserDetails = async (req: Request, res: Response): Promise<void> => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith(BEARER)) {
    sendError(res, COMMON_STRINGS.MISSING_AUTHORIZATION_HEADER, 401);
    return;
  }

  const token = authHeader.split(BEARER)[1];

  try {
    const decodedToken = await auth.verifyIdToken(token);
    const userDoc = await db.collection(FIREBASE_TABLES.USERS).doc(decodedToken.uid).get();

    if (!userDoc.exists) {
      sendError(res, COMMON_STRINGS.USER_NOT_FOUND, 404);
      return;
    }

    sendSuccess(
      res,
      { uid: decodedToken.uid, ...userDoc.data() },
      AUTH_MESSAGES.USER_DETAILS_FETCHED,
      200,
    );
  } catch (error: any) {
    sendError(res, error.message || ERROR_MESSAGES.INVALID_TOKEN, 401);
  }
};

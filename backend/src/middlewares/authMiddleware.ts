import { Request, Response, NextFunction } from "express";
import { auth, db } from "../config/firebase";
import { FIREBASE_TABLES } from "../constants/firebaseTables";

export interface AuthenticatedRequest extends Request {
  user?: {
    email?: string;
    uid?: string;
    username?: string;
    role?: string;
  };
}

export const authenticateFirebaseToken = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
): void => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    res.status(401).json({ error: "Missing or invalid authorization header" });
    return;
  }

  const idToken = authHeader.split("Bearer ")[1];

  auth
    .verifyIdToken(idToken)
    .then(async (decodedToken) => {
      const userDoc = await db.collection(FIREBASE_TABLES.USERS).doc(decodedToken.uid).get();

      if (!userDoc.exists) {
        return res.status(404).json({ error: "User not found" });
      }

      const userData = userDoc.data();

      if (!userData) {
        return res.status(404).json({ error: "User data empty" });
      }

      req.user = {
        uid: decodedToken.uid,
        email: userData.email,
        username: userData.username,
        role: userData.role,
      };

      next();
    })
    .catch((error) => {
      return res.status(401).json({ error: error.message || "Invalid token" });
    });
};

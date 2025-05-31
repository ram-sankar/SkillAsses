import { Router } from "express";
import { registerUser, loginUser, logoutUser, getUserDetails } from "../controllers/authController";

const router = Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/logout", logoutUser);
router.get("/me", getUserDetails);

export default router;

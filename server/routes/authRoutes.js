import express from "express";
import { registerUser, loginUser, getMe } from "../controllers/authController.js";
import authMiddleware from "../middleware/authMiddleware.js";
import { deleteAccount ,   changePassword } from "../controllers/authController.js";
const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);

//   CORRECT USER DATA
router.get("/me", authMiddleware, getMe);
router.delete("/delete", authMiddleware, deleteAccount);
router.put("/change-password", authMiddleware, changePassword);

export default router;

import express from "express";
import {
  register,
  login,
  getProfile,
} from "./../controllers/authController.js";
import {
  validateRegistration,
  validateLogin,
} from "./../middlewares/validation.js";
import { authenticate } from "./../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/register", validateRegistration, register);
router.post("/login", validateLogin, login);
router.get("/profile", authenticate, getProfile);

export default router;

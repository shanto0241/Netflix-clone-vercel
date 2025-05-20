import express from "express";
import {
  authCheck,
  login,
  logout,
  signup,
} from "../controllers/auth.controller.js";
import { protectRoute } from "../middleware/protectRoute.js";

const authRoutes = express.Router();

authRoutes.post("/signup", signup);
authRoutes.post("/login", login);
authRoutes.post("/logout", logout);

authRoutes.get("/authCheck", protectRoute, authCheck);

export default authRoutes;

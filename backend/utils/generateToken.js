import jwt from "jsonwebtoken";
import { ENV_VARS } from "../config/envVars.js";

export const generateTokenAndSetCookie = (userId, res) => {
  // Generate a JWT token
  const token = jwt.sign({ userId }, ENV_VARS.JWT_SECRET, {
    expiresIn: "15d", // Token expiration time
  });

  // Set the token in a cookie
  res.cookie("jwt-netflix", token, {
    sameSite: "strict", // Prevents CSRF attacks
    httpOnly: true, // Prevents client-side JavaScript from accessing the cookie
    secure: ENV_VARS.NODE_ENV !== "development", // Use secure cookies in production
    maxAge: 15 * 24 * 60 * 60, // Cookie expiration time (1 hour)
  });
  return token; // Return the token if needed
};

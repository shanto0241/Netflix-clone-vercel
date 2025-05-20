import bcryptjs from "bcryptjs";
import { User } from "../models/user.model.js";
import { generateTokenAndSetCookie } from "../utils/generateToken.js";

export async function signup(req, res) {
  try {
    const { username, email, password } = req.body;
    // Check if the request body is empty
    if (!req.body) {
      return res.status(400).json({ message: "Request body is empty" });
    }
    // Check if the request body is not an object
    if (typeof req.body !== "object") {
      return res.status(400).json({ message: "Request body is not an object" });
    }

    // Validate the input data
    if (!username || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Check if the email is valid
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: "Invalid email address" });
    }

    // Check if the user already exists
    const existingUser = await User.findOne({ email: email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // check if the username is already taken
    const existingUserByUserName = await User.findOne({ username: username });
    if (existingUserByUserName) {
      return res.status(400).json({ message: "Username already exists" });
    }

    // Check if the password is strong
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/;
    if (!passwordRegex.test(password)) {
      return res.status(400).json({
        message:
          "Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, and one number",
      });
    }

    // Hash the password
    const salt = await bcryptjs.genSalt(10);
    const hashedPassword = await bcryptjs.hash(password, salt);

    const PROFILE_PICS = ["/avatar1.png", "/avatar2.png", "/avatar3.png"];
    const image = PROFILE_PICS[Math.floor(Math.random() * PROFILE_PICS.length)];

    // Create a new user
    const newUser = new User({
      username,
      email,
      password: hashedPassword,
      image,
    });
    // Check if the user was created successfully
    if (!newUser) {
      return res.status(500).json({ message: "Failed to create user" });
    }
    // Generate a JWT token and set it in a cookie
    generateTokenAndSetCookie(newUser._id, res);

    // Save the user to the database
    await newUser.save();

    // Check if the user was saved successfully
    // Send a success response
    res.status(201).json({
      success: true,
      user: { ...newUser._doc, password: "" }, // Exclude the password from the response
      message: "User created successfully",
    });
  } catch (error) {
    console.error("Error in signup:", error.message);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
}
export async function login(req, res) {
  try {
    const { email, password } = req.body;
    // Check if the request body is empty
    if (!req.body) {
      return res.status(400).json({ message: "Request body is empty" });
    }
    // Check if the request body is not an object
    if (typeof req.body !== "object") {
      return res.status(400).json({ message: "Request body is not an object" });
    }
    // Validate the input data
    if (!email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }
    // Check if the email is valid
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: "Invalid email address" });
    }
    // Check if the user exists
    const existingUser = await User.findOne({ email: email });
    if (!existingUser) {
      return res.status(400).json({ message: "User does not exist" });
    }
    // Check if the password is correct
    const isPasswordCorrect = await bcryptjs.compare(
      password,
      existingUser.password
    );
    if (!isPasswordCorrect) {
      return res.status(400).json({ message: "Invalid password" });
    }
    // Generate a JWT token and set it in a cookie
    generateTokenAndSetCookie(existingUser._id, res);

    // Send a success response
    res.status(200).json({
      success: true,
      user: { ...existingUser._doc, password: "" }, // Exclude the password from the response
      message: "User logged in successfully",
    });
  } catch (error) {
    console.error("Error in login:", error.message);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
}
export async function logout(req, res) {
  try {
    // Clear the session or token (if applicable)
    // In this case, we are just clearing the cookie
    // Clear the JWT cookie
    res.clearCookie("jwt-netflix");

    res.status(200).json({
      success: true,
      message: "User logged out successfully",
    });
  } catch (error) {
    console.error("Error in logout:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}
export async function authCheck(req, res) {
  try {
    // Check if the user is authenticated
    if (!req.user) {
      return res.status(401).json({ message: "User is not authenticated" });
    }
    res.status(200).json({ success: false, message: "User is authenticated" });
  } catch (error) {
    console.error("Error in authCheck:", error.message);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
}

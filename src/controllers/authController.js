import User from "../models/User.js";
import jwt from "jsonwebtoken";

// Generate JWT Token
const generateToken = (userId, email) => {
  const token = jwt.sign(
    { id: userId, email: email },
    process.env.JWT_SECRET || "your_secret_key_change_in_production",
    { expiresIn: "7d" }
  );
  return token;
};

// Register a new user
export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    console.log("📝 Register attempt:", { name, email });

    // Validate required fields
    if (!name || !email || !password) {
      return res.status(400).json({
        error: "Validation failed",
        message: "Name, email, and password are required",
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      console.log("❌ User already exists:", email);
      return res.status(400).json({
        error: "User already exists",
        message: "Email is already registered",
      });
    }

    // ✅ DO NOT hash password here!
    // The User model pre('save') hook will do it automatically

    // Create new user with plain password
    const user = new User({
      name,
      email,
      password: password, // ✅ Plain password - will be hashed by pre('save')
    });

    // Save to database - this triggers the pre('save') hook
    await user.save();
    console.log("✅ User created:", email);
    console.log("📋 Password hashed by pre('save') hook");

    // Generate token
    const token = generateToken(user._id.toString(), user.email);

    // Return response with token
    res.status(201).json({
      message: "Account created successfully",
      token: token,
      user: {
        id: user._id.toString(),
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    console.error("❌ Register error:", error);
    res.status(500).json({
      error: "Registration failed",
      message: error.message,
    });
  }
};

// Login user
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    console.log("🔐 Login attempt:", email);

    // Validate required fields
    if (!email || !password) {
      return res.status(400).json({
        error: "Validation failed",
        message: "Email and password are required",
      });
    }

    // Find user by email
    // ✅ IMPORTANT: Use .select('+password') because password has select: false
    console.log("🔍 Looking up user:", email);
    const user = await User.findOne({ email }).select("+password");

    if (!user) {
      console.log("❌ User not found:", email);
      return res.status(401).json({
        error: "Invalid credentials",
        message: "Email not found",
      });
    }

    console.log("👤 User found:", {
      id: user._id,
      email: user.email,
      hasPassword: !!user.password,
      passwordLength: user.password?.length,
    });

    // Check if user has password
    if (!user.password) {
      console.log("❌ User has no password field:", email);
      return res.status(401).json({
        error: "Invalid credentials",
        message: "Account error - no password",
      });
    }

    console.log("🔒 Comparing passwords using matchPassword()...");

    // ✅ Use the matchPassword method from User model
    const isPasswordValid = await user.matchPassword(password);

    if (!isPasswordValid) {
      console.log("❌ Wrong password for:", email);
      return res.status(401).json({
        error: "Invalid credentials",
        message: "Password is incorrect",
      });
    }

    console.log("✅ Password valid for:", email);

    // Generate token
    const token = generateToken(user._id.toString(), user.email);

    console.log("✅ Login successful:", email);

    // Return response with token
    res.status(200).json({
      message: "Login successful",
      token: token,
      user: {
        id: user._id.toString(),
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    console.error("❌ Login error:", error);
    res.status(500).json({
      error: "Login failed",
      message: error.message,
    });
  }
};

// Get current user (protected route)
export const getMe = async (req, res) => {
  try {
    const userId = req.user.id; // From auth middleware

    const user = await User.findById(userId).select("-password");
    if (!user) {
      return res.status(404).json({
        error: "User not found",
      });
    }

    res.status(200).json({
      user: {
        id: user._id.toString(),
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    console.error("❌ GetCurrentUser error:", error);
    res.status(500).json({
      error: "Failed to get user",
      message: error.message,
    });
  }
};

// Logout (optional - just clear token on frontend)
export const logout = async (req, res) => {
  try {
    // Token is cleared on frontend
    // Backend just confirms logout
    res.status(200).json({
      message: "Logout successful",
    });
  } catch (error) {
    console.error("❌ Logout error:", error);
    res.status(500).json({
      error: "Logout failed",
      message: error.message,
    });
  }
};

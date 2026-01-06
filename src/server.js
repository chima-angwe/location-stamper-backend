import "dotenv/config"; // ✅ MUST be first
import express from "express";
import cors from "cors";
import connectDB from "./config/db.js";
import { errorHandler } from "./middleware/errorHandler.js";
import { generalLimiter } from "./middleware/rateLimitMiddleware.js";

// Initialize Express app
const app = express();

// Connect to MongoDB
connectDB();

// ✅ SIMPLE CORS FOR DEVELOPMENT - Allow everything!
const corsOptions = {
  origin: true, // ✅ Allow all origins (safe for development)
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  optionsSuccessStatus: 200,
};

// Apply CORS middleware
app.use(cors(corsOptions));

// Middleware
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

// Apply general rate limiting to all requests
app.use(generalLimiter);

// Request logging (optional but helpful for debugging)
app.use((req, res, next) => {
  console.log(
    `📨 ${req.method} ${req.path} from ${req.get("origin") || "unknown"}`
  );
  next();
});

// Routes
app.get("/", (req, res) => {
  res.json({
    message: "Location Stamper API",
    version: "1.0.0",
    status: "running",
    environment: process.env.NODE_ENV || "development",
  });
});

// Health check endpoint
app.get("/health", (req, res) => {
  res.json({ status: "OK", timestamp: new Date().toISOString() });
});

// API Routes
import authRoutes from "./routes/authRoutes.js";
import stampRoutes from "./routes/stampRoutes.js";
import uploadRoutes from "./routes/uploadRoutes.js";

app.use("/api/auth", authRoutes);
app.use("/api/stamps", stampRoutes);
app.use("/api/upload", uploadRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    error: "Not Found",
    message: `Route ${req.method} ${req.path} does not exist`,
  });
});

// Error Handler Middleware
app.use(errorHandler);

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📝 Environment: ${process.env.NODE_ENV || "development"}`);
  console.log(
    `🔗 Frontend URL: ${process.env.FRONTEND_URL || "http://localhost:5173"}`
  );
  console.log(`✅ CORS: Allowing all origins (development mode)`);
});

export default app;
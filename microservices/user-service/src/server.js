// server.js

// Description: Node.js server for CRUD operations with Supabase and MongoDB.

import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import userRoutes from "./src/routes/userRouter.js";

// Load environment variables
dotenv.config({ path: "./secrets/.env" });

const app = express();

// Middleware
app.use(express.json());
app.use(cors({ origin: "*" }));

// Log middleware
app.use((req, res, next) => {
  console.log(
    `Route: ${req.originalUrl} | Time: ${new Date().toLocaleString()}`,
  );
  next();
});

// Routes
app.use("/", userRoutes);

// Start server
const PORT = process.env.PORT;
app.listen(PORT, () =>
  console.log(`Server is running on http://localhost:${PORT}`),
);

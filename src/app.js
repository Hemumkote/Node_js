import express from "express";
import dotenv from "dotenv";
import { connectDB } from "./config/database.js";

import cookieParser from "cookie-parser";

//importing the routers
import { authRouter } from "./routes/auth.js";
import { profileRouter } from "./routes/profile.js";
import { requestRouter } from "./routes/request.js";

//configure dotenv to access environment variables
dotenv.config();

const app = express(); // instance of an express js application
app.use(express.json()); // <-- add this so req.body is populated

const PORT = 3000;
app.use(cookieParser());

const isConnected = await connectDB();
if (!isConnected) {
  console.error("Failed to connect to the database. Exiting...");
  process.exit(1); // Exit the application if DB connection fails
}
if (isConnected) {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
} else {
  console.error("Database connection failed. Server not started.");
  process.exit(1); // Exit the application if DB connection fails
}

//using the routers add route like middleware
app.use("/auth", authRouter);
app.use("/profile", profileRouter);
app.use("/request", requestRouter);

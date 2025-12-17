import express from "express";
import { userAuth } from "../middleware/auth.js";

export const requestRouter = express.Router();

requestRouter.post("/sendConnectionRequest", userAuth, async (req, res) => {
  const user = req.user;
  console.log("Authenticated user:", user);
  console.log("sending the connection request");
  res.send(user.firstName + " connection request sent successfully");
});

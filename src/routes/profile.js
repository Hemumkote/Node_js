import { userAuth } from "#src/middleware/auth.js";
import { validateProfileData } from "#src/utils/validateProfileDate.js";
import express from "express";
import bcrypt from "bcrypt";

export const profileRouter = express.Router();

profileRouter.get("/view", userAuth, async (req, res) => {
  try {
    //user is added to req object in the userAuth middleware
    const user = req.user;
    //send only specific fields in the response
    res.status(200).json({
      message: "User data accessed successfully",
      user: {
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        age: user.age,
        photoUrl: user.photoUrl,
      },
    });
  } catch (error) {
    res.status(500).send("Internal Server Error", error);
  }
});

profileRouter.patch("/update", userAuth, async (req, res) => {
  try {
    validateProfileData(req);
    const loggedinUser = req.user;
    Object.keys(req.body).forEach((key) => {
      loggedinUser[key] = req.body[key];
    });
    await loggedinUser.save();
    res.status(200).json({ message: "Profile updated successfully" });
    // TODO: Add logic to update the user in the database
  } catch (error) {
    // Send the specific error message from our validator
    res.status(400).json({ message: error.message });
  }
});

profileRouter.patch("/updatePassword", userAuth, async (req, res) => {
  try {
    const loggedinUser = req.user;
    const { oldPassword, newPassword } = req.body;
    const isOldPasswordValid = await loggedinUser.validatePassword(oldPassword);
    if (!isOldPasswordValid) {
      res.status(400).json({ message: "Invalid old password" });
      return;
    }
    const isSamePassword = await bcrypt.compare(
      newPassword,
      loggedinUser.password
    );
    if (isSamePassword) {
      res.status(400).json({ message: "New password must be different" });
      return;
    }
    loggedinUser.password = await bcrypt.hash(newPassword, 10);
    await loggedinUser.save();
    res.status(200).json({ message: "Password updated successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

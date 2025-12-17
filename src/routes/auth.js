import express from "express";
import User from "../models/user.ts";
import bcrypt from "bcrypt";
import { validateSignUpData } from "../utils/validation.ts";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";

export const authRouter = express.Router();

authRouter.post("/signup", async (req, res) => {
  try {
    const data = req.body;
    const { firstName, lastName, email, password, age, photoUrl, gender } =
      data;

    //validating the signup data
    validateSignUpData(data);

    //checking if user already exists in the database
    const savedUser = await User.findOne({ email: email });

    //encrypt the password before saving to the database using the "bcrypt" package
    const hashedPassword = await bcrypt.hash(password, 10);

    //checking if the user already exists
    if (savedUser) {
      res.status(409).send("Error signing up user");
    } else {
      //make sure the required fields are passed while creating the user
      const user = new User({
        firstName,
        lastName,
        email,
        password: hashedPassword,
        age,
        photoUrl,
        gender,
      });

      await user.save();
      res.status(201).send("User signed up successfully!!");
    }
  } catch (error) {
    console.error("Error during signup:", error);
    let firstError = "Something went wrong";
    if (error instanceof mongoose.Error.ValidationError) {
      firstError = Object.values(error.errors)[0].message;
    } else if (error instanceof Error) {
      firstError = error.message;
    }

    res.status(400).json({
      message: firstError,
    });
  }
});

authRouter.post("/login", async (req, res) => {
  const data = req.body;
  const { email, password } = data;

  try {
    const storedUser = await User.findOne({ email: email });
    if (!storedUser) {
      //user not found
      res.status(404).json({ message: "User not found" });
    } else {
      //compare the password with the hashed password stored in the database
      const isPasswordValid = await storedUser.validatePassword(password);
      if (!isPasswordValid) {
        //invalid credentials
        res.status(401).json({ message: "Invalid credentials" });
      } else {
        //create a JWT token add it to cookie and send to the user
        const token = await storedUser.getJwtToken();
        //or send the cookie innthe response body
        res.cookie("token", token, {
          httpOnly: true,
          secure: true,
          sameSite: "Strict",
        });
        //login successful
        res.status(200).json({ message: "Login successful" });
      }
    }
  } catch (error) {
    //in case of any error during login
    console.error("Error during signup:", error);
    let firstError = "Something went wrong";
    if (error instanceof mongoose.Error.ValidationError) {
      firstError = Object.values(error.errors)[0].message;
    } else if (error instanceof Error) {
      firstError = error.message;
    }

    res.status(400).json({
      message: firstError,
    });
  }
});

authRouter.post("/logout", async (req, res) => {
  try {
    // To log out, we clear the cookie containing the JWT.
    res.clearCookie("token", {
      httpOnly: true,
      secure: true,
      sameSite: "Strict",
    });
    res.status(200).json({ message: "Logout successful" });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
});

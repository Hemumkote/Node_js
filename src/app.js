import express from "express";
import dotenv from "dotenv";
import { connectDB } from "./config/database.js";
import User from "./models/user.ts";
import mongoose from "mongoose";

dotenv.config();

const app = express(); // instance of an express js application
app.use(express.json()); // <-- add this so req.body is populated

const PORT = 3000;

app.post("/signup", async (req, res) => {
  try {
    const data = req.body;
    console.log(data);
    const user = new User(data);

    //validation check
    const validationError = user.validateSync();
    if (validationError) {
      console.error("Validation error:", validationError);
      const firstError = Object.values(validationError.errors)[0].message;
      return res.status(400).json({ message: firstError });
    }

    const savedUser = await User.findOne({ email: data.email });
    console.log(savedUser);
    if (savedUser) {
      res.status(409).send("Error signing up user");
    } else {
      await user.save();
      res.status(201).send("User signed up successfully!!");
    }
  } catch (error) {
    console.error("Error during signup:", error);
    const firstError = error?.errors
      ? Object.values(error.errors)[0].message
      : "Something went wrong";

    res.status(400).json({
      message: firstError,
    });
  }
});

app.get("/user/:age", async (req, res) => {
  try {
    const data = Number(req.params.age);
    if (!Number.isInteger(data)) {
      return res.status(400).send("Invalid age parameter");
    }
    const users = await User.find({ age: data });
    if (users.length > 0) {
      res.status(200).send({ data: users });
    } else {
      res.status(404).send({ message: "User not found" });
    }
  } catch (error) {
    res.status(500).send("Internal Server Error");
  }
});

app.delete("/user", async (req, res) => {
  try {
    const id = req.body.id;
    if (!id) {
      return res.status(400).send("User ID is required");
    } else if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).send("Invalid User ID format");
    }
    const user = await User.findByIdAndDelete(id);
    if (!user) {
      return res.status(404).send("User not found");
    } else {
      res.status(200).send("User deleted successfully");
    }
  } catch (error) {
    res.status(500).send("Internal Server Error");
  }
});

app.patch("/user", async (req, res) => {
  //
  //
  //always try to add the validation for all the fields while saving and updating the data
  //
  //
  try {
    const data = req.body;

    //checking the id validity
    console.log(data._id);
    if (!data._id) {
      return res.status(400).json({ message: "User ID is required" });
    }
    if (!mongoose.Types.ObjectId.isValid(data._id)) {
      return res.status(400).json({ message: "Invalid User ID format" });
    }

    const { _id, ...updateData } = data;

    //filtering the allowed update fields
    const ALLOWED_UPDATES = [
      "firstName",
      "lastName",
      "age",
      "photoUrl",
      "gender",
    ];

    //check if all fields in updateData are allowed
    const isUpdateValid = Object.keys(updateData).every((key) =>
      ALLOWED_UPDATES.includes(key)
    );

    if (!isUpdateValid) {
      return res.status(400).json({ message: "Invalid update fields" });
    }

    const user = await User.findByIdAndUpdate(_id, updateData, {
      new: true, // return updated document
      runValidators: true, // validate update against schema
      select: { firstName: 1, age: 1, email: 1, _id: 0 }, // to return only specific fields , 0 only allowed for _id fields
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    } else {
      res.status(200).json({ data: user });
    }
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
});

const isConnected = await connectDB();

if (isConnected) {
  app.listen(PORT, () => {
    console.log(
      `Server is running on port ${PORT}, open in http://localhost:${PORT}`
    );
  });
} else {
  console.error("Cannot connect to database");
  process.exit(1);
}

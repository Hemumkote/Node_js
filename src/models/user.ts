import mongoose from "mongoose";
const Schema = mongoose.Schema;
import validator from "validator";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

// A simple sanitizer function to escape HTML special characters.
// This helps prevent Cross-Site Scripting (XSS) attacks.
const escapeHtml = (text: string) => {
  if (typeof text !== "string") return text;
  return text.replace(/[&<>"']/g, (match) => `&#${match.charCodeAt(0)};`);
};

// creating hte user schema
const userScheme = new Schema<any>(
  {
    firstName: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 20,
      set: escapeHtml, // Sanitize on save
    },
    lastName: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 20,
      set: escapeHtml, // Sanitize on save
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      validate: {
        validator: validator.isEmail,
        message: "Invalid email format.",
      },
    },
    password: {
      type: String,
      required: true,
    },
    age: {
      type: Number,
      required: true,
      min: [18, "You must be at least 18 years old."],
      max: [120, "Age must be less than 120."],
    },
    gender: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      enum: {
        values: ["male", "female", "other"],
        message: "{VALUE} is not a supported gender.",
      },
    },
    photoUrl: {
      type: String,
      default: "https://www.example.com/default-photo.jpg",
      trim: true,
      set: (url: string) => (url === "" ? undefined : url), // If empty string, use default
      validate: {
        validator: function (url: string) {
          if (url === "") {
            return true;
          }
          // Simple regex to check for a valid URL format
          return /^(ftp|http|https):\/\/[^ "]+$/.test(url);
        },
        message: "Photo URL must be a valid URL.",
      },
    },
    // Additional fields can be added here
    //   phoneNumber: {
    //     type: String,
    //     required: true,
    //     unique: true,
    //   },
    //   address: {
    //     type: String,
    //     required: true,
    //   },
    //   city: {
    //     type: String,
    //     required: true,
    //   },
    //   state: {
    //     type: String,
    //     required: true,
    //   },
    //   zipCode: {
    //     type: String,
    //     required: true,
    //   },
    //   country: {
    //     type: String,
    //     required: true,
    //   },
  },
  {
    timestamps: true, //keep track of createdAt and updatedAt fields
  }
);

//these are the instance methods for the user schema used as handlers
//method to generate JWT token
userScheme.methods.getJwtToken = async function () {
  // arrow functions don't bind 'this', so we use function keyword
  //we can access the user document using 'this' keyword
  const user = this;
  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET as string);
  console.log(token);
  return token;
};

//method to compare the password
userScheme.methods.validatePassword = async function (
  userEnteredPassword: string
) {
  const passwordHash = this.password;
  const isMatch = await bcrypt.compare(userEnteredPassword, passwordHash);
  return isMatch;
};

//creating the user model using mongoose.modal(modelName, schema)
// Model
const User = mongoose.model("User", userScheme);
export default User;

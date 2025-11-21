import mongoose from "mongoose";
const Schema = mongoose.Schema;

// A simple sanitizer function to escape HTML special characters.
// This helps prevent Cross-Site Scripting (XSS) attacks.
const escapeHtml = (text: string) => {
  if (typeof text !== "string") return text;
  return text.replace(/[&<>"']/g, (match) => `&#${match.charCodeAt(0)};`);
};

// creating hte user schema
const userScheme = new Schema(
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
        validator: function (email: string) {
          // Email must be a hemu.com address (e.g., someString@hemu.com)
          const emailRegex = /^[^\s@]+@hemu\.com$/;
          return emailRegex.test(email);
        },
        message: "Email must be a hemu.com address (e.g., user@hemu.com).",
      },
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
      maxlength: 15,
      validate: {
        validator: function (password: string) {
          // This regex enforces at least one lowercase letter, one uppercase letter, one digit, and one special character.
          const passwordRegex =
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,15}$/;
          return passwordRegex.test(password);
        },
        message:
          "Password must be 6-15 characters and contain at least one lowercase letter, one uppercase letter, one number, and one special character (@$!%*?&).",
      },
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
      // required: true,
      default: "https://www.example.com/default-photo.jpg",
      trim: true,
      validate: {
        validator: function (url: string) {
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

//creating the user model using mongoose.modal(modelName, schema)
// Model
const User = mongoose.model("User", userScheme);
export default User;

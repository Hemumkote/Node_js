import jwt from "jsonwebtoken";
import User from "../models/user.ts";

export const userAuth = async (req, res, next) => {
  const token = req.cookies.token;
  if (!token) {
    return res.status(401).json({ message: "Token not valid" });
  }
  try {
    const tokenVerification = jwt.verify(token, process.env.JWT_SECRET);
    console.log(tokenVerification);
    const userId = tokenVerification._id;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }
    //attach the user object to the request for further use
    req.user = user;
    //proceed to the next middleware or route handler
    next();
  } catch (error) {
    console.log(error);
    if (error.name === "TokenExpiredError") {
      return res
        .status(401)
        .json({ message: "Your session has expired. Please log in again." });
    }
    return res.status(401).json({ message: "Unauthorized: " + error.message });
  }
};

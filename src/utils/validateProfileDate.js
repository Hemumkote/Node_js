import validator from "validator";

export const validateProfileData = (req) => {
  const allowedEditFields = [
    "firstName",
    "lastName",
    "age",
    "photoUrl",
    "gender",
  ];
  const input = req.body;
  const isAllowed = Object.keys(req.body).every((key) =>
    allowedEditFields.includes(key)
  );
  if (!isAllowed) {
    throw new Error("Invalid edit fields");
  }
  if (input.hasOwnProperty("firstName") && input.firstName === "") {
    throw new Error("First name cannot be empty");
  }
  if (input.hasOwnProperty("lastName") && input.lastName === "") {
    throw new Error("Last name cannot be empty");
  }
  if (input.age && !validator.isNumeric(String(input.age))) {
    throw new Error("Age must be a number");
  }
  if (input.age && input.age < 18) {
    throw new Error("Age must be greater than 18");
  }
  if (!input.photoUrl === "" && !validator.isURL(input.photoUrl)) {
    throw new Error("Invalid photo URL");
  }
  return true;
};

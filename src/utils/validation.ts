import validator from "validator";

export const validateSignUpData = (data: any) => {
  const { firstName, lastName, email, password, age } = data;

  if (!firstName || !lastName) {
    throw new Error("First name and Last name are required.");
  } else if (!validator.isEmail(email)) {
    throw new Error("Invalid email format......");
  } else if (
    !validator.isStrongPassword(password, {
      minLength: 6,
      maxLength: 15,
      minLowercase: 1,
      minUppercase: 1,
      minNumbers: 1,
      minSymbols: 1,
    })
  ) {
    throw new Error("Invalid password format......");
  } else if (!validator.isInt(age.toString(), { min: 18, max: 120 })) {
    throw new Error("Age must be between 18 and 120.");
  }
};

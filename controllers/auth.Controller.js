import { StatusCodes } from "http-status-codes";
import {
  BadRequestError,
  UnauthenticatedError,
} from "../errors/customErrors.js";
import { User } from "../model/user.Model.js";
import bcrypt from "bcrypt";
import { createJWT } from "../utils/jsonToken.js";
import { Brand } from "../model/brand.Model.js";

export const Register = async (req, res, next) => {
  try {
    const { firstname, email, password } = req.body;

    // Check if the email already exists in the database
    let existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) throw new BadRequestError("Email already Exists");

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create a new user instance
    const newUser = new User({
      firstname: firstname.trim(),
      email: email.toLowerCase(),
      password: hashedPassword,
    });

    // Save the new user to the database
    await newUser.save();

    // Send success response
    res.status(StatusCodes.CREATED).json({
      msg: "Registration Successful",
      newUser,
    });
  } catch (error) {
    next(error); // Pass the error to the error-handling middleware
  }
};

export const BrandRegister = async (req, res, next) => {
  try {
    const { firstname, email, password, brandname } = req.body;

    // Check for missing fields
    if (!firstname || !email || !password || !brandname) {
      throw new BadRequestError("Please provide all required fields.");
    }

    // Check if email is already registered
    const existingUser = await Brand.findOne({ email });
    if (existingUser) {
      throw new BadRequestError("Email is already registered.");
    }

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create a new user
    const newUser = new Brand({
      firstname,
      email,
      password: hashedPassword,
      role: "brand", // Ensures the role defaults to "brand"
      brandname,
      isApproved: false, // Assuming you need an approval system
    });

    // Save the user to the database
    await newUser.save();

    // Respond with success
    res.status(StatusCodes.CREATED).json({
      success: true,
      message: "Brand registered successfully.",
    });
  } catch (error) {
    // Pass errors to the error handler
    next(error);
  }
};

export const Login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      throw new UnauthenticatedError("Email and password are required");
    }

    // Find user by email
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) throw new UnauthenticatedError("Invalid credentials");

    // Compare passwords
    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect)
      throw new UnauthenticatedError("Invalid credentials");

    // Generate JWT
    const token = createJWT({
      userId: user._id,
      role: user.role,
    });

    // Set token in an HTTP-only cookie
    res.cookie("token", token, {
      httpOnly: true,
      expires: new Date(Date.now() + 24 * 60 * 60 * 1000), // 1 day
      secure: process.env.NODE_ENV === "production", // Ensure secure flag for production
    });

    // Send success response
    res.status(StatusCodes.OK).json({
      success: true,
      user: {
        id: user._id,
        firstname: user.firstname,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    next(error); // Pass errors to the error-handling middleware
  }
};

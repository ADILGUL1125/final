import { User } from "../modals/users.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

// create user indb
export const registerUser = async (req, res) => {
  try {
    const { username, email, role, password, confirmpassword } = req.body;

    // 1. Basic Validation (Empty fields check)
    if (!username || !email || !role || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // 2. Password Match Check
    if (password !== confirmpassword) {
      return res.status(400).json({ message: "Passwords do not match" });
    }

    // 3. Check if user already exists (Email or Username)
    const existingUser = await User.findOne({ 
      $or: [{ email }, { username }] 
    });

    if (existingUser) {
      return res.status(400).json({ 
        message: "User with this email or username already exists" 
      });
    }

    // 4. Password Hashing (Agar aapne model mein pre-save hook nahi lagaya)
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // 5. Create New User
    const newUser = new User({
      username,
      email,
      role,
      password: hashedPassword,
    });

    await newUser.save();

    // 6. Success Response (Password ko response mein nahi bhejte)
    return res.status(201).json({
      success: true,
      message: "Account created successfully!",
      user: {
        id: newUser._id,
        username: newUser.username,
        email: newUser.email,
        role: newUser.role,
      },
    });

  } catch (error) {
    console.error("Register Error:", error);
    return res.status(500).json({ 
      message: "Internal Server Error", 
      error: error.message 
    });
  }
};
// login
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // 1. Validation
    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    // 2. Find User
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // 3. Compare Password
    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // 4. Generate Token
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET || "your_secret_key",
      { expiresIn: "1d" }
    );

    // 5. Cookie Options
    const cookieOptions = {
      httpOnly: true, // Client-side JS isko read nahi kar sakti (Secure)
      secure: process.env.NODE_ENV === "production", // Sirf HTTPS par kaam karega prod mein
      sameSite: "strict", // CSRF attacks se bachata hai
      maxAge: 1 * 24 * 60 * 60 * 1000, // 1 din ki expiry
    };

    // 6. Send Cookie and Response
    return res
      .status(200)
      .cookie("token", token, cookieOptions) // "token" naam ki cookie bhej di
      .json({
        success: true,
        message: `Welcome back, ${user.username}`,
        user: {
          id: user._id,
          username: user.username,
          email: user.email,
          role: user.role, // Frontend redirect ke liye iska use karega
        },
      });

  } catch (error) {
    console.error("Login Error:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};
// get current user
export const getcurrentuser=async (req,res)=>{
    try {
        let userid= req.userid;
        let user =await User.findById(userid).select("-password")
        if(!user){
            return resizeBy.status(401).json({
                message:"user not found"
            })
        }
        return res.status(200).json(user)
    } catch (error) {
        return res.status(500).json({
            message:error.message 
        })
    }
}

// logout
export const logout =async (req,res)=>{
  try {
    res.clearCookie("token", {
      httpOnly: true,
      secure: false,        // production me true karna (https)
      sameSite: "lax",
    });
return res.status(200).json({
      success: true,
      message: "Logout successful",
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Logout failed",
    });

  }

}

// Get all users (patients and doctors)
export const getAllUsers = async (req, res) => {
  try {
    // Check if user is admin
    if (req.userrole !== "admin") {
      return res.status(403).json({ message: "Access denied. Admin only." });
    }

    const users = await User.find().select("-password");
    return res.status(200).json({
      success: true,
      users
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message
    });
  }
};

// Update user
export const updateUser = async (req, res) => {
  try {
    // Check if user is admin
    if (req.userrole !== "admin") {
      return res.status(403).json({ message: "Access denied. Admin only." });
    }

    const { id } = req.params;
    const { username, email, role } = req.body;

    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Prevent admin from changing their own role
    if (user.role === "admin" && req.userid === id) {
      return res.status(400).json({ message: "Cannot modify your own admin account" });
    }

    if (username) user.username = username;
    if (email) user.email = email;
    if (role && ["doctor", "patient", "receptionist"].includes(role)) {
      user.role = role;
    }

    await user.save();

    return res.status(200).json({
      success: true,
      message: "User updated successfully",
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message
    });
  }
};

// Delete user
export const deleteUser = async (req, res) => {
  try {
    // Check if user is admin
    if (req.userrole !== "admin") {
      return res.status(403).json({ message: "Access denied. Admin only." });
    }

    const { id } = req.params;

    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Prevent admin from deleting their own account
    if (user.role === "admin" && req.userid === id) {
      return res.status(400).json({ message: "Cannot delete your own admin account" });
    }

    await User.findByIdAndDelete(id);

    return res.status(200).json({
      success: true,
      message: "User deleted successfully"
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message
    });
  }
};

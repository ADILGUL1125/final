import { User } from "../modals/users.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

// create user indb
export const createuser = async (req, res) => {
  const { username, email, password } = req.body;

  try {
    if (!username || !email || !password) {
      return res.json({
        message: "fields is missings",
      });
    }
    const existinguser = await User.findOne({ email });
    if (existinguser) {
      return res.json({ message: "user is already created using this email " });
    }
    const hashpassowrd = await bcrypt.hash(password, 10);
    console.log(hashpassowrd);
    const createuser = await User.create({
      username,
      email,
      password: hashpassowrd,
    });
    res.json({
      message: "Successfuly created account",
      data: createuser,
    });
  } catch (error) {
    res.json({ message: "cannot create user" });
    console.log(error.message);
  }
};
// login
export const loginuser = async (req, res) => {
  const { email, password } = req.body;

  try {
    if (!email || !password) {
      return res.status(400).json({
        message: "fields is missings",
      });
    }
    const existinguser = await User.findOne({ email });
    if (!existinguser) {
      return res.status(400).json({
        message: " User is not regestered",
      });
    }
    const matchpass = await bcrypt.compare(password, existinguser.password);
    console.log(matchpass);
    if (!matchpass) {
      return res.status(400).json({
        message: "invalid password",
      });
    }
    const token = jwt.sign({ id: existinguser._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    // const verifytoken =jwt.verify(token,process.env.JWT_SECRET)
    // console.log(verifytoken)
    res.cookie("token", token, {
      httpOnly: true,
      secure: false,     // in https we true it 
      sameSite: "lax",
      maxAge: 60 * 60 * 1000,
    });
    res.status(200).json({
      message: "Successfully login",
      data:{
        id:existinguser._id,
        username:existinguser.username,
      email:existinguser.email
      }
    });
  } catch (error) {
    res.json({ message: "cannot login user" || "something went worng" });
    console.log(error.message);
  }
};

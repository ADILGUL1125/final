  import mongoose from "mongoose";

  const userschema = mongoose.Schema({
      username :{type:String,required:[true,"username is required"],minlength:[3,"username atleast 3 chracter"],maxlength:[8,"username notexceed 8 chracter"],trim: true,},
      email :{type:String,required:true,unique: true,
        lowercase: true,
        trim: true,
        match: [
          /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/,
          "Please enter a valid email",
        ],},
      password :{type:String,required:[true,"password s required"], minlength: [6, "Password must be at least 6 characters"],}

  },{timestamps: true})

  export const User = mongoose.model('User',userschema)
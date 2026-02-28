import React, { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { Link } from "react-router";
import axios from "axios";
import { useAuthStore } from "../zustand/auth.js";
import {useNavigate} from "react-router"

const Login = () => {
  let navigate =useNavigate()
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm();
  const [showPassword, setShowPassword] = useState(false);
  const { login } = useAuthStore()

  const onSubmit = async (data) => {
   try {
    const response = await axios.post(
      "https://final-git-main-adilgul1125s-projects.vercel.app/api/login", 
      data, // Doosra argument: Data (Payload)
      { 
        withCredentials: true // Teesra argument: Config object
      } 
    );
    login(response.data.user)

    // Baki redirect logic
    const { role } = response.data.user;
    if (role === "admin") {
      navigate("/admin");
    } else {
      navigate("/dashbord");
    }

    toast.success("Welcome back!");}
    catch (error) {
      console.log("error to fetch login api");
      toast.error(error.response?.data?.message || "Login failed");
  };
  }
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#071034] via-[#0b3a73] to-[#081a3a] ">
      <div className="max-w-xl w-full  gap-8">
        <div className="p-8 rounded-2xl bg-white/6 backdrop-blur-md border border-white/10 shadow-xl animate-fade-in">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-white">
              Sign in to your account
            </h2>
            <p className="text-sm text-white/80 mt-1">
              Use your email and password to continue
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="text-sm text-white/80">Email</label>
              <input
                {...register("email", {
                  required: "Email is required",
                  pattern: {
                    value: /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/,
                    message: "Invalid email",
                  },
                })}
                className={`mt-2 w-full px-4 py-3 rounded-lg bg-white/5 border ${errors.email ? "border-rose-400" : "border-white/10"} placeholder-white/40 text-white outline-none focus:ring-2 focus:ring-blue-400 transition`}
                placeholder="you@example.com"
                type="email"
              />
              {errors.email && (
                <p className="text-rose-400 text-sm mt-1">
                  {errors.email.message}
                </p>
              )}
            </div>

            <div>
              <label className="text-sm text-white/80">Password</label>
              <div className="relative mt-2">
                <input
                  {...register("password", {
                    required: "Password required",
                    minLength: { value: 6, message: "Minimum 6 characters" },
                  })}
                  className={`w-full px-4 py-3 rounded-lg bg-white/5 border ${errors.password ? "border-rose-400" : "border-white/10"} placeholder-white/40 text-white outline-none focus:ring-2 focus:ring-blue-400 transition`}
                  placeholder="Enter password"
                  type={showPassword ? "text" : "password"}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((s) => !s)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-white/60 hover:text-white"
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
              {errors.password && (
                <p className="text-rose-400 text-sm mt-1">
                  {errors.password.message}
                </p>
              )}
            </div>

            <div className="flex items-center justify-end">
              {/* <label className="flex items-center gap-2 text-white/80">
                <input type="checkbox" className="accent-blue-400" /> <span className="text-sm">Remember me</span>
              </label> */}
              <a className="text-sm text-white/80 hover:underline">
                Forgot password?
              </a>
            </div>

            <div>
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 rounded-lg bg-gradient-to-r from-blue-400 to-indigo-500 text-white font-semibold shadow-lg hover:shadow-2xl transform hover:-translate-y-0.5 transition disabled:opacity-60"
              >
                {isSubmitting ? "Signing in..." : "Sign in"}
              </button>
            </div>
          </form>

          <div className="mt-6 text-center text-white/70">
            <p className="text-sm">
              Don't have an account?{" "}
              <Link to={"/signup"} className="text-blue-300 hover:underline">
                Create one
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;


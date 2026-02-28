import axios from 'axios'
import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { Link } from 'react-router'

const Signup = () => {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm()
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)

  const onSubmit = async (data) => {
    
   try {
    const response = await axios.post("https://final-git-main-adilgul1125s-projects.vercel.app/api/signup", data);
    toast.success(response.data.message);
  } catch (err) {
    toast.error(err.response?.data?.message || "Signup failed");
    console.log(err.message)
  }
  };
    
  

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#071034] via-[#0b3a73] to-[#081a3a] ">
      <div className="max-w-xl w-full  gap-8">
        <div className="p-8 rounded-2xl bg-white/6 backdrop-blur-md border border-white/10 shadow-xl animate-fade-in">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-white">Create your account</h2>
            <p className="text-sm text-white/80 mt-1">Fill in the form to get started</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="text-sm text-white/80">Username</label>
              <input
                {...register('username', { required: 'Username is required', minLength: { value: 3, message: 'Minimum 6 characters'} , maxLength: { value: 8, message: 'Maximam 8 characters' } })}
                className={`mt-2 w-full px-4 py-3 rounded-lg bg-white/5 border ${
                  errors.username ? 'border-rose-400' : 'border-white/10'
                } placeholder-white/40 text-white outline-none focus:ring-2 focus:ring-blue-400 transition`}
                placeholder="Choose a username"
                type="text"
              />
              {errors.username && <p className="text-rose-400 text-sm mt-1">{errors.username.message}</p>}
            </div>

            <div>
              <label className="text-sm text-white/80">Email</label>
              <input
                {...register('email', { required: 'Email is required', pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/, message: 'Invalid email' } })}
                className={`mt-2 w-full px-4 py-3 rounded-lg bg-white/5 border ${
                  errors.email ? 'border-rose-400' : 'border-white/10'
                } placeholder-white/40 text-white outline-none focus:ring-2 focus:ring-blue-400 transition`}
                placeholder="you@example.com"
                type="email"
              />
              {errors.email && <p className="text-rose-400 text-sm mt-1">{errors.email.message}</p>}
            </div>

            <div>
              <label className="text-sm text-white/80">Role</label>
              <select
                {...register('role', { required: 'Role is required' })}
                className={`mt-2 w-full px-4 py-3 rounded-lg bg-white/5 border ${
                  errors.role ? 'border-rose-400' : 'border-white/10'
                } placeholder-white/40 text-white outline-none focus:ring-2 focus:ring-blue-400 transition`}
              >
                <option value="" className="bg-gray-800">Select a role</option>
                <option value="doctor" className="bg-gray-800">Doctor</option>
                <option value="patient" className="bg-gray-800">Patient</option>
                <option value="receptionist" className="bg-gray-800">Receptionist</option>
              </select>
              {errors.role && <p className="text-rose-400 text-sm mt-1">{errors.role.message}</p>}
            </div>

            <div>
              <label className="text-sm text-white/80">Password</label>
              <div className="relative mt-2">
                <input
                  {...register('password', { required: 'Password required', minLength: { value: 6, message: 'Minimum 6 characters' } })}
                  className={`w-full px-4 py-3 rounded-lg bg-white/5 border ${
                    errors.password ? 'border-rose-400' : 'border-white/10'
                  } placeholder-white/40 text-white outline-none focus:ring-2 focus:ring-blue-400 transition`}
                  placeholder="Enter password"
                  type={showPassword ? 'text' : 'password'}
                />
                <button type="button" onClick={() => setShowPassword((s) => !s)} className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-white/60 hover:text-white">
                  {showPassword ? 'Hide' : 'Show'}
                </button>
              </div>
              {errors.password && <p className="text-rose-400 text-sm mt-1">{errors.password.message}</p>}
            </div>

            <div>
              <label className="text-sm text-white/80">Confirm Password</label>
              <div className="relative mt-2">
                <input
                  {...register('confirmpassword', {
                    validate: (value) => value === watch('password') || 'Passwords do not match',
                  })}
                  className={`w-full px-4 py-3 rounded-lg bg-white/5 border ${
                    errors.confirmPassword ? 'border-rose-400' : 'border-white/10'
                  } placeholder-white/40 text-white outline-none focus:ring-2 focus:ring-blue-400 transition`}
                  placeholder="Re-enter password"
                  type={showConfirm ? 'text' : 'password'}
                />
                <button type="button" onClick={() => setShowConfirm((s) => !s)} className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-white/60 hover:text-white">
                  {showConfirm ? 'Hide' : 'Show'}
                </button>
              </div>
              {errors.confirmPassword && <p className="text-rose-400 text-sm mt-1">{errors.confirmPassword.message}</p>}
            </div>

            <div>
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 rounded-lg bg-gradient-to-r from-blue-400 to-indigo-500 text-white font-semibold shadow-lg hover:shadow-2xl transform hover:-translate-y-0.5 transition disabled:opacity-60"
              >
                {isSubmitting ? 'Creating account...' : 'Sign up'}
              </button>
            </div>
          </form>

          <div className="mt-6 text-center text-white/70">
            <p className="text-sm">Already have an account? <Link  to={'/login'} className="text-blue-300 hover:underline">Sign in</Link></p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Signup


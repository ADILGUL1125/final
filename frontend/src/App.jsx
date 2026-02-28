import React from 'react'
import { BrowserRouter, Routes, Route, Navigate } from "react-router";
import Login from '../pages/login';
import Signup from '../pages/signup';
import Home from '../pages/home';
import {Toaster} from "react-hot-toast"
import { useAuthStore } from '../zustand/auth.js';
import Dashbord from '../pages/dashbord.jsx';
import Admin from '../pages/admin.jsx';

const App = () => {
  const {user}=useAuthStore()
  console.log(user)
  return (
    <div>
      <Toaster   position="top-left" toastOptions={{
    // Define default options
   
    duration: 2000,
    removeDelay: 0,
   
            
    // Default options for specific types
    
  }}
/>
            {!user ? (
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="*" element={<Login />} />
            </Routes>
          ) : (
            <Routes>
              
              <Route path="/dashbord" element={<Dashbord />} />
              {user.role === 'admin' && (
                <Route path="/admin" element={<Admin />} />
              )}
              <Route path="*" element={<Navigate to="/dashbord" />} />
            
            </Routes>
          )}

    


    </div>
  )
}

export default App

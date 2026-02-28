import React, { useEffect, useState } from 'react'
import { Routes, Route, Navigate } from "react-router";
import Login from '../pages/login';
import Signup from '../pages/signup';
import {Toaster} from "react-hot-toast"
import { useAuthStore } from '../zustand/auth.js';
import Dashbord from '../pages/dashbord.jsx';
import Admin from '../pages/admin.jsx';

const App = () => {
  const { user, setUser, logout } = useAuthStore()
  const [bootLoading, setBootLoading] = useState(true)

  useEffect(() => {
    const restoreSession = async () => {
      try {
        const response = await fetch("http://localhost:3000/api/currentuser", {
          credentials: "include",
        });

        if (!response.ok) {
          logout();
          return;
        }

        const data = await response.json();
        const currentUser = data?.user || data;
        setUser(currentUser || null);
      } catch {
        logout();
      } finally {
        setBootLoading(false);
      }
    };

    restoreSession();
  }, [setUser, logout]);

  if (bootLoading) {
    return <div className="min-h-screen grid place-items-center text-gray-700">Loading...</div>;
  }

  return (
    <div>
      <Toaster   position="top-left" toastOptions={{
    duration: 2000,
    removeDelay: 0,
  }}
/>
            {!user ? (
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="*" element={<Navigate to="/login" />} />
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

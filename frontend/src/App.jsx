import React from 'react'
import { BrowserRouter, Routes, Route } from "react-router";
import Login from '../pages/login';
import Signup from '../pages/signup';
import Home from '../pages/home';
import {Toaster} from "react-hot-toast"

const App = () => {
  return (
    <div>
      <Toaster   position="top-left" toastOptions={{
    // Define default options
   
    duration: 2000,
    removeDelay: 0,
   
            
    // Default options for specific types
    
  }}
/>
    <Routes>
      <Route path="/" element={<Home/>} />
      <Route path="/login" element={<Login/>} />
      <Route path="/signup" element={<Signup/>} />
    </Routes>


    </div>
  )
}

export default App
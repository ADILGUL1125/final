import React from 'react'
import { useAuthStore } from '../zustand/auth';
import axios from "axios"
import {useNavigate} from "react-router"

const Logout = () => {
    let navigate =useNavigate()
    let { logout} =useAuthStore()
    const handlelogout =async ()=>{
       try {
    await axios.post("http://localhost:3000/api/logout", {}, {
      withCredentials: true
    });

    logout();       // zustand state clear
    navigate("/login");

  } catch (error) {
    console.log("Logout error");
    console.log(error.message)
  }


    }
  return (
    <div>
        <button onClick={()=>handlelogout()}>
            Logout
        </button>
    </div>
  )
}

export default Logout
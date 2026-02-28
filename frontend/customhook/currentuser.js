import axios from "axios"
import { useEffect } from "react"
import { useAuthStore } from "../zustand/auth"


const getcurrentuser=()=>{
    const loginuser =useAuthStore()
    
    
    useEffect(()=>{
           const fetchuser= async()=>{
            try {
                let result =await axios(`http://localhost:3000/api/user/currentuser`,{withCredentials:true})
                console.log(result)
                // loginuser.login()
            } catch (error) {
                console.log("error in get current user ",error)
            }
           } 
           fetchuser()
    },[])

} 
export default getcurrentuser
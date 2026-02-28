import mongoose from "mongoose"
import "dotenv/config"

 export const dbconnect = async ()=>{

try {
    
    await mongoose.connect(process.env.MONGODB_URL).then(()=>console.log("MONGOSB IS CONNECTED"))
} catch (error) {
    console.log("connnt connect mongodb ")
    console.log(error.message)
    
}
}
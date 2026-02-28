import { GoogleGenAI } from "@google/genai";
import "dotenv/config"




const ai = new GoogleGenAI({apiKey:process.env.GEMINI_API});

export const chatcontrol = async(req,res)=>{
    let {msg}=req.body
    try {
         const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents:msg,
  });
  console.log( '..........',response.text);
  res.json({
    message:"responce aagya ha "
  })
    } catch (error) {
        console.log( "error ay ah a.....",error.msg)
        res.json({
            message:"something went wrong"
        })
    }
}


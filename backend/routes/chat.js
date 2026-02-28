import express from "express";
import { chatcontrol } from "../controllers/chat.js";
const chatroutes = express.Router()



chatroutes.post('/chat',chatcontrol)
export default chatroutes
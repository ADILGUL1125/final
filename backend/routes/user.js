import { createuser, loginuser } from "../controllers/usercontrller.js";
import express from "express";


const userroute =express.Router()
userroute.post('/createuser',createuser)
userroute.post('/loginuser',loginuser)





export default userroute
import {  getcurrentuser, loginUser, logout, registerUser, getAllUsers, updateUser, deleteUser } from "../controllers/usercontrller.js";
import express from "express";
import { verifyToken } from "../middlwware/auth.js";


const userroute =express.Router()
userroute.post('/signup',registerUser)
userroute.post('/login',loginUser)
userroute.get('/currentuser',verifyToken,getcurrentuser)
userroute.post('/logout',logout)
userroute.get('/allusers',verifyToken,getAllUsers)
userroute.put('/updateuser/:id',verifyToken,updateUser)
userroute.delete('/deleteuser/:id',verifyToken,deleteUser)





export default userroute

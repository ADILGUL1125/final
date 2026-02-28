import express from "express";
import { verifyToken } from "../middlwware/auth.js";
import { getAllDoctors, getDoctor, createDoctor, updateDoctor, deleteDoctor } from "../controllers/doctorController.js";

const doctorRoute = express.Router();

doctorRoute.get('/alldoctors', verifyToken, getAllDoctors);
doctorRoute.get('/doctor/:id', verifyToken, getDoctor);
doctorRoute.post('/doctor', verifyToken, createDoctor);
doctorRoute.put('/doctor/:id', verifyToken, updateDoctor);
doctorRoute.delete('/doctor/:id', verifyToken, deleteDoctor);

export default doctorRoute;

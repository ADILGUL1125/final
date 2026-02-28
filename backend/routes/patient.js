import express from "express";
import { verifyToken } from "../middlwware/auth.js";
import { getAllPatients, getPatient, createPatient, updatePatient, deletePatient } from "../controllers/patientController.js";

const patientRoute = express.Router();

patientRoute.get('/allpatients', verifyToken, getAllPatients);
patientRoute.get('/patient/:id', verifyToken, getPatient);
patientRoute.post('/patient', verifyToken, createPatient);
patientRoute.put('/patient/:id', verifyToken, updatePatient);
patientRoute.delete('/patient/:id', verifyToken, deletePatient);

export default patientRoute;

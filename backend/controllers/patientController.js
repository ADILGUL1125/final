import { Patient } from "../modals/patient.js";
import { User } from "../modals/users.js";

// Get all patients
export const getAllPatients = async (req, res) => {
  try {
    // Allow all authenticated users to view patients (change to admin only for production)
    // if (req.userrole !== "admin") {
    //   return res.status(403).json({ message: "Access denied. Admin only." });
    // }

    const patients = await Patient.find().populate('userId', 'username email');
    return res.status(200).json({
      success: true,
      patients
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// Get single patient
export const getPatient = async (req, res) => {
  try {
    const patient = await Patient.findById(req.params.id).populate('userId', 'username email');
    if (!patient) {
      return res.status(404).json({ message: "Patient not found" });
    }
    return res.status(200).json({ success: true, patient });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// Create patient
export const createPatient = async (req, res) => {
  try {
    // Allow all authenticated users to create patients (change to admin only for production)
    // if (req.userrole !== "admin") {
    //   return res.status(403).json({ message: "Access denied. Admin only." });
    // }

    const { userId, firstName, lastName, phone, dateOfBirth, gender, address, medicalHistory, emergencyContact, bloodGroup } = req.body;

    // Check if user exists and is a patient
    const user = await User.findById(userId);
    if (!user || user.role !== "patient") {
      return res.status(400).json({ message: "Invalid patient user" });
    }

    // Check if patient profile already exists
    const existingPatient = await Patient.findOne({ userId });
    if (existingPatient) {
      return res.status(400).json({ message: "Patient profile already exists" });
    }

    const patient = new Patient({
      userId, firstName, lastName, phone, dateOfBirth, gender, address, medicalHistory, emergencyContact, bloodGroup
    });

    await patient.save();
    return res.status(201).json({ success: true, patient });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// Update patient
export const updatePatient = async (req, res) => {
  try {
    // Allow all authenticated users to update patients (change to admin only for production)
    // if (req.userrole !== "admin") {
    //   return res.status(403).json({ message: "Access denied. Admin only." });
    // }

    const patient = await Patient.findById(req.params.id);
    if (!patient) {
      return res.status(404).json({ message: "Patient not found" });
    }

    const allowedUpdates = ['firstName', 'lastName', 'phone', 'dateOfBirth', 'gender', 'address', 'medicalHistory', 'emergencyContact', 'bloodGroup'];
    
    allowedUpdates.forEach(field => {
      if (req.body[field] !== undefined) {
        patient[field] = req.body[field];
      }
    });

    await patient.save();
    return res.status(200).json({ success: true, patient });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// Delete patient
export const deletePatient = async (req, res) => {
  try {
    // Allow all authenticated users to delete patients (change to admin only for production)
    // if (req.userrole !== "admin") {
    //   return res.status(403).json({ message: "Access denied. Admin only." });
    // }

    const patient = await Patient.findById(req.params.id);
    if (!patient) {
      return res.status(404).json({ message: "Patient not found" });
    }

    await Patient.findByIdAndDelete(req.params.id);
    return res.status(200).json({ success: true, message: "Patient deleted successfully" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

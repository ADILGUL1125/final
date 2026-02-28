import { Doctor } from "../modals/doctor.js";
import { User } from "../modals/users.js";

// Get all doctors
export const getAllDoctors = async (req, res) => {
  try {
    if (req.userrole !== "admin") {
      return res.status(403).json({ message: "Access denied. Admin only." });
    }

    const doctors = await Doctor.find().populate('userId', 'username email');
    return res.status(200).json({
      success: true,
      doctors
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// Get single doctor
export const getDoctor = async (req, res) => {
  try {
    const doctor = await Doctor.findById(req.params.id).populate('userId', 'username email');
    if (!doctor) {
      return res.status(404).json({ message: "Doctor not found" });
    }
    return res.status(200).json({ success: true, doctor });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// Create doctor
export const createDoctor = async (req, res) => {
  try {
    if (req.userrole !== "admin") {
      return res.status(403).json({ message: "Access denied. Admin only." });
    }

    const { userId, firstName, lastName, phone, specialization, experience, qualification, licenseNumber, department, availableDays, consultationFee, bio, languages, isAvailable } = req.body;

    // Check if user exists and is a doctor
    const user = await User.findById(userId);
    if (!user || user.role !== "doctor") {
      return res.status(400).json({ message: "Invalid doctor user" });
    }

    // Check if doctor profile already exists
    const existingDoctor = await Doctor.findOne({ userId });
    if (existingDoctor) {
      return res.status(400).json({ message: "Doctor profile already exists" });
    }

    const doctor = new Doctor({
      userId, firstName, lastName, phone, specialization, experience, qualification, licenseNumber, department, availableDays, consultationFee, bio, languages, isAvailable
    });

    await doctor.save();
    return res.status(201).json({ success: true, doctor });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// Update doctor
export const updateDoctor = async (req, res) => {
  try {
    if (req.userrole !== "admin") {
      return res.status(403).json({ message: "Access denied. Admin only." });
    }

    const doctor = await Doctor.findById(req.params.id);
    if (!doctor) {
      return res.status(404).json({ message: "Doctor not found" });
    }

    const allowedUpdates = ['firstName', 'lastName', 'phone', 'specialization', 'experience', 'qualification', 'licenseNumber', 'department', 'availableDays', 'consultationFee', 'bio', 'languages', 'isAvailable'];
    
    allowedUpdates.forEach(field => {
      if (req.body[field] !== undefined) {
        doctor[field] = req.body[field];
      }
    });

    await doctor.save();
    return res.status(200).json({ success: true, doctor });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// Delete doctor
export const deleteDoctor = async (req, res) => {
  try {
    if (req.userrole !== "admin") {
      return res.status(403).json({ message: "Access denied. Admin only." });
    }

    const doctor = await Doctor.findById(req.params.id);
    if (!doctor) {
      return res.status(404).json({ message: "Doctor not found" });
    }

    await Doctor.findByIdAndDelete(req.params.id);
    return res.status(200).json({ success: true, message: "Doctor deleted successfully" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

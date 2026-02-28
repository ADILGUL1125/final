import React, { useCallback, useEffect, useMemo, useState } from "react";
import Logout from "../components/logout.jsx";

const API = "http://localhost:3000/api";

const initialPatientForm = {
  userId: "",
  firstName: "",
  lastName: "",
  phone: "",
  dateOfBirth: "",
  gender: "male",
  bloodGroup: "A+",
};

const initialDoctorForm = {
  userId: "",
  firstName: "",
  lastName: "",
  phone: "",
  specialization: "",
  experience: "",
  qualification: "",
  licenseNumber: "",
  department: "",
  consultationFee: "",
  availableDays: "",
  languages: "",
  bio: "",
  isAvailable: true,
};

const getId = (value) => (typeof value === "object" && value ? value._id : value);

const Admin = () => {
  const [users, setUsers] = useState([]);
  const [patients, setPatients] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("patients");

  const [editingPatientId, setEditingPatientId] = useState("");
  const [editingDoctorId, setEditingDoctorId] = useState("");
  const [patientForm, setPatientForm] = useState(initialPatientForm);
  const [doctorForm, setDoctorForm] = useState(initialDoctorForm);

  const fetchAllData = useCallback(async () => {
    setError("");
    setLoading(true);
    try {
      const fetchJson = async (url, options = {}) => {
        const response = await fetch(url, { credentials: "include", ...options });
        const data = await response.json();
        if (!response.ok) {
          throw new Error(data?.message || "Request failed");
        }
        return data;
      };

      const [usersData, patientsData, doctorsData] = await Promise.all([
        fetchJson(`${API}/allusers`),
        fetchJson(`${API}/allpatients`),
        fetchJson(`${API}/alldoctors`),
      ]);

      setUsers(usersData.users || []);
      setPatients(patientsData.patients || []);
      setDoctors(doctorsData.doctors || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAllData();
  }, [fetchAllData]);

  const patientProfileUserIds = useMemo(
    () => new Set(patients.map((p) => String(getId(p.userId)))),
    [patients]
  );

  const doctorProfileUserIds = useMemo(
    () => new Set(doctors.map((d) => String(getId(d.userId)))),
    [doctors]
  );

  const patientUsersWithoutProfile = useMemo(
    () => users.filter((u) => u.role === "patient" && !patientProfileUserIds.has(String(u._id))),
    [users, patientProfileUserIds]
  );

  const doctorUsersWithoutProfile = useMemo(
    () => users.filter((u) => u.role === "doctor" && !doctorProfileUserIds.has(String(u._id))),
    [users, doctorProfileUserIds]
  );

  const patientRows = useMemo(() => {
    const profileByUserId = new Map(
      patients.map((p) => [String(getId(p.userId)), p])
    );

    return users
      .filter((u) => u.role === "patient")
      .map((u) => {
        const profile = profileByUserId.get(String(u._id));
        return {
          user: u,
          profile: profile || null,
        };
      });
  }, [users, patients]);

  const doctorRows = useMemo(() => {
    const profileByUserId = new Map(
      doctors.map((d) => [String(getId(d.userId)), d])
    );

    return users
      .filter((u) => u.role === "doctor")
      .map((u) => {
        const profile = profileByUserId.get(String(u._id));
        return {
          user: u,
          profile: profile || null,
        };
      });
  }, [users, doctors]);

  const getUserEmail = (userId) => {
    const normalized = String(getId(userId));
    const fromUsers = users.find((u) => String(u._id) === normalized);
    if (fromUsers) return fromUsers.email;
    if (userId && typeof userId === "object") return userId.email || "N/A";
    return "N/A";
  };

  const formatList = (value) => {
    if (!Array.isArray(value) || value.length === 0) return "N/A";
    return value.join(", ");
  };

  const formatAddress = (address) => {
    if (!address) return "N/A";
    const parts = [address.street, address.city, address.state, address.zipCode].filter(Boolean);
    return parts.length ? parts.join(", ") : "N/A";
  };

  const resetPatientForm = () => {
    setEditingPatientId("");
    setPatientForm(initialPatientForm);
  };

  const resetDoctorForm = () => {
    setEditingDoctorId("");
    setDoctorForm(initialDoctorForm);
  };

  const submitPatient = async () => {
    try {
      const fetchJson = async (url, options = {}) => {
        const response = await fetch(url, { credentials: "include", ...options });
        const data = await response.json();
        if (!response.ok) {
          throw new Error(data?.message || "Request failed");
        }
        return data;
      };

      const payload = {
        userId: patientForm.userId,
        firstName: patientForm.firstName,
        lastName: patientForm.lastName,
        phone: patientForm.phone,
        dateOfBirth: patientForm.dateOfBirth,
        gender: patientForm.gender,
        bloodGroup: patientForm.bloodGroup,
      };

      if (editingPatientId) {
        await fetchJson(`${API}/patient/${editingPatientId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      } else {
        await fetchJson(`${API}/patient`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      }

      resetPatientForm();
      fetchAllData();
    } catch (err) {
      setError(err.message);
    }
  };

  const submitDoctor = async () => {
    try {
      const fetchJson = async (url, options = {}) => {
        const response = await fetch(url, { credentials: "include", ...options });
        const data = await response.json();
        if (!response.ok) {
          throw new Error(data?.message || "Request failed");
        }
        return data;
      };

      const payload = {
        userId: doctorForm.userId,
        firstName: doctorForm.firstName,
        lastName: doctorForm.lastName,
        phone: doctorForm.phone,
        specialization: doctorForm.specialization,
        experience: Number(doctorForm.experience),
        qualification: doctorForm.qualification,
        licenseNumber: doctorForm.licenseNumber,
        department: doctorForm.department,
        consultationFee: Number(doctorForm.consultationFee),
        availableDays: doctorForm.availableDays
          .split(",")
          .map((v) => v.trim().toLowerCase())
          .filter(Boolean),
        languages: doctorForm.languages
          .split(",")
          .map((v) => v.trim())
          .filter(Boolean),
        bio: doctorForm.bio,
        isAvailable: doctorForm.isAvailable,
      };

      if (editingDoctorId) {
        await fetchJson(`${API}/doctor/${editingDoctorId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      } else {
        await fetchJson(`${API}/doctor`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      }

      resetDoctorForm();
      fetchAllData();
    } catch (err) {
      setError(err.message);
    }
  };

  const editPatient = (patient) => {
    setEditingPatientId(patient._id);
    setPatientForm({
      userId: String(getId(patient.userId)),
      firstName: patient.firstName || "",
      lastName: patient.lastName || "",
      phone: patient.phone || "",
      dateOfBirth: patient.dateOfBirth ? String(patient.dateOfBirth).slice(0, 10) : "",
      gender: patient.gender || "male",
      bloodGroup: patient.bloodGroup || "A+",
    });
  };

  const editDoctor = (doctor) => {
    setEditingDoctorId(doctor._id);
    setDoctorForm({
      userId: String(getId(doctor.userId)),
      firstName: doctor.firstName || "",
      lastName: doctor.lastName || "",
      phone: doctor.phone || "",
      specialization: doctor.specialization || "",
      experience: doctor.experience ?? "",
      qualification: doctor.qualification || "",
      licenseNumber: doctor.licenseNumber || "",
      department: doctor.department || "",
      consultationFee: doctor.consultationFee ?? "",
      availableDays: (doctor.availableDays || []).join(", "),
      languages: (doctor.languages || []).join(", "),
      bio: doctor.bio || "",
      isAvailable: doctor.isAvailable ?? true,
    });
  };

  const deletePatient = async (id) => {
    if (!window.confirm("Delete this patient profile?")) return;
    try {
      const fetchJson = async (url, options = {}) => {
        const response = await fetch(url, { credentials: "include", ...options });
        const data = await response.json();
        if (!response.ok) {
          throw new Error(data?.message || "Request failed");
        }
        return data;
      };

      await fetchJson(`${API}/patient/${id}`, { method: "DELETE" });
      if (editingPatientId === id) resetPatientForm();
      fetchAllData();
    } catch (err) {
      setError(err.message);
    }
  };

  const deleteDoctor = async (id) => {
    if (!window.confirm("Delete this doctor profile?")) return;
    try {
      const fetchJson = async (url, options = {}) => {
        const response = await fetch(url, { credentials: "include", ...options });
        const data = await response.json();
        if (!response.ok) {
          throw new Error(data?.message || "Request failed");
        }
        return data;
      };

      await fetchJson(`${API}/doctor/${id}`, { method: "DELETE" });
      if (editingDoctorId === id) resetDoctorForm();
      fetchAllData();
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) {
    return <div className="min-h-screen grid place-items-center">Loading...</div>;
  }

  const startCreatePatientProfile = (userId) => {
    resetPatientForm();
    setPatientForm((prev) => ({ ...prev, userId: String(userId) }));
  };

  const startCreateDoctorProfile = (userId) => {
    resetDoctorForm();
    setDoctorForm((prev) => ({ ...prev, userId: String(userId) }));
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-gray-800">Admin Dashboard</h1>
          <Logout />
        </div>

        {error ? (
          <div className="bg-red-100 border border-red-300 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        ) : null}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white rounded-lg shadow p-4">
            <p className="text-sm text-gray-500">Total Users</p>
            <p className="text-3xl font-bold text-blue-600">{users.length}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-4">
            <p className="text-sm text-gray-500">Doctor Profiles</p>
            <p className="text-3xl font-bold text-green-600">{doctors.length}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-4">
            <p className="text-sm text-gray-500">Patient Profiles</p>
            <p className="text-3xl font-bold text-purple-600">{patients.length}</p>
          </div>
        </div>

        <div className="flex gap-3">
          <button
            className={`px-4 py-2 rounded ${activeTab === "patients" ? "bg-purple-600 text-white" : "bg-white"}`}
            onClick={() => setActiveTab("patients")}
          >
            Patients
          </button>
          <button
            className={`px-4 py-2 rounded ${activeTab === "doctors" ? "bg-green-600 text-white" : "bg-white"}`}
            onClick={() => setActiveTab("doctors")}
          >
            Doctors
          </button>
        </div>

        {activeTab === "patients" ? (
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
            <div className="xl:col-span-1 bg-white rounded-lg shadow p-4 space-y-3">
              <h2 className="font-semibold text-lg">
                {editingPatientId ? "Edit Patient Profile" : "Add Patient Profile"}
              </h2>
              <select
                className="border rounded px-3 py-2 w-full"
                value={patientForm.userId}
                onChange={(e) => setPatientForm({ ...patientForm, userId: e.target.value })}
                disabled={!!editingPatientId}
              >
                <option value="">Select Patient User</option>
                {(editingPatientId ? users.filter((u) => u.role === "patient") : patientUsersWithoutProfile).map((u) => (
                  <option key={u._id} value={u._id}>
                    {u.username} ({u.email})
                  </option>
                ))}
              </select>
              <input
                className="border rounded px-3 py-2 w-full"
                placeholder="First Name"
                value={patientForm.firstName}
                onChange={(e) => setPatientForm({ ...patientForm, firstName: e.target.value })}
              />
              <input
                className="border rounded px-3 py-2 w-full"
                placeholder="Last Name"
                value={patientForm.lastName}
                onChange={(e) => setPatientForm({ ...patientForm, lastName: e.target.value })}
              />
              <input
                className="border rounded px-3 py-2 w-full"
                placeholder="Phone"
                value={patientForm.phone}
                onChange={(e) => setPatientForm({ ...patientForm, phone: e.target.value })}
              />
              <input
                className="border rounded px-3 py-2 w-full"
                type="date"
                value={patientForm.dateOfBirth}
                onChange={(e) => setPatientForm({ ...patientForm, dateOfBirth: e.target.value })}
              />
              <select
                className="border rounded px-3 py-2 w-full"
                value={patientForm.gender}
                onChange={(e) => setPatientForm({ ...patientForm, gender: e.target.value })}
              >
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
              <select
                className="border rounded px-3 py-2 w-full"
                value={patientForm.bloodGroup}
                onChange={(e) => setPatientForm({ ...patientForm, bloodGroup: e.target.value })}
              >
                {["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"].map((bg) => (
                  <option key={bg} value={bg}>
                    {bg}
                  </option>
                ))}
              </select>
              <div className="flex gap-2">
                <button
                  className="bg-purple-600 text-white rounded px-3 py-2"
                  onClick={submitPatient}
                >
                  {editingPatientId ? "Update" : "Add"}
                </button>
                <button className="bg-gray-200 rounded px-3 py-2" onClick={resetPatientForm}>
                  Cancel
                </button>
              </div>
            </div>

            <div className="xl:col-span-2 bg-white rounded-lg shadow overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs uppercase">Name</th>
                    <th className="px-4 py-3 text-left text-xs uppercase">Email</th>
                    <th className="px-4 py-3 text-left text-xs uppercase">Phone</th>
                    <th className="px-4 py-3 text-left text-xs uppercase">DOB</th>
                    <th className="px-4 py-3 text-left text-xs uppercase">Gender</th>
                    <th className="px-4 py-3 text-left text-xs uppercase">Blood</th>
                    <th className="px-4 py-3 text-left text-xs uppercase">Address</th>
                    <th className="px-4 py-3 text-left text-xs uppercase">Allergies</th>
                    <th className="px-4 py-3 text-left text-xs uppercase">Medications</th>
                    <th className="px-4 py-3 text-left text-xs uppercase">Conditions</th>
                    <th className="px-4 py-3 text-left text-xs uppercase">Emergency</th>
                    <th className="px-4 py-3 text-left text-xs uppercase">Created</th>
                    <th className="px-4 py-3 text-left text-xs uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {patientRows.map(({ user, profile }) => (
                    <tr key={user._id} className="hover:bg-gray-50">
                      <td className="px-4 py-3">
                        {profile ? `${profile.firstName || ""} ${profile.lastName || ""}`.trim() || user.username : user.username}
                      </td>
                      <td className="px-4 py-3">{user.email || getUserEmail(profile?.userId)}</td>
                      <td className="px-4 py-3">{profile?.phone || "N/A"}</td>
                      <td className="px-4 py-3">
                        {profile?.dateOfBirth ? new Date(profile.dateOfBirth).toLocaleDateString() : "N/A"}
                      </td>
                      <td className="px-4 py-3">{profile?.gender || "N/A"}</td>
                      <td className="px-4 py-3">{profile?.bloodGroup || "N/A"}</td>
                      <td className="px-4 py-3">{formatAddress(profile?.address)}</td>
                      <td className="px-4 py-3">{formatList(profile?.medicalHistory?.allergies)}</td>
                      <td className="px-4 py-3">{formatList(profile?.medicalHistory?.medications)}</td>
                      <td className="px-4 py-3">{formatList(profile?.medicalHistory?.conditions)}</td>
                      <td className="px-4 py-3">
                        {profile?.emergencyContact
                          ? `${profile.emergencyContact.name || ""} ${profile.emergencyContact.phone ? `(${profile.emergencyContact.phone})` : ""}`.trim() || "N/A"
                          : "N/A"}
                      </td>
                      <td className="px-4 py-3">
                        {(profile?.createdAt || user.createdAt) ? new Date(profile?.createdAt || user.createdAt).toLocaleDateString() : "N/A"}
                      </td>
                      <td className="px-4 py-3 space-x-3">
                        {profile ? (
                          <>
                            <button className="text-blue-600" onClick={() => editPatient(profile)}>
                              Edit
                            </button>
                            <button className="text-red-600" onClick={() => deletePatient(profile._id)}>
                              Delete
                            </button>
                          </>
                        ) : (
                          <button className="text-purple-700" onClick={() => startCreatePatientProfile(user._id)}>
                            Create Profile
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {patientRows.length === 0 ? (
                <div className="text-center text-gray-500 py-6">No patient users found.</div>
              ) : null}
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
            <div className="xl:col-span-1 bg-white rounded-lg shadow p-4 space-y-3">
              <h2 className="font-semibold text-lg">
                {editingDoctorId ? "Edit Doctor Profile" : "Add Doctor Profile"}
              </h2>
              <select
                className="border rounded px-3 py-2 w-full"
                value={doctorForm.userId}
                onChange={(e) => setDoctorForm({ ...doctorForm, userId: e.target.value })}
                disabled={!!editingDoctorId}
              >
                <option value="">Select Doctor User</option>
                {(editingDoctorId ? users.filter((u) => u.role === "doctor") : doctorUsersWithoutProfile).map((u) => (
                  <option key={u._id} value={u._id}>
                    {u.username} ({u.email})
                  </option>
                ))}
              </select>
              <input
                className="border rounded px-3 py-2 w-full"
                placeholder="First Name"
                value={doctorForm.firstName}
                onChange={(e) => setDoctorForm({ ...doctorForm, firstName: e.target.value })}
              />
              <input
                className="border rounded px-3 py-2 w-full"
                placeholder="Last Name"
                value={doctorForm.lastName}
                onChange={(e) => setDoctorForm({ ...doctorForm, lastName: e.target.value })}
              />
              <input
                className="border rounded px-3 py-2 w-full"
                placeholder="Phone"
                value={doctorForm.phone}
                onChange={(e) => setDoctorForm({ ...doctorForm, phone: e.target.value })}
              />
              <input
                className="border rounded px-3 py-2 w-full"
                placeholder="Specialization"
                value={doctorForm.specialization}
                onChange={(e) => setDoctorForm({ ...doctorForm, specialization: e.target.value })}
              />
              <input
                className="border rounded px-3 py-2 w-full"
                type="number"
                placeholder="Experience (years)"
                value={doctorForm.experience}
                onChange={(e) => setDoctorForm({ ...doctorForm, experience: e.target.value })}
              />
              <input
                className="border rounded px-3 py-2 w-full"
                placeholder="Qualification"
                value={doctorForm.qualification}
                onChange={(e) => setDoctorForm({ ...doctorForm, qualification: e.target.value })}
              />
              <input
                className="border rounded px-3 py-2 w-full"
                placeholder="License Number"
                value={doctorForm.licenseNumber}
                onChange={(e) => setDoctorForm({ ...doctorForm, licenseNumber: e.target.value })}
              />
              <input
                className="border rounded px-3 py-2 w-full"
                placeholder="Department"
                value={doctorForm.department}
                onChange={(e) => setDoctorForm({ ...doctorForm, department: e.target.value })}
              />
              <input
                className="border rounded px-3 py-2 w-full"
                type="number"
                placeholder="Consultation Fee"
                value={doctorForm.consultationFee}
                onChange={(e) => setDoctorForm({ ...doctorForm, consultationFee: e.target.value })}
              />
              <input
                className="border rounded px-3 py-2 w-full"
                placeholder="Available Days (monday,tuesday)"
                value={doctorForm.availableDays}
                onChange={(e) => setDoctorForm({ ...doctorForm, availableDays: e.target.value })}
              />
              <input
                className="border rounded px-3 py-2 w-full"
                placeholder="Languages (English, Urdu)"
                value={doctorForm.languages}
                onChange={(e) => setDoctorForm({ ...doctorForm, languages: e.target.value })}
              />
              <textarea
                className="border rounded px-3 py-2 w-full"
                rows={3}
                placeholder="Bio"
                value={doctorForm.bio}
                onChange={(e) => setDoctorForm({ ...doctorForm, bio: e.target.value })}
              />
              <label className="flex gap-2 items-center text-sm">
                <input
                  type="checkbox"
                  checked={doctorForm.isAvailable}
                  onChange={(e) => setDoctorForm({ ...doctorForm, isAvailable: e.target.checked })}
                />
                Available
              </label>
              <div className="flex gap-2">
                <button className="bg-green-600 text-white rounded px-3 py-2" onClick={submitDoctor}>
                  {editingDoctorId ? "Update" : "Add"}
                </button>
                <button className="bg-gray-200 rounded px-3 py-2" onClick={resetDoctorForm}>
                  Cancel
                </button>
              </div>
            </div>

            <div className="xl:col-span-2 bg-white rounded-lg shadow overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs uppercase">Name</th>
                    <th className="px-4 py-3 text-left text-xs uppercase">Email</th>
                    <th className="px-4 py-3 text-left text-xs uppercase">Phone</th>
                    <th className="px-4 py-3 text-left text-xs uppercase">Specialization</th>
                    <th className="px-4 py-3 text-left text-xs uppercase">Experience</th>
                    <th className="px-4 py-3 text-left text-xs uppercase">Qualification</th>
                    <th className="px-4 py-3 text-left text-xs uppercase">License</th>
                    <th className="px-4 py-3 text-left text-xs uppercase">Department</th>
                    <th className="px-4 py-3 text-left text-xs uppercase">Fee</th>
                    <th className="px-4 py-3 text-left text-xs uppercase">Available Days</th>
                    <th className="px-4 py-3 text-left text-xs uppercase">Languages</th>
                    <th className="px-4 py-3 text-left text-xs uppercase">Availability</th>
                    <th className="px-4 py-3 text-left text-xs uppercase">Bio</th>
                    <th className="px-4 py-3 text-left text-xs uppercase">Created</th>
                    <th className="px-4 py-3 text-left text-xs uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {doctorRows.map(({ user, profile }) => (
                    <tr key={user._id} className="hover:bg-gray-50">
                      <td className="px-4 py-3">
                        {profile ? `Dr. ${profile.firstName || ""} ${profile.lastName || ""}`.trim() : `Dr. ${user.username}`}
                      </td>
                      <td className="px-4 py-3">{user.email || getUserEmail(profile?.userId)}</td>
                      <td className="px-4 py-3">{profile?.phone || "N/A"}</td>
                      <td className="px-4 py-3">{profile?.specialization || "N/A"}</td>
                      <td className="px-4 py-3">{profile?.experience ?? "N/A"}</td>
                      <td className="px-4 py-3">{profile?.qualification || "N/A"}</td>
                      <td className="px-4 py-3">{profile?.licenseNumber || "N/A"}</td>
                      <td className="px-4 py-3">{profile?.department || "N/A"}</td>
                      <td className="px-4 py-3">{profile?.consultationFee ?? "N/A"}</td>
                      <td className="px-4 py-3">{formatList(profile?.availableDays)}</td>
                      <td className="px-4 py-3">{formatList(profile?.languages)}</td>
                      <td className="px-4 py-3">
                        {profile ? (profile.isAvailable ? "Available" : "Unavailable") : "N/A"}
                      </td>
                      <td className="px-4 py-3">{profile?.bio || "N/A"}</td>
                      <td className="px-4 py-3">
                        {(profile?.createdAt || user.createdAt) ? new Date(profile?.createdAt || user.createdAt).toLocaleDateString() : "N/A"}
                      </td>
                      <td className="px-4 py-3 space-x-3">
                        {profile ? (
                          <>
                            <button className="text-blue-600" onClick={() => editDoctor(profile)}>
                              Edit
                            </button>
                            <button className="text-red-600" onClick={() => deleteDoctor(profile._id)}>
                              Delete
                            </button>
                          </>
                        ) : (
                          <button className="text-green-700" onClick={() => startCreateDoctorProfile(user._id)}>
                            Create Profile
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {doctorRows.length === 0 ? (
                <div className="text-center text-gray-500 py-6">No doctor users found.</div>
              ) : null}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Admin;

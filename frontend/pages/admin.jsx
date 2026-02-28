import React, { useEffect, useState } from 'react';
import Logout from '../components/logout.jsx';

const Admin = () => {
  const [patients, setPatients] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('patients');
  const [editingPatient, setEditingPatient] = useState(null);
  const [editingDoctor, setEditingDoctor] = useState(null);
  const [patientForm, setPatientForm] = useState({});
  const [doctorForm, setDoctorForm] = useState({});

  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    try {
      // Fetch users
      const usersRes = await fetch('http://localhost:3000/api/user/allusers', { 
        credentials: 'include'
      });
      const usersData = await usersRes.json();
      console.log('Users response:', usersData);
      if (usersData.success) {
        setUsers(usersData.users);
      }

      // Fetch patients
      const patientsRes = await fetch('http://localhost:3000/api/allpatients', { 
        credentials: 'include'
      });
      const patientsData = await patientsRes.json();
      console.log('Patients response:', patientsData);
      if (patientsData.success) {
        setPatients(patientsData.patients);
      }

      // Fetch doctors
      const doctorsRes = await fetch('http://localhost:3000/api/alldoctors', { 
        credentials: 'include'
      });
      const doctorsData = await doctorsRes.json();
      console.log('Doctors response:', doctorsData);
      if (doctorsData.success) {
        setDoctors(doctorsData.doctors);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEditPatient = (patient) => {
    setEditingPatient(patient._id);
    setPatientForm({
      firstName: patient.firstName || '',
      lastName: patient.lastName || '',
      phone: patient.phone || '',
      dateOfBirth: patient.dateOfBirth ? patient.dateOfBirth.split('T')[0] : '',
      gender: patient.gender || '',
      bloodGroup: patient.bloodGroup || '',
      'address.street': patient.address?.street || '',
      'address.city': patient.address?.city || '',
      'address.state': patient.address?.state || '',
      'address.zipCode': patient.address?.zipCode || '',
      'medicalHistory.allergies': patient.medicalHistory?.allergies?.join(', ') || '',
      'medicalHistory.medications': patient.medicalHistory?.medications?.join(', ') || '',
      'medicalHistory.conditions': patient.medicalHistory?.conditions?.join(', ') || '',
      'emergencyContact.name': patient.emergencyContact?.name || '',
      'emergencyContact.phone': patient.emergencyContact?.phone || '',
      'emergencyContact.relationship': patient.emergencyContact?.relationship || ''
    });
  };

  const handleSavePatient = async (id) => {
    try {
      const updateData = {
        firstName: patientForm.firstName,
        lastName: patientForm.lastName,
        phone: patientForm.phone,
        dateOfBirth: patientForm.dateOfBirth,
        gender: patientForm.gender,
        bloodGroup: patientForm.bloodGroup,
        address: {
          street: patientForm['address.street'],
          city: patientForm['address.city'],
          state: patientForm['address.state'],
          zipCode: patientForm['address.zipCode']
        },
        medicalHistory: {
          allergies: patientForm['medicalHistory.allergies']?.split(',').map(s => s.trim()).filter(Boolean) || [],
          medications: patientForm['medicalHistory.medications']?.split(',').map(s => s.trim()).filter(Boolean) || [],
          conditions: patientForm['medicalHistory.conditions']?.split(',').map(s => s.trim()).filter(Boolean) || []
        },
        emergencyContact: {
          name: patientForm['emergencyContact.name'],
          phone: patientForm['emergencyContact.phone'],
          relationship: patientForm['emergencyContact.relationship']
        }
      };

      const response = await fetch(`http://localhost:3000/api/patient/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(updateData)
      });
      const data = await response.json();
      if (data.success) {
        fetchAllData();
        setEditingPatient(null);
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.error('Error updating patient:', error);
    }
  };

  const handleDeletePatient = async (id) => {
    if (!window.confirm('Are you sure you want to delete this patient?')) return;
    try {
      const response = await fetch(`http://localhost:3000/api/patient/${id}`, {
        method: 'DELETE',
        credentials: 'include'
      });
      const data = await response.json();
      if (data.success) {
        fetchAllData();
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.error('Error deleting patient:', error);
    }
  };

  const handleEditDoctor = (doctor) => {
    setEditingDoctor(doctor._id);
    setDoctorForm({
      firstName: doctor.firstName || '',
      lastName: doctor.lastName || '',
      phone: doctor.phone || '',
      specialization: doctor.specialization || '',
      experience: doctor.experience || '',
      qualification: doctor.qualification || '',
      licenseNumber: doctor.licenseNumber || '',
      department: doctor.department || '',
      consultationFee: doctor.consultationFee || '',
      bio: doctor.bio || '',
      languages: doctor.languages?.join(', ') || '',
      isAvailable: doctor.isAvailable || false
    });
  };

  const handleSaveDoctor = async (id) => {
    try {
      const updateData = {
        firstName: doctorForm.firstName,
        lastName: doctorForm.lastName,
        phone: doctorForm.phone,
        specialization: doctorForm.specialization,
        experience: doctorForm.experience,
        qualification: doctorForm.qualification,
        licenseNumber: doctorForm.licenseNumber,
        department: doctorForm.department,
        consultationFee: doctorForm.consultationFee,
        bio: doctorForm.bio,
        languages: doctorForm.languages?.split(',').map(s => s.trim()).filter(Boolean) || [],
        isAvailable: doctorForm.isAvailable
      };

      const response = await fetch(`http://localhost:3000/api/doctor/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(updateData)
      });
      const data = await response.json();
      if (data.success) {
        fetchAllData();
        setEditingDoctor(null);
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.error('Error updating doctor:', error);
    }
  };

  const handleDeleteDoctor = async (id) => {
    if (!window.confirm('Are you sure you want to delete this doctor?')) return;
    try {
      const response = await fetch(`http://localhost:3000/api/doctor/${id}`, {
        method: 'DELETE',
        credentials: 'include'
      });
      const data = await response.json();
      if (data.success) {
        fetchAllData();
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.error('Error deleting doctor:', error);
    }
  };

  const handleCancel = () => {
    setEditingPatient(null);
    setEditingDoctor(null);
    setPatientForm({});
    setDoctorForm({});
  };

  const getUserEmail = (userId) => {
    const user = users.find(u => u._id === userId);
    return user?.email || 'N/A';
  };

  if (loading) {
    return <div className="p-8 text-center">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Admin Dashboard</h1>
          <Logout />
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-gray-500 text-sm font-medium">Total Users</h3>
            <p className="text-3xl font-bold text-blue-600">{users.length}</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-gray-500 text-sm font-medium">Total Doctors</h3>
            <p className="text-3xl font-bold text-green-600">{doctors.length}</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-gray-500 text-sm font-medium">Total Patients</h3>
            <p className="text-3xl font-bold text-purple-600">{patients.length}</p>
          </div>
        </div>

        {/* Tab Buttons */}
        <div className="flex gap-4 mb-6">
          <button
            onClick={() => setActiveTab('patients')}
            className={`px-4 py-2 rounded-lg ${activeTab === 'patients' ? 'bg-purple-600 text-white' : 'bg-white text-gray-700'}`}
          >
            Patients ({patients.length})
          </button>
          <button
            onClick={() => setActiveTab('doctors')}
            className={`px-4 py-2 rounded-lg ${activeTab === 'doctors' ? 'bg-green-600 text-white' : 'bg-white text-gray-700'}`}
          >
            Doctors ({doctors.length})
          </button>
        </div>

        {/* Patients Table */}
        {activeTab === 'patients' && (
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Phone</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">DOB</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Gender</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Blood Group</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {patients.map((patient) => (
                    <tr key={patient._id} className="hover:bg-gray-50">
                      <td className="px-4 py-4 whitespace-nowrap">
                        {editingPatient === patient._id ? (
                          <div className="space-y-1">
                            <input
                              type="text"
                              value={patientForm.firstName}
                              onChange={(e) => setPatientForm({ ...patientForm, firstName: e.target.value })}
                              placeholder="First Name"
                              className="border border-gray-300 rounded px-2 py-1 w-full text-sm"
                            />
                            <input
                              type="text"
                              value={patientForm.lastName}
                              onChange={(e) => setPatientForm({ ...patientForm, lastName: e.target.value })}
                              placeholder="Last Name"
                              className="border border-gray-300 rounded px-2 py-1 w-full text-sm"
                            />
                          </div>
                        ) : (
                          <span className="font-medium text-gray-900">
                            {patient.firstName} {patient.lastName}
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-gray-500">
                        {getUserEmail(patient.userId)}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        {editingPatient === patient._id ? (
                          <input
                            type="text"
                            value={patientForm.phone}
                            onChange={(e) => setPatientForm({ ...patientForm, phone: e.target.value })}
                            className="border border-gray-300 rounded px-2 py-1 w-full text-sm"
                          />
                        ) : (
                          <span className="text-gray-500">{patient.phone}</span>
                        )}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-gray-500">
                        {patient.dateOfBirth ? new Date(patient.dateOfBirth).toLocaleDateString() : 'N/A'}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        {editingPatient === patient._id ? (
                          <select
                            value={patientForm.gender}
                            onChange={(e) => setPatientForm({ ...patientForm, gender: e.target.value })}
                            className="border border-gray-300 rounded px-2 py-1 w-full text-sm"
                          >
                            <option value="">Select</option>
                            <option value="male">Male</option>
                            <option value="female">Female</option>
                            <option value="other">Other</option>
                          </select>
                        ) : (
                          <span className="capitalize text-gray-500">{patient.gender}</span>
                        )}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        {editingPatient === patient._id ? (
                          <select
                            value={patientForm.bloodGroup}
                            onChange={(e) => setPatientForm({ ...patientForm, bloodGroup: e.target.value })}
                            className="border border-gray-300 rounded px-2 py-1 w-full text-sm"
                          >
                            <option value="">Select</option>
                            <option value="A+">A+</option>
                            <option value="A-">A-</option>
                            <option value="B+">B+</option>
                            <option value="B-">B-</option>
                            <option value="O+">O+</option>
                            <option value="O-">O-</option>
                            <option value="AB+">AB+</option>
                            <option value="AB-">AB-</option>
                          </select>
                        ) : (
                          <span className="text-gray-500">{patient.bloodGroup || 'N/A'}</span>
                        )}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        {editingPatient === patient._id ? (
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleSavePatient(patient._id)}
                              className="text-green-600 hover:text-green-800 font-medium text-sm"
                            >
                              Save
                            </button>
                            <button
                              onClick={handleCancel}
                              className="text-gray-600 hover:text-gray-800 font-medium text-sm"
                            >
                              Cancel
                            </button>
                          </div>
                        ) : (
                          <div className="flex gap-4">
                            <button
                              onClick={() => handleEditPatient(patient)}
                              className="text-blue-600 hover:text-blue-800 font-medium text-sm"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleDeletePatient(patient._id)}
                              className="text-red-600 hover:text-red-800 font-medium text-sm"
                            >
                              Delete
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {patients.length === 0 && (
                <div className="text-center py-8 text-gray-500">No patients found</div>
              )}
            </div>
          </div>
        )}

        {/* Doctors Table */}
        {activeTab === 'doctors' && (
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Phone</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Specialization</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Department</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Experience</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Fee</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {doctors.map((doctor) => (
                    <tr key={doctor._id} className="hover:bg-gray-50">
                      <td className="px-4 py-4 whitespace-nowrap">
                        {editingDoctor === doctor._id ? (
                          <div className="space-y-1">
                            <input
                              type="text"
                              value={doctorForm.firstName}
                              onChange={(e) => setDoctorForm({ ...doctorForm, firstName: e.target.value })}
                              placeholder="First Name"
                              className="border border-gray-300 rounded px-2 py-1 w-full text-sm"
                            />
                            <input
                              type="text"
                              value={doctorForm.lastName}
                              onChange={(e) => setDoctorForm({ ...doctorForm, lastName: e.target.value })}
                              placeholder="Last Name"
                              className="border border-gray-300 rounded px-2 py-1 w-full text-sm"
                            />
                          </div>
                        ) : (
                          <span className="font-medium text-gray-900">
                            Dr. {doctor.firstName} {doctor.lastName}
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-gray-500">
                        {getUserEmail(doctor.userId)}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        {editingDoctor === doctor._id ? (
                          <input
                            type="text"
                            value={doctorForm.phone}
                            onChange={(e) => setDoctorForm({ ...doctorForm, phone: e.target.value })}
                            className="border border-gray-300 rounded px-2 py-1 w-full text-sm"
                          />
                        ) : (
                          <span className="text-gray-500">{doctor.phone}</span>
                        )}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        {editingDoctor === doctor._id ? (
                          <input
                            type="text"
                            value={doctorForm.specialization}
                            onChange={(e) => setDoctorForm({ ...doctorForm, specialization: e.target.value })}
                            className="border border-gray-300 rounded px-2 py-1 w-full text-sm"
                          />
                        ) : (
                          <span className="text-gray-500">{doctor.specialization}</span>
                        )}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        {editingDoctor === doctor._id ? (
                          <input
                            type="text"
                            value={doctorForm.department}
                            onChange={(e) => setDoctorForm({ ...doctorForm, department: e.target.value })}
                            className="border border-gray-300 rounded px-2 py-1 w-full text-sm"
                          />
                        ) : (
                          <span className="text-gray-500">{doctor.department}</span>
                        )}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        {editingDoctor === doctor._id ? (
                          <input
                            type="number"
                            value={doctorForm.experience}
                            onChange={(e) => setDoctorForm({ ...doctorForm, experience: e.target.value })}
                            className="border border-gray-300 rounded px-2 py-1 w-full text-sm"
                          />
                        ) : (
                          <span className="text-gray-500">{doctor.experience} years</span>
                        )}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        {editingDoctor === doctor._id ? (
                          <input
                            type="number"
                            value={doctorForm.consultationFee}
                            onChange={(e) => setDoctorForm({ ...doctorForm, consultationFee: e.target.value })}
                            className="border border-gray-300 rounded px-2 py-1 w-full text-sm"
                          />
                        ) : (
                          <span className="text-gray-500">${doctor.consultationFee}</span>
                        )}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        {editingDoctor === doctor._id ? (
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleSaveDoctor(doctor._id)}
                              className="text-green-600 hover:text-green-800 font-medium text-sm"
                            >
                              Save
                            </button>
                            <button
                              onClick={handleCancel}
                              className="text-gray-600 hover:text-gray-800 font-medium text-sm"
                            >
                              Cancel
                            </button>
                          </div>
                        ) : (
                          <div className="flex gap-4">
                            <button
                              onClick={() => handleEditDoctor(doctor)}
                              className="text-blue-600 hover:text-blue-800 font-medium text-sm"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleDeleteDoctor(doctor._id)}
                              className="text-red-600 hover:text-red-800 font-medium text-sm"
                            >
                              Delete
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {doctors.length === 0 && (
                <div className="text-center py-8 text-gray-500">No doctors found</div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Admin;

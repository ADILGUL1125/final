import React, { useEffect, useState } from 'react'
import Logout from '../components/logout.jsx'
import { Link } from 'react-router-dom'
import { useAuthStore } from '../zustand/auth.js'

const Dashbord = () => {
  const { user } = useAuthStore()
  const [patients, setPatients] = useState([])
  const [doctors, setDoctors] = useState([])
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('patients')

  useEffect(() => {
    fetchUsers()
  }, [])

  const fetchUsers = async () => {
    try {
      const usersRes = await fetch('http://localhost:3000/api/user/allusers', {
        credentials: 'include'
      })
      const usersData = await usersRes.json()
      if (usersData.success) {
        setUsers(usersData.users)
      }

      const patientsRes = await fetch('http://localhost:3000/api/allpatients', {
        credentials: 'include'
      })
      const patientsData = await patientsRes.json()
      if (patientsData.success) {
        setPatients(patientsData.patients)
      }

      const doctorsRes = await fetch('http://localhost:3000/api/alldoctors', {
        credentials: 'include'
      })
      const doctorsData = await doctorsRes.json()
      if (doctorsData.success) {
        setDoctors(doctorsData.doctors)
      }
    } catch (error) {
      console.error('Error fetching users:', error)
    } finally {
      setLoading(false)
    }
  }

  const getUserEmail = (userId) => {
    const u = users.find(u => u._id === userId)
    return u?.email || 'N/A'
  }

  const currentUsers = activeTab === 'patients' ? patients : doctors

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h1 className="text-3xl font-bold text-gray-800 mb-4">Dashboard</h1>
          <p className="text-gray-600 mb-4">Welcome, {user?.username}!</p>
          
          <div className="space-y-2 mb-4">
            <p className="text-gray-700">Your role: <span className="font-semibold capitalize">{user?.role}</span></p>
            <p className="text-gray-700">Email: {user?.email}</p>
          </div>
          
          {user?.role === 'admin' && (
            <div className="mt-4 pt-4 border-t border-gray-200">
              <Link 
                to="/admin" 
                className="inline-block bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Go to Admin Panel
              </Link>
            </div>
          )}
          
          <div className="mt-4 pt-4 border-t border-gray-200">
            <Logout />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800">Manage Users</h2>
          </div>

          <div className="flex gap-4 mb-6">
            <button
              onClick={() => setActiveTab('patients')}
              className={`px-4 py-2 rounded-lg ${activeTab === 'patients' ? 'bg-purple-600 text-white' : 'bg-gray-200 text-gray-700'}`}
            >
              Patients ({patients.length})
            </button>
            <button
              onClick={() => setActiveTab('doctors')}
              className={`px-4 py-2 rounded-lg ${activeTab === 'doctors' ? 'bg-green-600 text-white' : 'bg-gray-200 text-gray-700'}`}
            >
              Doctors ({doctors.length})
            </button>
          </div>

          {loading ? (
            <div className="text-center py-8">Loading...</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Phone</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      {activeTab === 'patients' ? 'DOB' : 'Specialization'}
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      {activeTab === 'patients' ? 'Blood Group' : 'Department'}
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Created</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {currentUsers.map((u) => (
                    <tr key={u._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="font-medium text-gray-900">
                          {activeTab === 'patients' 
                            ? `${u.firstName} ${u.lastName}` 
                            : `Dr. ${u.firstName} ${u.lastName}`}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-gray-500">
                        {getUserEmail(u.userId)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-gray-500">
                        {u.phone}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-gray-500">
                        {activeTab === 'patients' 
                          ? (u.dateOfBirth ? new Date(u.dateOfBirth).toLocaleDateString() : 'N/A')
                          : u.specialization}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {activeTab === 'patients' ? (
                          <span className="text-gray-500">{u.bloodGroup || 'N/A'}</span>
                        ) : (
                          <span className="text-gray-500">{u.department}</span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-gray-500">
                        {new Date(u.createdAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {currentUsers.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  No {activeTab} found
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Dashbord

import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import { useAuth } from '../contexts/AuthContext';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [users, setUsers] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { currentUser } = useAuth();

  // Doctor form state
  const [doctorForm, setDoctorForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    specialty: '',
    qualification: '',
    experience: '',
    description: '',
    consultationFee: '',
    availableDays: [],
    startTime: '09:00',
    endTime: '17:00',
    slotDuration: 30
  });

  useEffect(() => {
    fetchAdminData();
  }, []);

  const fetchAdminData = async () => {
    try {
      const [usersResponse, doctorsResponse, appointmentsResponse] = await Promise.all([
        api.get('/admin/users'),
        api.get('/admin/doctors'),
        api.get('/admin/appointments')
      ]);
      
      setUsers(usersResponse.data);
      setDoctors(doctorsResponse.data);
      setAppointments(appointmentsResponse.data);
    } catch (error) {
      setError('Failed to fetch admin data');
      console.error('Error fetching admin data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDoctorFormChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (name === 'availableDays') {
      const updatedDays = checked
        ? [...doctorForm.availableDays, value]
        : doctorForm.availableDays.filter(day => day !== value);
      
      setDoctorForm({
        ...doctorForm,
        availableDays: updatedDays
      });
    } else {
      setDoctorForm({
        ...doctorForm,
        [name]: type === 'number' ? Number(value) : value
      });
    }
  };

  const handleAddDoctor = async (e) => {
    e.preventDefault();
    try {
      const signupData = {
        firstName: doctorForm.firstName,
        lastName: doctorForm.lastName,
        email: doctorForm.email,
        phone: doctorForm.phone,
        password: doctorForm.password,
        role: 'DOCTOR'
      };

      const doctorData = {
        specialty: doctorForm.specialty,
        qualification: doctorForm.qualification,
        experience: doctorForm.experience,
        description: doctorForm.description,
        consultationFee: doctorForm.consultationFee,
        availableDays: doctorForm.availableDays,
        startTime: doctorForm.startTime,
        endTime: doctorForm.endTime,
        slotDuration: doctorForm.slotDuration
      };

      // Note: This is a simplified version. In reality, you'd need to modify the backend
      // to accept both user and doctor data in a single request
      await api.post('/admin/doctors', { ...signupData, ...doctorData });
      
      // Reset form
      setDoctorForm({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        password: '',
        specialty: '',
        qualification: '',
        experience: '',
        description: '',
        consultationFee: '',
        availableDays: [],
        startTime: '09:00',
        endTime: '17:00',
        slotDuration: 30
      });

      fetchAdminData(); // Refresh data
      alert('Doctor added successfully!');
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to add doctor');
    }
  };

  const deleteUser = async (userId) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await api.delete(`/admin/users/${userId}`);
        fetchAdminData();
      } catch (error) {
        setError('Failed to delete user');
      }
    }
  };

  const deleteDoctor = async (doctorId) => {
    if (window.confirm('Are you sure you want to delete this doctor?')) {
      try {
        await api.delete(`/admin/doctors/${doctorId}`);
        fetchAdminData();
      } catch (error) {
        setError('Failed to delete doctor');
      }
    }
  };

  const deleteAppointment = async (appointmentId) => {
    if (window.confirm('Are you sure you want to delete this appointment?')) {
      try {
        await api.delete(`/admin/appointments/${appointmentId}`);
        fetchAdminData();
      } catch (error) {
        setError('Failed to delete appointment');
      }
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'SCHEDULED':
        return 'bg-blue-100 text-blue-800';
      case 'COMPLETED':
        return 'bg-green-100 text-green-800';
      case 'CANCELLED':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const weekDays = ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY'];

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          Admin Dashboard
        </h1>
        <p className="text-gray-600">Welcome, {currentUser?.firstName}! Manage the hospital system</p>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {/* Tab Navigation */}
      <div className="bg-white rounded-lg shadow-md mb-6">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8 px-6">
            {[
              { id: 'overview', name: 'Overview', icon: '📊' },
              { id: 'users', name: 'Users', icon: '👥' },
              { id: 'doctors', name: 'Doctors', icon: '👨‍⚕️' },
              { id: 'appointments', name: 'Appointments', icon: '📅' },
              { id: 'add-doctor', name: 'Add Doctor', icon: '➕' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? 'border-primary-500 text-primary-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <span className="mr-2">{tab.icon}</span>
                {tab.name}
              </button>
            ))}
          </nav>
        </div>

        <div className="p-6">
          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <div>
              <h2 className="text-2xl font-bold text-gray-800 mb-6">System Overview</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg p-6 text-white">
                  <div className="flex items-center">
                    <div className="text-3xl mr-4">👥</div>
                    <div>
                      <h3 className="text-lg font-semibold">Total Users</h3>
                      <p className="text-3xl font-bold">{users.length}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-lg p-6 text-white">
                  <div className="flex items-center">
                    <div className="text-3xl mr-4">👨‍⚕️</div>
                    <div>
                      <h3 className="text-lg font-semibold">Total Doctors</h3>
                      <p className="text-3xl font-bold">{doctors.length}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg p-6 text-white">
                  <div className="flex items-center">
                    <div className="text-3xl mr-4">📅</div>
                    <div>
                      <h3 className="text-lg font-semibold">Total Appointments</h3>
                      <p className="text-3xl font-bold">{appointments.length}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-lg p-6 text-white">
                  <div className="flex items-center">
                    <div className="text-3xl mr-4">🏥</div>
                    <div>
                      <h3 className="text-lg font-semibold">Patients</h3>
                      <p className="text-3xl font-bold">
                        {users.filter(user => user.role === 'PATIENT').length}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Users Tab */}
          {activeTab === 'users' && (
            <div>
              <h2 className="text-2xl font-bold text-gray-800 mb-6">User Management</h2>
              
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Name
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Email
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Phone
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Role
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {users.map((user) => (
                      <tr key={user.id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {user.firstName} {user.lastName}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {user.email}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {user.phone}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            user.role === 'ADMIN' ? 'bg-red-100 text-red-800' :
                            user.role === 'DOCTOR' ? 'bg-green-100 text-green-800' :
                            'bg-blue-100 text-blue-800'
                          }`}>
                            {user.role}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          {user.role !== 'ADMIN' && (
                            <button
                              onClick={() => deleteUser(user.id)}
                              className="text-red-600 hover:text-red-900 transition-colors"
                            >
                              Delete
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Doctors Tab */}
          {activeTab === 'doctors' && (
            <div>
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Doctor Management</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {doctors.map((doctor) => (
                  <div key={doctor.id} className="bg-gray-50 rounded-lg p-6">
                    <div className="flex items-center mb-4">
                      <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center text-xl">
                        👨‍⚕️
                      </div>
                      <div className="ml-4">
                        <h3 className="text-lg font-semibold text-gray-800">
                          Dr. {doctor.userId}
                        </h3>
                        <p className="text-primary-600">{doctor.specialty}</p>
                      </div>
                    </div>
                    
                    <div className="space-y-2 text-sm text-gray-600 mb-4">
                      <p><span className="font-medium">Qualification:</span> {doctor.qualification}</p>
                      <p><span className="font-medium">Experience:</span> {doctor.experience} years</p>
                      <p><span className="font-medium">Fee:</span> ${doctor.consultationFee}</p>
                    </div>
                    
                    <button
                      onClick={() => deleteDoctor(doctor.id)}
                      className="w-full bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-md transition-colors"
                    >
                      Delete Doctor
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Appointments Tab */}
          {activeTab === 'appointments' && (
            <div>
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Appointment Management</h2>
              
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Date & Time
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Patient
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Doctor
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {appointments.map((appointment) => (
                      <tr key={appointment.id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {new Date(appointment.appointmentDate).toLocaleDateString()} at{' '}
                          {appointment.appointmentTime}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {appointment.patientId}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {appointment.doctorId}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(appointment.status)}`}>
                            {appointment.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <button
                            onClick={() => deleteAppointment(appointment.id)}
                            className="text-red-600 hover:text-red-900 transition-colors"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Add Doctor Tab */}
          {activeTab === 'add-doctor' && (
            <div>
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Add New Doctor</h2>
              
              <form onSubmit={handleAddDoctor} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      First Name
                    </label>
                    <input
                      type="text"
                      name="firstName"
                      value={doctorForm.firstName}
                      onChange={handleDoctorFormChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Last Name
                    </label>
                    <input
                      type="text"
                      name="lastName"
                      value={doctorForm.lastName}
                      onChange={handleDoctorFormChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={doctorForm.email}
                      onChange={handleDoctorFormChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Phone
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={doctorForm.phone}
                      onChange={handleDoctorFormChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Password
                    </label>
                    <input
                      type="password"
                      name="password"
                      value={doctorForm.password}
                      onChange={handleDoctorFormChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Specialty
                    </label>
                    <input
                      type="text"
                      name="specialty"
                      value={doctorForm.specialty}
                      onChange={handleDoctorFormChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Qualification
                    </label>
                    <input
                      type="text"
                      name="qualification"
                      value={doctorForm.qualification}
                      onChange={handleDoctorFormChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Experience (years)
                    </label>
                    <input
                      type="number"
                      name="experience"
                      value={doctorForm.experience}
                      onChange={handleDoctorFormChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Consultation Fee ($)
                    </label>
                    <input
                      type="number"
                      name="consultationFee"
                      value={doctorForm.consultationFee}
                      onChange={handleDoctorFormChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Start Time
                    </label>
                    <input
                      type="time"
                      name="startTime"
                      value={doctorForm.startTime}
                      onChange={handleDoctorFormChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      End Time
                    </label>
                    <input
                      type="time"
                      name="endTime"
                      value={doctorForm.endTime}
                      onChange={handleDoctorFormChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Slot Duration (minutes)
                    </label>
                    <input
                      type="number"
                      name="slotDuration"
                      value={doctorForm.slotDuration}
                      onChange={handleDoctorFormChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                      required
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description
                  </label>
                  <textarea
                    name="description"
                    value={doctorForm.description}
                    onChange={handleDoctorFormChange}
                    rows="3"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Available Days
                  </label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                    {weekDays.map((day) => (
                      <label key={day} className="flex items-center">
                        <input
                          type="checkbox"
                          name="availableDays"
                          value={day}
                          checked={doctorForm.availableDays.includes(day)}
                          onChange={handleDoctorFormChange}
                          className="mr-2"
                        />
                        <span className="text-sm">{day}</span>
                      </label>
                    ))}
                  </div>
                </div>
                
                <button
                  type="submit"
                  className="w-full bg-primary-600 hover:bg-primary-700 text-white font-bold py-3 px-4 rounded-md transition-colors"
                >
                  Add Doctor
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../utils/api';
import { useAuth } from '../contexts/AuthContext';

const PatientDashboard = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { currentUser } = useAuth();

  useEffect(() => {
    fetchAppointments();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchAppointments = async () => {
    try {
      const response = await api.get('/patient/appointments');
      setAppointments(response.data);
    } catch (error) {
      setError('Failed to fetch appointments');
      console.error('Error fetching appointments:', error);
    } finally {
      setLoading(false);
    }
  };

  const cancelAppointment = async (appointmentId) => {
    if (window.confirm('Are you sure you want to cancel this appointment?')) {
      try {
        await api.delete(`/patient/appointments/${appointmentId}`);
        fetchAppointments(); // Refresh the list
      } catch (error) {
        setError('Failed to cancel appointment');
        console.error('Error cancelling appointment:', error);
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

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          Welcome, {currentUser?.firstName}!
        </h1>
        <p className="text-gray-600">Manage your appointments and find doctors</p>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-primary-100 text-primary-600">
              📅
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-semibold text-gray-800">
                Total Appointments
              </h3>
              <p className="text-2xl font-bold text-primary-600">
                {appointments.length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-green-100 text-green-600">
              ✅
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-semibold text-gray-800">
                Completed
              </h3>
              <p className="text-2xl font-bold text-green-600">
                {appointments.filter(apt => apt.status === 'COMPLETED').length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-blue-100 text-blue-600">
              ⏰
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-semibold text-gray-800">
                Upcoming
              </h3>
              <p className="text-2xl font-bold text-blue-600">
                {appointments.filter(apt => apt.status === 'SCHEDULED').length}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-800">Quick Actions</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Link
            to="/patient/doctors"
            className="bg-primary-600 hover:bg-primary-700 text-white p-4 rounded-lg text-center transition-colors"
          >
            <div className="text-2xl mb-2">🔍</div>
            <div className="font-semibold">Find Doctors</div>
            <div className="text-sm opacity-90">Browse doctors by specialty</div>
          </Link>
          <Link
            to="/patient/doctors"
            className="bg-secondary-600 hover:bg-secondary-700 text-white p-4 rounded-lg text-center transition-colors"
          >
            <div className="text-2xl mb-2">📅</div>
            <div className="font-semibold">Book Appointment</div>
            <div className="text-sm opacity-90">Schedule a new appointment</div>
          </Link>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Your Appointments</h2>
        
        {appointments.length === 0 ? (
          <div className="text-center py-8">
            <div className="text-4xl mb-4">📋</div>
            <p className="text-gray-600 mb-4">No appointments found</p>
            <Link
              to="/patient/doctors"
              className="bg-primary-600 hover:bg-primary-700 text-white px-6 py-2 rounded-md transition-colors"
            >
              Book Your First Appointment
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date & Time
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Doctor
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Symptoms
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
                      Dr. {appointment.doctorId}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {appointment.symptoms || 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(appointment.status)}`}>
                        {appointment.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      {appointment.status === 'SCHEDULED' && (
                        <button
                          onClick={() => cancelAppointment(appointment.id)}
                          className="text-red-600 hover:text-red-900 transition-colors"
                        >
                          Cancel
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default PatientDashboard;
import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import { useAuth } from '../contexts/AuthContext';

const DoctorDashboard = () => {
  const [appointments, setAppointments] = useState([]);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const { currentUser } = useAuth();

  useEffect(() => {
    fetchDoctorData();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchDoctorData = async () => {
    try {
      const [appointmentsResponse, profileResponse] = await Promise.all([
        api.get('/doctor/appointments'),
        api.get('/doctor/profile')
      ]);
      
      setAppointments(appointmentsResponse.data);
      setProfile(profileResponse.data);
    } catch (error) {
      setError('Failed to fetch doctor data');
      console.error('Error fetching doctor data:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateAppointmentStatus = async (appointmentId, status) => {
    try {
      await api.put(`/doctor/appointments/${appointmentId}/status?status=${status}`);
      fetchDoctorData(); // Refresh data
    } catch (error) {
      setError('Failed to update appointment status');
      console.error('Error updating appointment:', error);
    }
  };

  const blockDate = async () => {
    if (!selectedDate) {
      setError('Please select a date to block');
      return;
    }

    try {
      await api.post(`/doctor/availability/block?date=${selectedDate}`);
      setSelectedDate('');
      alert('Date blocked successfully');
    } catch (error) {
      setError('Failed to block date');
      console.error('Error blocking date:', error);
    }
  };

  const unblockDate = async (date) => {
    try {
      await api.post(`/doctor/availability/unblock?date=${date}`);
      fetchDoctorData(); // Refresh to update blocked dates
      alert('Date unblocked successfully');
    } catch (error) {
      setError('Failed to unblock date');
      console.error('Error unblocking date:', error);
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

  const getTodayAppointments = () => {
    const today = new Date().toISOString().split('T')[0];
    return appointments.filter(apt => 
      apt.appointmentDate === today && apt.status === 'SCHEDULED'
    );
  };

  const getUpcomingAppointments = () => {
    const today = new Date().toISOString().split('T')[0];
    return appointments.filter(apt => 
      apt.appointmentDate > today && apt.status === 'SCHEDULED'
    );
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
          Welcome, Dr. {currentUser?.firstName}!
        </h1>
        <p className="text-gray-600">Manage your appointments and availability</p>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-blue-100 text-blue-600">
              📅
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-semibold text-gray-800">Today's Appointments</h3>
              <p className="text-2xl font-bold text-blue-600">
                {getTodayAppointments().length}
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
              <h3 className="text-lg font-semibold text-gray-800">Completed</h3>
              <p className="text-2xl font-bold text-green-600">
                {appointments.filter(apt => apt.status === 'COMPLETED').length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-yellow-100 text-yellow-600">
              ⏰
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-semibold text-gray-800">Upcoming</h3>
              <p className="text-2xl font-bold text-yellow-600">
                {getUpcomingAppointments().length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-primary-100 text-primary-600">
              💰
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-semibold text-gray-800">Consultation Fee</h3>
              <p className="text-2xl font-bold text-primary-600">
                ${profile?.consultationFee || 0}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Availability Management */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Manage Availability</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-700 mb-3">Block Date</h3>
            <div className="flex gap-2">
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                min={new Date().toISOString().split('T')[0]}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
              <button
                onClick={blockDate}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md transition-colors"
              >
                Block
              </button>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-gray-700 mb-3">Blocked Dates</h3>
            <div className="max-h-32 overflow-y-auto">
              {profile?.blockedDates?.length > 0 ? (
                <div className="space-y-2">
                  {profile.blockedDates.map((date) => (
                    <div key={date} className="flex justify-between items-center bg-gray-100 px-3 py-2 rounded">
                      <span className="text-sm">{date}</span>
                      <button
                        onClick={() => unblockDate(date)}
                        className="text-red-600 hover:text-red-800 text-sm"
                      >
                        Unblock
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-sm">No blocked dates</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Today's Appointments */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Today's Appointments</h2>
        
        {getTodayAppointments().length === 0 ? (
          <div className="text-center py-8">
            <div className="text-4xl mb-4">📅</div>
            <p className="text-gray-600">No appointments scheduled for today</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Time
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Patient
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
                {getTodayAppointments().map((appointment) => (
                  <tr key={appointment.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {appointment.appointmentTime}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {appointment.patientId}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {appointment.symptoms || 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(appointment.status)}`}>
                        {appointment.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                      <button
                        onClick={() => updateAppointmentStatus(appointment.id, 'COMPLETED')}
                        className="text-green-600 hover:text-green-900 transition-colors"
                      >
                        Complete
                      </button>
                      <button
                        onClick={() => updateAppointmentStatus(appointment.id, 'CANCELLED')}
                        className="text-red-600 hover:text-red-900 transition-colors"
                      >
                        Cancel
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* All Appointments */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-bold text-gray-800 mb-4">All Appointments</h2>
        
        {appointments.length === 0 ? (
          <div className="text-center py-8">
            <div className="text-4xl mb-4">📋</div>
            <p className="text-gray-600">No appointments found</p>
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
                    Patient
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
                      {appointment.patientId}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {appointment.symptoms || 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(appointment.status)}`}>
                        {appointment.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                      {appointment.status === 'SCHEDULED' && (
                        <>
                          <button
                            onClick={() => updateAppointmentStatus(appointment.id, 'COMPLETED')}
                            className="text-green-600 hover:text-green-900 transition-colors"
                          >
                            Complete
                          </button>
                          <button
                            onClick={() => updateAppointmentStatus(appointment.id, 'CANCELLED')}
                            className="text-red-600 hover:text-red-900 transition-colors"
                          >
                            Cancel
                          </button>
                        </>
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

export default DoctorDashboard;
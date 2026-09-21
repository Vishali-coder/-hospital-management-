import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../utils/api';

const BookAppointment = () => {
  const { doctorId } = useParams();
  const navigate = useNavigate();
  
  const [doctor, setDoctor] = useState(null);
  const [formData, setFormData] = useState({
    appointmentDate: '',
    appointmentTime: '',
    symptoms: ''
  });
  const [availableSlots, setAvailableSlots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetchDoctorDetails();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [doctorId]);

  useEffect(() => {
    if (formData.appointmentDate) {
      fetchAvailableSlots();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formData.appointmentDate]);

  const fetchDoctorDetails = async () => {
    try {
      const response = await api.get('/patient/doctors');
      const doctorData = response.data.find(doc => doc.id === doctorId);
      setDoctor(doctorData);
    } catch (error) {
      setError('Failed to fetch doctor details');
      console.error('Error fetching doctor:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchAvailableSlots = async () => {
    try {
      await api.get(
        `/patient/doctors/${doctorId}/availability?date=${formData.appointmentDate}`
      );
      // Generate time slots based on doctor's schedule
      generateTimeSlots();
    } catch (error) {
      console.error('Error fetching availability:', error);
      generateTimeSlots(); // Fallback to generate slots
    }
  };

  const generateTimeSlots = () => {
    if (!doctor) return;

    const slots = [];
    const startTime = doctor.startTime || '09:00';
    const endTime = doctor.endTime || '17:00';
    const slotDuration = doctor.slotDuration || 30;

    const [startHour, startMinute] = startTime.split(':').map(Number);
    const [endHour, endMinute] = endTime.split(':').map(Number);

    let currentHour = startHour;
    let currentMinute = startMinute;

    while (currentHour < endHour || (currentHour === endHour && currentMinute < endMinute)) {
      const timeString = `${currentHour.toString().padStart(2, '0')}:${currentMinute.toString().padStart(2, '0')}`;
      slots.push(timeString);

      currentMinute += slotDuration;
      if (currentMinute >= 60) {
        currentHour += Math.floor(currentMinute / 60);
        currentMinute = currentMinute % 60;
      }
    }

    setAvailableSlots(slots);
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);

    try {
      const appointmentData = {
        doctorId,
        appointmentDate: formData.appointmentDate,
        appointmentTime: formData.appointmentTime,
        symptoms: formData.symptoms
      };

      await api.post('/patient/appointments', appointmentData);
      setSuccess('Appointment booked successfully! You will receive a confirmation email.');
      
      setTimeout(() => {
        navigate('/patient/dashboard');
      }, 2000);
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to book appointment');
    } finally {
      setSubmitting(false);
    }
  };

  const getMinDate = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
  };

  const getMaxDate = () => {
    const maxDate = new Date();
    maxDate.setDate(maxDate.getDate() + 30); // Allow booking up to 30 days in advance
    return maxDate.toISOString().split('T')[0];
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!doctor) {
    return (
      <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-6">
        <div className="text-center">
          <div className="text-4xl mb-4">❌</div>
          <h2 className="text-xl font-bold text-gray-800 mb-2">Doctor Not Found</h2>
          <p className="text-gray-600 mb-4">The requested doctor could not be found.</p>
          <button
            onClick={() => navigate('/patient/doctors')}
            className="bg-primary-600 hover:bg-primary-700 text-white px-6 py-2 rounded-md transition-colors"
          >
            Back to Doctors
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Doctor Information */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Doctor Information</h2>
          
          <div className="flex items-center mb-6">
            <div className="w-20 h-20 bg-primary-100 rounded-full flex items-center justify-center text-3xl">
              👨‍⚕️
            </div>
            <div className="ml-4">
              <h3 className="text-xl font-semibold text-gray-800">
                Dr. {doctor.userId}
              </h3>
              <p className="text-primary-600 font-medium">{doctor.specialty}</p>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="font-medium text-gray-700">Qualification:</span>
              <span className="text-gray-600">{doctor.qualification}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium text-gray-700">Experience:</span>
              <span className="text-gray-600">{doctor.experience} years</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium text-gray-700">Consultation Fee:</span>
              <span className="text-gray-600">${doctor.consultationFee}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium text-gray-700">Timing:</span>
              <span className="text-gray-600">{doctor.startTime} - {doctor.endTime}</span>
            </div>
          </div>

          {doctor.description && (
            <div className="mt-4">
              <h4 className="font-medium text-gray-700 mb-2">About:</h4>
              <p className="text-gray-600 text-sm">{doctor.description}</p>
            </div>
          )}

          <div className="mt-4">
            <h4 className="font-medium text-gray-700 mb-2">Available Days:</h4>
            <div className="flex flex-wrap gap-2">
              {doctor.availableDays?.map((day) => (
                <span
                  key={day}
                  className="px-3 py-1 bg-secondary-100 text-secondary-800 text-sm rounded-full"
                >
                  {day}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Booking Form */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Book Appointment</h2>

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}

          {success && (
            <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
              {success}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label htmlFor="appointmentDate" className="block text-gray-700 text-sm font-bold mb-2">
                Appointment Date
              </label>
              <input
                type="date"
                id="appointmentDate"
                name="appointmentDate"
                value={formData.appointmentDate}
                onChange={handleChange}
                min={getMinDate()}
                max={getMaxDate()}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                required
              />
            </div>

            <div className="mb-4">
              <label htmlFor="appointmentTime" className="block text-gray-700 text-sm font-bold mb-2">
                Appointment Time
              </label>
              <select
                id="appointmentTime"
                name="appointmentTime"
                value={formData.appointmentTime}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                required
                disabled={!formData.appointmentDate}
              >
                <option value="">Select Time</option>
                {availableSlots.map((slot) => (
                  <option key={slot} value={slot}>
                    {slot}
                  </option>
                ))}
              </select>
              {!formData.appointmentDate && (
                <p className="text-sm text-gray-500 mt-1">Please select a date first</p>
              )}
            </div>

            <div className="mb-6">
              <label htmlFor="symptoms" className="block text-gray-700 text-sm font-bold mb-2">
                Symptoms / Reason for Visit
              </label>
              <textarea
                id="symptoms"
                name="symptoms"
                value={formData.symptoms}
                onChange={handleChange}
                rows="4"
                placeholder="Please describe your symptoms or reason for the visit..."
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>

            <div className="flex gap-4">
              <button
                type="button"
                onClick={() => navigate('/patient/doctors')}
                className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded-md transition-colors"
              >
                Back
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="flex-1 bg-primary-600 hover:bg-primary-700 text-white font-bold py-2 px-4 rounded-md transition-colors disabled:opacity-50"
              >
                {submitting ? 'Booking...' : 'Book Appointment'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default BookAppointment;
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../utils/api';

const DoctorList = () => {
  const [doctors, setDoctors] = useState([]);
  const [filteredDoctors, setFilteredDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSpecialty, setSelectedSpecialty] = useState('');

  useEffect(() => {
    fetchDoctors();
  }, []);

  useEffect(() => {
    filterDoctors();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [doctors, searchTerm, selectedSpecialty]);

  const fetchDoctors = async () => {
    try {
      const response = await api.get('/patient/doctors');
      setDoctors(response.data);
      setFilteredDoctors(response.data);
    } catch (error) {
      setError('Failed to fetch doctors');
      console.error('Error fetching doctors:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterDoctors = () => {
    let filtered = doctors;

    if (searchTerm) {
      filtered = filtered.filter(doctor =>
        doctor.specialty.toLowerCase().includes(searchTerm.toLowerCase()) ||
        doctor.qualification.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedSpecialty) {
      filtered = filtered.filter(doctor =>
        doctor.specialty.toLowerCase().includes(selectedSpecialty.toLowerCase())
      );
    }

    setFilteredDoctors(filtered);
  };

  const getUniqueSpecialties = () => {
    const specialties = doctors.map(doctor => doctor.specialty);
    return [...new Set(specialties)];
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
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Find Doctors</h1>
        <p className="text-gray-600">Browse and book appointments with our qualified doctors</p>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {/* Search and Filter Section */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-2">
              Search Doctors
            </label>
            <input
              type="text"
              id="search"
              placeholder="Search by specialty or qualification..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>
          <div>
            <label htmlFor="specialty" className="block text-sm font-medium text-gray-700 mb-2">
              Filter by Specialty
            </label>
            <select
              id="specialty"
              value={selectedSpecialty}
              onChange={(e) => setSelectedSpecialty(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="">All Specialties</option>
              {getUniqueSpecialties().map((specialty) => (
                <option key={specialty} value={specialty}>
                  {specialty}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Doctors Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredDoctors.length === 0 ? (
          <div className="col-span-full text-center py-8">
            <div className="text-4xl mb-4">👨‍⚕️</div>
            <p className="text-gray-600 mb-4">No doctors found matching your criteria</p>
            <button
              onClick={() => {
                setSearchTerm('');
                setSelectedSpecialty('');
              }}
              className="bg-primary-600 hover:bg-primary-700 text-white px-6 py-2 rounded-md transition-colors"
            >
              Clear Filters
            </button>
          </div>
        ) : (
          filteredDoctors.map((doctor) => (
            <div key={doctor.id} className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="p-6">
                <div className="flex items-center mb-4">
                  <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center text-2xl">
                    👨‍⚕️
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-semibold text-gray-800">
                      Dr. {doctor.userId}
                    </h3>
                    <p className="text-primary-600 font-medium">{doctor.specialty}</p>
                  </div>
                </div>

                <div className="space-y-2 mb-4">
                  <div className="flex items-center text-sm text-gray-600">
                    <span className="font-medium">Qualification:</span>
                    <span className="ml-2">{doctor.qualification}</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <span className="font-medium">Experience:</span>
                    <span className="ml-2">{doctor.experience} years</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <span className="font-medium">Consultation Fee:</span>
                    <span className="ml-2">${doctor.consultationFee}</span>
                  </div>
                </div>

                {doctor.description && (
                  <p className="text-sm text-gray-600 mb-4 line-clamp-3">
                    {doctor.description}
                  </p>
                )}

                <div className="mb-4">
                  <p className="text-sm font-medium text-gray-700 mb-2">Available Days:</p>
                  <div className="flex flex-wrap gap-1">
                    {doctor.availableDays?.map((day) => (
                      <span
                        key={day}
                        className="px-2 py-1 bg-secondary-100 text-secondary-800 text-xs rounded-full"
                      >
                        {day}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="mb-4">
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">Timing:</span>{' '}
                    {doctor.startTime} - {doctor.endTime}
                  </p>
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">Slot Duration:</span>{' '}
                    {doctor.slotDuration} minutes
                  </p>
                </div>

                <Link
                  to={`/patient/book-appointment/${doctor.id}`}
                  className="w-full bg-primary-600 hover:bg-primary-700 text-white py-2 px-4 rounded-md transition-colors text-center block"
                >
                  Book Appointment
                </Link>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default DoctorList;
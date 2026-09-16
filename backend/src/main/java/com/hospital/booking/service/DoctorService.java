package com.hospital.booking.service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.hospital.booking.model.Doctor;
import com.hospital.booking.repository.DoctorRepository;

@Service
public class DoctorService {

    @Autowired
    private DoctorRepository doctorRepository;

    public Doctor createDoctor(Doctor doctor) {
        doctor.setCreatedAt(LocalDateTime.now());
        doctor.setUpdatedAt(LocalDateTime.now());
        return doctorRepository.save(doctor);
    }

    public List<Doctor> findAllDoctors() {
        return doctorRepository.findAll();
    }

    public Optional<Doctor> findById(String id) {
        return doctorRepository.findById(id);
    }

    public Optional<Doctor> findByUserId(String userId) {
        return doctorRepository.findByUserId(userId);
    }

    public List<Doctor> findBySpecialty(String specialty) {
        return doctorRepository.findBySpecialtyContainingIgnoreCase(specialty);
    }

    public Doctor updateDoctor(Doctor doctor) {
        doctor.setUpdatedAt(LocalDateTime.now());
        return doctorRepository.save(doctor);
    }

    public void deleteDoctor(String id) {
        doctorRepository.deleteById(id);
    }

    public void blockDate(String doctorId, String date) {
        Optional<Doctor> doctorOpt = findById(doctorId);
        if (doctorOpt.isPresent()) {
            Doctor doctor = doctorOpt.get();
            if (!doctor.getBlockedDates().contains(date)) {
                doctor.getBlockedDates().add(date);
                updateDoctor(doctor);
            }
        }
    }

    public void unblockDate(String doctorId, String date) {
        Optional<Doctor> doctorOpt = findById(doctorId);
        if (doctorOpt.isPresent()) {
            Doctor doctor = doctorOpt.get();
            doctor.getBlockedDates().remove(date);
            updateDoctor(doctor);
        }
    }
}
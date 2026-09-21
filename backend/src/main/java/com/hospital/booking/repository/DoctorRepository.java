package com.hospital.booking.repository;

import com.hospital.booking.model.Doctor;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.List;

@Repository
public interface DoctorRepository extends MongoRepository<Doctor, String> {
    Optional<Doctor> findByUserId(String userId);
    List<Doctor> findBySpecialty(String specialty);
    List<Doctor> findBySpecialtyContainingIgnoreCase(String specialty);
}
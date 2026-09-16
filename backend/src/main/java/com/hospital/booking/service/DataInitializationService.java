package com.hospital.booking.service;

import java.time.LocalTime;
import java.util.Arrays;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Service;

import com.hospital.booking.model.Doctor;
import com.hospital.booking.model.Role;
import com.hospital.booking.model.User;

@Service
public class DataInitializationService implements CommandLineRunner {

    private static final Logger logger = LoggerFactory.getLogger(DataInitializationService.class);

    @Autowired
    private UserService userService;

    @Autowired
    private DoctorService doctorService;

    @Override
    public void run(String... args) throws Exception {
        initializeData();
    }

    private void initializeData() {
        try {
            // Create admin user if not exists
            if (!userService.existsByEmail("admin@demo.com")) {
                User admin = new User("Admin", "User", "admin@demo.com", "1234567890", "password123", Role.ADMIN);
                userService.createUser(admin);
                logger.info("Created admin user: admin@demo.com");
            }

            // Create patient user if not exists
            if (!userService.existsByEmail("patient@demo.com")) {
                User patient = new User("John", "Doe", "patient@demo.com", "1234567891", "password123", Role.PATIENT);
                userService.createUser(patient);
                logger.info("Created patient user: patient@demo.com");
            }

            // Create doctor user and profile if not exists
            if (!userService.existsByEmail("doctor@demo.com")) {
                User doctorUser = new User("Dr. Jane", "Smith", "doctor@demo.com", "1234567892", "password123", Role.DOCTOR);
                User savedDoctorUser = userService.createUser(doctorUser);
                
                // Create doctor profile
                Doctor doctor = new Doctor();
                doctor.setUserId(savedDoctorUser.getId());
                doctor.setSpecialty("Cardiology");
                doctor.setQualification("MBBS, MD Cardiology");
                doctor.setExperience(10);
                doctor.setDescription("Experienced cardiologist with 10 years of practice");
                doctor.setConsultationFee(150.0);
                doctor.setAvailableDays(Arrays.asList("MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY"));
                doctor.setStartTime(LocalTime.of(9, 0));
                doctor.setEndTime(LocalTime.of(17, 0));
                doctor.setSlotDuration(30);
                
                doctorService.createDoctor(doctor);
                logger.info("Created doctor user and profile: doctor@demo.com");
            }

            // Create another doctor
            if (!userService.existsByEmail("doctor2@demo.com")) {
                User doctorUser2 = new User("Dr. Michael", "Johnson", "doctor2@demo.com", "1234567893", "password123", Role.DOCTOR);
                User savedDoctorUser2 = userService.createUser(doctorUser2);
                
                Doctor doctor2 = new Doctor();
                doctor2.setUserId(savedDoctorUser2.getId());
                doctor2.setSpecialty("Dermatology");
                doctor2.setQualification("MBBS, MD Dermatology");
                doctor2.setExperience(8);
                doctor2.setDescription("Specialist in skin care and dermatological treatments");
                doctor2.setConsultationFee(120.0);
                doctor2.setAvailableDays(Arrays.asList("MONDAY", "WEDNESDAY", "FRIDAY", "SATURDAY"));
                doctor2.setStartTime(LocalTime.of(10, 0));
                doctor2.setEndTime(LocalTime.of(18, 0));
                doctor2.setSlotDuration(45);
                
                doctorService.createDoctor(doctor2);
                logger.info("Created doctor user and profile: doctor2@demo.com");
            }

            // Create orthopedic doctor
            if (!userService.existsByEmail("doctor3@demo.com")) {
                User doctorUser3 = new User("Dr. Sarah", "Wilson", "doctor3@demo.com", "1234567894", "password123", Role.DOCTOR);
                User savedDoctorUser3 = userService.createUser(doctorUser3);
                
                Doctor doctor3 = new Doctor();
                doctor3.setUserId(savedDoctorUser3.getId());
                doctor3.setSpecialty("Orthopedics");
                doctor3.setQualification("MBBS, MS Orthopedics");
                doctor3.setExperience(12);
                doctor3.setDescription("Expert in bone and joint treatments, sports injuries");
                doctor3.setConsultationFee(180.0);
                doctor3.setAvailableDays(Arrays.asList("TUESDAY", "THURSDAY", "FRIDAY", "SATURDAY"));
                doctor3.setStartTime(LocalTime.of(8, 30));
                doctor3.setEndTime(LocalTime.of(16, 30));
                doctor3.setSlotDuration(30);
                
                doctorService.createDoctor(doctor3);
                logger.info("Created doctor user and profile: doctor3@demo.com");
            }

            logger.info("Data initialization completed successfully");

        } catch (Exception e) {
            logger.error("Error during data initialization", e);
        }
    }
}
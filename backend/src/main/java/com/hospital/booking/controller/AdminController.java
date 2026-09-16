package com.hospital.booking.controller;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.hospital.booking.dto.AddDoctorRequest;
import com.hospital.booking.dto.DoctorRequest;
import com.hospital.booking.dto.MessageResponse;
import com.hospital.booking.model.Appointment;
import com.hospital.booking.model.Doctor;
import com.hospital.booking.model.Role;
import com.hospital.booking.model.User;
import com.hospital.booking.service.AppointmentService;
import com.hospital.booking.service.DoctorService;
import com.hospital.booking.service.UserService;

import jakarta.validation.Valid;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/admin")
public class AdminController {

    @Autowired
    private UserService userService;

    @Autowired
    private DoctorService doctorService;

    @Autowired
    private AppointmentService appointmentService;

    @GetMapping("/users")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<User>> getAllUsers() {
        List<User> users = userService.findAllUsers();
        return ResponseEntity.ok(users);
    }

    @GetMapping("/doctors")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<Doctor>> getAllDoctors() {
        List<Doctor> doctors = doctorService.findAllDoctors();
        return ResponseEntity.ok(doctors);
    }

    @PostMapping("/doctors")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> addDoctor(@Valid @RequestBody AddDoctorRequest request) {
        
        if (userService.existsByEmail(request.getEmail())) {
            return ResponseEntity.badRequest().body(new MessageResponse("Email is already in use!"));
        }

        // Create user account for doctor
        User doctorUser = new User(
            request.getFirstName(),
            request.getLastName(),
            request.getEmail(),
            request.getPhone(),
            request.getPassword(),
            Role.DOCTOR
        );

        User savedUser = userService.createUser(doctorUser);

        // Create doctor profile
        Doctor doctor = new Doctor();
        doctor.setUserId(savedUser.getId());
        doctor.setSpecialty(request.getSpecialty());
        doctor.setQualification(request.getQualification());
        doctor.setExperience(request.getExperience());
        doctor.setDescription(request.getDescription());
        doctor.setConsultationFee(request.getConsultationFee());
        doctor.setAvailableDays(request.getAvailableDays());
        doctor.setStartTime(request.getStartTime());
        doctor.setEndTime(request.getEndTime());
        doctor.setSlotDuration(request.getSlotDuration());

        Doctor savedDoctor = doctorService.createDoctor(doctor);

        return ResponseEntity.ok(savedDoctor);
    }

    @PutMapping("/doctors/{doctorId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> updateDoctor(@PathVariable String doctorId, 
                                        @Valid @RequestBody DoctorRequest doctorRequest) {
        
        Optional<Doctor> doctorOpt = doctorService.findById(doctorId);
        if (doctorOpt.isEmpty()) {
            return ResponseEntity.badRequest().body(new MessageResponse("Doctor not found"));
        }

        Doctor doctor = doctorOpt.get();
        doctor.setSpecialty(doctorRequest.getSpecialty());
        doctor.setQualification(doctorRequest.getQualification());
        doctor.setExperience(doctorRequest.getExperience());
        doctor.setDescription(doctorRequest.getDescription());
        doctor.setConsultationFee(doctorRequest.getConsultationFee());
        doctor.setAvailableDays(doctorRequest.getAvailableDays());
        doctor.setStartTime(doctorRequest.getStartTime());
        doctor.setEndTime(doctorRequest.getEndTime());
        doctor.setSlotDuration(doctorRequest.getSlotDuration());

        Doctor updatedDoctor = doctorService.updateDoctor(doctor);
        return ResponseEntity.ok(updatedDoctor);
    }

    @DeleteMapping("/doctors/{doctorId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> deleteDoctor(@PathVariable String doctorId) {
        Optional<Doctor> doctorOpt = doctorService.findById(doctorId);
        if (doctorOpt.isEmpty()) {
            return ResponseEntity.badRequest().body(new MessageResponse("Doctor not found"));
        }

        Doctor doctor = doctorOpt.get();
        
        // Delete doctor profile
        doctorService.deleteDoctor(doctorId);
        
        // Delete user account
        userService.deleteUser(doctor.getUserId());

        return ResponseEntity.ok(new MessageResponse("Doctor deleted successfully"));
    }

    @GetMapping("/appointments")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<Appointment>> getAllAppointments() {
        List<Appointment> appointments = appointmentService.findAllAppointments();
        return ResponseEntity.ok(appointments);
    }

    @DeleteMapping("/appointments/{appointmentId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> deleteAppointment(@PathVariable String appointmentId) {
        Optional<Appointment> appointmentOpt = appointmentService.findById(appointmentId);
        if (appointmentOpt.isEmpty()) {
            return ResponseEntity.badRequest().body(new MessageResponse("Appointment not found"));
        }

        appointmentService.deleteAppointment(appointmentId);
        return ResponseEntity.ok(new MessageResponse("Appointment deleted successfully"));
    }

    @DeleteMapping("/users/{userId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> deleteUser(@PathVariable String userId) {
        Optional<User> userOpt = userService.findById(userId);
        if (userOpt.isEmpty()) {
            return ResponseEntity.badRequest().body(new MessageResponse("User not found"));
        }

        userService.deleteUser(userId);
        return ResponseEntity.ok(new MessageResponse("User deleted successfully"));
    }
}
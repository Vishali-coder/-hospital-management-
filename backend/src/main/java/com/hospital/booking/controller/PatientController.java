package com.hospital.booking.controller;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.hospital.booking.dto.AppointmentRequest;
import com.hospital.booking.dto.MessageResponse;
import com.hospital.booking.model.Appointment;
import com.hospital.booking.model.AppointmentStatus;
import com.hospital.booking.model.Doctor;
import com.hospital.booking.model.User;
import com.hospital.booking.security.UserPrincipal;
import com.hospital.booking.service.AppointmentService;
import com.hospital.booking.service.DoctorService;
import com.hospital.booking.service.EmailService;
import com.hospital.booking.service.UserService;

import jakarta.validation.Valid;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/patient")
public class PatientController {

    @Autowired
    private DoctorService doctorService;

    @Autowired
    private AppointmentService appointmentService;

    @Autowired
    private UserService userService;

    @Autowired
    private EmailService emailService;

    @GetMapping("/doctors")
    @PreAuthorize("hasRole('PATIENT')")
    public ResponseEntity<List<Doctor>> getAllDoctors() {
        List<Doctor> doctors = doctorService.findAllDoctors();
        return ResponseEntity.ok(doctors);
    }

    @GetMapping("/doctors/specialty")
    @PreAuthorize("hasRole('PATIENT')")
    public ResponseEntity<List<Doctor>> getDoctorsBySpecialty(@RequestParam String specialty) {
        List<Doctor> doctors = doctorService.findBySpecialty(specialty);
        return ResponseEntity.ok(doctors);
    }

    @GetMapping("/doctors/{doctorId}/availability")
    @PreAuthorize("hasRole('PATIENT')")
    public ResponseEntity<?> getDoctorAvailability(
            @PathVariable String doctorId,
            @RequestParam String date) {
        
        Optional<Doctor> doctorOpt = doctorService.findById(doctorId);
        if (doctorOpt.isEmpty()) {
            return ResponseEntity.badRequest().body(new MessageResponse("Doctor not found"));
        }

        Doctor doctor = doctorOpt.get();
        
        // Check if date is blocked
        if (doctor.getBlockedDates().contains(date)) {
            return ResponseEntity.ok(List.of()); // Return empty list for blocked dates
        }

        // This is a simplified version - you would implement proper slot generation logic
        return ResponseEntity.ok(doctor);
    }

    @PostMapping("/appointments")
    @PreAuthorize("hasRole('PATIENT')")
    public ResponseEntity<?> bookAppointment(
            @Valid @RequestBody AppointmentRequest appointmentRequest,
            Authentication authentication) {
        
        UserPrincipal userPrincipal = (UserPrincipal) authentication.getPrincipal();
        
        // Check if slot is available
        if (!appointmentService.isSlotAvailable(
                appointmentRequest.getDoctorId(),
                appointmentRequest.getAppointmentDate(),
                appointmentRequest.getAppointmentTime())) {
            return ResponseEntity.badRequest().body(new MessageResponse("Time slot is not available"));
        }

        // Check if doctor exists
        Optional<Doctor> doctorOpt = doctorService.findById(appointmentRequest.getDoctorId());
        if (doctorOpt.isEmpty()) {
            return ResponseEntity.badRequest().body(new MessageResponse("Doctor not found"));
        }

        // Create appointment
        Appointment appointment = new Appointment(
                userPrincipal.getId(),
                appointmentRequest.getDoctorId(),
                appointmentRequest.getAppointmentDate(),
                appointmentRequest.getAppointmentTime(),
                appointmentRequest.getSymptoms()
        );

        Appointment savedAppointment = appointmentService.createAppointment(appointment);

        // Send confirmation email
        Optional<User> patientOpt = userService.findById(userPrincipal.getId());
        Optional<User> doctorUserOpt = userService.findById(doctorOpt.get().getUserId());
        
        if (patientOpt.isPresent() && doctorUserOpt.isPresent()) {
            emailService.sendAppointmentConfirmation(
                patientOpt.get().getEmail(),
                patientOpt.get().getFullName(),
                doctorUserOpt.get().getFullName(),
                appointment.getAppointmentDate().toString(),
                appointment.getAppointmentTime().toString()
            );
        }

        return ResponseEntity.ok(savedAppointment);
    }

    @GetMapping("/appointments")
    @PreAuthorize("hasRole('PATIENT')")
    public ResponseEntity<List<Appointment>> getPatientAppointments(Authentication authentication) {
        UserPrincipal userPrincipal = (UserPrincipal) authentication.getPrincipal();
        List<Appointment> appointments = appointmentService.findByPatientId(userPrincipal.getId());
        return ResponseEntity.ok(appointments);
    }

    @DeleteMapping("/appointments/{appointmentId}")
    @PreAuthorize("hasRole('PATIENT')")
    public ResponseEntity<?> cancelAppointment(
            @PathVariable String appointmentId,
            Authentication authentication) {
        
        UserPrincipal userPrincipal = (UserPrincipal) authentication.getPrincipal();
        
        Optional<Appointment> appointmentOpt = appointmentService.findById(appointmentId);
        if (appointmentOpt.isEmpty()) {
            return ResponseEntity.badRequest().body(new MessageResponse("Appointment not found"));
        }

        Appointment appointment = appointmentOpt.get();
        if (!appointment.getPatientId().equals(userPrincipal.getId())) {
            return ResponseEntity.badRequest().body(new MessageResponse("Unauthorized to cancel this appointment"));
        }

        // Update status to cancelled instead of deleting
        appointmentService.updateAppointmentStatus(appointmentId, AppointmentStatus.CANCELLED);

        // Send cancellation email
        Optional<Doctor> doctorOpt = doctorService.findById(appointment.getDoctorId());
        Optional<User> doctorUserOpt = doctorOpt.isPresent() ? 
            userService.findById(doctorOpt.get().getUserId()) : Optional.empty();
        
        if (doctorUserOpt.isPresent()) {
            emailService.sendAppointmentCancellation(
                userPrincipal.getEmail(),
                userPrincipal.getFirstName() + " " + userPrincipal.getLastName(),
                doctorUserOpt.get().getFullName(),
                appointment.getAppointmentDate().toString(),
                appointment.getAppointmentTime().toString()
            );
        }

        return ResponseEntity.ok(new MessageResponse("Appointment cancelled successfully"));
    }
}
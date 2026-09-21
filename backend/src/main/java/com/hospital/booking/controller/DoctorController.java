package com.hospital.booking.controller;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

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

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/doctor")
public class DoctorController {

    @Autowired
    private DoctorService doctorService;

    @Autowired
    private AppointmentService appointmentService;

    @Autowired
    private UserService userService;

    @Autowired
    private EmailService emailService;

    @GetMapping("/appointments")
    @PreAuthorize("hasRole('DOCTOR')")
    public ResponseEntity<?> getDoctorAppointments(Authentication authentication) {
        UserPrincipal userPrincipal = (UserPrincipal) authentication.getPrincipal();
        Optional<Doctor> doctorOpt = doctorService.findByUserId(userPrincipal.getId());
        
        if (doctorOpt.isEmpty()) {
            return ResponseEntity.badRequest().body(new MessageResponse("Doctor profile not found"));
        }

        List<Appointment> appointments = appointmentService.findByDoctorId(doctorOpt.get().getId());
        return ResponseEntity.ok(appointments);
    }

    @PutMapping("/appointments/{appointmentId}/status")
    @PreAuthorize("hasRole('DOCTOR')")
    public ResponseEntity<?> updateAppointmentStatus(
            @PathVariable String appointmentId,
            @RequestParam AppointmentStatus status,
            Authentication authentication) {
        
        UserPrincipal userPrincipal = (UserPrincipal) authentication.getPrincipal();
        Optional<Doctor> doctorOpt = doctorService.findByUserId(userPrincipal.getId());
        
        if (doctorOpt.isEmpty()) {
            return ResponseEntity.badRequest().body(new MessageResponse("Doctor profile not found"));
        }

        Optional<Appointment> appointmentOpt = appointmentService.findById(appointmentId);
        if (appointmentOpt.isEmpty()) {
            return ResponseEntity.badRequest().body(new MessageResponse("Appointment not found"));
        }

        Appointment appointment = appointmentOpt.get();
        if (!appointment.getDoctorId().equals(doctorOpt.get().getId())) {
            return ResponseEntity.badRequest().body(new MessageResponse("Unauthorized to update this appointment"));
        }

        Appointment updatedAppointment = appointmentService.updateAppointmentStatus(appointmentId, status);
        
        // Send email notification if cancelled
        if (status == AppointmentStatus.CANCELLED) {
            Optional<User> patientOpt = userService.findById(appointment.getPatientId());
            Optional<User> doctorUserOpt = userService.findById(doctorOpt.get().getUserId());
            
            if (patientOpt.isPresent() && doctorUserOpt.isPresent()) {
                emailService.sendAppointmentCancellation(
                    patientOpt.get().getEmail(),
                    patientOpt.get().getFullName(),
                    doctorUserOpt.get().getFullName(),
                    appointment.getAppointmentDate().toString(),
                    appointment.getAppointmentTime().toString()
                );
            }
        }

        return ResponseEntity.ok(updatedAppointment);
    }

    @PostMapping("/availability/block")
    @PreAuthorize("hasRole('DOCTOR')")
    public ResponseEntity<?> blockDate(
            @RequestParam String date,
            Authentication authentication) {
        
        UserPrincipal userPrincipal = (UserPrincipal) authentication.getPrincipal();
        Optional<Doctor> doctorOpt = doctorService.findByUserId(userPrincipal.getId());
        
        if (doctorOpt.isEmpty()) {
            return ResponseEntity.badRequest().body(new MessageResponse("Doctor profile not found"));
        }

        doctorService.blockDate(doctorOpt.get().getId(), date);
        return ResponseEntity.ok(new MessageResponse("Date blocked successfully"));
    }

    @PostMapping("/availability/unblock")
    @PreAuthorize("hasRole('DOCTOR')")
    public ResponseEntity<?> unblockDate(
            @RequestParam String date,
            Authentication authentication) {
        
        UserPrincipal userPrincipal = (UserPrincipal) authentication.getPrincipal();
        Optional<Doctor> doctorOpt = doctorService.findByUserId(userPrincipal.getId());
        
        if (doctorOpt.isEmpty()) {
            return ResponseEntity.badRequest().body(new MessageResponse("Doctor profile not found"));
        }

        doctorService.unblockDate(doctorOpt.get().getId(), date);
        return ResponseEntity.ok(new MessageResponse("Date unblocked successfully"));
    }

    @GetMapping("/profile")
    @PreAuthorize("hasRole('DOCTOR')")
    public ResponseEntity<?> getDoctorProfile(Authentication authentication) {
        UserPrincipal userPrincipal = (UserPrincipal) authentication.getPrincipal();
        Optional<Doctor> doctorOpt = doctorService.findByUserId(userPrincipal.getId());
        
        if (doctorOpt.isEmpty()) {
            return ResponseEntity.badRequest().body(new MessageResponse("Doctor profile not found"));
        }

        return ResponseEntity.ok(doctorOpt.get());
    }
}
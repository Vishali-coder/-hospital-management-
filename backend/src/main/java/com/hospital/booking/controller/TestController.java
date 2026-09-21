package com.hospital.booking.controller;

import java.util.HashMap;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.hospital.booking.service.AppointmentService;
import com.hospital.booking.service.DoctorService;
import com.hospital.booking.service.UserService;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/test")
public class TestController {

    @GetMapping("/ping")
    public ResponseEntity<?> ping() {
        Map<String, Object> response = new HashMap<>();
        response.put("message", "pong");
        response.put("timestamp", System.currentTimeMillis());
        response.put("status", "Server is running");
        return ResponseEntity.ok(response);
    }

    @Autowired
    private UserService userService;

    @Autowired
    private DoctorService doctorService;

    @Autowired
    private AppointmentService appointmentService;

    @GetMapping("/health")
    public ResponseEntity<?> healthCheck() {
        Map<String, Object> response = new HashMap<>();
        response.put("status", "OK");
        response.put("message", "Hospital Booking System is running");
        response.put("timestamp", System.currentTimeMillis());
        
        try {
            response.put("totalUsers", userService.findAllUsers().size());
            response.put("totalDoctors", doctorService.findAllDoctors().size());
            response.put("totalAppointments", appointmentService.findAllAppointments().size());
        } catch (Exception e) {
            response.put("databaseStatus", "Error: " + e.getMessage());
        }
        
        return ResponseEntity.ok(response);
    }

    @GetMapping("/demo-accounts")
    public ResponseEntity<?> getDemoAccounts() {
        Map<String, Object> response = new HashMap<>();
        response.put("message", "Demo accounts for testing");
        
        Map<String, String> accounts = new HashMap<>();
        accounts.put("admin", "admin@demo.com / password123");
        accounts.put("patient", "patient@demo.com / password123");
        accounts.put("doctor1", "doctor@demo.com / password123");
        accounts.put("doctor2", "doctor2@demo.com / password123");
        accounts.put("doctor3", "doctor3@demo.com / password123");
        
        response.put("accounts", accounts);
        return ResponseEntity.ok(response);
    }
}
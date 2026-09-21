package com.hospital.booking.controller;

import java.util.HashMap;
import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/")
public class RootController {

    @GetMapping
    public ResponseEntity<?> root() {
        Map<String, Object> response = new HashMap<>();
        response.put("message", "Hospital Booking System API");
        response.put("version", "1.0.0");
        response.put("status", "running");
        response.put("endpoints", Map.of(
            "health", "/test/health",
            "ping", "/test/ping",
            "auth", "/auth/signin, /auth/signup",
            "demo", "/test/demo-accounts"
        ));
        return ResponseEntity.ok(response);
    }

    @GetMapping("/api")
    public ResponseEntity<?> api() {
        return root(); // Same response for /api path
    }
}
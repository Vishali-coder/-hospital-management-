package com.hospital.booking;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class HospitalBookingSystemApplication {

    public static void main(String[] args) {
        SpringApplication.run(HospitalBookingSystemApplication.class, args);
    }
}
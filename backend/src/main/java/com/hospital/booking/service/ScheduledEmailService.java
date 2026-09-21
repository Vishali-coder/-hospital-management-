package com.hospital.booking.service;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import com.hospital.booking.model.Appointment;
import com.hospital.booking.model.AppointmentStatus;
import com.hospital.booking.model.Doctor;
import com.hospital.booking.model.User;

@Service
public class ScheduledEmailService {

    private static final Logger logger = LoggerFactory.getLogger(ScheduledEmailService.class);

    @Autowired
    private AppointmentService appointmentService;

    @Autowired
    private UserService userService;

    @Autowired
    private DoctorService doctorService;

    @Autowired
    private EmailService emailService;

    // Run every day at 9:00 AM
    @Scheduled(cron = "0 0 9 * * ?")
    public void sendAppointmentReminders() {
        logger.info("Starting appointment reminder job");

        LocalDate tomorrow = LocalDate.now().plusDays(1);
        List<Appointment> appointments = appointmentService.findByStatus(AppointmentStatus.SCHEDULED);

        for (Appointment appointment : appointments) {
            if (appointment.getAppointmentDate().equals(tomorrow)) {
                sendReminderEmail(appointment);
            }
        }

        logger.info("Appointment reminder job completed");
    }

    private void sendReminderEmail(Appointment appointment) {
        try {
            Optional<User> patientOpt = userService.findById(appointment.getPatientId());
            Optional<Doctor> doctorOpt = doctorService.findById(appointment.getDoctorId());
            
            if (patientOpt.isPresent() && doctorOpt.isPresent()) {
                Optional<User> doctorUserOpt = userService.findById(doctorOpt.get().getUserId());
                
                if (doctorUserOpt.isPresent()) {
                    emailService.sendAppointmentReminder(
                        patientOpt.get().getEmail(),
                        patientOpt.get().getFullName(),
                        doctorUserOpt.get().getFullName(),
                        appointment.getAppointmentDate().toString(),
                        appointment.getAppointmentTime().toString()
                    );
                    
                    logger.info("Reminder email sent for appointment: {}", appointment.getId());
                }
            }
        } catch (Exception e) {
            logger.error("Failed to send reminder email for appointment: {}", appointment.getId(), e);
        }
    }
}
package com.hospital.booking.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    private static final Logger logger = LoggerFactory.getLogger(EmailService.class);

    @Autowired(required = false)
    private JavaMailSender mailSender;

    public void sendAppointmentConfirmation(String to, String patientName, String doctorName,String appointmentDate, String appointmentTime) {
        if (mailSender == null) {
            logger.warn("Email service not configured. Skipping appointment confirmation email to: {}", to);
            return;
        }
        
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setTo(to);
            message.setSubject("Appointment Confirmation - Hospital Booking System");
            message.setText(String.format("""
                Dear %s,

                Your appointment has been confirmed with the following details:

                Doctor: %s
                Date: %s
                Time: %s

                Please arrive 15 minutes before your scheduled appointment time.

                Thank you for choosing our hospital.

                Best regards,
                Hospital Management System""",
                patientName, doctorName, appointmentDate, appointmentTime
            ));

            mailSender.send(message);
            logger.info("Appointment confirmation email sent to: {}", to);
        } catch (Exception e) {
            logger.error("Failed to send appointment confirmation email to: {}", to, e);
        }
    }

    public void sendAppointmentReminder(String to, String patientName, String doctorName,String appointmentDate, String appointmentTime) {
        if (mailSender == null) {
            logger.warn("Email service not configured. Skipping appointment reminder email to: {}", to);
            return;
        }
        
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setTo(to);
            message.setSubject("Appointment Reminder - Hospital Booking System");
            message.setText(String.format("""
                Dear %s,

                This is a reminder for your upcoming appointment:

                Doctor: %s
                Date: %s
                Time: %s

                Please arrive 15 minutes before your scheduled appointment time.

                If you need to reschedule or cancel, please contact us as soon as possible.

                Thank you,
                Hospital Management System""",
                patientName, doctorName, appointmentDate, appointmentTime
            ));

            mailSender.send(message);
            logger.info("Appointment reminder email sent to: {}", to);
        } catch (Exception e) {
            logger.error("Failed to send appointment reminder email to: {}", to, e);
        }
    }

    public void sendAppointmentCancellation(String to, String patientName, String doctorName, String appointmentDate, String appointmentTime) {
        if (mailSender == null) {
            logger.warn("Email service not configured. Skipping appointment cancellation email to: {}", to);
            return;
        }
        
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setTo(to);
            message.setSubject("Appointment Cancelled - Hospital Booking System");
            message.setText(String.format("""
                Dear %s,

                Your appointment has been cancelled:

                Doctor: %s
                Date: %s
                Time: %s

                If you would like to reschedule, please book a new appointment through our system.

                Thank you,
                Hospital Management System""",
                patientName, doctorName, appointmentDate, appointmentTime
            ));

            mailSender.send(message);
            logger.info("Appointment cancellation email sent to: {}", to);
        } catch (Exception e) {
            logger.error("Failed to send appointment cancellation email to: {}", to, e);
        }
    }
}
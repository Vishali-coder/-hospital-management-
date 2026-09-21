package com.hospital.booking.repository;

import com.hospital.booking.model.Appointment;
import com.hospital.booking.model.AppointmentStatus;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface AppointmentRepository extends MongoRepository<Appointment, String> {
    List<Appointment> findByPatientId(String patientId);
    List<Appointment> findByDoctorId(String doctorId);
    List<Appointment> findByDoctorIdAndAppointmentDate(String doctorId, LocalDate appointmentDate);
    List<Appointment> findByDoctorIdAndAppointmentDateAndAppointmentTime(String doctorId, LocalDate appointmentDate, LocalTime appointmentTime);
    List<Appointment> findByStatus(AppointmentStatus status);
    List<Appointment> findByPatientIdAndStatus(String patientId, AppointmentStatus status);
    List<Appointment> findByDoctorIdAndStatus(String doctorId, AppointmentStatus status);
    Optional<Appointment> findByDoctorIdAndAppointmentDateAndAppointmentTimeAndStatus(String doctorId, LocalDate appointmentDate, LocalTime appointmentTime, AppointmentStatus status);
}
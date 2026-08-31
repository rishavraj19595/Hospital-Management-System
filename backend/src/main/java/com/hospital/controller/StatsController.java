package com.hospital.controller;

import com.hospital.repository.AppointmentRepository;
import com.hospital.repository.ContactQueryRepository;
import com.hospital.repository.DoctorRepository;
import com.hospital.repository.PatientRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/stats")
public class StatsController {

    @Autowired
    private DoctorRepository doctorRepository;

    @Autowired
    private PatientRepository patientRepository;

    @Autowired
    private AppointmentRepository appointmentRepository;

    @Autowired
    private ContactQueryRepository contactQueryRepository;

    // Get system metrics dashboard statistics
    @GetMapping("/overview")
    public ResponseEntity<?> getStatsOverview() {
        long doctors = doctorRepository.count();
        long patients = patientRepository.count();
        long appointments = appointmentRepository.count();
        long queries = contactQueryRepository.count();

        return ResponseEntity.ok(Map.of(
            "doctors", doctors,
            "patients", patients,
            "appointments", appointments,
            "queries", queries
        ));
    }
}

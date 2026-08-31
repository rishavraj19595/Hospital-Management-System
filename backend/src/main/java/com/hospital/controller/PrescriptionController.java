package com.hospital.controller;

import com.hospital.model.Appointment;
import com.hospital.model.Prescription;
import com.hospital.repository.AppointmentRepository;
import com.hospital.repository.PrescriptionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/prescriptions")
public class PrescriptionController {

    @Autowired
    private PrescriptionRepository prescriptionRepository;

    @Autowired
    private AppointmentRepository appointmentRepository;

    // Create / write prescription
    @PostMapping("/create")
    public ResponseEntity<?> createPrescription(@RequestBody Prescription prescription) {
        // Retrieve corresponding appointment to get date/time details
        Optional<Appointment> appOpt = appointmentRepository.findById(prescription.getAppointmentId());
        if (appOpt.isPresent()) {
            Appointment app = appOpt.get();

            // Validate that we are not prescribing before the appointment date
            try {
                java.time.LocalDate appDate = java.time.LocalDate.parse(app.getAppdate());
                java.time.LocalDate today = java.time.LocalDate.now(java.time.ZoneId.systemDefault());
                if (today.isBefore(appDate)) {
                    return ResponseEntity.badRequest().body(java.util.Map.of("message", 
                        "Cannot write prescription before the appointment date (" + app.getAppdate() + ")."));
                }
            } catch (Exception e) {
                // Ignore parsing errors or fallback
            }

            prescription.setAppdate(app.getAppdate());
            prescription.setApptime(app.getApptime());
            
            // Mark appointment as Completed (Status = 2)
            app.setUserStatus(2);
            app.setDoctorStatus(2);
            appointmentRepository.save(app);
        }

        Prescription saved = prescriptionRepository.save(prescription);
        return ResponseEntity.ok(saved);
    }

    // Get prescriptions by patient ID
    @GetMapping("/patient/{pid}")
    public ResponseEntity<List<Prescription>> getPatientPrescriptions(@PathVariable String pid) {
        return ResponseEntity.ok(prescriptionRepository.findByPid(pid));
    }

    // Get prescriptions written by doctor name
    @GetMapping("/doctor/{doctor}")
    public ResponseEntity<List<Prescription>> getDoctorPrescriptions(@PathVariable String doctor) {
        return ResponseEntity.ok(prescriptionRepository.findByDoctor(doctor));
    }
}

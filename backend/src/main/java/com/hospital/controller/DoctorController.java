package com.hospital.controller;

import com.hospital.model.Doctor;
import com.hospital.repository.DoctorRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/doctors")
public class DoctorController {

    @Autowired
    private DoctorRepository doctorRepository;

    // List all doctors
    @GetMapping("/all")
    public ResponseEntity<List<Doctor>> getAllDoctors() {
        return ResponseEntity.ok(doctorRepository.findAll());
    }

    // Add a doctor
    @PostMapping("/add")
    public ResponseEntity<?> addDoctor(@RequestBody Doctor doctor) {
        if (doctorRepository.findByUsername(doctor.getUsername()).isPresent()) {
            return ResponseEntity.badRequest().body("Doctor name already exists.");
        }
        if (doctorRepository.findByEmail(doctor.getEmail()).isPresent()) {
            return ResponseEntity.badRequest().body("Doctor email already exists.");
        }
        if (doctor.getStartTime() == null || doctor.getStartTime().trim().isEmpty()) {
            doctor.setStartTime("09:00");
        }
        if (doctor.getEndTime() == null || doctor.getEndTime().trim().isEmpty()) {
            doctor.setEndTime("16:45");
        }
        Doctor saved = doctorRepository.save(doctor);
        return ResponseEntity.ok(saved);
    }

    // Update a doctor (including time slots / shift)
    @PutMapping("/update/{id}")
    public ResponseEntity<?> updateDoctor(@PathVariable String id, @RequestBody Doctor doctorDetails) {
        Optional<Doctor> doctorOpt = doctorRepository.findById(id);
        if (!doctorOpt.isPresent()) {
            return ResponseEntity.notFound().build();
        }

        Doctor doctor = doctorOpt.get();

        // Check name uniqueness if updated
        if (doctorDetails.getUsername() != null && !doctorDetails.getUsername().trim().isEmpty() && !doctorDetails.getUsername().equals(doctor.getUsername())) {
            Optional<Doctor> existingName = doctorRepository.findByUsername(doctorDetails.getUsername());
            if (existingName.isPresent()) {
                return ResponseEntity.badRequest().body("Doctor name already exists.");
            }
            doctor.setUsername(doctorDetails.getUsername().trim());
        }

        // Check email uniqueness if updated
        if (doctorDetails.getEmail() != null && !doctorDetails.getEmail().trim().isEmpty() && !doctorDetails.getEmail().equals(doctor.getEmail())) {
            Optional<Doctor> existingEmail = doctorRepository.findByEmail(doctorDetails.getEmail());
            if (existingEmail.isPresent()) {
                return ResponseEntity.badRequest().body("Doctor email already exists.");
            }
            doctor.setEmail(doctorDetails.getEmail().trim());
        }

        if (doctorDetails.getSpec() != null && !doctorDetails.getSpec().trim().isEmpty()) {
            doctor.setSpec(doctorDetails.getSpec().trim());
        }

        if (doctorDetails.getDocFees() > 0) {
            doctor.setDocFees(doctorDetails.getDocFees());
        }

        if (doctorDetails.getStartTime() != null && !doctorDetails.getStartTime().trim().isEmpty()) {
            doctor.setStartTime(doctorDetails.getStartTime().trim());
        }

        if (doctorDetails.getEndTime() != null && !doctorDetails.getEndTime().trim().isEmpty()) {
            doctor.setEndTime(doctorDetails.getEndTime().trim());
        }

        if (doctorDetails.getPassword() != null && !doctorDetails.getPassword().trim().isEmpty()) {
            doctor.setPassword(doctorDetails.getPassword());
        }

        Doctor updated = doctorRepository.save(doctor);
        return ResponseEntity.ok(updated);
    }

    // Delete a doctor
    @DeleteMapping("/delete/{id}")
    public ResponseEntity<?> deleteDoctor(@PathVariable String id) {
        Optional<Doctor> doctorOpt = doctorRepository.findById(id);
        if (doctorOpt.isPresent()) {
            doctorRepository.deleteById(id);
            return ResponseEntity.ok().build();
        }
        return ResponseEntity.notFound().build();
    }
}

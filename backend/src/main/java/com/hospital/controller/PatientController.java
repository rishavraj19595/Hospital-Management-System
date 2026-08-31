package com.hospital.controller;

import com.hospital.model.Patient;
import com.hospital.repository.PatientRepository;
import com.hospital.service.PatientSearcher;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/patients")
public class PatientController {

    @Autowired
    private PatientRepository patientRepository;

    // List all patients
    @GetMapping("/all")
    public ResponseEntity<List<Patient>> getAllPatients() {
        return ResponseEntity.ok(patientRepository.findAll());
    }

    // Search patient by contact number (Uses custom Binary Search DSA)
    @GetMapping("/search")
    public ResponseEntity<?> searchPatientByContact(@RequestParam String contact) {
        List<Patient> allPatients = patientRepository.findAll();
        Patient result = PatientSearcher.searchByContact(allPatients, contact);
        if (result != null) {
            return ResponseEntity.ok(result);
        }
        return ResponseEntity.notFound().build();
    }
}

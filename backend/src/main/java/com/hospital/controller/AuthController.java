package com.hospital.controller;

import com.hospital.model.Patient;
import com.hospital.model.Doctor;
import com.hospital.repository.PatientRepository;
import com.hospital.repository.DoctorRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private PatientRepository patientRepository;

    @Autowired
    private DoctorRepository doctorRepository;

    // PATIENT REGISTER
    @PostMapping("/patient/register")
    public ResponseEntity<?> registerPatient(@RequestBody Patient patient) {
        if (patientRepository.findByEmail(patient.getEmail()).isPresent()) {
            return ResponseEntity.badRequest().body(Map.of("message", "Email is already registered."));
        }
        if (patientRepository.findByContact(patient.getContact()).isPresent()) {
            return ResponseEntity.badRequest().body(Map.of("message", "Phone number is already registered."));
        }
        Patient saved = patientRepository.save(patient);
        return ResponseEntity.ok(saved);
    }

    // PATIENT LOGIN
    @PostMapping("/patient/login")
    public ResponseEntity<?> loginPatient(@RequestBody Map<String, String> credentials) {
        String email = credentials.get("email");
        String password = credentials.get("password");

        Optional<Patient> patientOpt = patientRepository.findByEmail(email);
        if (patientOpt.isPresent() && patientOpt.get().getPassword().equals(password)) {
            return ResponseEntity.ok(patientOpt.get());
        }
        return ResponseEntity.status(401).body(Map.of("message", "Invalid email or password"));
    }

    // DOCTOR LOGIN
    @PostMapping("/doctor/login")
    public ResponseEntity<?> loginDoctor(@RequestBody Map<String, String> credentials) {
        String username = credentials.get("username");
        String password = credentials.get("password");

        Optional<Doctor> doctorOpt = doctorRepository.findByUsername(username);
        if (doctorOpt.isPresent() && doctorOpt.get().getPassword().equals(password)) {
            return ResponseEntity.ok(doctorOpt.get());
        }
        return ResponseEntity.status(401).body(Map.of("message", "Invalid username or password"));
    }

    // RECEPTIONIST (ADMIN) LOGIN
    @PostMapping("/receptionist/login")
    public ResponseEntity<?> loginReceptionist(@RequestBody Map<String, String> credentials) {
        String username = credentials.get("username");
        String password = credentials.get("password");

        if ("admin".equals(username) && "admin123".equals(password)) {
            return ResponseEntity.ok(Map.of("role", "receptionist", "username", "admin"));
        }
        return ResponseEntity.status(401).body(Map.of("message", "Invalid receptionist credentials"));
    }
}

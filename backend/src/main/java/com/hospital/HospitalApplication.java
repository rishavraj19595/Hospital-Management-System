package com.hospital;

import com.hospital.model.Doctor;
import com.hospital.model.Patient;
import com.hospital.repository.DoctorRepository;
import com.hospital.repository.PatientRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;

@SpringBootApplication
public class HospitalApplication {

    public static void main(String[] args) {
        SpringApplication.run(HospitalApplication.class, args);
    }

    /**
     * Database Seeder: Seeds default doctors and patient if database collection is empty.
     * Matches default credentials from original schema.
     */
    @Bean
    public CommandLineRunner initDatabase(DoctorRepository doctorRepository, PatientRepository patientRepository) {
        return args -> {
            if (doctorRepository.count() == 0) {
                System.out.println("Seeding default doctor accounts with 24-hour shift coverage to MongoDB...");
                // General Specialization (1 Day, 1 Night = 24h coverage)
                doctorRepository.save(new Doctor("ashok", "ashok123", "ashok@gmail.com", "General", 500, "09:00", "16:45"));
                doctorRepository.save(new Doctor("Dinesh", "dinesh123", "dinesh@gmail.com", "General", 700, "17:00", "08:45"));

                // Cardiologist Specialization (1 Day, 1 Night = 24h coverage)
                doctorRepository.save(new Doctor("arun", "arun123", "arun@gmail.com", "Cardiologist", 600, "09:00", "16:45"));
                doctorRepository.save(new Doctor("Amit", "amit123", "amit@gmail.com", "Cardiologist", 1000, "17:00", "08:45"));

                // Pediatrician Specialization (2 Day, 1 Night till next morning)
                doctorRepository.save(new Doctor("Ganesh", "ganesh123", "ganesh@gmail.com", "Pediatrician", 550, "09:00", "16:45"));
                doctorRepository.save(new Doctor("Kumar", "kumar123", "kumar@gmail.com", "Pediatrician", 800, "09:00", "16:45"));
                doctorRepository.save(new Doctor("Tiwary", "tiwary123", "tiwary@gmail.com", "Pediatrician", 450, "17:00", "08:45"));

                // Neurologist Specialization
                doctorRepository.save(new Doctor("Abbis", "abbis123", "abbis@gmail.com", "Neurologist", 1500, "09:00", "16:45"));
                System.out.println("Doctor seeding complete!");
            } else {
                // Ensure existing database doctor entries have their updated shifts
                doctorRepository.findByUsername("ashok").ifPresent(d -> {
                    d.setStartTime("09:00");
                    d.setEndTime("16:45");
                    doctorRepository.save(d);
                });
                doctorRepository.findByUsername("Dinesh").ifPresent(d -> {
                    d.setStartTime("17:00");
                    d.setEndTime("08:45");
                    doctorRepository.save(d);
                });
                doctorRepository.findByUsername("arun").ifPresent(d -> {
                    d.setStartTime("09:00");
                    d.setEndTime("16:45");
                    doctorRepository.save(d);
                });
                doctorRepository.findByUsername("Amit").ifPresent(d -> {
                    d.setStartTime("17:00");
                    d.setEndTime("08:45");
                    doctorRepository.save(d);
                });
                doctorRepository.findByUsername("Ganesh").ifPresent(d -> {
                    d.setStartTime("09:00");
                    d.setEndTime("16:45");
                    doctorRepository.save(d);
                });
                doctorRepository.findByUsername("Kumar").ifPresent(d -> {
                    d.setStartTime("09:00");
                    d.setEndTime("16:45");
                    doctorRepository.save(d);
                });
                doctorRepository.findByUsername("Tiwary").ifPresent(d -> {
                    d.setStartTime("17:00");
                    d.setEndTime("08:45");
                    doctorRepository.save(d);
                });
            }

            if (patientRepository.count() == 0) {
                System.out.println("Seeding default patient account (Rishav Raj) to MongoDB...");
                patientRepository.save(new Patient("Rishav", "Raj", "Male", "rishavraj19595@gmail.com", "8340124017", "rishav1"));
                System.out.println("Patient seeding complete!");
            }
        };
    }
}


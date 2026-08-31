package com.hospital.repository;

import com.hospital.model.Doctor;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.Optional;

public interface DoctorRepository extends MongoRepository<Doctor, String> {
    Optional<Doctor> findByUsername(String username);
    Optional<Doctor> findByEmail(String email);
}

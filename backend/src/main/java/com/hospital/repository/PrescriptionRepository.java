package com.hospital.repository;

import com.hospital.model.Prescription;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.List;

public interface PrescriptionRepository extends MongoRepository<Prescription, String> {
    List<Prescription> findByPid(String pid);
    List<Prescription> findByDoctor(String doctor);
}

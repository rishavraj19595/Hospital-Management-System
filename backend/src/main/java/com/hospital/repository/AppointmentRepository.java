package com.hospital.repository;

import com.hospital.model.Appointment;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.List;

public interface AppointmentRepository extends MongoRepository<Appointment, String> {
    List<Appointment> findByPid(String pid);
    List<Appointment> findByDoctor(String doctor);
    List<Appointment> findByDoctorAndAppdateAndApptime(String doctor, String appdate, String apptime);
}

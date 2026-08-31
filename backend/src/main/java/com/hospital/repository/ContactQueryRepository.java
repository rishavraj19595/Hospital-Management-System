package com.hospital.repository;

import com.hospital.model.ContactQuery;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface ContactQueryRepository extends MongoRepository<ContactQuery, String> {
}

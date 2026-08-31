package com.hospital.controller;

import com.hospital.model.ContactQuery;
import com.hospital.repository.ContactQueryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/queries")
public class ContactQueryController {

    @Autowired
    private ContactQueryRepository contactQueryRepository;

    // Submit contact message query
    @PostMapping("/submit")
    public ResponseEntity<?> submitQuery(@RequestBody ContactQuery query) {
        ContactQuery saved = contactQueryRepository.save(query);
        return ResponseEntity.ok(saved);
    }

    // List all contact message queries
    @GetMapping("/all")
    public ResponseEntity<List<ContactQuery>> getAllQueries() {
        return ResponseEntity.ok(contactQueryRepository.findAll());
    }
}

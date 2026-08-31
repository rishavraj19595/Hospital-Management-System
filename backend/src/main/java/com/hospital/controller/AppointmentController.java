package com.hospital.controller;

import com.hospital.model.Appointment;
import com.hospital.repository.AppointmentRepository;
import com.hospital.service.AppointmentQueue;
import com.hospital.service.AppointmentSorter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/appointments")
public class AppointmentController {

    @Autowired
    private AppointmentRepository appointmentRepository;

    private int parseTimeToMinutes(String timeStr) {
        if (timeStr == null || !timeStr.contains(":")) {
            return -1;
        }
        try {
            String[] parts = timeStr.split(":");
            int hours = Integer.parseInt(parts[0]);
            int minutes = Integer.parseInt(parts[1]);
            return hours * 60 + minutes;
        } catch (Exception e) {
            return -1;
        }
    }

    // Book an appointment (with doctor slot collision checking within 15 minutes)
    @PostMapping("/book")
    public ResponseEntity<?> bookAppointment(@RequestBody Appointment appointment) {
        String doctor = appointment.getDoctor();
        String date = appointment.getAppdate();
        String time = appointment.getApptime();

        int newTimeMinutes = parseTimeToMinutes(time);
        if (newTimeMinutes == -1) {
            return ResponseEntity.badRequest().body(Map.of("message", "Invalid appointment time format."));
        }

        // Check if doctor is already booked at that exact date and time with active appointment within 15 mins
        List<Appointment> existing = appointmentRepository.findByDoctor(doctor);
        boolean collision = existing.stream()
            .filter(app -> app.getUserStatus() == 1 && app.getDoctorStatus() == 1 && date.equals(app.getAppdate()))
            .anyMatch(app -> {
                int existingTimeMinutes = parseTimeToMinutes(app.getApptime());
                return existingTimeMinutes != -1 && Math.abs(existingTimeMinutes - newTimeMinutes) < 15;
            });

        if (collision) {
            return ResponseEntity.badRequest().body(Map.of("message", 
                "Doctor " + doctor + " is busy at this time slot, it is booked by another patient."));
        }

        Appointment saved = appointmentRepository.save(appointment);
        return ResponseEntity.ok(saved);
    }

    private void checkAndMarkMissedAppointments(List<Appointment> list) {
        long nowMillis = System.currentTimeMillis();
        for (Appointment app : list) {
            if (app.getUserStatus() == 1 && app.getDoctorStatus() == 1) {
                try {
                    String[] dateParts = app.getAppdate().split("-");
                    String[] timeParts = app.getApptime().split(":");
                    java.util.Calendar cal = java.util.Calendar.getInstance();
                    cal.set(
                        Integer.parseInt(dateParts[0]),
                        Integer.parseInt(dateParts[1]) - 1,
                        Integer.parseInt(dateParts[2]),
                        Integer.parseInt(timeParts[0]),
                        Integer.parseInt(timeParts[1]),
                        0
                    );
                    long appMillis = cal.getTimeInMillis();
                    if (nowMillis - appMillis > 50L * 60L * 1000L) {
                        app.setUserStatus(3);
                        app.setDoctorStatus(3);
                        appointmentRepository.save(app);
                    }
                } catch (Exception e) {
                    // Ignore parsing errors
                }
            }
        }
    }

    // Get appointments by patient (Sorted chronologically using custom Min-Heap Priority Queue)
    @GetMapping("/patient/{pid}")
    public ResponseEntity<List<Appointment>> getPatientAppointments(@PathVariable String pid) {
        List<Appointment> rawList = appointmentRepository.findByPid(pid);
        checkAndMarkMissedAppointments(rawList);
        
        // Use custom Heap Min-Priority Queue for sorting
        AppointmentQueue queue = new AppointmentQueue();
        for (Appointment app : rawList) {
            queue.insert(app);
        }
        return ResponseEntity.ok(queue.toSortedList());
    }

    // Get appointments by doctor (Sorted chronologically using custom Min-Heap Priority Queue)
    @GetMapping("/doctor/{doctor}")
    public ResponseEntity<List<Appointment>> getDoctorAppointments(@PathVariable String doctor) {
        List<Appointment> rawList = appointmentRepository.findByDoctor(doctor);
        checkAndMarkMissedAppointments(rawList);
        
        // Use custom Heap Min-Priority Queue for sorting
        AppointmentQueue queue = new AppointmentQueue();
        for (Appointment app : rawList) {
            queue.insert(app);
        }
        return ResponseEntity.ok(queue.toSortedList());
    }

    // Get all appointments (Supports sorting by date, patient name, or fees using custom Merge Sort)
    @GetMapping("/all")
    public ResponseEntity<List<Appointment>> getAllAppointments(@RequestParam(required = false, defaultValue = "date") String sortBy) {
        List<Appointment> rawList = appointmentRepository.findAll();
        checkAndMarkMissedAppointments(rawList);
        
        // Use custom Merge Sort implementation
        List<Appointment> sortedList = AppointmentSorter.sort(rawList, sortBy);
        return ResponseEntity.ok(sortedList);
    }

    // Reschedule/Modify timing of an appointment
    @PutMapping("/reschedule/{id}")
    public ResponseEntity<?> rescheduleAppointment(@PathVariable String id, @RequestBody Map<String, String> request) {
        Optional<Appointment> appointmentOpt = appointmentRepository.findById(id);
        if (!appointmentOpt.isPresent()) {
            return ResponseEntity.notFound().build();
        }

        Appointment app = appointmentOpt.get();
        String newDate = request.get("newDate");
        String newTime = request.get("newTime");

        int newTimeMinutes = parseTimeToMinutes(newTime);
        if (newTimeMinutes == -1) {
            return ResponseEntity.badRequest().body(Map.of("message", "Invalid appointment time format."));
        }

        // Check if doctor is already booked at that new date and time within 15 mins
        List<Appointment> existing = appointmentRepository.findByDoctor(app.getDoctor());
        boolean collision = existing.stream()
            .filter(e -> e.getUserStatus() == 1 && e.getDoctorStatus() == 1 && !e.getId().equals(id) && newDate.equals(e.getAppdate()))
            .anyMatch(e -> {
                int existingTimeMinutes = parseTimeToMinutes(e.getApptime());
                return existingTimeMinutes != -1 && Math.abs(existingTimeMinutes - newTimeMinutes) < 15;
            });

        if (collision) {
            return ResponseEntity.badRequest().body(Map.of("message", 
                "Doctor " + app.getDoctor() + " is busy at this time slot, it is booked by another patient."));
        }

        // Update timing and reset status to Active (1)
        app.setAppdate(newDate);
        app.setApptime(newTime);
        app.setUserStatus(1);
        app.setDoctorStatus(1);
        appointmentRepository.save(app);

        return ResponseEntity.ok(app);
    }

    // Cancel an appointment
    @PutMapping("/cancel/{id}")
    public ResponseEntity<?> cancelAppointment(@PathVariable String id) {
        Optional<Appointment> appointmentOpt = appointmentRepository.findById(id);
        if (appointmentOpt.isPresent()) {
            Appointment app = appointmentOpt.get();
            app.setUserStatus(0);
            app.setDoctorStatus(0);
            appointmentRepository.save(app);
            return ResponseEntity.ok().build();
        }
        return ResponseEntity.notFound().build();
    }
}

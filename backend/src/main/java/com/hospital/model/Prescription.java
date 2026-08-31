package com.hospital.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "prescriptions")
public class Prescription {
    @Id
    private String id;
    private String appointmentId;
    private String pid;
    private String fname;
    private String lname;
    private String disease;
    private String allergy;
    private String prescription;
    private String doctor;
    private String appdate;
    private String apptime;

    public Prescription() {}

    public Prescription(String appointmentId, String pid, String fname, String lname, String disease, 
                        String allergy, String prescription, String doctor, String appdate, String apptime) {
        this.appointmentId = appointmentId;
        this.pid = pid;
        this.fname = fname;
        this.lname = lname;
        this.disease = disease;
        this.allergy = allergy;
        this.prescription = prescription;
        this.doctor = doctor;
        this.appdate = appdate;
        this.apptime = apptime;
    }

    // Getters and Setters
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getAppointmentId() { return appointmentId; }
    public void setAppointmentId(String appointmentId) { this.appointmentId = appointmentId; }

    public String getPid() { return pid; }
    public void setPid(String pid) { this.pid = pid; }

    public String getFname() { return fname; }
    public void setFname(String fname) { this.fname = fname; }

    public String getLname() { return lname; }
    public void setLname(String lname) { this.lname = lname; }

    public String getDisease() { return disease; }
    public void setDisease(String disease) { this.disease = disease; }

    public String getAllergy() { return allergy; }
    public void setAllergy(String allergy) { this.allergy = allergy; }

    public String getPrescription() { return prescription; }
    public void setPrescription(String prescription) { this.prescription = prescription; }

    public String getDoctor() { return doctor; }
    public void setDoctor(String doctor) { this.doctor = doctor; }

    public String getAppdate() { return appdate; }
    public void setAppdate(String appdate) { this.appdate = appdate; }

    public String getApptime() { return apptime; }
    public void setApptime(String apptime) { this.apptime = apptime; }
}

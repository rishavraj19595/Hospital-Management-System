package com.hospital.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "appointments")
public class Appointment {
    @Id
    private String id;
    private String pid;
    private String fname;
    private String lname;
    private String gender;
    private String email;
    private String contact;
    private String doctor;
    private int docFees;
    private String appdate;
    private String apptime;
    private int userStatus;    // 1 = Active, 0 = Cancelled
    private int doctorStatus;  // 1 = Active, 0 = Cancelled
    private boolean emergency;

    public Appointment() {}

    public Appointment(String pid, String fname, String lname, String gender, String email, String contact, 
                       String doctor, int docFees, String appdate, String apptime, int userStatus, int doctorStatus, boolean emergency) {
        this.pid = pid;
        this.fname = fname;
        this.lname = lname;
        this.gender = gender;
        this.email = email;
        this.contact = contact;
        this.doctor = doctor;
        this.docFees = docFees;
        this.appdate = appdate;
        this.apptime = apptime;
        this.userStatus = userStatus;
        this.doctorStatus = doctorStatus;
        this.emergency = emergency;
    }

    // Getters and Setters
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getPid() { return pid; }
    public void setPid(String pid) { this.pid = pid; }

    public String getFname() { return fname; }
    public void setFname(String fname) { this.fname = fname; }

    public String getLname() { return lname; }
    public void setLname(String lname) { this.lname = lname; }

    public String getGender() { return gender; }
    public void setGender(String gender) { this.gender = gender; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getContact() { return contact; }
    public void setContact(String contact) { this.contact = contact; }

    public String getDoctor() { return doctor; }
    public void setDoctor(String doctor) { this.doctor = doctor; }

    public int getDocFees() { return docFees; }
    public void setDocFees(int docFees) { this.docFees = docFees; }

    public String getAppdate() { return appdate; }
    public void setAppdate(String appdate) { this.appdate = appdate; }

    public String getApptime() { return apptime; }
    public void setApptime(String apptime) { this.apptime = apptime; }

    public int getUserStatus() { return userStatus; }
    public void setUserStatus(int userStatus) { this.userStatus = userStatus; }

    public int getDoctorStatus() { return doctorStatus; }
    public void setDoctorStatus(int doctorStatus) { this.doctorStatus = doctorStatus; }

    public boolean isEmergency() { return emergency; }
    public void setEmergency(boolean emergency) { this.emergency = emergency; }
}

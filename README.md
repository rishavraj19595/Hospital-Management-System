# 🏥 Enterprise Hospital Management System (HMS)

[![Spring Boot](https://img.shields.io/badge/Spring--Boot-3.3.0-brightgreen.svg)](https://spring.io/projects/spring-boot)
[![Java](https://img.shields.io/badge/Java-21-orange.svg)](https://www.oracle.com/java/)
[![MongoDB](https://img.shields.io/badge/MongoDB-5.0+-green.svg)](https://www.mongodb.com/)
[![License](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Architecture](https://img.shields.io/badge/Architecture-RESTful%20%7C%20Micro--Services-purple.svg)](#system-architecture)

An enterprise-grade, full-stack Hospital Management System engineered with Java 21, Spring Boot 3.3.0, MongoDB, and a responsive modern web dashboard. The system integrates custom Computer Science Data Structures & Algorithms (DSAs)—such as Min-Heap Priority Queues, Merge Sort, and Binary Search—to handle real-time appointment scheduling, patient tracking, slot collision prevention, and digital prescription lifecycle management.

---

## 📋 Table of Contents

- [Overview](#-overview)
- [Key Features](#-key-features)
  - [Patient Management Portal](#1-patient-management-portal)
  - [Doctor Operations Portal](#2-doctor-operations-portal)
  - [Receptionist & Administrative Dashboard](#3-receptionist--administrative-dashboard)
- [Custom Data Structures & Algorithms (DSA)](#-custom-data-structures--algorithms-dsa)
- [System Architecture](#-system-architecture)
- [Technology Stack](#-technology-stack)
- [Directory Structure](#-directory-structure)
- [Database Schema & Models](#-database-schema--models)
- [API Reference Documentation](#-api-reference-documentation)
- [Pre-Seeded Credentials](#-pre-seeded-credentials)
- [Installation & Getting Started](#-installation--getting-started)
  - [Prerequisites](#prerequisites)
  - [Automated 1-Click Launch (Recommended)](#automated-1-click-launch-recommended)
  - [Manual Setup](#manual-setup)
- [Troubleshooting & FAQs](#-troubleshooting--faqs)
- [License](#-license)

---

## 🌟 Overview

The **Hospital Management System (HMS)** provides a centralized web ecosystem connecting **Patients**, **Medical Doctors**, and **Receptionist / Administrative Staff**. It addresses hospital workflow challenges including appointment overlaps, schedule delays, record management, and queue priority handling.

### 💡 Highlights
- **Real-Time Slot Collision Prevention**: Enforces a 15-minute buffer per doctor to prevent overlapping bookings.
- **Priority Queue Scheduling**: Emergency cases bypass standard chronological queues automatically.
- **Automated Status Tracking**: Automatically transitions overdue appointments to "Missed" after 50 minutes.
- **Zero-Dependency PowerShell Launcher**: Automated setup script downloads local MongoDB & Maven binaries if missing.

---

## 🚀 Key Features

### 1. Patient Management Portal
* **Registration & Authentication**: Secure sign-up and login with email and phone number uniqueness verification.
* **Appointment Booking**: Select medical specialization, doctor, date, and time slot with instant availability check.
* **Emergency Tagging**: Flag critical medical conditions for immediate priority queue escalation.
* **Personal Medical Dashboard**: View past and upcoming appointments, prescription histories, and status updates (Active, Completed, Cancelled, Missed).
* **Contact Queries**: Direct feedback and inquiry submission form.

### 2. Doctor Operations Portal
* **Doctor Authentication**: Dedicated credentials for each medical practitioner.
* **Chronological Appointment Queue**: Displays assigned patient appointments sorted dynamically via Min-Heap Priority Queue.
* **Shift Management**: Real-time display of working hours (Day Shift: `09:00 - 16:45`, Night Shift: `17:00 - 08:45`).
* **Digital Prescription Engine**: Issue digital prescriptions specifying medication details, dosage, and diagnostic notes. Enforces constraint checking to prevent writing prescriptions prior to the appointment date.

### 3. Receptionist & Administrative Dashboard
* **System Metrics Overview**: Live statistics detailing total Doctors, Patients, Appointments, and Contact Queries.
* **Doctor Management**: Add new doctors, delete records, update consultation fees, and adjust operational shift hours.
* **Patient Lookup System**: Instant phone number lookup powered by custom Binary Search algorithm.
* **Multi-Criteria Appointment Sorting**: Sort all global hospital appointments by Date/Time, Patient Name, or Consultation Fees via custom Merge Sort algorithm.
* **Inquiry Desk**: Review and address incoming contact messages.

---

## 🔬 Custom Data Structures & Algorithms (DSA)

Rather than relying purely on standard collection libraries, HMS implements custom algorithmic components within the core Spring Boot service layer:

```
                      ┌──────────────────────────────────────────────┐
                      │          Custom Algorithmic Core             │
                      └──────────────────────┬───────────────────────┘
                                             │
      ┌──────────────────────────────────────┼──────────────────────────────────────┐
      │                                      │                                      │
┌─────▼──────────────────────┐    ┌──────────▼───────────────────┐    ┌─────────────▼────────────────┐
│  Min-Heap Priority Queue   │    │      Merge Sort Engine       │    │ Binary Search + Insertion    │
│  (AppointmentQueue.java)   │    │    (AppointmentSorter.java)  │    │    (PatientSearcher.java)    │
└─────────────┬──────────────┘    └──────────┬───────────────────┘    └─────────────┬────────────────┘
              │                              │                                      │
              ▼                              ▼                                      ▼
Chronological queueing with    Sorting global records by Date,        Rapid $O(\log N)$ patient lookup
Emergency priority escalation  Patient Name, or Consultation Fees     by contact phone number
```

### 1. Min-Heap Priority Queue (`AppointmentQueue.java`)
* **Purpose**: Manages chronological queueing for patient & doctor appointment listings.
* **Time Complexity**: Insert $O(\log N)$, Poll $O(\log N)$, Heapify $O(N)$.
* **Priority Rule**: Emergency appointments automatically bubble up to the root of the heap ahead of non-emergency appointments.

### 2. Custom Merge Sort (`AppointmentSorter.java`)
* **Purpose**: Provides high-performance sorting of global appointments across 3 distinct dimensions (Date/Time, Patient Name, and Doctor Consultation Fees).
* **Time Complexity**: Guaranteed $O(N \log N)$ worst-case and average-case efficiency.

### 3. Binary Search + Insertion Sort (`PatientSearcher.java`)
* **Purpose**: Performs high-speed contact number lookup across patient directories.
* **Time Complexity**: Pre-sorting via Insertion Sort $O(N^2)$, Binary Search $O(\log N)$.

### 4. 15-Minute Slot Collision Detection
* Parses requested appointment time into minute offsets (`hours * 60 + minutes`) and validates whether any existing active booking for the target doctor falls within $|T_{\text{new}} - T_{\text{existing}}| < 15$ minutes.

---

## 🏗 System Architecture

```mermaid
graph TD
    Client[Web Browser / HTML5 + JavaScript + CSS3] -->|HTTP / JSON REST API| Controller[Spring Boot REST Controllers]
    
    subgraph Backend Core
        Controller --> AuthCtrl[AuthController]
        Controller --> ApptCtrl[AppointmentController]
        Controller --> DocCtrl[DoctorController]
        Controller --> PatCtrl[PatientController]
        Controller --> PresCtrl[PrescriptionController]
        Controller --> StatCtrl[StatsController]
        
        ApptCtrl --> ApptQueue[AppointmentQueue Min-Heap]
        ApptCtrl --> ApptSorter[AppointmentSorter Merge-Sort]
        PatCtrl --> PatSearcher[PatientSearcher Binary-Search]
    end
    
    Backend Core -->|Spring Data Mongo Repository| MongoRepo[Data Access Layer]
    MongoRepo -->|MongoDB Native Driver| Database[(MongoDB Database GlobalHospital)]
```

---

## 🛠 Technology Stack

### Backend
* **Language**: Java 21 (LTS)
* **Framework**: Spring Boot 3.3.0
* **Data Access**: Spring Data MongoDB
* **Build System**: Apache Maven 3.9.6
* **Embedded Server**: Tomcat 10.1

### Frontend
* **UI Structure**: HTML5 (Semantic elements)
* **Styling**: Modern CSS3 (CSS Variables, Flexbox, CSS Grid, Glassmorphism UI)
* **Logic & Networking**: Native JavaScript (ES6+, Fetch API, Dynamic DOM Manipulation)
* **Icons & Assets**: Responsive Vector Graphics & Iconography

### Database & Tooling
* **Database**: MongoDB (Local Instance / Atlas Cluster)
* **Automation Scripting**: PowerShell 5.1+ (`run.ps1`)

---

## 📂 Directory Structure

```
HospitalmanagementSystem/
├── run.ps1                       # Automated 1-Click Environment & Application Bootstrapper
├── README.md                     # System Documentation
├── backend/                      # Spring Boot Java Server Application
│   ├── pom.xml                   # Maven Build & Dependencies Configuration
│   └── src/
│       └── main/
│           ├── java/com/hospital/
│           │   ├── HospitalApplication.java   # Application Entry & Seeder
│           │   ├── config/                    # Web & CORS Security Config
│           │   ├── controller/                # REST Controllers
│           │   │   ├── AppointmentController.java
│           │   │   ├── AuthController.java
│           │   │   ├── ContactQueryController.java
│           │   │   ├── DoctorController.java
│           │   │   ├── PatientController.java
│           │   │   ├── PrescriptionController.java
│           │   │   └── StatsController.java
│           │   ├── model/                     # Data Domain Entities
│           │   │   ├── Appointment.java
│           │   │   ├── ContactQuery.java
│           │   │   ├── Doctor.java
│           │   │   ├── Patient.java
│           │   │   └── Prescription.java
│           │   ├── repository/                # Spring Data Mongo Interfaces
│           │   └── service/                   # Algorithmic Core Services
│           │       ├── AppointmentQueue.java   # Min-Heap Priority Queue
│           │       ├── AppointmentSorter.java  # Merge Sort Engine
│           │       └── PatientSearcher.java   # Binary Search Utility
│           └── resources/
│               └── application.properties     # Spring Database & Port Configuration
└── frontend/                     # Client Web Portal Application
    ├── index.html                # Home Landing Page
    ├── about.html                # About Hospital Page
    ├── contact.html              # Contact & Feedback Form
    ├── dashboard-patient.html    # Patient Self-Service Portal
    ├── dashboard-doctor.html     # Doctor Clinical Portal
    ├── dashboard-receptionist.html# Admin Management System
    ├── css/
    │   └── style.css             # Enterprise Theme & Component Styles
    └── js/
        └── main.js               # Frontend API Client & State Manager
```

---

## 🗄 Database Schema & Models

HMS utilizes MongoDB collections under the `GlobalHospital` database namespace:

### 1. `doctors` Collection
| Field | Type | Description |
| :--- | :--- | :--- |
| `id` | String (ObjectId) | Primary key auto-generated by MongoDB |
| `username` | String | Doctor full name / login identifier |
| `password` | String | Account access password |
| `email` | String | Email address (Unique constraint) |
| `spec` | String | Medical Specialization (e.g., Cardiologist, Neurologist) |
| `docFees` | int | Consultation Fee (INR/USD) |
| `startTime` | String | Shift start time (e.g., `09:00`) |
| `endTime` | String | Shift end time (e.g., `16:45`) |

### 2. `patients` Collection
| Field | Type | Description |
| :--- | :--- | :--- |
| `id` | String (ObjectId) | Primary key |
| `fname` / `lname` | String | Patient first name & last name |
| `gender` | String | Gender identifier |
| `email` | String | Patient login email (Unique constraint) |
| `contact` | String | Phone number (Indexed for Binary Search) |
| `password` | String | Account access password |

### 3. `appointments` Collection
| Field | Type | Description |
| :--- | :--- | :--- |
| `id` | String (ObjectId) | Primary key |
| `pid` | String | Reference to Patient ID |
| `fname` / `lname` | String | Patient snapshot name |
| `email` / `contact` | String | Patient contact snapshot |
| `doctor` | String | Assigned Doctor name |
| `docFees` | int | Appointment fee |
| `appdate` | String | Booking date (`YYYY-MM-DD`) |
| `apptime` | String | Booking time (`HH:mm`) |
| `userStatus` | int | `1` (Active), `2` (Completed), `0` (Cancelled), `3` (Missed) |
| `doctorStatus` | int | Mirror status for doctor synchronization |
| `isEmergency` | boolean | Priority queue flag |

### 4. `prescriptions` Collection
| Field | Type | Description |
| :--- | :--- | :--- |
| `id` | String (ObjectId) | Primary key |
| `appointmentId` | String | Reference to completed appointment |
| `pid` / `doctor` | String | Foreign keys for patient & doctor |
| `disease` | String | Primary medical diagnosis |
| `allergy` | String | Patient allergies recorded |
| `prescription` | String | Prescribed drugs, dosage, and instructions |
| `appdate` / `apptime` | String | Appointment execution timestamp |

---

## 📑 API Reference Documentation

### Authentication Base Endpoint: `/api/auth`
| Method | Endpoint | Payload / Params | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/patient/register` | Patient JSON Object | Register new patient account |
| `POST` | `/patient/login` | `{ email, password }` | Authenticate patient |
| `POST` | `/doctor/login` | `{ username, password }` | Authenticate doctor |
| `POST` | `/receptionist/login` | `{ username, password }` | Authenticate admin staff |

### Doctor Management Endpoint: `/api/doctors`
| Method | Endpoint | Payload / Params | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/all` | None | Fetch all registered doctors |
| `POST` | `/add` | Doctor JSON Object | Create new doctor account |
| `PUT` | `/update/{id}` | Doctor JSON Object | Update doctor details & shift hours |
| `DELETE` | `/delete/{id}` | Path variable `id` | Remove doctor from system |

### Appointment Management Endpoint: `/api/appointments`
| Method | Endpoint | Payload / Params | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/book` | Appointment JSON | Book appointment with collision check |
| `GET` | `/patient/{pid}` | Path variable `pid` | Min-Heap sorted patient appointments |
| `GET` | `/doctor/{doctor}` | Path variable `doctor` | Min-Heap sorted doctor appointments |
| `GET` | `/all` | `?sortBy=date\|name\|fees` | Merge Sort sorted global appointments |
| `PUT` | `/reschedule/{id}` | `{ newDate, newTime }` | Reschedule booking date & time |
| `PUT` | `/cancel/{id}` | Path variable `id` | Mark appointment cancelled |

### Prescription Endpoint: `/api/prescriptions`
| Method | Endpoint | Payload / Params | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/create` | Prescription JSON | Submit prescription & complete appointment |
| `GET` | `/patient/{pid}` | Path variable `pid` | Get prescriptions by patient ID |
| `GET` | `/doctor/{doctor}` | Path variable `doctor` | Get prescriptions by doctor name |

---

## 🔑 Pre-Seeded Credentials

Upon initial launch, the system automatically populates MongoDB with default accounts for instant testing:

### Administrative Account
* **Role**: Receptionist / Admin
* **Username**: `admin`
* **Password**: `admin123`

### Default Patient Account
* **Name**: Rishav Raj
* **Email**: `rishavraj19595@gmail.com`
* **Password**: `rishav1`
* **Contact**: `8340124017`

### Pre-configured Doctors
| Doctor Name | Specialization | Shift Hours | Fee | Username | Password |
| :--- | :--- | :--- | :--- | :--- | :--- |
| Dr. Ashok | General | Day (`09:00 - 16:45`) | ₹500 | `ashok` | `ashok123` |
| Dr. Dinesh | General | Night (`17:00 - 08:45`) | ₹700 | `Dinesh` | `dinesh123` |
| Dr. Arun | Cardiologist | Day (`09:00 - 16:45`) | ₹600 | `arun` | `arun123` |
| Dr. Amit | Cardiologist | Night (`17:00 - 08:45`) | ₹1000 | `Amit` | `amit123` |
| Dr. Ganesh | Pediatrician | Day (`09:00 - 16:45`) | ₹550 | `Ganesh` | `ganesh123` |
| Dr. Abbis | Neurologist | Day (`09:00 - 16:45`) | ₹1500 | `Abbis` | `abbis123` |

---

## 💻 Installation & Getting Started

### Prerequisites
1. **Operating System**: Windows 10/11, macOS, or Linux.
2. **Java Development Kit**: JDK 21 or higher (Verified in system PATH).

---

### Automated 1-Click Launch (Recommended for Windows)

The project includes an automated PowerShell setup script (`run.ps1`) that inspects, downloads, configures, and boots all necessary environment components:

```powershell
# Open PowerShell in the project root directory
.\run.ps1
```

#### What `run.ps1` executes automatically:
1. Validates system **Java 21** availability.
2. Checks if **MongoDB** is running on port `27017`. If absent, automatically downloads MongoDB 5.0.26 zip archive, extracts it to `.mongodb/`, and launches the daemon background process.
3. Checks for local **Apache Maven 3.9.6**. If absent, downloads and configures Maven inside `backend/.maven/`.
4. Compiles and starts the **Spring Boot** application server on port `8080`.
5. Launches the **Frontend** web dashboard directly in your default web browser.

---

### Manual Setup

If running on macOS/Linux or setting up step-by-step manually:

#### 1. Start Database
Ensure MongoDB service is installed and running locally on port `27017`:
```bash
mongod --dbpath ./data --port 27017
```

#### 2. Build & Launch Backend
Navigate into the `backend/` directory:
```bash
cd backend
# Using installed Maven:
mvn clean spring-boot:run
```
*The Spring Boot server will initialize on `http://localhost:8080` and seed default database records automatically.*

#### 3. Launch Frontend
Open `frontend/index.html` in any modern web browser or serve via a web server (Live Server, http-server, or nginx):
```bash
# Example using Python http.server
cd frontend
python -m http.server 3000
```
Navigate to `http://localhost:3000` or open `index.html` directly in your browser.

---

## ❓ Troubleshooting & FAQs

#### Q1: "Java is not installed or not in system PATH" error when executing `run.ps1`.
* **Solution**: Ensure JDK 21+ is installed. Set your `JAVA_HOME` environment variable to point to your JDK directory and append `%JAVA_HOME%\bin` to your system `PATH`.

#### Q2: Backend fail to start with `Address already in use: bind` on Port 8080.
* **Solution**: Another process is occupying port 8080. Free port 8080 or update `server.port=8081` in `backend/src/main/resources/application.properties`.

#### Q3: Doctor collision error during appointment booking.
* **Solution**: The system enforces a 15-minute buffer between appointments for the same doctor. Select a time slot at least 15 minutes apart from existing active bookings.

#### Q4: CORS Policy errors when calling REST APIs.
* **Solution**: Ensure `WebConfig` in `backend/src/main/java/com/hospital/config` allows origin request headers or launch frontend directly via the browser or local server origin.

---

## 📜 License

Distributed under the **MIT License**. See `LICENSE` for more information.

---

<p align="center">
  <b>Enterprise Hospital Management System</b> • Engineered with Spring Boot 3.3.0 & Java 21
</p>

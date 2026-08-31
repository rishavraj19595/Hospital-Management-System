Hospital Management System

A full-stack Hospital Management System built with Spring Boot,
MongoDB, HTML, CSS, and JavaScript. The application
provides role-based workflows for patients, doctors, and receptionists.
It includes patient registration and login, doctor authentication,
appointment booking, emergency prioritization, appointment cancellation
and rescheduling, prescription management, patient searching, contact
queries, dashboard statistics, and custom data-structure
implementations. --- ## Table of Contents 1. Project
Overview 2. Key Features 3. User
Roles 4. Technology Stack 5. Project
Structure 6. System
Architecture 7. Database
Design 8. Authentication 9.
Patient Features 10. Doctor
Features 11. Receptionist
Features 12. Appointment
Management 13. Emergency
Priority 14. Prescription
Management 15. Contact
Queries 16. Dashboard
Statistics 17. Data Structures and
Algorithms 18. API
Documentation 19. Appointment
API 20. Doctor API 21. Patient
API 22. Prescription API 23. Query
API 24. Statistics API 25. Running the
Project 26. PowerShell Quick
Start 27. Manual Backend
Setup 28. Frontend Setup 29.
Default Accounts 30.
Configuration 31. Validation and Business
Rules 32. Security
Notes 33. Troubleshooting 34.
Future Improvements 35. Learning
Outcomes 36. Contributing 37.
License --- ## Project Overview Global Hospital Management
System is a web-based application designed to digitize common hospital
administration and patient-care workflows. The project separates the
user interface from the REST API backend. The frontend communicates with
the Spring Boot backend using HTTP requests and JSON payloads. The
backend stores application data in MongoDB. The project also
demonstrates practical implementation of data structures and algorithms
inside a real-world application. Custom implementations include a
Min-Heap based appointment queue, Merge Sort for appointment sorting,
Insertion Sort for preparing patient records, and Binary Search for
patient lookup. --- ## Key Features - Patient registration. • Patient
login. • Doctor login. • Receptionist login. • Doctor directory. •
Doctor addition. • Doctor deletion. • Patient directory. • Patient
search by contact number. • Appointment booking. • Doctor availability
collision checking. • Emergency appointment prioritization. •
Appointment cancellation. • Appointment rescheduling. • Automatic
missed-appointment detection. • Patient appointment history. • Doctor
appointment management. • Prescription creation. • Patient prescription
history. • Doctor prescription history. • Contact form submission. •
Receptionist contact-query dashboard. • Dashboard statistics. •
Appointment sorting by date. • Appointment sorting by patient name. •
Appointment sorting by doctor fees. • Responsive dashboard-oriented UI.
• Local development startup script. --- ## User Roles ### Patient
Patients can create an account and log into the system. A patient can
browse doctors, select a specialization, view doctor information, choose
an appointment slot, and book an appointment. Patients can also review
appointment history, cancel appointments, view prescriptions, and print
a prescription receipt. ### Doctor Doctors authenticate using a
username and password. A doctor can view appointments assigned to them
and manage prescription records. Doctors can create prescriptions for
completed or eligible appointments. ### Receptionist The receptionist
works as the administrative role. The receptionist dashboard provides
system statistics and administrative controls. Receptionists can manage
doctors, view patients, search patients, review appointments, cancel
appointments, reschedule appointments, and view contact queries. --- ##
Technology Stack ### Frontend - HTML5. • CSS3. • Vanilla JavaScript. •
Font Awesome icons. • Browser Local Storage. • Fetch API. ### Backend -
Java 21. • Spring Boot 3.3.0. • Spring Web. • Spring Data MongoDB. •
Maven. ### Database - MongoDB. • Default database: GlobalHospital. •
Default local MongoDB port: 27017. ### Development Tools - Git. • VS
Code or another Java/HTML IDE. • PowerShell on Windows. • Modern web
browser. --- ## Project Structure Code example:
HospitalmanagementSystem/ ├── backend/ --- ## System Architecture The
application follows a simple three-layer web architecture.
Code example: User | The frontend is responsible for presentation
and browser-side interaction. The Spring Boot application provides REST
endpoints and business rules. Spring Data MongoDB provides
repository-based persistence. MongoDB stores patients, doctors,
appointments, prescriptions, and contact queries. --- ## Database
Design The application uses five main MongoDB collections. ###
patients Stores patient account information. Important fields
include: - id • fname • lname • gender • email • contact •
password ### doctors Stores doctor account and professional
information. Important fields include: - id • username • password
• email • spec • docFees ### appointments Stores appointment
and scheduling information. Important fields include: - id • pid •
fname • lname • gender • email • contact • doctor •
docFees • appdate • apptime • userStatus • doctorStatus •
emergency ### prescriptions Stores prescriptions linked to
appointments and patients. Important fields include: - id •
appointmentId • pid • fname • lname • disease • allergy •
prescription • doctor • appdate • apptime ### queries Stores
messages submitted through the contact page. Important fields include: -
id • name • email • contact • message --- ## Authentication
Authentication is implemented through REST endpoints. Patient
registration checks both email and phone number uniqueness. Patient
login validates the supplied email and password against the patient
collection. Doctor login validates username and password against the
doctor collection. Receptionist authentication currently uses fixed
credentials inside the backend. After successful login, the frontend
stores the selected role in browser Local Storage. The dashboard pages
use the stored role to determine the active user experience. >
Important: This implementation is suitable for a learning/project
environment, but production authentication should use password hashing,
sessions or JWT, authorization middleware, secure cookies, and proper
secret management. --- ## Patient Features ### Registration Patients
provide: - First name. • Last name. • Email. • Phone number. • Gender. •
Password. • Password confirmation. The frontend performs basic
validation before sending registration data to the backend. The backend
prevents duplicate email addresses and duplicate contact numbers. ###
Login Patients log in with email and password. A successful login stores
the patient role and patient information in Local Storage. ### Doctor
Selection Patients can view doctors and filter available doctors by
specialization. The frontend retrieves doctor records from the backend.
Doctor email and consultation fee information can be displayed while
booking. ### Appointment Booking Patients select: - Doctor. •
Appointment date. • Appointment time. • Emergency priority when
required. The backend checks for conflicting active appointments. ###
Appointment History Patients can view their appointments in priority
order. Appointments can be cancelled from the patient dashboard. ###
Prescriptions Patients can view prescriptions associated with their
patient ID. Prescription information can also be displayed in a
printable receipt format. --- ## Doctor Features Doctors log in using
their registered username and password. The doctor dashboard loads
appointments assigned to the logged-in doctor. Appointments are returned
using the custom priority queue. Doctors can inspect appointment
information and create prescriptions. A prescription contains the
patient details, disease, allergy information, prescribed treatment,
doctor information, and appointment timing. The backend also updates the
corresponding appointment status after prescription creation. --- ##
Receptionist Features The receptionist dashboard provides administrative
visibility into the system. The dashboard includes: - Active doctor
count. • Patient count. • Appointment count. • Contact-query count.
Receptionists can add new doctors. Doctor usernames and email addresses
are checked for duplicates. Receptionists can delete doctors by ID.
Receptionists can view all patients. The patient search function
searches by contact number. Receptionists can view all appointments and
sort them by date, patient name, or fees. Receptionists can cancel
appointments. Receptionists can reschedule appointments while checking
for scheduling collisions. Receptionists can also view submitted contact
queries. --- ## Appointment Management Appointments are stored in
MongoDB through AppointmentRepository. The appointment controller
supports booking, retrieving, sorting, rescheduling, and cancellation.
### Appointment Status The project uses numeric status values.
Code example: 0 = Cancelled 1 = Active The userStatus and
doctorStatus fields represent the status from the respective sides of
the appointment. ### Collision Detection When an appointment is booked,
the backend checks active appointments for the selected doctor and date.
If another active appointment is within 15 minutes of the requested
time, the booking is rejected. This prevents closely overlapping
appointments. The same type of collision check is used during
rescheduling. --- ## Emergency Priority Appointments contain an
emergency boolean field. Emergency appointments receive priority in
the custom appointment queue. When two appointments are compared, an
emergency appointment is ordered before a non-emergency appointment. For
non-emergency appointments, date and time determine the ordering. This
provides a simple priority-based scheduling mechanism. --- ##
Prescription Management Doctors create prescriptions through the
prescription API. A prescription references the appointment using
appointmentId. The backend retrieves the related appointment before
saving the prescription. The appointment date and time are copied into
the prescription. The backend prevents a prescription from being created
before the appointment date when the appointment date can be parsed
successfully. After a prescription is created, the appointment is marked
as completed. The patient can later retrieve prescriptions using the
patient ID. The doctor can retrieve prescriptions using the doctor's
name. --- ## Contact Queries The public contact page allows visitors to
submit a message. The frontend sends the form information to the query
endpoint. The backend stores the submitted query in MongoDB. The
receptionist dashboard can retrieve all stored queries. This provides a
basic communication channel between visitors and hospital
administration. --- ## Dashboard Statistics The statistics endpoint
returns counts for: Code example: doctors patients The receptionist
dashboard displays these values as summary cards. The values are
calculated directly from MongoDB repository counts. --- ## Data
Structures and Algorithms This project intentionally demonstrates
multiple DSA concepts. ### Min-Heap Priority Queue AppointmentQueue
implements a custom Min-Heap using an ArrayList. The heap supports: -
Insert. • Poll. • Empty check. • Size. • Sorted extraction. Emergency
appointments receive higher priority. Otherwise, appointments are
compared using date and time. ### Merge Sort AppointmentSorter
implements custom Merge Sort. Appointments can be sorted using: -
Date/time. • Patient name. • Doctor fees. Merge Sort provides
O(n log n) sorting complexity. ### Insertion Sort PatientSearcher
first creates a copy of the patient list. It sorts the copy by contact
number using Insertion Sort. ### Binary Search After sorting by contact
number, PatientSearcher performs Binary Search. The search returns the
matching patient or null. The combined search workflow has O(n²)
worst-case preprocessing because of Insertion Sort, followed by
O(log n) binary search. --- ## API Documentation Base API URL:
Code example: http://localhost:8080/api All request and response
bodies use JSON where applicable. --- ## Authentication API ###
Register Patient Code example: POST /auth/patient/register Example
body: Code example: { "fname": "John", ### Patient Login
Code example: POST /auth/patient/login Example body: Code example:
{ "email": "john@example.com", ### Doctor Login Code example:
POST /auth/doctor/login Example body: Code example:
{ "username": "ashok", ### Receptionist Login Code example:
POST /auth/receptionist/login Example body: Code example:
{ "username": "admin", --- ## Appointment API ### Book Appointment
Code example: POST /appointments/book The endpoint validates the
appointment time and checks doctor conflicts. ### Patient Appointments
Code example: GET /appointments/patient/{pid} Appointments are
returned through the custom Min-Heap queue. ### Doctor Appointments
Code example: GET /appointments/doctor/{doctor} Appointments
assigned to the specified doctor are returned. ### All Appointments
Code example: GET /appointments/all?sortBy=date Supported sorting
parameters: Code example: date name ### Cancel Appointment
Code example: PUT /appointments/cancel/{id} The appointment is
marked as cancelled. ### Reschedule Appointment Code example:
PUT /appointments/reschedule/{id} Example body: Code example:
{ "newDate": "2026-09-10", --- ## Doctor API ### Get All Doctors
Code example: GET /doctors/all Returns all doctors stored in
MongoDB. ### Add Doctor Code example: POST /doctors/add Example
body: Code example: { "username": "newdoctor", ### Delete Doctor
Code example: DELETE /doctors/delete/{id} Deletes the doctor with
the specified MongoDB ID. --- ## Patient API ### Get All Patients
Code example: GET /patients/all Returns all patients. ### Search
Patient Code example: GET /patients/search?contact=9876543210 The
endpoint uses the custom sorting and binary-search implementation. ---
## Prescription API ### Create Prescription Code example:
POST /prescriptions/create Example body: Code example:
{ "appointmentId": "appointment-id", ### Patient Prescriptions
Code example: GET /prescriptions/patient/{pid} ### Doctor
Prescriptions Code example: GET /prescriptions/doctor/{doctor} ---
## Query API ### Submit Query Code example: POST /queries/submit
Example body: Code example: { "name": "Visitor", ### Get Queries
Code example: GET /queries/all --- ## Statistics API ### Overview
Code example: GET /stats/overview Example response: Code example:
{ "doctors": 8, --- ## Running the Project ### Prerequisites Install
the following software: - Java 21 or later. • MongoDB. • A modern
browser. • PowerShell on Windows. Maven does not have to be installed
globally because the project contains a local Maven setup. --- ##
PowerShell Quick Start The project contains run.ps1. From the project
root, run: Code example: Set-ExecutionPolicy -Scope Process Bypass .
The script performs several setup steps. First, it checks whether Java
is available. Next, it checks whether MongoDB is running on port
27017. If MongoDB is unavailable, the script attempts to download and
start a local MongoDB instance. The script also prepares local Apache
Maven if required. The Spring Boot backend is then started on port
8080. Finally, the frontend index.html file is opened. --- ##
Manual Backend Setup Open a terminal in the backend directory.
Code example: cd backend Run the Spring Boot application with Maven.
Code example: mvn spring-boot:run If using the bundled Maven
executable on Windows: Code example:
.\.mavenpache-maven-3.9.6in\mvn.cmd spring-boot:run The backend should
start on: Code example: http://localhost:8080 --- ## Frontend Setup
The frontend is composed of static HTML, CSS, and JavaScript files.
After starting the backend, open: Code example: frontend/index.html
The JavaScript application uses: Code example:
http://localhost:8080/api as the API base URL. A local static-server
workflow can also be used if preferred. For example, the frontend can be
served using a VS Code Live Server extension. --- ## Default Accounts
The backend seeds default doctor accounts when the doctor collection is
empty. Example doctor accounts include: Code example:
Username: ashok Password: ashok123 The application also seeds a
default patient when the patient collection is empty. The receptionist
currently uses: Code example: Username: admin Password: admin123
These credentials are development/demo credentials and should not be
used in production. --- ## Configuration MongoDB configuration is
stored in: Code example:
backend/src/main/resources/application.properties Current database
configuration: Code example:
spring.data.mongodb.uri=mongodb://localhost:27017/GlobalHospital server.port=8080
The database name is: Code example: GlobalHospital The API server
uses: Code example: 8080 The frontend API base URL is defined in:
Code example: frontend/js/main.js as: Code example:
const BASE_URL = 'http://localhost:8080/api'; --- ## Validation and
Business Rules Patient email addresses must be unique. Patient contact
numbers must be unique. Doctor usernames must be unique. Doctor email
addresses must be unique. Appointment times must contain a valid
hour/minute structure. Active doctor appointments cannot overlap within
15 minutes. Cancelled appointments are excluded from active collision
checks. Rescheduling performs the same collision check. Appointments
older than approximately 50 minutes are automatically marked as missed
when appointment lists are requested. Prescription creation copies
appointment date and time. Prescriptions cannot normally be created
before the appointment date. Creating a prescription changes the
appointment status to completed. --- ## Status Lifecycle The intended
appointment lifecycle is: Code example: Active | Active appointments
use status 1. Cancelled appointments use status 0. Completed
appointments use status 2. Missed appointments use status 3. Both
user and doctor status fields are updated by the relevant backend
operations. --- ## Frontend Design The frontend uses a clean
hospital-themed interface. The main page provides navigation for: -
Home. • About Us. • Contact. The home page provides separate
authentication tabs. The dashboard pages use side navigation and content
panels. JavaScript handles API communication without requiring a
frontend framework. Font Awesome is used for interface icons. --- ##
Browser Storage The frontend uses Local Storage for lightweight session
information. Stored values include role and user-related login
information. Logout clears Local Storage and returns the user to the
main page. For production use, sensitive authentication information
should not be stored insecurely in browser Local Storage. --- ##
Security Notes This repository is best treated as an academic or
portfolio project. Passwords are currently stored as plain text.
Authentication is not implemented with JWT or server-side sessions.
Receptionist credentials are hardcoded in the backend. There is no
comprehensive role-based authorization layer on REST endpoints. API
access should therefore not be exposed publicly in its current form. For
production deployment, implement password hashing with BCrypt or Argon2.
Use JWT or secure server-side sessions for authentication. Add
authorization checks to every protected endpoint. Use environment
variables or a secrets manager for credentials. Enable HTTPS. Validate
and sanitize all incoming data. Add rate limiting and account lockout
controls. Configure CORS for trusted origins only. Avoid returning
password fields in API responses. Add audit logging for administrative
operations. --- ## Troubleshooting ### Backend Does Not Start Check
that Java 21 or later is installed. Run: Code example: java -version
Confirm that MongoDB is available. Check port 27017. ### MongoDB
Connection Error Make sure MongoDB is running locally. The application
expects: Code example: localhost:27017 If MongoDB uses another port,
update application.properties. ### Frontend Cannot Reach Backend
Confirm that Spring Boot is running on port 8080. Check the browser
developer console. Verify the BASE_URL value in frontend/js/main.js.
### CORS Error The project includes a CORS configuration class. If the
frontend is served from a different origin, verify that the configured
origin is allowed. ### Appointment Booking Fails Check the appointment
date and time. Make sure another active appointment for the same doctor
is not within the 15-minute collision window. ### Prescription Cannot
Be Created Verify that the appointment ID exists. Check that the
appointment date is not in the future. ### Patient Search Returns
Nothing Verify that the contact number exactly matches the stored
contact value. The search is based on contact-number string comparison.
--- ## Future Improvements - Implement JWT authentication. • Hash all
passwords. • Add role-based authorization. • Add Spring Security. • Add
service-layer classes for business logic. • Add DTOs to avoid exposing
database models. • Add centralized exception handling. • Add request
validation using Jakarta Validation. • Add pagination for large
datasets. • Add database indexes. • Add appointment availability APIs. •
Add doctor schedules. • Add patient medical history. • Add billing and
payments. • Add medicine inventory. • Add laboratory records. • Add
email notifications. • Add SMS notifications. • Add password reset. •
Add profile management. • Add automated tests. • Add integration tests.
• Add API documentation with OpenAPI/Swagger. • Add Docker support. •
Add CI/CD. • Add production environment configuration. • Add audit logs.
• Add analytics and reporting. --- ## Learning Outcomes This project
demonstrates how a complete web application can combine frontend
development, backend development, database persistence, REST APIs, and
DSA concepts. It provides practical experience with Spring Boot REST
controllers. It demonstrates MongoDB repository integration. It
demonstrates asynchronous frontend API calls using JavaScript Fetch. It
demonstrates CRUD operations. It demonstrates validation and
business-rule enforcement. It demonstrates priority queues through a
custom Min-Heap. It demonstrates Merge Sort. It demonstrates Insertion
Sort. It demonstrates Binary Search. It also demonstrates how
algorithmic concepts can be integrated into a functional application
rather than being implemented only as isolated examples. --- ##
Contributing Contributions are welcome. A typical contribution workflow
is: Code example:
1. Fork the repository. 2. Create a feature branch. Keep changes
focused and document important architectural decisions. --- ## License
This project does not currently declare a formal open-source license. If
the project is intended for public redistribution, add an appropriate
license file such as MIT, Apache-2.0, or GPL according to the intended
usage. --- ## Project Summary Global Hospital Management System is
a full-stack hospital administration project combining: - Java 21. •
Spring Boot 3.3.0. • Spring Data MongoDB. • MongoDB. • HTML5. • CSS3. •
Vanilla JavaScript. • REST APIs. • Browser Local Storage. • Custom
Min-Heap. • Custom Merge Sort. • Insertion Sort. • Binary Search. The
project is designed as a practical demonstration of full-stack
development and data-structure implementation in a healthcare management
scenario.

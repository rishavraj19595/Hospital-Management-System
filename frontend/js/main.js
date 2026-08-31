const BASE_URL = 'http://localhost:8080/api';

// Utility for keying alpha characters only
function alphaOnly(event) {
  const key = event.keyCode;
  return ((key >= 65 && key <= 90) || key === 8 || key === 32 || (key >= 97 && key <= 122));
}

// Form validation: check matching password on registration
function checkPasswordMatch() {
  const password = document.getElementById('reg-password').value;
  const cpassword = document.getElementById('reg-cpassword').value;
  const msg = document.getElementById('pwd-match-msg');

  if (!cpassword) {
    msg.innerHTML = '';
    return;
  }

  if (password === cpassword) {
    msg.style.color = '#198754';
    msg.innerHTML = 'Matched';
  } else {
    msg.style.color = '#dc3545';
    msg.innerHTML = 'Not Matching';
  }
}

// Show alerts on top of forms
function showAlert(boxId, message, type = 'success') {
  const container = document.getElementById(boxId);
  if (!container) return;
  container.innerHTML = `
    <div class="alert alert-${type}">
      <i class="fa-solid ${type === 'success' ? 'fa-circle-check' : 'fa-circle-exclamation'}"></i>
      <span>${message}</span>
    </div>
  `;
  setTimeout(() => { container.innerHTML = ''; }, 6000);
}

// Switch between Patient, Doctor, and Receptionist tabs on index.html
function switchTab(tab) {
  // Update active tab buttons
  document.querySelectorAll('.auth-tab-btn').forEach(btn => btn.classList.remove('active'));
  document.getElementById(`btn-tab-${tab}`).classList.add('active');

  // Hide all sections
  document.getElementById('patient-auth-section').style.display = 'none';
  document.getElementById('doctor-auth-section').style.display = 'none';
  document.getElementById('receptionist-auth-section').style.display = 'none';

  // Show selected section
  document.getElementById(`${tab}-auth-section`).style.display = 'block';
}

// Toggle between register and login forms in Patient auth section
function togglePatientAuthView(view) {
  if (view === 'login') {
    document.getElementById('patient-register-form').style.display = 'none';
    document.getElementById('patient-login-form').style.display = 'block';
  } else {
    document.getElementById('patient-register-form').style.display = 'block';
    document.getElementById('patient-login-form').style.display = 'none';
  }
}

// Switch dashboard panels (tabs on dashboards)
function switchPanel(panelId) {
  document.querySelectorAll('.menu-item').forEach(item => item.classList.remove('active'));
  document.getElementById(`menu-${panelId}`).classList.add('active');

  document.querySelectorAll('.tab-panel').forEach(panel => panel.classList.remove('active'));
  document.getElementById(`panel-${panelId}`).classList.add('active');
}

// Handle Logout
function handleLogout() {
  localStorage.clear();
  window.location.href = 'index.html';
}

// ==========================================
// API Handlers: AUTHENTICATION
// ==========================================

async function handlePatientRegister(event) {
  event.preventDefault();
  const fname = document.getElementById('reg-fname').value.trim();
  const lname = document.getElementById('reg-lname').value.trim();
  const email = document.getElementById('reg-email').value.trim();
  const contact = document.getElementById('reg-contact').value.trim();
  const password = document.getElementById('reg-password').value;
  const cpassword = document.getElementById('reg-cpassword').value;
  const gender = document.querySelector('input[name="pat-gender"]:checked').value;

  if (password !== cpassword) {
    showAlert('alert-box', 'Passwords do not match!', 'danger');
    return;
  }

  try {
    const response = await fetch(`${BASE_URL}/auth/patient/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ fname, lname, email, contact, password, gender })
    });

    const data = await response.json();
    if (response.ok) {
      showAlert('alert-box', 'Registration successful! Toggle login below.', 'success');
      document.getElementById('pat-reg-form').reset();
      document.getElementById('pwd-match-msg').innerHTML = '';
      setTimeout(() => togglePatientAuthView('login'), 1500);
    } else {
      showAlert('alert-box', data.message || 'Registration failed. Email or contact might be in use.', 'danger');
    }
  } catch (error) {
    showAlert('alert-box', 'Error connecting to the backend. Is it running?', 'danger');
  }
}

async function handlePatientLogin(event) {
  event.preventDefault();
  const email = document.getElementById('pat-login-email').value.trim();
  const password = document.getElementById('pat-login-password').value;

  try {
    const response = await fetch(`${BASE_URL}/auth/patient/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });

    const data = await response.json();
    if (response.ok) {
      localStorage.setItem('role', 'patient');
      localStorage.setItem('userId', data.id);
      localStorage.setItem('name', `${data.fname} ${data.lname}`);
      localStorage.setItem('email', data.email);
      localStorage.setItem('contact', data.contact);
      localStorage.setItem('gender', data.gender);
      window.location.href = 'dashboard-patient.html';
    } else {
      showAlert('alert-box', data.message || 'Invalid email or password', 'danger');
    }
  } catch (error) {
    showAlert('alert-box', 'Server Connection Error.', 'danger');
  }
}

async function handleDoctorLogin(event) {
  event.preventDefault();
  const username = document.getElementById('doc-login-username').value.trim();
  const password = document.getElementById('doc-login-password').value;

  try {
    const response = await fetch(`${BASE_URL}/auth/doctor/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    });

    const data = await response.json();
    if (response.ok) {
      localStorage.setItem('role', 'doctor');
      localStorage.setItem('userId', data.id);
      localStorage.setItem('name', data.username);
      localStorage.setItem('spec', data.spec);
      localStorage.setItem('fees', data.docFees);
      window.location.href = 'dashboard-doctor.html';
    } else {
      showAlert('alert-box', data.message || 'Invalid username or password', 'danger');
    }
  } catch (error) {
    showAlert('alert-box', 'Server Connection Error.', 'danger');
  }
}

async function handleReceptionistLogin(event) {
  event.preventDefault();
  const username = document.getElementById('rec-login-username').value.trim();
  const password = document.getElementById('rec-login-password').value;

  try {
    const response = await fetch(`${BASE_URL}/auth/receptionist/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    });

    const data = await response.json();
    if (response.ok) {
      localStorage.setItem('role', 'receptionist');
      window.location.href = 'dashboard-receptionist.html';
    } else {
      showAlert('alert-box', data.message || 'Invalid admin credentials', 'danger');
    }
  } catch (error) {
    showAlert('alert-box', 'Server Connection Error.', 'danger');
  }
}

// ==========================================
// CONTACT / QUERY SUBMISSION
// ==========================================

async function handleContactSubmit(event) {
  event.preventDefault();
  const name = document.getElementById('contact-name').value.trim();
  const email = document.getElementById('contact-email').value.trim();
  const contact = document.getElementById('contact-phone').value.trim();
  const message = document.getElementById('contact-message').value.trim();

  try {
    const response = await fetch(`${BASE_URL}/queries/submit`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, contact, message })
    });

    if (response.ok) {
      showAlert('contact-alert', 'Thank you! Your message has been received.', 'success');
      event.target.reset();
    } else {
      showAlert('contact-alert', 'Unable to submit your message. Try again later.', 'danger');
    }
  } catch (error) {
    showAlert('contact-alert', 'Server Connection Error.', 'danger');
  }
}

// ==========================================
// PATIENT DASHBOARD OPERATIONS
// ==========================================
let allDoctorsGlobal = [];

async function loadPatientDashboard() {
  const patientName = localStorage.getItem('name');
  document.getElementById('patient-display-name').innerText = patientName;
  document.getElementById('welcome-patient-header').innerText = `Welcome, ${patientName}`;

  // Hook up date input change listener
  const dateInput = document.getElementById('book-date');
  if (dateInput) {
    dateInput.onchange = updateAvailableTimeSlots;
  }

  // Fetch doctors and build specializations list
  try {
    const res = await fetch(`${BASE_URL}/doctors/all`);
    if (res.ok) {
      allDoctorsGlobal = await res.json();
      populateSpecs(allDoctorsGlobal);
    }
  } catch (err) {
    console.error("Failed to load doctor lists", err);
  }

  loadPatientHistory();
  loadPatientPrescriptions();
}

function parseMinutes(timeStr) {
  if (!timeStr || !timeStr.includes(':')) return -1;
  const [h, m] = timeStr.split(':').map(Number);
  return h * 60 + m;
}

function generateSlots(startTime = "09:00", endTime = "16:45") {
  const slots = [];
  const startMin = parseMinutes(startTime);
  const endMin = parseMinutes(endTime);

  if (startMin === -1 || endMin === -1) {
    return [
      "09:00", "09:15", "09:30", "09:45",
      "10:00", "10:15", "10:30", "10:45",
      "11:00", "11:15", "11:30", "11:45",
      "12:00", "12:15", "12:30", "12:45",
      "13:00", "13:15", "13:30", "13:45",
      "14:00", "14:15", "14:30", "14:45",
      "15:00", "15:15", "15:30", "15:45",
      "16:00", "16:15", "16:30", "16:45"
    ];
  }

  function minutesToTime(m) {
    const hh = String(Math.floor(m / 60)).padStart(2, '0');
    const mm = String(m % 60).padStart(2, '0');
    return `${hh}:${mm}`;
  }

  if (startMin <= endMin) {
    for (let m = startMin; m <= endMin; m += 15) {
      slots.push(minutesToTime(m));
    }
  } else {
    // Overnight shift: e.g. 17:00 to 08:45 next day
    for (let m = startMin; m < 1440; m += 15) {
      slots.push(minutesToTime(m));
    }
    for (let m = 0; m <= endMin; m += 15) {
      slots.push(minutesToTime(m));
    }
  }

  return slots;
}

async function updateAvailableTimeSlots() {
  const doctor = document.getElementById('book-doctor').value;
  const appdate = document.getElementById('book-date').value;
  const container = document.getElementById('slots-container');
  const timeInput = document.getElementById('book-time');

  // Reset selected time
  timeInput.value = '';

  if (!doctor || !appdate) {
    container.innerHTML = '<div style="color: var(--text-muted); font-style: italic;">Please select a doctor and a date to view available time slots.</div>';
    return;
  }

  container.innerHTML = '<div style="color: var(--text-muted); font-style: italic;"><i class="fa-solid fa-spinner fa-spin"></i> Checking availability...</div>';

  try {
    const res = await fetch(`${BASE_URL}/appointments/doctor/${doctor}`);
    if (!res.ok) throw new Error("Failed to fetch appointments");
    
    const appointments = await res.json();
    
    // Get local today string in YYYY-MM-DD
    const now = new Date();
    const localYear = now.getFullYear();
    const localMonth = String(now.getMonth() + 1).padStart(2, '0');
    const localDay = String(now.getDate()).padStart(2, '0');
    const todayStr = `${localYear}-${localMonth}-${localDay}`;
    const currentMinutes = now.getHours() * 60 + now.getMinutes();

    // Filter active appointments for the selected date
    const activeBookings = appointments.filter(app => 
      app.appdate === appdate && app.userStatus === 1 && app.doctorStatus === 1
    );

    const selectedDoctorObj = allDoctorsGlobal.find(d => d.username === doctor);
    const docStart = selectedDoctorObj?.startTime || "09:00";
    const docEnd = selectedDoctorObj?.endTime || "16:45";

    const presetSlots = generateSlots(docStart, docEnd);

    container.innerHTML = '';

    presetSlots.forEach(slot => {
      const slotMin = parseMinutes(slot);
      
      // Check if slot has already passed for today
      const isPastToday = (appdate === todayStr) && (slotMin <= currentMinutes);

      // Check collision (diff < 15 mins)
      const isBooked = activeBookings.some(app => {
        const appMin = parseMinutes(app.apptime);
        return appMin !== -1 && Math.abs(appMin - slotMin) < 15;
      });

      let className = 'slot-btn';
      let titleText = '';
      let isDisabled = false;

      if (isBooked) {
        className += ' booked';
        titleText = 'This slot is booked by another patient';
        isDisabled = true;
      } else if (isPastToday) {
        className += ' past';
        titleText = 'This slot has already passed';
        isDisabled = true;
      } else {
        className += ' available';
      }

      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = className;
      btn.innerText = slot;

      if (isDisabled) {
        btn.disabled = true;
        btn.title = titleText;
      } else {
        btn.onclick = () => {
          document.querySelectorAll('.slot-btn').forEach(b => b.classList.remove('selected'));
          btn.classList.add('selected');
          timeInput.value = slot;
        };
      }
      container.appendChild(btn);
    });

  } catch (err) {
    console.error(err);
    container.innerHTML = '<div style="color: #dc3545; font-weight: bold;">Error loading slots. Please try again.</div>';
  }
}

function populateSpecs(doctors) {
  const specSelect = document.getElementById('book-spec');
  specSelect.innerHTML = '<option value="">Select Specialization</option>';

  const specs = [...new Set(doctors.map(d => d.spec))];
  specs.forEach(spec => {
    specSelect.innerHTML += `<option value="${spec}">${spec}</option>`;
  });
}

function loadDoctorsBySpec() {
  const spec = document.getElementById('book-spec').value;
  const docSelect = document.getElementById('book-doctor');
  docSelect.innerHTML = '<option value="">Select Doctor</option>';
  
  if (document.getElementById('book-fees')) document.getElementById('book-fees').value = '';
  if (document.getElementById('book-docemail')) document.getElementById('book-docemail').value = '';
  if (document.getElementById('book-docshift')) document.getElementById('book-docshift').value = '';

  if (!spec) return;

  const filtered = allDoctorsGlobal.filter(d => d.spec === spec);
  filtered.forEach(d => {
    const shiftText = `${d.startTime || '09:00'} - ${d.endTime || '16:45'}`;
    docSelect.innerHTML += `<option value="${d.username}">${d.username} (${shiftText})</option>`;
  });
}

function updateFeesAndEmail() {
  const docName = document.getElementById('book-doctor').value;
  const feesInput = document.getElementById('book-fees');
  const emailInput = document.getElementById('book-docemail');
  const shiftInput = document.getElementById('book-docshift');

  if (!docName) {
    if (feesInput) feesInput.value = '';
    if (emailInput) emailInput.value = '';
    if (shiftInput) shiftInput.value = '';
    updateAvailableTimeSlots();
    return;
  }

  const doctor = allDoctorsGlobal.find(d => d.username === docName);
  if (doctor) {
    if (feesInput) feesInput.value = doctor.docFees;
    if (emailInput) emailInput.value = doctor.email;
    if (shiftInput) shiftInput.value = `${doctor.startTime || '09:00'} - ${doctor.endTime || '16:45'}`;
    updateAvailableTimeSlots();
  }
}

async function handleBookAppointment(event) {
  event.preventDefault();
  const pid = localStorage.getItem('userId');
  const fname = localStorage.getItem('name').split(' ')[0];
  const lname = localStorage.getItem('name').split(' ')[1] || '';
  const email = localStorage.getItem('email');
  const contact = localStorage.getItem('contact');
  const gender = localStorage.getItem('gender');
  
  const doctor = document.getElementById('book-doctor').value;
  const docFees = parseInt(document.getElementById('book-fees').value);
  const appdate = document.getElementById('book-date').value;
  const apptime = document.getElementById('book-time').value;
  const emergency = document.getElementById('book-emergency')?.checked || false;

  // Validate that a time slot was selected
  if (!apptime) {
    showAlert('booking-alert', 'Please select an available time slot first!', 'danger');
    return;
  }

  // Validate date and time is in the future in local timezone
  const now = new Date();
  const [year, month, day] = appdate.split('-').map(Number);
  const [hours, minutes] = apptime.split(':').map(Number);
  const selectedDateTime = new Date(year, month - 1, day, hours, minutes);

  if (selectedDateTime <= now) {
    showAlert('booking-alert', 'Select an appointment time in the future!', 'danger');
    return;
  }

  try {
    const response = await fetch(`${BASE_URL}/appointments/book`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ pid, fname, lname, gender, email, contact, doctor, docFees, appdate, apptime, userStatus: 1, doctorStatus: 1, emergency })
    });

    const data = await response.json();
    if (response.ok) {
      showAlert('booking-alert', 'Appointment booked successfully!', 'success');
      event.target.reset();
      updateAvailableTimeSlots();
      loadPatientHistory();
    } else {
      showAlert('booking-alert', data.message || 'Time slot is taken or unavailable.', 'danger');
      alert(data.message || 'Time slot is taken or unavailable.');
    }
  } catch (error) {
    showAlert('booking-alert', 'Server connection failure.', 'danger');
    alert('Server connection failure.');
  }
}

async function loadPatientHistory() {
  const pid = localStorage.getItem('userId');
  try {
    const res = await fetch(`${BASE_URL}/appointments/patient/${pid}`);
    if (res.ok) {
      const appointments = await res.json();
      const tbody = document.getElementById('patient-history-table');
      tbody.innerHTML = '';
      
      if (appointments.length === 0) {
        tbody.innerHTML = '<tr><td colspan="7" style="text-align:center;">No appointments found.</td></tr>';
        return;
      }

      appointments.forEach(app => {
        let statusBadge = '';
        let actionBtn = '';
        
        if (app.userStatus === 1 && app.doctorStatus === 1) {
          statusBadge = '<span class="badge badge-active">Active</span>';
          actionBtn = `<button class="btn-action btn-cancel" onclick="cancelAppointment('${app.id}')">Cancel</button>`;
        } else if (app.userStatus === 2 || app.doctorStatus === 2) {
          statusBadge = '<span class="badge" style="background-color: #0dcaf0; color: white;">Completed</span>';
          actionBtn = '<span style="color:var(--text-muted); font-weight: bold;"><i class="fa-solid fa-check"></i> Done</span>';
        } else if (app.userStatus === 3 || app.doctorStatus === 3) {
          statusBadge = '<span class="badge" style="background-color: #ffc107; color: black; font-weight: 600;"><i class="fa-solid fa-clock"></i> Missed</span>';
          actionBtn = '<span style="color:var(--text-muted); font-weight: bold;">Expired</span>';
        } else {
          statusBadge = '<span class="badge badge-cancelled">Cancelled</span>';
          actionBtn = '<span style="color:var(--text-muted);">N/A</span>';
        }

        let typeBadge = app.emergency ? '<span class="badge" style="background-color: #dc3545; color: white; margin-bottom: 5px; display: inline-block;"><i class="fa-solid fa-truck-medical"></i> Emergency</span><br/>' : '';

        tbody.innerHTML += `
          <tr>
            <td>${app.id}</td>
            <td>Dr. ${app.doctor}</td>
            <td>INR ${app.docFees}</td>
            <td>${app.appdate}</td>
            <td>${app.apptime}</td>
            <td>${typeBadge}${statusBadge}</td>
            <td>${actionBtn}</td>
          </tr>
        `;
      });
    }
  } catch (err) {
    console.error("Failed to load appointment history", err);
  }
}

async function cancelAppointment(appId) {
  if (!confirm("Are you sure you want to cancel this appointment?")) return;

  try {
    const res = await fetch(`${BASE_URL}/appointments/cancel/${appId}`, { method: 'PUT' });
    if (res.ok) {
      showAlert('history-alert', 'Appointment cancelled successfully!', 'success');
      loadPatientHistory();
      loadReceptionistAppointments(); // Sync admin panel if running
    } else {
      showAlert('history-alert', 'Error cancelling appointment.', 'danger');
    }
  } catch (err) {
    showAlert('history-alert', 'Server error during cancellation.', 'danger');
  }
}

async function loadPatientPrescriptions() {
  const pid = localStorage.getItem('userId');
  try {
    const res = await fetch(`${BASE_URL}/prescriptions/patient/${pid}`);
    if (res.ok) {
      const pres = await res.json();
      const tbody = document.getElementById('patient-pres-table');
      tbody.innerHTML = '';

      if (pres.length === 0) {
        tbody.innerHTML = '<tr><td colspan="7" style="text-align:center;">No prescriptions available.</td></tr>';
        return;
      }

      pres.forEach(p => {
        tbody.innerHTML += `
          <tr>
            <td>Dr. ${p.doctor}</td>
            <td>${p.appdate}</td>
            <td>${p.apptime}</td>
            <td>${p.disease}</td>
            <td>${p.allergy}</td>
            <td>${p.prescription}</td>
            <td>
              <button class="btn-action btn-bill" onclick='viewReceipt(${JSON.stringify(p)})'>
                <i class="fa-solid fa-receipt"></i> Bill
              </button>
            </td>
          </tr>
        `;
      });
    }
  } catch (err) {
    console.error(err);
  }
}

function viewReceipt(pres) {
  const container = document.getElementById('receipt-container');
  const box = document.getElementById('bill-receipt');
  
  box.innerHTML = `
    <div class="receipt-header">
      <h2>GLOBAL HOSPITALS</h2>
      <p>Health Care & Medical Center</p>
      <p>----------------------------------</p>
    </div>
    <div class="receipt-row"><span>Appointment ID:</span> <span>${pres.appointmentId}</span></div>
    <div class="receipt-row"><span>Patient ID:</span> <span>${pres.pid}</span></div>
    <div class="receipt-row"><span>Patient Name:</span> <span>${pres.fname} ${pres.lname}</span></div>
    <div class="receipt-row"><span>Consulting Doctor:</span> <span>Dr. ${pres.doctor}</span></div>
    <div class="receipt-row"><span>Date:</span> <span>${pres.appdate}</span></div>
    <div class="receipt-row"><span>Time:</span> <span>${pres.apptime}</span></div>
    <div class="receipt-row"><span>Diagnosis:</span> <span>${pres.disease}</span></div>
    <div class="receipt-row"><span>Allergies:</span> <span>${pres.allergy}</span></div>
    <div class="receipt-row"><span>Medications:</span> <span>${pres.prescription}</span></div>
    <div class="receipt-row" style="font-weight: bold; border-top: 1px dashed black; padding-top: 5px; margin-top: 10px;">
      <span>Consultation Fee:</span> <span>INR 500.00</span>
    </div>
  `;
  container.style.display = 'block';
  box.scrollIntoView({ behavior: 'smooth' });
}

function printReceipt() {
  const printContents = document.getElementById('bill-receipt').innerHTML;
  const originalContents = document.body.innerHTML;
  
  document.body.innerHTML = `<div style="padding: 2rem; max-width: 400px; margin: 0 auto;">${printContents}</div>`;
  window.print();
  document.body.innerHTML = originalContents;
  window.location.reload(); // Reload to restore UI events
}


// ==========================================
// DOCTOR DASHBOARD OPERATIONS
// ==========================================

async function loadDoctorDashboard() {
  const docName = localStorage.getItem('name');
  const spec = localStorage.getItem('spec');
  
  document.getElementById('doctor-display-name').innerText = `Dr. ${docName}`;
  document.getElementById('doctor-display-spec').innerText = `${spec} Specialist`;

  loadDoctorAppointments();
  loadDoctorPrescriptions();
}

async function loadDoctorAppointments() {
  const doctor = localStorage.getItem('name');
  try {
    const res = await fetch(`${BASE_URL}/appointments/doctor/${doctor}`);
    if (res.ok) {
      const list = await res.json();
      const tbody = document.getElementById('doctor-appointments-table');
      tbody.innerHTML = '';

      if (list.length === 0) {
        tbody.innerHTML = '<tr><td colspan="10" style="text-align:center;">No scheduled appointments.</td></tr>';
        return;
      }

      const now = new Date();
      const localYear = now.getFullYear();
      const localMonth = String(now.getMonth() + 1).padStart(2, '0');
      const localDay = String(now.getDate()).padStart(2, '0');
      const todayStr = `${localYear}-${localMonth}-${localDay}`;

      list.forEach(app => {
        let statusBadge = '';
        let action = '';

        if (app.userStatus === 1 && app.doctorStatus === 1) {
          statusBadge = '<span class="badge badge-active">Active</span>';
          if (app.appdate > todayStr) {
            action = `<button class="btn-action btn-prescribe" disabled style="opacity: 0.6; cursor: not-allowed;" title="You can only prescribe on the day of the appointment (${app.appdate})"><i class="fa-solid fa-file-signature"></i> Prescribe</button>`;
          } else {
            action = `<button class="btn-action btn-prescribe" onclick="openPrescriptionForm('${app.id}', '${app.pid}', '${app.fname} ${app.lname}')"><i class="fa-solid fa-file-signature"></i> Prescribe</button>`;
          }
        } else if (app.userStatus === 2 || app.doctorStatus === 2) {
          statusBadge = '<span class="badge" style="background-color: #0dcaf0; color: white;">Completed</span>';
          action = '<span style="color:var(--text-muted); font-weight: bold;"><i class="fa-solid fa-check"></i> Done</span>';
        } else if (app.userStatus === 3 || app.doctorStatus === 3) {
          statusBadge = '<span class="badge" style="background-color: #ffc107; color: black; font-weight: 600;"><i class="fa-solid fa-clock"></i> Missed</span>';
          action = '<span style="color:var(--text-muted); font-weight: bold;">Expired</span>';
        } else {
          statusBadge = '<span class="badge badge-cancelled">Cancelled</span>';
          action = '<span style="color:var(--text-muted);">N/A</span>';
        }

        let typeBadge = app.emergency ? '<span class="badge" style="background-color: #dc3545; color: white; margin-bottom: 5px; display: inline-block;"><i class="fa-solid fa-truck-medical"></i> Emergency</span><br/>' : '';

        tbody.innerHTML += `
          <tr>
            <td>${app.id}</td>
            <td>${app.pid}</td>
            <td>${app.fname} ${app.lname}</td>
            <td>${app.gender}</td>
            <td>${app.email}</td>
            <td>${app.contact}</td>
            <td>${app.appdate}</td>
            <td>${app.apptime}</td>
            <td>${typeBadge}${statusBadge}</td>
            <td>${action}</td>
          </tr>
        `;
      });
    }
  } catch (err) {
    console.error(err);
  }
}

function openPrescriptionForm(appId, pid, patientName) {
  document.getElementById('prescription-form-container').style.display = 'block';
  document.getElementById('pres-app-id').value = appId;
  document.getElementById('pres-pat-id').value = pid;
  document.getElementById('pres-pat-name').value = patientName;
  document.getElementById('prescription-form-container').scrollIntoView({ behavior: 'smooth' });
}

function cancelPrescribing() {
  document.getElementById('prescription-form-container').style.display = 'none';
  document.getElementById('pres-app-id').value = '';
  document.getElementById('pres-pat-id').value = '';
  document.getElementById('pres-pat-name').value = '';
  document.getElementById('pres-disease').value = '';
  document.getElementById('pres-allergy').value = '';
  document.getElementById('pres-meds').value = '';
}

async function handlePrescriptionSubmit(event) {
  event.preventDefault();
  
  const appId = document.getElementById('pres-app-id').value;
  const pid = document.getElementById('pres-pat-id').value;
  const patientFullName = document.getElementById('pres-pat-name').value;
  const fname = patientFullName.split(' ')[0];
  const lname = patientFullName.split(' ')[1] || '';
  
  const disease = document.getElementById('pres-disease').value.trim();
  const allergy = document.getElementById('pres-allergy').value.trim();
  const prescription = document.getElementById('pres-meds').value.trim();
  const doctor = localStorage.getItem('name');

  try {
    const res = await fetch(`${BASE_URL}/prescriptions/create`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ appointmentId: appId, pid, fname, lname, disease, allergy, prescription, doctor })
    });

    if (res.ok) {
      showAlert('doctor-alert', 'Prescription saved and issued successfully!', 'success');
      cancelPrescribing();
      loadDoctorAppointments();
      loadDoctorPrescriptions();
    } else {
      showAlert('doctor-alert', 'Failed to save prescription.', 'danger');
    }
  } catch (err) {
    showAlert('doctor-alert', 'Connection error to the backend.', 'danger');
  }
}

async function loadDoctorPrescriptions() {
  const doctor = localStorage.getItem('name');
  try {
    const res = await fetch(`${BASE_URL}/prescriptions/doctor/${doctor}`);
    if (res.ok) {
      const list = await res.json();
      const tbody = document.getElementById('doctor-prescriptions-table');
      tbody.innerHTML = '';

      if (list.length === 0) {
        tbody.innerHTML = '<tr><td colspan="8" style="text-align:center;">No prescriptions issued yet.</td></tr>';
        return;
      }

      list.forEach(p => {
        tbody.innerHTML += `
          <tr>
            <td>${p.pid}</td>
            <td>${p.appointmentId}</td>
            <td>${p.fname} ${p.lname}</td>
            <td>${p.appdate}</td>
            <td>${p.apptime}</td>
            <td>${p.disease}</td>
            <td>${p.allergy}</td>
            <td>${p.prescription}</td>
          </tr>
        `;
      });
    }
  } catch (err) {
    console.error(err);
  }
}


// ==========================================
// RECEPTIONIST (ADMIN) DASHBOARD OPERATIONS
// ==========================================

let patientsGlobalList = [];
let appointmentsGlobalList = [];

async function loadReceptionistDashboard() {
  loadReceptionistStats();
  loadReceptionistDoctors();
  loadReceptionistPatients();
  loadReceptionistAppointments();
  loadReceptionistQueries();
}

async function loadReceptionistStats() {
  try {
    const res = await fetch(`${BASE_URL}/stats/overview`);
    if (res.ok) {
      const stats = await res.json();
      document.getElementById('stat-count-doctors').innerText = stats.doctors;
      document.getElementById('stat-count-patients').innerText = stats.patients;
      document.getElementById('stat-count-appointments').innerText = stats.appointments;
      document.getElementById('stat-count-queries').innerText = stats.queries;
    }
  } catch (err) {
    console.error("Error loading admin stats", err);
  }
}

let receptionistDoctorsGlobal = [];

async function loadReceptionistDoctors() {
  try {
    const res = await fetch(`${BASE_URL}/doctors/all`);
    if (res.ok) {
      const list = await res.json();
      receptionistDoctorsGlobal = list;
      const tbody = document.getElementById('receptionist-docs-table');
      tbody.innerHTML = '';

      list.forEach(doc => {
        const shiftText = `${doc.startTime || '09:00'} - ${doc.endTime || '16:45'}`;
        tbody.innerHTML += `
          <tr>
            <td>Dr. ${doc.username}</td>
            <td>${doc.spec}</td>
            <td>${doc.email}</td>
            <td><span class="badge" style="background-color: #198754; color: white; padding: 4px 8px; font-size: 0.85rem;"><i class="fa-solid fa-clock"></i> ${shiftText}</span></td>
            <td>INR ${doc.docFees}</td>
            <td>
              <button class="btn-action btn-reschedule" style="background-color: #0d6efd; color: white; margin-right: 5px;" onclick="openEditDoctorModal('${doc.id}')">
                <i class="fa-solid fa-edit"></i> Edit
              </button>
              <button class="btn-action btn-cancel" onclick="deleteDoctor('${doc.id}')">
                <i class="fa-solid fa-trash"></i> Delete
              </button>
            </td>
          </tr>
        `;
      });
    }
  } catch (err) {
    console.error(err);
  }
}

async function handleAddDoctor(event) {
  event.preventDefault();
  const username = document.getElementById('add-doc-name').value.trim();
  const email = document.getElementById('add-doc-email').value.trim();
  const spec = document.getElementById('add-doc-spec').value;
  const docFees = parseInt(document.getElementById('add-doc-fees').value);
  const password = document.getElementById('add-doc-password').value;
  const startTime = document.getElementById('add-doc-starttime')?.value || "09:00";
  const endTime = document.getElementById('add-doc-endtime')?.value || "16:45";

  try {
    const res = await fetch(`${BASE_URL}/doctors/add`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, email, spec, docFees, password, startTime, endTime })
    });

    if (res.ok) {
      showAlert('add-doc-alert', 'Doctor profile created successfully!', 'success');
      event.target.reset();
      loadReceptionistStats();
      loadReceptionistDoctors();
    } else {
      const errorMsg = await res.text();
      showAlert('add-doc-alert', errorMsg || 'Unable to save doctor profile.', 'danger');
    }
  } catch (err) {
    showAlert('add-doc-alert', 'Server connection failure.', 'danger');
  }
}

function openEditDoctorModal(docId) {
  const doc = receptionistDoctorsGlobal.find(d => d.id === docId);
  if (!doc) return;

  document.getElementById('edit-doc-id').value = doc.id;
  document.getElementById('edit-doc-name').value = doc.username;
  document.getElementById('edit-doc-email').value = doc.email;
  document.getElementById('edit-doc-spec').value = doc.spec;
  document.getElementById('edit-doc-fees').value = doc.docFees;
  document.getElementById('edit-doc-starttime').value = doc.startTime || "09:00";
  document.getElementById('edit-doc-endtime').value = doc.endTime || "16:45";

  const card = document.getElementById('edit-doc-card');
  card.style.display = 'block';
  card.scrollIntoView({ behavior: 'smooth' });
}

function cancelEditDoctor() {
  const card = document.getElementById('edit-doc-card');
  card.style.display = 'none';
  const alertBox = document.getElementById('edit-doc-alert');
  if (alertBox) alertBox.innerHTML = '';
}

async function handleUpdateDoctor(event) {
  event.preventDefault();
  const id = document.getElementById('edit-doc-id').value;
  const username = document.getElementById('edit-doc-name').value.trim();
  const email = document.getElementById('edit-doc-email').value.trim();
  const spec = document.getElementById('edit-doc-spec').value;
  const docFees = parseInt(document.getElementById('edit-doc-fees').value);
  const startTime = document.getElementById('edit-doc-starttime').value;
  const endTime = document.getElementById('edit-doc-endtime').value;

  try {
    const res = await fetch(`${BASE_URL}/doctors/update/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, email, spec, docFees, startTime, endTime })
    });

    if (res.ok) {
      showAlert('docs-list-alert', 'Doctor profile updated successfully!', 'success');
      cancelEditDoctor();
      loadReceptionistStats();
      loadReceptionistDoctors();
    } else {
      const errorMsg = await res.text();
      showAlert('edit-doc-alert', errorMsg || 'Unable to update doctor profile.', 'danger');
    }
  } catch (err) {
    showAlert('edit-doc-alert', 'Server connection failure.', 'danger');
  }
}

async function deleteDoctor(id) {
  if (!confirm("Are you sure you want to delete this doctor?")) return;

  try {
    const res = await fetch(`${BASE_URL}/doctors/delete/${id}`, { method: 'DELETE' });
    if (res.ok) {
      showAlert('docs-list-alert', 'Doctor profile deleted successfully.', 'success');
      loadReceptionistStats();
      loadReceptionistDoctors();
    } else {
      showAlert('docs-list-alert', 'Error deleting doctor.', 'danger');
    }
  } catch (err) {
    showAlert('docs-list-alert', 'Connection error.', 'danger');
  }
}

async function loadReceptionistPatients() {
  try {
    const res = await fetch(`${BASE_URL}/patients/all`);
    if (res.ok) {
      patientsGlobalList = await res.json();
      renderReceptionistPatients(patientsGlobalList);
    }
  } catch (err) {
    console.error(err);
  }
}

function renderReceptionistPatients(list) {
  const tbody = document.getElementById('receptionist-pats-table');
  tbody.innerHTML = '';
  
  if (list.length === 0) {
    tbody.innerHTML = '<tr><td colspan="6" style="text-align:center;">No patients registered.</td></tr>';
    return;
  }

  list.forEach(pat => {
    tbody.innerHTML += `
      <tr>
        <td>${pat.id}</td>
        <td>${pat.fname}</td>
        <td>${pat.lname}</td>
        <td>${pat.gender}</td>
        <td>${pat.email}</td>
        <td>${pat.contact}</td>
      </tr>
    `;
  });
}

function searchPatients() {
  const query = document.getElementById('patient-search-query').value.toLowerCase();
  const filtered = patientsGlobalList.filter(pat => {
    return pat.fname.toLowerCase().includes(query) ||
           pat.lname.toLowerCase().includes(query) ||
           pat.contact.includes(query) ||
           pat.id.includes(query);
  });
  renderReceptionistPatients(filtered);
}

async function loadReceptionistAppointments() {
  const sortParam = document.getElementById('appointment-sort-param').value;
  try {
    const res = await fetch(`${BASE_URL}/appointments/all?sortBy=${sortParam}`);
    if (res.ok) {
      appointmentsGlobalList = await res.json();
      renderReceptionistAppointments(appointmentsGlobalList);
    }
  } catch (err) {
    console.error(err);
  }
}

function renderReceptionistAppointments(list) {
  const tbody = document.getElementById('receptionist-apps-table');
  tbody.innerHTML = '';

  if (list.length === 0) {
    tbody.innerHTML = '<tr><td colspan="9" style="text-align:center;">No appointments booked.</td></tr>';
    return;
  }

  list.forEach(app => {
    let statusBadge = '';
    let actionBtn = '';

    if (app.userStatus === 1 && app.doctorStatus === 1) {
      statusBadge = '<span class="badge badge-active">Active</span>';
      actionBtn = `<button class="btn-action btn-cancel" onclick="cancelAppointmentByAdmin('${app.id}')">Cancel</button>`;
    } else if (app.userStatus === 2 || app.doctorStatus === 2) {
      statusBadge = '<span class="badge" style="background-color: #0dcaf0; color: white;">Completed</span>';
      actionBtn = '<span style="color:var(--text-muted); font-weight: bold;"><i class="fa-solid fa-check"></i> Done</span>';
    } else if (app.userStatus === 3 || app.doctorStatus === 3) {
      statusBadge = '<span class="badge" style="background-color: #ffc107; color: black; font-weight: 600;"><i class="fa-solid fa-clock"></i> Missed</span>';
      actionBtn = `<button class="btn-action btn-reschedule" style="background-color: #0d6efd; color: white;" onclick="rescheduleAppointmentByAdmin('${app.id}', '${app.appdate}', '${app.apptime}', '${app.doctor}')">Modify Time</button>`;
    } else {
      statusBadge = '<span class="badge badge-cancelled">Cancelled</span>';
      actionBtn = '<span style="color:var(--text-muted);">N/A</span>';
    }

    let typeBadge = app.emergency ? '<span class="badge" style="background-color: #dc3545; color: white; margin-bottom: 5px; display: inline-block;"><i class="fa-solid fa-truck-medical"></i> Emergency</span><br/>' : '';

    tbody.innerHTML += `
      <tr>
        <td>${app.id}</td>
        <td>${app.pid}</td>
        <td>${app.fname} ${app.lname}</td>
        <td>Dr. ${app.doctor}</td>
        <td>INR ${app.docFees}</td>
        <td>${app.appdate}</td>
        <td>${app.apptime}</td>
        <td>${typeBadge}${statusBadge}</td>
        <td>${actionBtn}</td>
      </tr>
    `;
  });
}

async function cancelAppointmentByAdmin(appId) {
  if (!confirm("Are you sure you want to cancel this appointment?")) return;

  try {
    const res = await fetch(`${BASE_URL}/appointments/cancel/${appId}`, { method: 'PUT' });
    if (res.ok) {
      showAlert('apps-list-alert', 'Appointment cancelled successfully!', 'success');
      loadReceptionistStats();
      loadReceptionistAppointments();
    } else {
      showAlert('apps-list-alert', 'Error cancelling appointment.', 'danger');
    }
  } catch (err) {
    showAlert('apps-list-alert', 'Server error.', 'danger');
  }
}

async function rescheduleAppointmentByAdmin(appId, currentDate, currentTime, doctor) {
  const newDate = prompt(`Enter new appointment date (YYYY-MM-DD) for Doctor ${doctor}:`, currentDate);
  if (!newDate) return;
  
  // Validate date format YYYY-MM-DD
  const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
  if (!dateRegex.test(newDate)) {
    alert("Invalid date format! Use YYYY-MM-DD.");
    return;
  }

  const newTime = prompt(`Enter new appointment time (HH:MM) for Doctor ${doctor} (15-min interval slot):`, currentTime);
  if (!newTime) return;

  // Validate time format HH:MM
  const timeRegex = /^\d{2}:\d{2}$/;
  if (!timeRegex.test(newTime)) {
    alert("Invalid time format! Use HH:MM.");
    return;
  }

  try {
    const res = await fetch(`${BASE_URL}/appointments/reschedule/${appId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ newDate, newTime })
    });

    const data = await res.json();

    if (res.ok) {
      showAlert('apps-list-alert', 'Appointment rescheduled successfully!', 'success');
      loadReceptionistStats();
      loadReceptionistAppointments();
    } else {
      showAlert('apps-list-alert', data.message || 'Error rescheduling appointment.', 'danger');
      if (data.message) {
        alert(data.message);
      }
    }
  } catch (err) {
    showAlert('apps-list-alert', 'Server error.', 'danger');
  }
}

function searchAppointments() {
  const query = document.getElementById('appointment-search-query').value.toLowerCase();
  const filtered = appointmentsGlobalList.filter(app => {
    return app.fname.toLowerCase().includes(query) ||
           app.lname.toLowerCase().includes(query) ||
           app.doctor.toLowerCase().includes(query);
  });
  renderReceptionistAppointments(filtered);
}

async function loadReceptionistQueries() {
  try {
    const res = await fetch(`${BASE_URL}/queries/all`);
    if (res.ok) {
      const list = await res.json();
      const tbody = document.getElementById('receptionist-queries-table');
      tbody.innerHTML = '';

      if (list.length === 0) {
        tbody.innerHTML = '<tr><td colspan="4" style="text-align:center;">No feedback queries.</td></tr>';
        return;
      }

      list.forEach(q => {
        tbody.innerHTML += `
          <tr>
            <td>${q.name}</td>
            <td>${q.email}</td>
            <td>${q.contact}</td>
            <td>${q.message}</td>
          </tr>
        `;
      });
    }
  } catch (err) {
    console.error(err);
  }
}

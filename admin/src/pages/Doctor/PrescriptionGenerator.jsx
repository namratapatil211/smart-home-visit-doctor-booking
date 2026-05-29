import React, { useState, useRef } from "react";
// Import the custom CSS file
import './PrescriptionGenerator.css';
// NOTE: We keep this import commented out as the data is defined below
// import { CONDITIONS, defaultDoctor, getCurrentDate } from './constants';




const CONDITION_TEMPLATES = [
  { id: 'custom', title: 'Custom Prescription', category: 'General', meds: [] },

  // ⭐ NEW — Common Cold
  {
    id: 'cold',
    title: 'Cold',
    category: 'Respiratory',
    meds: [
      { name: 'Cetirizine', 
        dose: '10 mg', 
        frequency: 'Once daily(HS)', 
        duration: '5 days', 
        instructions: 'Take at night; may causedrowsiness.' 
    },
    { 
        name: 'Paracetamol', 
        dose: '500 mg', 
        frequency: 'Every 6 hoursif needed', 
        duration: '3 days', 
        instructions: 'Only for fever/bodypain.'
     }
    ]
  },

  // ⭐ NEW — Fever
  {
    id: 'fever',
    title: 'Fever',
    category: 'General',
    meds: [
      { 
        name: 'Paracetamol',
         dose: '650 mg', 
         frequency: '3 times daily(TDS)', 
         duration: '3–5 days', 
         instructions: 'Take after food.'
         },
      { 
        name: 'ORS Solution', 
        dose: '200 ml', 
        frequency: 'As needed',
        duration: '2 days', 
        instructions: 'Maintain hydration.'
     }
    ]
  },

  // ⭐ UPDATED — Skin Infection (Keep as it is)
  {
    id: 'skin_infection',
    title: 'Skin Infection',
    category: 'Infection',
    meds: [
      {
         name: 'Cephalexin', 
         dose: '500 mg', 
         frequency: 'Four timesdaily',
          duration: '7–10 days', 
          instructions: 'Complete full course.'
        },
        { 
            name: 'Topical Antibiotic Ointment', 
            dose: 'Apply thin layer',
            frequency: 'Twice daily',
             duration: '7 days',
              instructions: 'Applylocally on affected area.' }
    ]
  }
];



function defaultDoctorData() {
  return {
    name: 'Dr. Richard James',
    qual: 'General physician',
    clinic: 'Wellness Medical Center, #56, Bhagya Nagar Main Road, Belagavi',
    contact: '9876785412 | dr.Richard@clinic.com'
  };
}

function escapeHtml(s) { if (!s) return ''; return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g,'&gt;'); }

const PrescriptionGenerator = ({ appointmentId, patientDetails = {} }) => {
  const [step, setStep] = useState(0); // 0:Patient, 1:Condition,2:Medications, 3:Doctor, 4:Review
  const [patient, setPatient] = useState({
    name: patientDetails.name || '',
    age: patientDetails.age || '',
    gender: patientDetails.gender || 'Female',
    weight: patientDetails.weight || ''
  });
  const [selectedCondition, setSelectedCondition] = useState('custom');
  const [medications, setMedications] = useState([]);
  const [doctor, setDoctor] = useState(defaultDoctorData());
  const [notes, setNotes] = useState('');
  const previewRef = useRef();

  // --- Core Logic ---
  const currentDiagnosisTitle = CONDITION_TEMPLATES.find(c => c.id ===
selectedCondition)?.title || 'N/A';

  function chooseCondition(id) {
    setSelectedCondition(id);
    const tmpl = CONDITION_TEMPLATES.find(c => c.id === id);
    if (tmpl && tmpl.meds && tmpl.meds.length) {
      setMedications(tmpl.meds.map(m => ({ ...m })));
    } else if (id === 'custom') {
      setMedications([]);
    }
  }

  function addMed() {
    setMedications(prev => [...prev, { name: '', dose: '', frequency:
'', duration: '', instructions: '' }]);
  }
  function updateMed(idx, key, value) {
    setMedications(prev => prev.map((m, i) => i === idx ? { ...m,
[key]: value } : m));
  }
  function removeMed(idx) {
    setMedications(prev => prev.filter((_, i) => i !== idx));
  }

  function next() {
    if (step < 4) setStep(step + 1);
  }
  function prev() {
    if (step > 0) setStep(step - 1);
  }

  // --- Output Handlers ---

  function renderPrintableHtml() {
    const patientHtml = `
      <div class="header-section">
        <h2 class="clinic-name">${escapeHtml(doctor.clinic)}</h2>
        <div class="doctor-info">${escapeHtml(doctor.name)}
${escapeHtml(doctor.qual)}</div>
        <div class="doctor-contact">${escapeHtml(doctor.contact)}</div>
      </div>
      <hr class="divider"/>
      <div class="patient-info">
        <h3>Patient Details</h3>
        <div><strong>Name:</strong> ${patient.name || '—'} |
<strong>Age:</strong> ${patient.age || '—'} | <strong>Gender:</strong>
${patient.gender || '—'} ${patient.weight ? `|
<strong>Weight:</strong> ${patient.weight} kg` : ''}</div>
        <div><strong>Date:</strong> ${new Date().toLocaleDateString()}</div>
      </div>
      <div class="diagnosis-section">
        <h3>Diagnosis (ICD-10)</h3>
        <p>${escapeHtml(currentDiagnosisTitle)}</p>
      </div>
      <div class="prescription-list">
        <h3>℞ Prescription</h3>
        ${medications.map((m, i) => `
          <div class="med-item">
            <div class="med-name"><strong>${i + 1}.
${escapeHtml(m.name || '—')}</strong></div>
            <ul class="med-details">
              <li>Dosage: ${escapeHtml(m.dose || '—')}</li>
              <li>Frequency: ${escapeHtml(m.frequency || '—')}</li>
              <li>Duration: ${escapeHtml(m.duration || '—')}</li>
              <li>Instructions: ${escapeHtml(m.instructions || '—')}</li>
            </ul>
          </div>
        `).join('')}
      </div>
      <div class="general-notes">
        <h3>General Instructions / Notes</h3>
        <p>${escapeHtml(notes || 'No specific instructions provided.')}</p>
      </div>
      <div class="signature">
        <p>Doctor's Signature: _________________________</p>
      </div>
    `;
    return patientHtml;
  }

  function printPreview() {
    const printWindow = window.open('', '_blank', 'width=800,height=900');
    // START OF PRINT STYLE FIX
    const style = `
      <style>
        body {
            font-family: Arial, sans-serif;
            padding: 25px;
            color: #000000; /* Ensure base body text is black */
        }
        .header-section { text-align: center; margin-bottom: 15px; }
        .clinic-name { font-size: 1.5em; font-weight: bold; color:
#1f2937; margin-bottom: 5px;}
        .doctor-info, .doctor-contact { font-size: 0.9em; color: #4b5563; }
        .divider { border: 0; height: 1px; background-color: #e5e7eb;
margin: 15px 0; }
        h3 { color: #10b981; border-bottom: 1px solid #d1fae5;
padding-bottom: 5px; margin-top: 20px; font-size: 1.1em; }
        /* Fix for invisible text inside the medication list items */
        .med-item * {
            color: #000000 !important;
        }
        .patient-info div, .diagnosis-section p { margin-top: 5px;
font-size: 0.95em; }
        .med-item { margin-bottom: 15px; padding: 10px; border-left:
3px solid #3b82f6; background: #f0f9ff; }
        .med-name { font-size: 1em; margin-bottom: 5px; }
        .med-details { list-style: none; padding-left: 15px; font-size: 0.9em; }
        .signature { margin-top: 40px; text-align: right; font-size: 0.9em; }
      </style>
    `;
    // END OF PRINT STYLE FIX

    const html = `<!doctype
html><html><head><title>Prescription</title>${style}</head><body>${renderPrintableHtml()}</body></html>`;
    printWindow.document.write(html);
    printWindow.document.close();
    printWindow.focus();
    // Use a slight delay to ensure content loads before printing is triggered
    setTimeout(() => { printWindow.print(); }, 500);
  }

  function handleSave() {
    const finalPrescriptionData = {
      appointmentId: appointmentId || 'APPOINTMENT_ID_MISSING',
      date: new Date().toISOString(),
      patient: patient,
      doctor: doctor,
      diagnosis: currentDiagnosisTitle,
      medications: medications,
      notes: notes,
    };

    console.log("Saving Prescription Data to API:", finalPrescriptionData);

    // *** INTEGRATION POINT: Replace this alert with your actual API call ***

    alert('Prescription finalized and ready to be saved via API. Checkconsole for data structure.');
  }

  // --- Render Steps (using CSS classes for layout) ---

  function renderPatientStep() {
    return (
      <div className="form-step">
        <h2 className="step-title">👤 Patient Information</h2>
        <div className="form-grid">
          <label>Name
            <input value={patient.name} onChange={e => setPatient({
...patient, name: e.target.value })}
              className="form-input" placeholder="Patient's full name"
required />
          </label>
          <label>Age (Years)
            <input type="number" value={patient.age} onChange={e =>
setPatient({ ...patient, age: e.target.value })}
              className="form-input" placeholder="e.g., 45" />
          </label>
          <label>Gender
            <select value={patient.gender} onChange={e => setPatient({
...patient, gender: e.target.value })}
              className="form-input">
              <option>Female</option>
              <option>Male</option>
              <option>Other</option>
            </select>
          </label>
          <label>Weight (kg)
            <input type="number" value={patient.weight} onChange={e =>
setPatient({ ...patient, weight: e.target.value })}
              className="form-input" placeholder="Optional" />
          </label>
        </div>
        {/* NOTE: No next/prev here, navigation is only in the footer */}
      </div>
    );
  }

  function renderConditionStep() {
    return (
      <div className="form-step">
        <h2 className="step-title">📋 Select Diagnosis Template</h2>
        <p className="step-description">Choosing a template
automatically suggests relevant medications and instructions.</p>
        <div className="condition-grid">
          {CONDITION_TEMPLATES.map(c => (
            <button key={c.id} onClick={() => chooseCondition(c.id)}
              className={`condition-card ${selectedCondition === c.id
? 'active' : ''}`}>
              <div className="card-title">{c.title}</div>
              <div className="card-category">{c.category}</div>
            </button>
          ))}
        </div>
      </div>
    );
  }

  function renderMedicationsStep() {
    return (
      <div className="form-step">
        <div className="flex-header">
          <h2 className="step-title">💊 Prescribe Medications</h2>
          <button onClick={addMed} className="btn-primary">+ Add New
Medication</button>
        </div>
        {medications.length === 0 && <div className="warning-box">No
medications added. Click '+ Add New Medication' above.</div>}
        <div className="medication-list">
          {medications.map((m, idx) => (
            <div key={idx} className="medication-item">
              <div className="med-header">
                <div className="med-counter">{idx + 1}</div>
                <h3 className="med-title">Medication Details</h3>
                <button onClick={() => removeMed(idx)}
className="btn-remove">Remove</button>
              </div>

              <div className="form-grid-med">
                <label className="span-2">Name
                  <input value={m.name} onChange={e => updateMed(idx,
'name', e.target.value)} className="form-input" placeholder="e.g.,
Amoxicillin 500mg" />
                </label>
                <label>Dosage
                  <input value={m.dose} onChange={e => updateMed(idx,
'dose', e.target.value)} className="form-input" placeholder="e.g., 500
mg" />
                </label>
                <label>Frequency
                  <input value={m.frequency} onChange={e =>
updateMed(idx, 'frequency', e.target.value)} className="form-input"
placeholder="e.g., Twice daily (BD)" />
                </label>
                <label>Duration
                  <input value={m.duration} onChange={e =>
updateMed(idx, 'duration', e.target.value)} className="form-input"
placeholder="e.g., 7 days" />
                </label>
                <label className="span-4">Instructions / Notes (Take
after food, etc.)
                  <textarea value={m.instructions} onChange={e =>
updateMed(idx, 'instructions', e.target.value)} className="form-input"
rows={2} />
                </label>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  function renderDoctorStep() {
    return (
      <div className="form-step">
        <h2 className="step-title">👨‍⚕️ Doctor / Clinic Information</h2>
        <p className="step-description">This information will appear
on the final prescription header.</p>
        <div className="form-grid">
          <label>Doctor Name
            <input value={doctor.name} onChange={e => setDoctor({
...doctor, name: e.target.value })} className="form-input" />
          </label>
          <label>Qualifications
            <input value={doctor.qual} onChange={e => setDoctor({
...doctor, qual: e.target.value })} className="form-input" />
          </label>
          <label>Clinic / Hospital
            <input value={doctor.clinic} onChange={e => setDoctor({
...doctor, clinic: e.target.value })} className="form-input" />
          </label>
          <label>Contact Info
            <input value={doctor.contact} onChange={e => setDoctor({
...doctor, contact: e.target.value })} className="form-input" />
          </label>
        </div>
        <div className="mt-6">
          <label>Additional Notes (General Instructions for Patient)
            <textarea value={notes} onChange={e =>
setNotes(e.target.value)} className="form-input" rows={4} />
          </label>
        </div>
      </div>
    );
  }

  function renderReviewStep() {
    return (
      <div className="form-step">
        <h2 className="step-title">✅ Final Review & Save</h2>
        <p className="step-description">Verify the details below
before finalizing the prescription.</p>

        <div className="review-box">
          <div className="review-section">
            <h3 className="review-title">Patient & Diagnosis</h3>
            <p><strong>Name:</strong> {patient.name || '—'} |
<strong>Age:</strong> {patient.age || '—'} | <strong>Gender:</strong>
{patient.gender || '—'}</p>
            <p><strong>Diagnosis:</strong> {currentDiagnosisTitle}</p>
          </div>
          <div className="review-section">
            <h3 className="review-title">Prescribed Medications
({medications.length})</h3>
            <ul className="med-review-list">
              {medications.map((m, i) => (
                <li key={i}>
                  <strong className="text-blue-600">{i + 1}. {m.name}</strong>
                  <span className="text-gray-600"> ({m.dose} -
{m.frequency} for {m.duration})</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="review-section">
            <h3 className="review-title">Doctor Notes</h3>
            <p className="note-text">{notes || 'No general notes.'}</p>
          </div>
        </div>

        <div className="action-buttons-review">
          <button onClick={handleSave} className="btn-save">
            💾 Save & Finalize Prescription
          </button>
          <button onClick={printPreview} className="btn-print">
            🖨️ Print / Generate PDF
          </button>
        </div>
      </div>
    );
  }

  // --- Main Render ---

  const renderStepContent = () => {
    switch (step) {
      case 0: return renderPatientStep();
      case 1: return renderConditionStep();
      case 2: return renderMedicationsStep();
      case 3: return renderDoctorStep();
      case 4: return renderReviewStep();
      default: return null;
    }
  };

  return (
    <div className="generator-container">
      <div className="progress-bar">
        {['Patient', 'Diagnosis', 'Meds', 'Doctor',
'Review'].map((label, i) => (
          <div key={i} className={`progress-step ${i <= step ? 'active' : ''}`}>
            <div className="progress-icon">{i + 1}</div>
            <div className="progress-label">{label}</div>
          </div>
        ))}
      </div>

      <div className="content-area">
        <div className="main-form">
          {renderStepContent()}
        </div>

        <div className="preview-panel">
          <h3>Quick Preview (Final Look)</h3>
          <div className="preview-box" ref={previewRef}
dangerouslySetInnerHTML={{ __html: renderPrintableHtml() }}>
            {/* Content injected here via renderPrintableHtml */}
          </div>
        </div>
      </div>

      <div className="navigation-footer">
        <button onClick={prev} disabled={step === 0} className="btn-secondary">
          ← Previous
        </button>
        {/* FIX: Set the 'Next' button to be hidden only on the final
step (4) */}
        <button
          onClick={next}
          className={`btn-primary ${step === 4 ? 'hidden' : ''}`}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default PrescriptionGenerator;
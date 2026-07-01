"use client";

import { useEffect, useMemo, useState } from "react";

type View =
  | "Dashboard"
  | "Patients"
  | "New Consult"
  | "Today's Consults"
  | "Calendar"
  | "Reports"
  | "Drug Formulary"
  | "Settings";

type PmhKey =
  | "Hypertension"
  | "Diabetes Mellitus"
  | "Asthma"
  | "CKD"
  | "Dyslipidemia"
  | "CAD"
  | "Stroke"
  | "TB"
  | "Others";

type Patient = {
  id: string;
  fullName: string;
  dob: string;
  sex: "M" | "F";
  civilStatus: string;
  contact: string;
  address: string;
  occupation: string;
  emergencyContact: string;
  allergies: string;
  pmh: Record<PmhKey, boolean>;
  otherPmh: string;
  psh: string;
  familyHistory: string;
  socialSmoking: string;
  socialAlcohol: string;
  vaccination: string;
  weight: string;
  height: string;
  lastConsult: string;
};

type Vitals = {
  bp: string;
  hr: string;
  rr: string;
  temp: string;
  spo2: string;
  weight: string;
};

type LabRow = {
  id: string;
  test: string;
  result: string;
  unit: string;
  range: string;
  date: string;
};

type ImagingRow = {
  id: string;
  test: string;
  finding: string;
  status: string;
  date: string;
};

type DrugRow = {
  id: string;
  medication: string;
  dose: string;
  frequency: string;
  duration: string;
  sig: string;
  qty: string;
};

type DrugTemplate = Omit<DrugRow, "id"> & {
  id: string;
  stock: string;
};

type Certificate = {
  recommendation: string;
  generated: boolean;
};

type Encounter = {
  id: string;
  patientId: string;
  dateTime: string;
  consultType: string;
  chiefComplaint: string;
  subjective: string;
  objective: string;
  vitals: Vitals;
  assessment: string;
  plan: string;
  labs: LabRow[];
  imaging: ImagingRow[];
  prescriptions: DrugRow[];
  certificate: Certificate;
  status: "Draft" | "Saved";
};

type Appointment = {
  id: string;
  patientId: string;
  date: string;
  time: string;
  reason: string;
  status: "Scheduled" | "Done" | "Cancelled";
};

type Settings = {
  clinicName: string;
  doctorName: string;
  licenseNumber: string;
  clinicAddress: string;
  defaultCertificate: string;
};

type AppData = {
  patients: Patient[];
  encounters: Encounter[];
  appointments: Appointment[];
  drugTemplates: DrugTemplate[];
  settings: Settings;
};

type Session = {
  data: AppData;
  activePatientId: string;
  activeView: View;
  draft: Encounter;
};

const STORAGE_KEY = "myclinic-emr-full-local";

const pmhOptions: PmhKey[] = [
  "Hypertension",
  "Diabetes Mellitus",
  "Asthma",
  "CKD",
  "Dyslipidemia",
  "CAD",
  "Stroke",
  "TB",
  "Others",
];

const navItems: Array<{ label: View; symbol: string }> = [
  { label: "Dashboard", symbol: "H" },
  { label: "Patients", symbol: "P" },
  { label: "New Consult", symbol: "+" },
  { label: "Today's Consults", symbol: "T" },
  { label: "Calendar", symbol: "C" },
  { label: "Reports", symbol: "R" },
  { label: "Drug Formulary", symbol: "D" },
  { label: "Settings", symbol: "S" },
];

const labTemplates: LabRow[] = [
  { id: "lab-cbc", test: "CBC", result: "View Details", unit: "", range: "Hgb 13 - 17", date: "07/01/2026" },
  { id: "lab-cmp", test: "CMP", result: "Normal", unit: "", range: "Template", date: "07/01/2026" },
  { id: "lab-lipid", test: "Lipid Profile", result: "Pending", unit: "", range: "Template", date: "07/01/2026" },
  { id: "lab-hba1c", test: "HbA1c", result: "6.9", unit: "%", range: "< 5.7", date: "07/01/2026" },
  { id: "lab-fbs", test: "FBS", result: "98", unit: "mg/dL", range: "70 - 110", date: "07/01/2026" },
  { id: "lab-crea", test: "Creatinine", result: "0.9", unit: "mg/dL", range: "0.6 - 1.2", date: "07/01/2026" },
];

const imagingTemplates: ImagingRow[] = [
  { id: "img-cxr", test: "CXR", finding: "No active infiltrates", status: "Final", date: "07/01/2026" },
  { id: "img-ecg", test: "ECG", finding: "Normal sinus rhythm", status: "Final", date: "07/01/2026" },
  { id: "img-utz", test: "UTZ", finding: "Pending result", status: "Pending", date: "07/01/2026" },
];

const initialDrugTemplates: DrugTemplate[] = [
  {
    id: "drug-paracetamol",
    medication: "Paracetamol 500mg",
    dose: "1 tab",
    frequency: "q6 PRN",
    duration: "3 days",
    sig: "q6 PRN fever",
    qty: "10 tabs",
    stock: "Available",
  },
  {
    id: "drug-amoxicillin",
    medication: "Amoxicillin 500mg",
    dose: "1 cap",
    frequency: "TID",
    duration: "7 days",
    sig: "TID after meals",
    qty: "21 caps",
    stock: "Available",
  },
  {
    id: "drug-loratadine",
    medication: "Loratadine 10mg",
    dose: "1 tab",
    frequency: "OD",
    duration: "7 days",
    sig: "OD",
    qty: "7 tabs",
    stock: "Low",
  },
  {
    id: "drug-losartan",
    medication: "Losartan 50mg",
    dose: "1 tab",
    frequency: "OD",
    duration: "30 days",
    sig: "OD after breakfast",
    qty: "30 tabs",
    stock: "Available",
  },
];

const initialPatients: Patient[] = [
  {
    id: "2025-000123",
    fullName: "Dela Cruz, Juan",
    dob: "1992-01-15",
    sex: "M",
    civilStatus: "Married",
    contact: "0917 123 4567",
    address: "123 Mabini St., Brgy. San Jose, City of Dasmarinas, Cavite",
    occupation: "Driver",
    emergencyContact: "Maria Dela Cruz (Wife), 0917 987 6543",
    allergies: "Penicillin, Shrimp",
    pmh: makePmh(["Hypertension", "Diabetes Mellitus"]),
    otherPmh: "",
    psh: "Appendectomy (2010)",
    familyHistory: "Hypertension (Mother)\nDiabetes Mellitus (Father)",
    socialSmoking: "Former",
    socialAlcohol: "Occasional",
    vaccination: "COVID-19 x3, Influenza (2024)",
    weight: "72",
    height: "170",
    lastConsult: "July 1, 2026",
  },
  {
    id: "2025-000124",
    fullName: "Santos, Maria",
    dob: "1984-09-02",
    sex: "F",
    civilStatus: "Single",
    contact: "0918 222 8899",
    address: "45 Rizal Ave., Imus, Cavite",
    occupation: "Teacher",
    emergencyContact: "Ana Santos (Sister), 0917 111 8899",
    allergies: "None known",
    pmh: makePmh(["Asthma"]),
    otherPmh: "",
    psh: "Cesarean section (2016)",
    familyHistory: "Asthma (Mother)",
    socialSmoking: "None",
    socialAlcohol: "None",
    vaccination: "COVID-19 x4",
    weight: "61",
    height: "158",
    lastConsult: "June 28, 2026",
  },
  {
    id: "2025-000125",
    fullName: "Lim, Roberto",
    dob: "1976-03-29",
    sex: "M",
    civilStatus: "Married",
    contact: "0920 555 0198",
    address: "8 Aguinaldo Highway, Bacoor, Cavite",
    occupation: "Business Owner",
    emergencyContact: "Grace Lim (Wife), 0920 555 0199",
    allergies: "Seafood",
    pmh: makePmh(["Hypertension", "Dyslipidemia"]),
    otherPmh: "",
    psh: "None",
    familyHistory: "CAD (Father)\nHypertension (Mother)",
    socialSmoking: "Former",
    socialAlcohol: "Regular",
    vaccination: "Influenza (2025)",
    weight: "84",
    height: "174",
    lastConsult: "June 20, 2026",
  },
];

const initialSettings: Settings = {
  clinicName: "MyClinic EMR",
  doctorName: "Dr. Maria Reyes",
  licenseNumber: "PRC 123456",
  clinicAddress: "Dasmarinas, Cavite",
  defaultCertificate: "Fit to rest for 2 days.",
};

const initialAppointments: Appointment[] = [
  {
    id: "APT-001",
    patientId: "2025-000123",
    date: "2026-07-01",
    time: "10:30",
    reason: "Cough follow-up",
    status: "Scheduled",
  },
  {
    id: "APT-002",
    patientId: "2025-000124",
    date: "2026-07-01",
    time: "14:00",
    reason: "Asthma review",
    status: "Scheduled",
  },
  {
    id: "APT-003",
    patientId: "2025-000125",
    date: "2026-07-02",
    time: "09:00",
    reason: "BP monitoring",
    status: "Scheduled",
  },
];

const initialEncounter: Encounter = {
  id: "ENC-2026-000456",
  patientId: "2025-000123",
  dateTime: "07/01/2026 10:42 AM",
  consultType: "Clinic Consult",
  chiefComplaint: "Cough and colds x 5 days",
  subjective:
    "Cough productive of yellowish sputum, colds, nasal congestion, sore throat. No fever. No shortness of breath.",
  objective:
    "Awake, alert, not in distress\nPinkish palpebral conjunctivae, anicteric sclerae.\nChest: occasional rhonchi, no wheezing\nHeart: regular rate and rhythm, no murmurs\nAbdomen: soft, non-tender",
  vitals: {
    bp: "120/80",
    hr: "88",
    rr: "20",
    temp: "36.7",
    spo2: "98",
    weight: "72",
  },
  assessment: "Acute Upper Respiratory Tract Infection",
  plan:
    "1. Increase fluid intake\n2. Rest\n3. Paracetamol 500mg q6 PRN fever\n4. Follow-up if symptoms persist or worsen\n5. Return to consult in 3 days",
  labs: [
    labTemplates[0],
    labTemplates[4],
    labTemplates[5],
    { id: "lab-uric", test: "Uric Acid", result: "5.8", unit: "mg/dL", range: "3.5 - 7.2", date: "07/01/2026" },
  ],
  imaging: [imagingTemplates[0]],
  prescriptions: [
    templateToDrug(initialDrugTemplates[1]),
    templateToDrug(initialDrugTemplates[2]),
    templateToDrug(initialDrugTemplates[0]),
  ],
  certificate: {
    recommendation: "Fit to rest for 2 days.",
    generated: false,
  },
  status: "Draft",
};

const initialData: AppData = {
  patients: initialPatients,
  encounters: [{ ...initialEncounter, status: "Saved" }],
  appointments: initialAppointments,
  drugTemplates: initialDrugTemplates,
  settings: initialSettings,
};

const initialSession: Session = {
  data: initialData,
  activePatientId: "2025-000123",
  activeView: "New Consult",
  draft: initialEncounter,
};

export default function Home() {
  const [session, setSession] = useState(initialSession);
  const [signedIn, setSignedIn] = useState(true);
  const [hydrated, setHydrated] = useState(false);
  const [search, setSearch] = useState("");
  const [toast, setToast] = useState("");
  const [sideTab, setSideTab] = useState<"orders" | "prescription" | "certificate">("orders");
  const [orderMode, setOrderMode] = useState<"labs" | "imaging">("labs");
  const [showNewPatient, setShowNewPatient] = useState(false);
  const [showTrends, setShowTrends] = useState(false);
  const [selectedLab, setSelectedLab] = useState<LabRow | null>(null);
  const [drugQuery, setDrugQuery] = useState("");
  const [orderQuery, setOrderQuery] = useState("");
  const [appointmentDraft, setAppointmentDraft] = useState({
    patientId: initialPatients[0].id,
    date: "2026-07-02",
    time: "09:30",
    reason: "Follow-up",
  });
  const [newDrug, setNewDrug] = useState({
    medication: "",
    dose: "",
    frequency: "",
    duration: "",
    sig: "",
    qty: "",
    stock: "Available",
  });
  const [reportReady, setReportReady] = useState(false);

  useEffect(() => {
    const saved = window.localStorage.getItem(STORAGE_KEY);
    const timer = window.setTimeout(() => {
      if (saved) {
        try {
          setSession(JSON.parse(saved) as Session);
        } catch {
          window.localStorage.removeItem(STORAGE_KEY);
        }
      }
      setHydrated(true);
    }, 0);

    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
  }, [hydrated, session]);

  const { data, draft } = session;
  const activePatient = useMemo(
    () => data.patients.find((patient) => patient.id === session.activePatientId) ?? data.patients[0],
    [data.patients, session.activePatientId],
  );
  const activeAge = calculateAge(activePatient.dob);
  const bmi = calculateBmi(activePatient.weight, activePatient.height);
  const todayEncounters = data.encounters.filter((encounter) => encounter.dateTime.includes("07/01/2026"));
  const pendingLabs = draft.labs.filter((lab) => lab.result.toLowerCase() === "pending").length;
  const pendingCertificates = draft.certificate.generated ? 0 : 1;
  const filteredPatients = filterPatients(data.patients, search);

  function setView(view: View) {
    setSession((current) => ({ ...current, activeView: view }));
    setToast("");
  }

  function showMessage(message: string) {
    setToast(message);
  }

  function updateDraft(patch: Partial<Encounter>) {
    setSession((current) => ({ ...current, draft: { ...current.draft, ...patch } }));
  }

  function updatePatient(patch: Partial<Patient>) {
    setSession((current) => ({
      ...current,
      data: {
        ...current.data,
        patients: current.data.patients.map((patient) =>
          patient.id === current.activePatientId ? { ...patient, ...patch } : patient,
        ),
      },
    }));
  }

  function selectPatient(patientId: string, view: View = "New Consult") {
    setSession((current) => ({
      ...current,
      activePatientId: patientId,
      activeView: view,
      draft: current.draft.patientId === patientId ? current.draft : makeEncounter(patientId, current.data.settings),
    }));
    setSearch("");
  }

  function startNewConsult(patientId = activePatient.id) {
    setSession((current) => ({
      ...current,
      activePatientId: patientId,
      activeView: "New Consult",
      draft: makeEncounter(patientId, current.data.settings),
    }));
    setSideTab("orders");
    showMessage("New consult ready.");
  }

  function loadEncounter(encounter: Encounter) {
    setSession((current) => ({
      ...current,
      activePatientId: encounter.patientId,
      activeView: "New Consult",
      draft: { ...encounter },
    }));
    setSideTab("orders");
    showMessage("Encounter loaded.");
  }

  function saveEncounter(status: "Draft" | "Saved") {
    const savedDraft = { ...draft, status };
    setSession((current) => ({
      ...current,
      draft: savedDraft,
      data: {
        ...current.data,
        patients: current.data.patients.map((patient) =>
          patient.id === savedDraft.patientId ? { ...patient, lastConsult: savedDraft.dateTime.split(" ")[0] } : patient,
        ),
        encounters: upsertById(current.data.encounters, savedDraft),
      },
    }));
    showMessage(status === "Saved" ? "Encounter saved." : "Draft saved.");
  }

  function addNewPatient(formData: FormData) {
    const fullName = String(formData.get("fullName") ?? "").trim();
    if (!fullName) {
      showMessage("Patient name is required.");
      return;
    }

    const patient: Patient = {
      id: `2026-${String(data.patients.length + 1).padStart(6, "0")}`,
      fullName,
      dob: String(formData.get("dob") ?? "1990-01-01"),
      sex: String(formData.get("sex") ?? "M") as "M" | "F",
      civilStatus: String(formData.get("civilStatus") ?? ""),
      contact: String(formData.get("contact") ?? ""),
      address: String(formData.get("address") ?? ""),
      occupation: String(formData.get("occupation") ?? ""),
      emergencyContact: String(formData.get("emergencyContact") ?? ""),
      allergies: "",
      pmh: makePmh([]),
      otherPmh: "",
      psh: "",
      familyHistory: "",
      socialSmoking: "None",
      socialAlcohol: "None",
      vaccination: "",
      weight: "",
      height: "",
      lastConsult: "New patient",
    };

    setSession((current) => ({
      ...current,
      activePatientId: patient.id,
      activeView: "New Consult",
      draft: makeEncounter(patient.id, current.data.settings),
      data: { ...current.data, patients: [...current.data.patients, patient] },
    }));
    setShowNewPatient(false);
    showMessage("Patient added.");
  }

  function addLabOrImaging() {
    if (orderMode === "labs") {
      const template = findTemplate(labTemplates, orderQuery, "test") ?? {
        id: makeId("LAB"),
        test: orderQuery.trim() || "Custom Lab",
        result: "Pending",
        unit: "",
        range: "",
        date: todayDate(),
      };
      updateDraft({ labs: [...draft.labs, { ...template, id: makeId("LAB") }] });
      setOrderQuery("");
      showMessage("Lab added.");
      return;
    }

    const template = findTemplate(imagingTemplates, orderQuery, "test") ?? {
      id: makeId("IMG"),
      test: orderQuery.trim() || "Custom Imaging",
      finding: "Pending result",
      status: "Pending",
      date: todayDate(),
    };
    updateDraft({ imaging: [...draft.imaging, { ...template, id: makeId("IMG") }] });
    setOrderQuery("");
    showMessage("Imaging added.");
  }

  function updateLab(id: string, patch: Partial<LabRow>) {
    updateDraft({ labs: draft.labs.map((lab) => (lab.id === id ? { ...lab, ...patch } : lab)) });
  }

  function updateImaging(id: string, patch: Partial<ImagingRow>) {
    updateDraft({ imaging: draft.imaging.map((item) => (item.id === id ? { ...item, ...patch } : item)) });
  }

  function addPrescription(template?: DrugTemplate) {
    const matched = template ?? findTemplate(data.drugTemplates, drugQuery, "medication");
    const drug = matched
      ? templateToDrug(matched)
      : {
          id: makeId("RX"),
          medication: drugQuery.trim() || "Custom medication",
          dose: "",
          frequency: "",
          duration: "",
          sig: "",
          qty: "",
        };
    updateDraft({ prescriptions: [...draft.prescriptions, drug] });
    setDrugQuery("");
    setSideTab("prescription");
    showMessage("Drug added.");
  }

  function updatePrescription(id: string, patch: Partial<DrugRow>) {
    updateDraft({
      prescriptions: draft.prescriptions.map((drug) => (drug.id === id ? { ...drug, ...patch } : drug)),
    });
  }

  function addAppointment() {
    const appointment: Appointment = {
      id: makeId("APT"),
      patientId: appointmentDraft.patientId,
      date: appointmentDraft.date,
      time: appointmentDraft.time,
      reason: appointmentDraft.reason,
      status: "Scheduled",
    };
    setSession((current) => ({
      ...current,
      data: { ...current.data, appointments: [...current.data.appointments, appointment] },
    }));
    showMessage("Appointment scheduled.");
  }

  function updateAppointment(id: string, status: Appointment["status"]) {
    setSession((current) => ({
      ...current,
      data: {
        ...current.data,
        appointments: current.data.appointments.map((appointment) =>
          appointment.id === id ? { ...appointment, status } : appointment,
        ),
      },
    }));
    showMessage(`Appointment marked ${status.toLowerCase()}.`);
  }

  function saveDrugTemplate() {
    if (!newDrug.medication.trim()) {
      showMessage("Drug name is required.");
      return;
    }

    setSession((current) => ({
      ...current,
      data: {
        ...current.data,
        drugTemplates: [...current.data.drugTemplates, { ...newDrug, id: makeId("DRUG") }],
      },
    }));
    setNewDrug({ medication: "", dose: "", frequency: "", duration: "", sig: "", qty: "", stock: "Available" });
    showMessage("Drug shortcut saved.");
  }

  function updateSettings(patch: Partial<Settings>) {
    setSession((current) => ({ ...current, data: { ...current.data, settings: { ...current.data.settings, ...patch } } }));
  }

  function restoreSampleData() {
    setSession(initialSession);
    showMessage("Sample data restored.");
  }

  function clearLocalData() {
    if (!window.confirm("Clear local EMR demo data from this browser?")) return;
    window.localStorage.removeItem(STORAGE_KEY);
    setSession(initialSession);
    showMessage("Local data cleared.");
  }

  function exportBackup() {
    const blob = new Blob([JSON.stringify(session, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "myclinic-emr-backup.json";
    link.click();
    URL.revokeObjectURL(url);
    showMessage("Backup exported.");
  }

  function exportReportCsv() {
    const rows = [
      ["Metric", "Value"],
      ["Patients", data.patients.length],
      ["Saved encounters", data.encounters.length],
      ["Scheduled appointments", data.appointments.filter((item) => item.status === "Scheduled").length],
      ["Prescription items in current consult", draft.prescriptions.length],
    ];
    const csv = rows.map((row) => row.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "myclinic-emr-report.csv";
    link.click();
    URL.revokeObjectURL(url);
    showMessage("Report CSV exported.");
  }

  function printPage(message: string) {
    showMessage(message);
    window.setTimeout(() => window.print(), 50);
  }

  if (!signedIn) {
    return (
      <main className="login-screen">
        <section className="login-panel" aria-label="Doctor login">
          <div className="brand-mark">+</div>
          <h1>{data.settings.clinicName}</h1>
          <p>Secure clinic workspace demo.</p>
          <label>
            Username
            <input defaultValue="doctor" />
          </label>
          <label>
            Password
            <input defaultValue="demo" type="password" />
          </label>
          <button onClick={() => setSignedIn(true)}>Sign In</button>
        </section>
      </main>
    );
  }

  return (
    <main className="emr-shell">
      <aside className="sidebar" aria-label="Primary navigation">
        <div className="brand">
          <div className="brand-mark">+</div>
          <span>{data.settings.clinicName}</span>
        </div>

        <nav>
          {navItems.map((item) => (
            <button
              className={session.activeView === item.label ? "nav-item active" : "nav-item"}
              key={item.label}
              onClick={() => setView(item.label)}
            >
              <span aria-hidden="true">{item.symbol}</span>
              {item.label}
            </button>
          ))}
        </nav>

        <section className="quick-stats" aria-label="Quick stats">
          <h2>Quick Stats</h2>
          <button onClick={() => setView("Today's Consults")}><span>Today&apos;s Consults</span><strong>{todayEncounters.length}</strong></button>
          <button onClick={() => setView("Calendar")}><span>Follow-ups</span><strong>{data.appointments.filter((item) => item.status === "Scheduled").length}</strong></button>
          <button onClick={() => setSideTab("orders")}><span>Pending Results</span><strong>{pendingLabs}</strong></button>
          <button onClick={() => setSideTab("certificate")}><span>Pending Certificates</span><strong>{pendingCertificates}</strong></button>
        </section>
      </aside>

      <section className="workspace">
        <header className="topbar">
          <button className="icon-button" onClick={() => setView("Dashboard")} aria-label="Open dashboard">=</button>
          <div className="search-box">
            <input
              onChange={(event) => setSearch(event.target.value)}
              onFocus={() => setView("Patients")}
              placeholder="Search patient by name, ID or contact..."
              value={search}
            />
            <kbd>/</kbd>
            {search.trim() && (
              <div className="search-results" role="listbox">
                {filteredPatients.map((patient) => (
                  <button key={patient.id} onClick={() => selectPatient(patient.id)}>
                    <strong>{patient.fullName}</strong>
                    <span>{patient.id} - {calculateAge(patient.dob)}{patient.sex} - Last: {patient.lastConsult}</span>
                  </button>
                ))}
                {!filteredPatients.length && <p>No patient found.</p>}
              </div>
            )}
          </div>
          <button className="ghost-button" onClick={() => setSignedIn(false)}>Sign Out</button>
        </header>

        <div className="content">
          {toast && (
            <div className="toast" role="status">
              <span>{toast}</span>
              <button onClick={() => setToast("")}>Dismiss</button>
            </div>
          )}

          {session.activeView === "Dashboard" && (
            <DashboardView
              activePatient={activePatient}
              appointments={data.appointments}
              encounters={data.encounters}
              onNewConsult={() => startNewConsult()}
              onOpenCalendar={() => setView("Calendar")}
              onOpenPatients={() => setView("Patients")}
              onOpenReports={() => setView("Reports")}
              patients={data.patients}
            />
          )}

          {session.activeView === "Patients" && (
            <PatientsView
              filteredPatients={filteredPatients}
              onAddPatient={addNewPatient}
              onOpenChart={(patientId) => selectPatient(patientId, "New Consult")}
              onStartConsult={startNewConsult}
              patients={data.patients}
              search={search}
              setSearch={setSearch}
              showNewPatient={showNewPatient}
              setShowNewPatient={setShowNewPatient}
            />
          )}

          {session.activeView === "New Consult" && (
            <ConsultWorkspace
              activeAge={activeAge}
              activePatient={activePatient}
              addLabOrImaging={addLabOrImaging}
              addPrescription={addPrescription}
              bmi={bmi}
              data={data}
              draft={draft}
              drugQuery={drugQuery}
              loadEncounter={loadEncounter}
              orderMode={orderMode}
              orderQuery={orderQuery}
              onBackToSearch={() => setView("Patients")}
              onNewConsult={() => startNewConsult()}
              onPrint={() => printPage("Preparing print view.")}
              saveEncounter={saveEncounter}
              selectedLab={selectedLab}
              setDrugQuery={setDrugQuery}
              setOrderMode={setOrderMode}
              setOrderQuery={setOrderQuery}
              setSelectedLab={setSelectedLab}
              setShowTrends={setShowTrends}
              setSideTab={setSideTab}
              showTrends={showTrends}
              sideTab={sideTab}
              updateDraft={updateDraft}
              updateImaging={updateImaging}
              updateLab={updateLab}
              updatePatient={updatePatient}
              updatePrescription={updatePrescription}
            />
          )}

          {session.activeView === "Today's Consults" && (
            <TodayView
              encounters={data.encounters}
              loadEncounter={loadEncounter}
              patients={data.patients}
              startNewConsult={startNewConsult}
            />
          )}

          {session.activeView === "Calendar" && (
            <CalendarView
              appointmentDraft={appointmentDraft}
              appointments={data.appointments}
              onAddAppointment={addAppointment}
              patients={data.patients}
              setAppointmentDraft={setAppointmentDraft}
              updateAppointment={updateAppointment}
            />
          )}

          {session.activeView === "Reports" && (
            <ReportsView
              appointments={data.appointments}
              encounters={data.encounters}
              exportReportCsv={exportReportCsv}
              onPrint={() => printPage("Preparing report print view.")}
              patients={data.patients}
              reportReady={reportReady}
              setReportReady={setReportReady}
            />
          )}

          {session.activeView === "Drug Formulary" && (
            <DrugFormularyView
              addPrescription={addPrescription}
              drugTemplates={data.drugTemplates}
              newDrug={newDrug}
              saveDrugTemplate={saveDrugTemplate}
              setNewDrug={setNewDrug}
            />
          )}

          {session.activeView === "Settings" && (
            <SettingsView
              clearLocalData={clearLocalData}
              exportBackup={exportBackup}
              onPrint={() => printPage("Preparing settings print view.")}
              restoreSampleData={restoreSampleData}
              settings={data.settings}
              updateSettings={updateSettings}
            />
          )}
        </div>
      </section>
    </main>
  );
}

function DashboardView({
  activePatient,
  appointments,
  encounters,
  onNewConsult,
  onOpenCalendar,
  onOpenPatients,
  onOpenReports,
  patients,
}: {
  activePatient: Patient;
  appointments: Appointment[];
  encounters: Encounter[];
  onNewConsult: () => void;
  onOpenCalendar: () => void;
  onOpenPatients: () => void;
  onOpenReports: () => void;
  patients: Patient[];
}) {
  const scheduled = appointments.filter((item) => item.status === "Scheduled");
  return (
    <section className="view-stack">
      <div className="page-heading">
        <div>
          <h1>Dashboard</h1>
          <p>Fast clinic actions for today&apos;s work.</p>
        </div>
        <button className="primary-button" onClick={onNewConsult}>Start Consult</button>
      </div>

      <section className="workflow-strip" aria-label="Dashboard quick actions">
        <button onClick={onOpenPatients}>Search Patient</button>
        <button onClick={onOpenPatients}>New Patient</button>
        <button onClick={onOpenCalendar}>Today&apos;s Schedule: {scheduled.length}</button>
        <button onClick={onOpenReports}>Clinic Summary</button>
      </section>

      <section className="dashboard-grid">
        <article className="panel stat-panel">
          <h2>{patients.length}</h2>
          <p>Active patients</p>
        </article>
        <article className="panel stat-panel">
          <h2>{encounters.length}</h2>
          <p>Saved encounters</p>
        </article>
        <article className="panel stat-panel">
          <h2>{scheduled.length}</h2>
          <p>Scheduled visits</p>
        </article>
        <article className="panel stat-panel">
          <h2>{activePatient.fullName}</h2>
          <p>Current chart</p>
        </article>
      </section>

      <section className="panel">
        <header className="panel-header"><h2>Today&apos;s Queue</h2><button onClick={onOpenCalendar}>Manage</button></header>
        <table>
          <thead><tr><th>Time</th><th>Patient</th><th>Reason</th><th>Status</th></tr></thead>
          <tbody>
            {scheduled.map((appointment) => (
              <tr key={appointment.id}>
                <td>{appointment.time}</td>
                <td>{patientName(patients, appointment.patientId)}</td>
                <td>{appointment.reason}</td>
                <td>{appointment.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </section>
  );
}

function PatientsView({
  filteredPatients,
  onAddPatient,
  onOpenChart,
  onStartConsult,
  patients,
  search,
  setSearch,
  showNewPatient,
  setShowNewPatient,
}: {
  filteredPatients: Patient[];
  onAddPatient: (formData: FormData) => void;
  onOpenChart: (patientId: string) => void;
  onStartConsult: (patientId: string) => void;
  patients: Patient[];
  search: string;
  setSearch: (value: string) => void;
  showNewPatient: boolean;
  setShowNewPatient: (value: boolean) => void;
}) {
  const displayPatients = search.trim() ? filteredPatients : patients;
  return (
    <section className="view-stack">
      <div className="page-heading">
        <div>
          <h1>Patients</h1>
          <p>Search by name, ID, or contact. One click opens the chart.</p>
        </div>
        <button className="primary-button" onClick={() => setShowNewPatient(!showNewPatient)}>
          {showNewPatient ? "Close Form" : "New Patient"}
        </button>
      </div>

      {showNewPatient && (
        <form action={onAddPatient} className="panel form-panel">
          <label>Full Name<input name="fullName" placeholder="Last, First" /></label>
          <label>Contact<input name="contact" placeholder="09xx xxx xxxx" /></label>
          <label>DOB<input name="dob" type="date" defaultValue="1990-01-01" /></label>
          <label>Sex<select name="sex" defaultValue="M"><option>M</option><option>F</option></select></label>
          <label>Civil Status<input name="civilStatus" /></label>
          <label>Occupation<input name="occupation" /></label>
          <label className="wide-field">Address<input name="address" /></label>
          <label className="wide-field">Emergency Contact<input name="emergencyContact" /></label>
          <button className="primary-button" type="submit">Add Patient</button>
        </form>
      )}

      <section className="panel">
        <header className="panel-header">
          <h2>Patient Search</h2>
          <input className="header-input" onChange={(event) => setSearch(event.target.value)} value={search} placeholder="Search patient..." />
        </header>
        <table>
          <thead><tr><th>Patient</th><th>Age/Sex</th><th>Contact</th><th>Last Consult</th><th>Actions</th></tr></thead>
          <tbody>
            {displayPatients.map((patient) => (
              <tr key={patient.id}>
                <td><strong>{patient.fullName}</strong><br /><span className="muted">{patient.id}</span></td>
                <td>{calculateAge(patient.dob)} / {patient.sex}</td>
                <td>{patient.contact}</td>
                <td>{patient.lastConsult}</td>
                <td className="button-cell">
                  <button className="outline-button compact" onClick={() => onOpenChart(patient.id)}>Open Chart</button>
                  <button className="primary-button compact" onClick={() => onStartConsult(patient.id)}>New Consult</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </section>
  );
}

function ConsultWorkspace({
  activeAge,
  activePatient,
  addLabOrImaging,
  addPrescription,
  bmi,
  data,
  draft,
  drugQuery,
  loadEncounter,
  orderMode,
  orderQuery,
  onBackToSearch,
  onNewConsult,
  onPrint,
  saveEncounter,
  selectedLab,
  setDrugQuery,
  setOrderMode,
  setOrderQuery,
  setSelectedLab,
  setShowTrends,
  setSideTab,
  showTrends,
  sideTab,
  updateDraft,
  updateImaging,
  updateLab,
  updatePatient,
  updatePrescription,
}: {
  activeAge: number;
  activePatient: Patient;
  addLabOrImaging: () => void;
  addPrescription: (template?: DrugTemplate) => void;
  bmi: string;
  data: AppData;
  draft: Encounter;
  drugQuery: string;
  loadEncounter: (encounter: Encounter) => void;
  orderMode: "labs" | "imaging";
  orderQuery: string;
  onBackToSearch: () => void;
  onNewConsult: () => void;
  onPrint: () => void;
  saveEncounter: (status: "Draft" | "Saved") => void;
  selectedLab: LabRow | null;
  setDrugQuery: (value: string) => void;
  setOrderMode: (value: "labs" | "imaging") => void;
  setOrderQuery: (value: string) => void;
  setSelectedLab: (lab: LabRow | null) => void;
  setShowTrends: (value: boolean) => void;
  setSideTab: (value: "orders" | "prescription" | "certificate") => void;
  showTrends: boolean;
  sideTab: "orders" | "prescription" | "certificate";
  updateDraft: (patch: Partial<Encounter>) => void;
  updateImaging: (id: string, patch: Partial<ImagingRow>) => void;
  updateLab: (id: string, patch: Partial<LabRow>) => void;
  updatePatient: (patch: Partial<Patient>) => void;
  updatePrescription: (id: string, patch: Partial<DrugRow>) => void;
}) {
  return (
    <section className="view-stack">
      <button className="back-button" onClick={onBackToSearch}>{"<"} Back to Search</button>
      <PatientBanner activeAge={activeAge} activePatient={activePatient} onEdit={onBackToSearch} />

      <section className="emr-grid">
        <PatientInfo activePatient={activePatient} bmi={bmi} onChange={updatePatient} />
        <ConsultForm draft={draft} onNew={onNewConsult} onPrint={onPrint} saveEncounter={saveEncounter} updateDraft={updateDraft} />
        <OrdersPanel
          activeAge={activeAge}
          activePatient={activePatient}
          addLabOrImaging={addLabOrImaging}
          addPrescription={addPrescription}
          data={data}
          draft={draft}
          drugQuery={drugQuery}
          loadEncounter={loadEncounter}
          orderMode={orderMode}
          orderQuery={orderQuery}
          selectedLab={selectedLab}
          setDrugQuery={setDrugQuery}
          setOrderMode={setOrderMode}
          setOrderQuery={setOrderQuery}
          setSelectedLab={setSelectedLab}
          setShowTrends={setShowTrends}
          setSideTab={setSideTab}
          showTrends={showTrends}
          sideTab={sideTab}
          updateDraft={updateDraft}
          updateImaging={updateImaging}
          updateLab={updateLab}
          updatePrescription={updatePrescription}
        />
      </section>
    </section>
  );
}

function PatientBanner({
  activeAge,
  activePatient,
  onEdit,
}: {
  activeAge: number;
  activePatient: Patient;
  onEdit: () => void;
}) {
  return (
    <section className="patient-banner" aria-label="Patient summary">
      <div className="avatar" aria-hidden="true">{initials(activePatient.fullName)}</div>
      <div className="patient-name">
        <h1>{activePatient.fullName}</h1>
        <p>Patient ID: {activePatient.id}</p>
        <p>{activePatient.contact}</p>
      </div>
      <Info label="DOB" value={formatDob(activePatient.dob)} />
      <Info label="Age" value={`${activeAge} (Auto)`} />
      <Info label="Sex" value={activePatient.sex} />
      <Info label="Civil Status" value={activePatient.civilStatus || "Not set"} />
      <Info label="Occupation" value={activePatient.occupation || "Not set"} />
      <button className="outline-button" onClick={onEdit}>Edit Profile</button>
    </section>
  );
}

function PatientInfo({
  activePatient,
  bmi,
  onChange,
}: {
  activePatient: Patient;
  bmi: string;
  onChange: (patch: Partial<Patient>) => void;
}) {
  function togglePmh(key: PmhKey) {
    onChange({ pmh: { ...activePatient.pmh, [key]: !activePatient.pmh[key] } });
  }

  return (
    <article className="panel patient-info">
      <header className="panel-header">
        <h2>Patient Information</h2>
        <button onClick={() => window.alert("Chart changes are saved locally in this browser.")}>Save Chart</button>
      </header>

      <section className="history-section">
        <h3>Address</h3>
        <textarea onChange={(event) => onChange({ address: event.target.value })} rows={2} value={activePatient.address} />
      </section>
      <section className="history-section">
        <h3>Emergency Contact</h3>
        <input onChange={(event) => onChange({ emergencyContact: event.target.value })} value={activePatient.emergencyContact} />
      </section>
      <section className="history-section">
        <h3>Allergies</h3>
        <input onChange={(event) => onChange({ allergies: event.target.value })} placeholder="Free text" value={activePatient.allergies} />
      </section>
      <section className="history-section">
        <h3>Past Medical History</h3>
        <div className="check-grid">
          {pmhOptions.map((item) => (
            <label key={item}>
              <input checked={activePatient.pmh[item]} onChange={() => togglePmh(item)} type="checkbox" />
              {item}
            </label>
          ))}
        </div>
        {activePatient.pmh.Others && (
          <input onChange={(event) => onChange({ otherPmh: event.target.value })} placeholder="Others" value={activePatient.otherPmh} />
        )}
      </section>
      <section className="history-section">
        <h3>Past Surgical History</h3>
        <textarea onChange={(event) => onChange({ psh: event.target.value })} rows={2} value={activePatient.psh} />
      </section>
      <section className="history-section">
        <h3>Family History</h3>
        <textarea onChange={(event) => onChange({ familyHistory: event.target.value })} rows={3} value={activePatient.familyHistory} />
      </section>
      <section className="history-section two-selects">
        <h3>Social History</h3>
        <label>Smoking<select onChange={(event) => onChange({ socialSmoking: event.target.value })} value={activePatient.socialSmoking}><option>None</option><option>Former</option><option>Current</option></select></label>
        <label>Alcohol<select onChange={(event) => onChange({ socialAlcohol: event.target.value })} value={activePatient.socialAlcohol}><option>None</option><option>Occasional</option><option>Regular</option></select></label>
      </section>
      <section className="history-section">
        <h3>Vaccination History</h3>
        <input onChange={(event) => onChange({ vaccination: event.target.value })} placeholder="COVID x3, Flu 2026" value={activePatient.vaccination} />
      </section>

      <div className="metrics">
        <label>Weight<input onChange={(event) => onChange({ weight: event.target.value })} value={activePatient.weight} /></label>
        <label>Height<input onChange={(event) => onChange({ height: event.target.value })} value={activePatient.height} /></label>
        <Info label="BMI" value={bmi ? `${bmi} (Auto)` : "Auto"} />
      </div>
    </article>
  );
}

function ConsultForm({
  draft,
  onNew,
  onPrint,
  saveEncounter,
  updateDraft,
}: {
  draft: Encounter;
  onNew: () => void;
  onPrint: () => void;
  saveEncounter: (status: "Draft" | "Saved") => void;
  updateDraft: (patch: Partial<Encounter>) => void;
}) {
  function updateVitals(key: keyof Vitals, value: string) {
    updateDraft({ vitals: { ...draft.vitals, [key]: value } });
  }

  return (
    <article className="panel consult-panel">
      <header className="consult-header">
        <div>
          <h2>New Consult</h2>
          <p>{draft.id} - {draft.status}</p>
        </div>
        <div className="two-fields">
          <label>Date & Time<input onChange={(event) => updateDraft({ dateTime: event.target.value })} value={draft.dateTime} /></label>
          <label>Consult Type<select onChange={(event) => updateDraft({ consultType: event.target.value })} value={draft.consultType}><option>Clinic Consult</option><option>Follow-up</option><option>Clearance</option></select></label>
        </div>
      </header>

      <div className="chips" aria-label="Common chief complaints">
        {["Fever", "Cough", "Headache", "Follow-up", "Chest Pain", "Other"].map((chip) => (
          <button key={chip} onClick={() => updateDraft({ chiefComplaint: chip === "Other" ? "" : chip })}>{chip}</button>
        ))}
      </div>

      <label>Chief Complaint<input onChange={(event) => updateDraft({ chiefComplaint: event.target.value })} value={draft.chiefComplaint} /></label>
      <label>S - Subjective<textarea onChange={(event) => updateDraft({ subjective: event.target.value })} rows={3} value={draft.subjective} /></label>
      <label>O - Objective<textarea onChange={(event) => updateDraft({ objective: event.target.value })} rows={5} value={draft.objective} /></label>

      <section className="vitals" aria-label="Vital signs">
        <label>BP<input onChange={(event) => updateVitals("bp", event.target.value)} value={draft.vitals.bp} /></label>
        <label>HR<input onChange={(event) => updateVitals("hr", event.target.value)} value={draft.vitals.hr} /></label>
        <label>RR<input onChange={(event) => updateVitals("rr", event.target.value)} value={draft.vitals.rr} /></label>
        <label>Temp (C)<input onChange={(event) => updateVitals("temp", event.target.value)} value={draft.vitals.temp} /></label>
        <label>SpO2 (%)<input onChange={(event) => updateVitals("spo2", event.target.value)} value={draft.vitals.spo2} /></label>
        <label>Weight (kg)<input onChange={(event) => updateVitals("weight", event.target.value)} value={draft.vitals.weight} /></label>
      </section>

      <label>A - Assessment<input onChange={(event) => updateDraft({ assessment: event.target.value })} value={draft.assessment} /></label>
      <label>P - Plan<textarea onChange={(event) => updateDraft({ plan: event.target.value })} rows={6} value={draft.plan} /></label>

      <div className="save-row three-actions">
        <button className="primary-button" onClick={() => saveEncounter("Saved")}>Save All</button>
        <button className="ghost-button" onClick={() => saveEncounter("Draft")}>Save Draft</button>
        <button className="outline-button" onClick={onPrint}>Print</button>
        <button className="outline-button" onClick={onNew}>Clear / New</button>
      </div>
    </article>
  );
}

function OrdersPanel({
  activeAge,
  activePatient,
  addLabOrImaging,
  addPrescription,
  data,
  draft,
  drugQuery,
  loadEncounter,
  orderMode,
  orderQuery,
  selectedLab,
  setDrugQuery,
  setOrderMode,
  setOrderQuery,
  setSelectedLab,
  setShowTrends,
  setSideTab,
  showTrends,
  sideTab,
  updateDraft,
  updateImaging,
  updateLab,
  updatePrescription,
}: {
  activeAge: number;
  activePatient: Patient;
  addLabOrImaging: () => void;
  addPrescription: (template?: DrugTemplate) => void;
  data: AppData;
  draft: Encounter;
  drugQuery: string;
  loadEncounter: (encounter: Encounter) => void;
  orderMode: "labs" | "imaging";
  orderQuery: string;
  selectedLab: LabRow | null;
  setDrugQuery: (value: string) => void;
  setOrderMode: (value: "labs" | "imaging") => void;
  setOrderQuery: (value: string) => void;
  setSelectedLab: (lab: LabRow | null) => void;
  setShowTrends: (value: boolean) => void;
  setSideTab: (value: "orders" | "prescription" | "certificate") => void;
  showTrends: boolean;
  sideTab: "orders" | "prescription" | "certificate";
  updateDraft: (patch: Partial<Encounter>) => void;
  updateImaging: (id: string, patch: Partial<ImagingRow>) => void;
  updateLab: (id: string, patch: Partial<LabRow>) => void;
  updatePrescription: (id: string, patch: Partial<DrugRow>) => void;
}) {
  const patientEncounters = data.encounters.filter((encounter) => encounter.patientId === activePatient.id);

  return (
    <div className="right-stack">
      <article className="panel">
        <header className="tab-header">
          <button className={sideTab === "orders" ? "active" : ""} onClick={() => setSideTab("orders")}>Labs / Imaging</button>
          <button className={sideTab === "prescription" ? "active" : ""} onClick={() => setSideTab("prescription")}>Prescription</button>
          <button className={sideTab === "certificate" ? "active" : ""} onClick={() => setSideTab("certificate")}>Certificate</button>
        </header>

        {sideTab === "orders" && (
          <>
            <div className="subtabs">
              <button className={orderMode === "labs" ? "active" : ""} onClick={() => setOrderMode("labs")}>Labs</button>
              <button className={orderMode === "imaging" ? "active" : ""} onClick={() => setOrderMode("imaging")}>Imaging</button>
            </div>
            <div className="action-line">
              <input
                list={orderMode === "labs" ? "lab-templates" : "imaging-templates"}
                onChange={(event) => setOrderQuery(event.target.value)}
                placeholder={orderMode === "labs" ? "Search lab test..." : "Search imaging..."}
                value={orderQuery}
              />
              <datalist id="lab-templates">{labTemplates.map((lab) => <option key={lab.id} value={lab.test} />)}</datalist>
              <datalist id="imaging-templates">{imagingTemplates.map((item) => <option key={item.id} value={item.test} />)}</datalist>
              <button className="outline-button" onClick={addLabOrImaging}>+ Add</button>
            </div>
            {orderMode === "labs" ? (
              <EditableLabTable labs={draft.labs} setSelectedLab={setSelectedLab} updateLab={updateLab} updateDraft={updateDraft} draft={draft} />
            ) : (
              <EditableImagingTable imaging={draft.imaging} updateDraft={updateDraft} updateImaging={updateImaging} draft={draft} />
            )}
            <button className="outline-button align-right" onClick={() => setShowTrends(!showTrends)}>View Trends</button>
            {showTrends && (
              <section className="trend-box">
                <h3>HbA1c Trend</h3>
                <p>Jan - 8.4</p>
                <p>Mar - 7.5</p>
                <p>Jun - 6.9</p>
              </section>
            )}
            {selectedLab && (
              <section className="trend-box">
                <h3>{selectedLab.test} Details</h3>
                <p>Result: {selectedLab.result || "Pending"}</p>
                <p>Reference: {selectedLab.range || "No reference range set"}</p>
                <button className="outline-button compact" onClick={() => setSelectedLab(null)}>Close Details</button>
              </section>
            )}
          </>
        )}

        {sideTab === "prescription" && (
          <>
            <div className="action-line">
              <input
                list="drug-templates"
                onChange={(event) => setDrugQuery(event.target.value)}
                placeholder="Search drug..."
                value={drugQuery}
              />
              <datalist id="drug-templates">{data.drugTemplates.map((drug) => <option key={drug.id} value={drug.medication} />)}</datalist>
              <button className="outline-button" onClick={() => addPrescription()}>+ Add Drug</button>
            </div>
            <EditablePrescriptionTable
              draft={draft}
              updateDraft={updateDraft}
              updatePrescription={updatePrescription}
            />
          </>
        )}

        {sideTab === "certificate" && (
          <CertificatePanel
            activeAge={activeAge}
            activePatient={activePatient}
            draft={draft}
            updateDraft={updateDraft}
          />
        )}
      </article>

      <article className="panel">
        <header className="panel-header"><h2>Recent Encounters</h2><button onClick={() => loadEncounter(draft)}>Current</button></header>
        <table>
          <thead><tr><th>Date</th><th>Complaint</th><th>Status</th><th></th></tr></thead>
          <tbody>
            {patientEncounters.map((encounter) => (
              <tr key={encounter.id}>
                <td>{encounter.dateTime}</td>
                <td>{encounter.chiefComplaint}</td>
                <td>{encounter.status}</td>
                <td><button className="outline-button compact" onClick={() => loadEncounter(encounter)}>Open</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </article>
    </div>
  );
}

function EditableLabTable({
  draft,
  labs,
  setSelectedLab,
  updateDraft,
  updateLab,
}: {
  draft: Encounter;
  labs: LabRow[];
  setSelectedLab: (lab: LabRow | null) => void;
  updateDraft: (patch: Partial<Encounter>) => void;
  updateLab: (id: string, patch: Partial<LabRow>) => void;
}) {
  return (
    <table className="editable-table">
      <thead><tr><th>Test</th><th>Result</th><th>Unit</th><th>Range</th><th>Date</th><th></th></tr></thead>
      <tbody>
        {labs.map((lab) => (
          <tr key={lab.id}>
            <td><input value={lab.test} onChange={(event) => updateLab(lab.id, { test: event.target.value })} /></td>
            <td><input value={lab.result} onChange={(event) => updateLab(lab.id, { result: event.target.value })} /></td>
            <td><input value={lab.unit} onChange={(event) => updateLab(lab.id, { unit: event.target.value })} /></td>
            <td><input value={lab.range} onChange={(event) => updateLab(lab.id, { range: event.target.value })} /></td>
            <td><input value={lab.date} onChange={(event) => updateLab(lab.id, { date: event.target.value })} /></td>
            <td className="button-cell">
              <button className="outline-button compact" onClick={() => setSelectedLab(lab)}>Details</button>
              <button className="mini-button" onClick={() => updateDraft({ labs: draft.labs.filter((item) => item.id !== lab.id) })}>X</button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

function EditableImagingTable({
  draft,
  imaging,
  updateDraft,
  updateImaging,
}: {
  draft: Encounter;
  imaging: ImagingRow[];
  updateDraft: (patch: Partial<Encounter>) => void;
  updateImaging: (id: string, patch: Partial<ImagingRow>) => void;
}) {
  return (
    <table className="editable-table">
      <thead><tr><th>Test</th><th>Finding</th><th>Status</th><th>Date</th><th></th></tr></thead>
      <tbody>
        {imaging.map((item) => (
          <tr key={item.id}>
            <td><input value={item.test} onChange={(event) => updateImaging(item.id, { test: event.target.value })} /></td>
            <td><input value={item.finding} onChange={(event) => updateImaging(item.id, { finding: event.target.value })} /></td>
            <td><select value={item.status} onChange={(event) => updateImaging(item.id, { status: event.target.value })}><option>Pending</option><option>Final</option><option>Cancelled</option></select></td>
            <td><input value={item.date} onChange={(event) => updateImaging(item.id, { date: event.target.value })} /></td>
            <td><button className="mini-button" onClick={() => updateDraft({ imaging: draft.imaging.filter((row) => row.id !== item.id) })}>X</button></td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

function EditablePrescriptionTable({
  draft,
  updateDraft,
  updatePrescription,
}: {
  draft: Encounter;
  updateDraft: (patch: Partial<Encounter>) => void;
  updatePrescription: (id: string, patch: Partial<DrugRow>) => void;
}) {
  return (
    <>
      <table className="editable-table">
        <thead><tr><th>Medication</th><th>Dose</th><th>Frequency</th><th>Duration</th><th>SIG</th><th>Qty</th><th></th></tr></thead>
        <tbody>
          {draft.prescriptions.map((drug) => (
            <tr key={drug.id}>
              <td><input value={drug.medication} onChange={(event) => updatePrescription(drug.id, { medication: event.target.value })} /></td>
              <td><input value={drug.dose} onChange={(event) => updatePrescription(drug.id, { dose: event.target.value })} /></td>
              <td><input value={drug.frequency} onChange={(event) => updatePrescription(drug.id, { frequency: event.target.value })} /></td>
              <td><input value={drug.duration} onChange={(event) => updatePrescription(drug.id, { duration: event.target.value })} /></td>
              <td><input value={drug.sig} onChange={(event) => updatePrescription(drug.id, { sig: event.target.value })} /></td>
              <td><input value={drug.qty} onChange={(event) => updatePrescription(drug.id, { qty: event.target.value })} /></td>
              <td><button className="mini-button" onClick={() => updateDraft({ prescriptions: draft.prescriptions.filter((item) => item.id !== drug.id) })}>X</button></td>
            </tr>
          ))}
        </tbody>
      </table>
      <button className="outline-button align-right" onClick={() => updateDraft({ prescriptions: [] })}>Clear Prescription</button>
    </>
  );
}

function CertificatePanel({
  activeAge,
  activePatient,
  draft,
  updateDraft,
}: {
  activeAge: number;
  activePatient: Patient;
  draft: Encounter;
  updateDraft: (patch: Partial<Encounter>) => void;
}) {
  return (
    <>
      <label>Diagnosis (Auto)<input readOnly value={draft.assessment} /></label>
      <label>Recommendation<textarea rows={3} value={draft.certificate.recommendation} onChange={(event) => updateDraft({ certificate: { ...draft.certificate, recommendation: event.target.value } })} /></label>
      <div className="button-row padded-row">
        <button className="primary-button" onClick={() => updateDraft({ certificate: { ...draft.certificate, generated: true } })}>Generate Certificate</button>
        <button className="outline-button" onClick={() => window.print()}>Print Certificate</button>
        <button className="ghost-button" onClick={() => updateDraft({ certificate: { ...draft.certificate, generated: false } })}>Reset</button>
      </div>
      {draft.certificate.generated && (
        <section className="certificate-preview">
          <h3>Certificate Preview</h3>
          <p>This certifies that {activePatient.fullName}, {activeAge} years old, was seen for {draft.chiefComplaint || "consultation"}.</p>
          <p>Diagnosis: {draft.assessment || "Pending assessment"}</p>
          <p>Recommendation: {draft.certificate.recommendation}</p>
        </section>
      )}
    </>
  );
}

function TodayView({
  encounters,
  loadEncounter,
  patients,
  startNewConsult,
}: {
  encounters: Encounter[];
  loadEncounter: (encounter: Encounter) => void;
  patients: Patient[];
  startNewConsult: (patientId: string) => void;
}) {
  return (
    <section className="view-stack">
      <div className="page-heading">
        <div><h1>Today&apos;s Consults</h1><p>Review saved visits and continue drafts.</p></div>
      </div>
      <section className="panel">
        <table>
          <thead><tr><th>Time</th><th>Patient</th><th>Complaint</th><th>Assessment</th><th>Status</th><th>Actions</th></tr></thead>
          <tbody>
            {encounters.map((encounter) => (
              <tr key={encounter.id}>
                <td>{encounter.dateTime}</td>
                <td>{patientName(patients, encounter.patientId)}</td>
                <td>{encounter.chiefComplaint}</td>
                <td>{encounter.assessment}</td>
                <td>{encounter.status}</td>
                <td className="button-cell">
                  <button className="outline-button compact" onClick={() => loadEncounter(encounter)}>Open</button>
                  <button className="primary-button compact" onClick={() => startNewConsult(encounter.patientId)}>New Follow-up</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </section>
  );
}

function CalendarView({
  appointmentDraft,
  appointments,
  onAddAppointment,
  patients,
  setAppointmentDraft,
  updateAppointment,
}: {
  appointmentDraft: { patientId: string; date: string; time: string; reason: string };
  appointments: Appointment[];
  onAddAppointment: () => void;
  patients: Patient[];
  setAppointmentDraft: (value: { patientId: string; date: string; time: string; reason: string }) => void;
  updateAppointment: (id: string, status: Appointment["status"]) => void;
}) {
  return (
    <section className="view-stack">
      <div className="page-heading">
        <div><h1>Calendar</h1><p>Schedule and manage clinic visits.</p></div>
        <button className="primary-button" onClick={onAddAppointment}>Add Appointment</button>
      </div>
      <section className="panel form-panel">
        <label>Patient<select value={appointmentDraft.patientId} onChange={(event) => setAppointmentDraft({ ...appointmentDraft, patientId: event.target.value })}>{patients.map((patient) => <option key={patient.id} value={patient.id}>{patient.fullName}</option>)}</select></label>
        <label>Date<input type="date" value={appointmentDraft.date} onChange={(event) => setAppointmentDraft({ ...appointmentDraft, date: event.target.value })} /></label>
        <label>Time<input type="time" value={appointmentDraft.time} onChange={(event) => setAppointmentDraft({ ...appointmentDraft, time: event.target.value })} /></label>
        <label className="wide-field">Reason<input value={appointmentDraft.reason} onChange={(event) => setAppointmentDraft({ ...appointmentDraft, reason: event.target.value })} /></label>
      </section>
      <section className="panel">
        <table>
          <thead><tr><th>Date</th><th>Time</th><th>Patient</th><th>Reason</th><th>Status</th><th>Actions</th></tr></thead>
          <tbody>
            {appointments.map((appointment) => (
              <tr key={appointment.id}>
                <td>{appointment.date}</td>
                <td>{appointment.time}</td>
                <td>{patientName(patients, appointment.patientId)}</td>
                <td>{appointment.reason}</td>
                <td>{appointment.status}</td>
                <td className="button-cell">
                  <button className="outline-button compact" onClick={() => updateAppointment(appointment.id, "Done")}>Done</button>
                  <button className="ghost-button compact" onClick={() => updateAppointment(appointment.id, "Cancelled")}>Cancel</button>
                  <button className="outline-button compact" onClick={() => updateAppointment(appointment.id, "Scheduled")}>Reopen</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </section>
  );
}

function ReportsView({
  appointments,
  encounters,
  exportReportCsv,
  onPrint,
  patients,
  reportReady,
  setReportReady,
}: {
  appointments: Appointment[];
  encounters: Encounter[];
  exportReportCsv: () => void;
  onPrint: () => void;
  patients: Patient[];
  reportReady: boolean;
  setReportReady: (value: boolean) => void;
}) {
  const saved = encounters.filter((encounter) => encounter.status === "Saved").length;
  const scheduled = appointments.filter((appointment) => appointment.status === "Scheduled").length;
  return (
    <section className="view-stack">
      <div className="page-heading">
        <div><h1>Reports</h1><p>Simple operational clinic summary.</p></div>
        <div className="button-row">
          <button className="primary-button" onClick={() => setReportReady(true)}>Generate</button>
          <button className="outline-button" onClick={exportReportCsv}>Export CSV</button>
          <button className="ghost-button" onClick={onPrint}>Print</button>
        </div>
      </div>
      <section className="dashboard-grid">
        <article className="panel stat-panel"><h2>{patients.length}</h2><p>Patients</p></article>
        <article className="panel stat-panel"><h2>{saved}</h2><p>Saved encounters</p></article>
        <article className="panel stat-panel"><h2>{scheduled}</h2><p>Scheduled follow-ups</p></article>
        <article className="panel stat-panel"><h2>{encounters.length - saved}</h2><p>Drafts</p></article>
      </section>
      {reportReady && (
        <section className="panel report-box">
          <h2>Generated Report</h2>
          <p>The clinic has {patients.length} active patients, {saved} saved encounters, and {scheduled} scheduled appointments.</p>
          <p>Use this summary for daily handoff, not as an audited production report yet.</p>
        </section>
      )}
    </section>
  );
}

function DrugFormularyView({
  addPrescription,
  drugTemplates,
  newDrug,
  saveDrugTemplate,
  setNewDrug,
}: {
  addPrescription: (template?: DrugTemplate) => void;
  drugTemplates: DrugTemplate[];
  newDrug: Omit<DrugTemplate, "id">;
  saveDrugTemplate: () => void;
  setNewDrug: (value: Omit<DrugTemplate, "id">) => void;
}) {
  return (
    <section className="view-stack">
      <div className="page-heading">
        <div><h1>Drug Formulary</h1><p>Reusable prescription shortcuts.</p></div>
        <button className="primary-button" onClick={saveDrugTemplate}>Save Shortcut</button>
      </div>
      <section className="panel form-panel">
        <label>Medication<input value={newDrug.medication} onChange={(event) => setNewDrug({ ...newDrug, medication: event.target.value })} /></label>
        <label>Dose<input value={newDrug.dose} onChange={(event) => setNewDrug({ ...newDrug, dose: event.target.value })} /></label>
        <label>Frequency<input value={newDrug.frequency} onChange={(event) => setNewDrug({ ...newDrug, frequency: event.target.value })} /></label>
        <label>Duration<input value={newDrug.duration} onChange={(event) => setNewDrug({ ...newDrug, duration: event.target.value })} /></label>
        <label>SIG<input value={newDrug.sig} onChange={(event) => setNewDrug({ ...newDrug, sig: event.target.value })} /></label>
        <label>Qty<input value={newDrug.qty} onChange={(event) => setNewDrug({ ...newDrug, qty: event.target.value })} /></label>
        <label>Stock<select value={newDrug.stock} onChange={(event) => setNewDrug({ ...newDrug, stock: event.target.value })}><option>Available</option><option>Low</option><option>Unavailable</option></select></label>
      </section>
      <section className="panel">
        <table>
          <thead><tr><th>Medication</th><th>Dose</th><th>Frequency</th><th>SIG</th><th>Qty</th><th>Stock</th><th></th></tr></thead>
          <tbody>
            {drugTemplates.map((drug) => (
              <tr key={drug.id}>
                <td>{drug.medication}</td>
                <td>{drug.dose}</td>
                <td>{drug.frequency}</td>
                <td>{drug.sig}</td>
                <td>{drug.qty}</td>
                <td>{drug.stock}</td>
                <td><button className="outline-button compact" onClick={() => addPrescription(drug)}>Use</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </section>
  );
}

function SettingsView({
  clearLocalData,
  exportBackup,
  onPrint,
  restoreSampleData,
  settings,
  updateSettings,
}: {
  clearLocalData: () => void;
  exportBackup: () => void;
  onPrint: () => void;
  restoreSampleData: () => void;
  settings: Settings;
  updateSettings: (patch: Partial<Settings>) => void;
}) {
  return (
    <section className="view-stack">
      <div className="page-heading">
        <div><h1>Settings</h1><p>Clinic identity and local data tools.</p></div>
        <div className="button-row">
          <button className="primary-button" onClick={exportBackup}>Export Backup</button>
          <button className="outline-button" onClick={onPrint}>Print</button>
        </div>
      </div>
      <section className="panel form-panel">
        <label>Clinic Name<input value={settings.clinicName} onChange={(event) => updateSettings({ clinicName: event.target.value })} /></label>
        <label>Doctor Name<input value={settings.doctorName} onChange={(event) => updateSettings({ doctorName: event.target.value })} /></label>
        <label>License Number<input value={settings.licenseNumber} onChange={(event) => updateSettings({ licenseNumber: event.target.value })} /></label>
        <label className="wide-field">Clinic Address<input value={settings.clinicAddress} onChange={(event) => updateSettings({ clinicAddress: event.target.value })} /></label>
        <label className="wide-field">Default Certificate Text<input value={settings.defaultCertificate} onChange={(event) => updateSettings({ defaultCertificate: event.target.value })} /></label>
      </section>
      <section className="panel settings-actions">
        <button className="outline-button" onClick={restoreSampleData}>Restore Sample Data</button>
        <button className="ghost-button danger" onClick={clearLocalData}>Clear Local Data</button>
      </section>
    </section>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div className="info-cell">
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}

function makePmh(enabled: PmhKey[]): Record<PmhKey, boolean> {
  return pmhOptions.reduce(
    (current, key) => ({ ...current, [key]: enabled.includes(key) }),
    {} as Record<PmhKey, boolean>,
  );
}

function makeEncounter(patientId: string, settings: Settings): Encounter {
  return {
    id: makeId("ENC"),
    patientId,
    dateTime: formatDateTime(new Date()),
    consultType: "Clinic Consult",
    chiefComplaint: "",
    subjective: "",
    objective: "",
    vitals: { bp: "", hr: "", rr: "", temp: "", spo2: "", weight: "" },
    assessment: "",
    plan: "",
    labs: [],
    imaging: [],
    prescriptions: [],
    certificate: { recommendation: settings.defaultCertificate, generated: false },
    status: "Draft",
  };
}

function templateToDrug(template: DrugTemplate): DrugRow {
  return {
    id: makeId("RX"),
    medication: template.medication,
    dose: template.dose,
    frequency: template.frequency,
    duration: template.duration,
    sig: template.sig,
    qty: template.qty,
  };
}

function filterPatients(patients: Patient[], search: string) {
  const needle = search.trim().toLowerCase();
  if (!needle) return patients.slice(0, 4);
  return patients.filter((patient) =>
    [patient.fullName, patient.id, patient.contact].some((value) => value.toLowerCase().includes(needle)),
  );
}

function findTemplate<T extends { [key: string]: string }>(items: T[], query: string, key: keyof T) {
  const needle = query.trim().toLowerCase();
  if (!needle) return items[0];
  return items.find((item) => item[key].toLowerCase().includes(needle));
}

function upsertById<T extends { id: string }>(items: T[], nextItem: T) {
  return items.some((item) => item.id === nextItem.id)
    ? items.map((item) => (item.id === nextItem.id ? nextItem : item))
    : [nextItem, ...items];
}

function initials(name: string) {
  return name
    .split(/[,\s]+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();
}

function formatDateTime(date: Date) {
  return new Intl.DateTimeFormat("en-US", {
    month: "2-digit",
    day: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

function formatDob(dob: string) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(dob));
}

function todayDate() {
  return new Date().toLocaleDateString("en-US");
}

function calculateAge(dob: string, referenceDate = new Date()) {
  const birth = new Date(dob);
  let age = referenceDate.getFullYear() - birth.getFullYear();
  const monthDiff = referenceDate.getMonth() - birth.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && referenceDate.getDate() < birth.getDate())) age -= 1;
  return age;
}

function calculateBmi(weight: string, height: string) {
  const weightNumber = Number(weight);
  const heightMeters = Number(height) / 100;
  if (!weightNumber || !heightMeters) return "";
  return (weightNumber / (heightMeters * heightMeters)).toFixed(1);
}

function patientName(patients: Patient[], patientId: string) {
  return patients.find((patient) => patient.id === patientId)?.fullName ?? "Unknown patient";
}

function makeId(prefix: string) {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}

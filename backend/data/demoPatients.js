// In-memory store for sessions/encounters
let encounters = {};

// The default demo patient as requested
const demoPatient = {
  id: "ABHA-DEMO-001",
  name: "Ramesh Kumar",
  age: 52,
  gender: "Male"
};

const createEncounter = (patient = demoPatient) => {
  const encounterId = "ENC-" + Date.now();
  encounters[encounterId] = {
    encounterId,
    patient,
    language: "en",
    consent: false,
    status: "started",
    conversation: [],
    structuredHistory: {
      chiefComplaint: "",
      hpi: {},
      pastHistory: [],
      medications: [],
      allergies: []
    },
    documents: [],
    triageFlags: null,
    summary: null,
    currentStepIndex: 0 // to track where we are in the clinical graph
  };
  return encounters[encounterId];
};

const getEncounter = (id) => encounters[id];

module.exports = {
  encounters,
  demoPatient,
  createEncounter,
  getEncounter
};

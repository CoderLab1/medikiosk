const { clinicalGraph } = require('./data/clinicalQuestions');
const { triageRules } = require('./data/clinicalRules');
const { evaluateTriage } = require('./services/triageEngine');
const { processAnswer } = require('./services/historyEngine');
const { ocrProvider } = require('./services/ocrProvider');

console.log("--- Running Backend Tests ---");

// Test 1: Triage Rules
const mockHistory = {
  chiefComplaint: "Severe chest pain",
  hpi: {
    associatedSymptoms: ["I have some breathlessness"]
  }
};
const triageResult = evaluateTriage(mockHistory);
if (triageResult.priority === "HIGH" && triageResult.flags.includes("MI_SUSPICION")) {
  console.log("✅ Triage Engine: MI Suspicion correctly flagged.");
} else {
  console.log("❌ Triage Engine: Failed to flag MI Suspicion.");
}

// Test 2: History Engine Branching
const mockEncounter = {
  structuredHistory: { chiefComplaint: "", hpi: {}, pastHistory: [], medications: [], allergies: [] },
  currentGraphNode: null,
  currentStepIndex: 0
};
processAnswer(mockEncounter, "Chest pain");
if (mockEncounter.structuredHistory.chiefComplaint === "Chest pain") {
  console.log("✅ History Engine: Chief complaint recorded.");
} else {
  console.log("❌ History Engine: Chief complaint failed.");
}

// Test 3: OCR Provider Structure
ocrProvider.processDocument().then(res => {
  if (res.documentType === "lab_report" && res.entities.investigations.length > 0) {
    console.log("✅ OCR Provider: Lab report structured correctly.");
  } else {
    console.log("❌ OCR Provider: Lab report failed.");
  }
});

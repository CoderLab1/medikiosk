// Deterministic rule-based triage engine
// These rules evaluate the structured history JSON to determine priority.
// Must not output diagnoses, only "PRIORITY" or "ATTENTION" flags.

const triageRules = [
  {
    id: "SEVERE_CHEST_PAIN",
    priority: "URGENT",
    message: "Potential emergency symptoms detected. Please alert the triage staff immediately.",
    requiresImmediateAttention: true,
    condition: (history) => {
      // Looks for chest pain + (breathlessness OR sweating OR radiation to left arm/jaw OR syncope)
      if (history.normalizedComplaint !== 'chest_pain') return false;
      
      const assoc = (history.hpi?.associatedSymptoms || []).map(s => typeof s === 'string' ? s.toLowerCase() : '');
      const rad = (history.hpi?.radiation || "").toLowerCase();
      
      const hasBreathlessness = assoc.some(s => s.includes("breathlessness") || s.includes("shortness"));
      const hasSweating = assoc.some(s => s.includes("sweating"));
      const hasSyncope = assoc.some(s => s.includes("dizziness") || s.includes("faint"));
      const hasLeftArmJaw = rad.includes("left arm") || rad.includes("jaw") || rad.includes("neck");
      
      return hasBreathlessness || hasSweating || hasSyncope || hasLeftArmJaw;
    }
  },
  {
    id: "NEUROLOGICAL_DEFICIT",
    priority: "URGENT",
    message: "Potential emergency symptoms detected. Please alert the triage staff immediately.",
    requiresImmediateAttention: true,
    condition: (history) => {
      // Looks for stroke-like symptoms: sudden headache + (weakness OR speech difficulty)
      const assoc = (history.hpi?.associatedSymptoms || []).map(s => typeof s === 'string' ? s.toLowerCase() : '');
      const onset = (history.hpi?.onset || "").toLowerCase();
      const cc = (history.chiefComplaint || "").toLowerCase();

      const hasHeadache = (history.normalizedComplaint === 'headache');
      const sudden = onset.includes("sudden") || onset.includes("thunderclap");
      const hasWeakness = cc.includes("weakness") || assoc.some(s => s.includes("weakness"));
      const hasSpeech = cc.includes("speech") || assoc.some(s => s.includes("speech"));
      
      return (hasHeadache && sudden) || hasWeakness || hasSpeech;
    }
  },
  {
    id: "SEVERE_RESPIRATORY",
    priority: "URGENT",
    message: "Potential emergency symptoms detected. Please alert the triage staff immediately.",
    requiresImmediateAttention: true,
    condition: (history) => {
      // Looks for severe breathlessness
      const cc = (history.chiefComplaint || "").toLowerCase();
      const assoc = (history.hpi?.associatedSymptoms || []).map(s => typeof s === 'string' ? s.toLowerCase() : '');
      
      const hasBreathlessness = cc.includes("breathlessness") || assoc.some(s => s.includes("breathlessness"));
      // We can also flag it if they explicitly complained of breathlessness, even if the primary node was something else.
      return hasBreathlessness;
    }
  },
  {
    id: "SEVERE_ALLERGIC_REACTION",
    priority: "URGENT",
    message: "Potential emergency symptoms detected. Please alert the triage staff immediately.",
    requiresImmediateAttention: true,
    condition: (history) => {
      const cc = (history.chiefComplaint || "").toLowerCase();
      const assoc = (history.hpi?.associatedSymptoms || []).map(s => typeof s === 'string' ? s.toLowerCase() : '');
      
      const hasSwelling = cc.includes("swelling") || assoc.some(s => s.includes("swelling") || s.includes("facial"));
      const hasBreathing = assoc.some(s => s.includes("breathlessness") || s.includes("wheezing"));
      
      return hasSwelling && hasBreathing;
    }
  }
];

module.exports = { triageRules };

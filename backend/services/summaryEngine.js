const { evaluateTriage } = require('./triageEngine');

const generateSummary = (encounter) => {
  // 1. Evaluate Triage Flags
  const triage = evaluateTriage(encounter.structuredHistory);
  encounter.triageFlags = triage;

  // 2. Format HPI (History of Present Illness)
  const hpiData = encounter.structuredHistory.hpi;
  let hpiText = `Patient presents with ${encounter.structuredHistory.chiefComplaint || 'complaint'}. `;
  
  if (hpiData.onset) hpiText += `Onset was ${hpiData.onset}. `;
  if (hpiData.location) hpiText += `Location: ${hpiData.location}. `;
  if (hpiData.character) hpiText += `Character: ${hpiData.character}. `;
  if (hpiData.radiation) hpiText += `Radiates to: ${hpiData.radiation}. `;
  if (hpiData.severity) hpiText += `Severity: ${hpiData.severity}. `;
  
  const assoc = hpiData.associatedSymptoms || [];
  if (assoc.length > 0) hpiText += `Associated symptoms include: ${assoc.join(', ')}. `;
  
  // 3. Compile Timeline
  let timeline = [];
  encounter.documents.forEach(doc => {
    timeline.push({
      date: doc.date,
      type: doc.documentType,
      items: [...(doc.entities.investigations || []), ...(doc.entities.medications || [])]
    });
  });
  
  // Sort timeline chronologically (mocked as already sorted for demo)
  
  // 4. Create Draft
  const summaryDraft = {
    patient: encounter.patient,
    chiefComplaint: encounter.structuredHistory.chiefComplaint,
    hpi: hpiText,
    pastMedicalHistory: encounter.structuredHistory.pastHistory.join(', ') || 'None reported',
    medications: encounter.structuredHistory.medications.join(', ') || 'None reported',
    allergies: encounter.structuredHistory.allergies.join(', ') || 'No known allergies',
    timeline: timeline,
    triage: triage,
    isDraft: true, // Requires physician verification
    timestamp: new Date().toISOString(),
    correctionHistory: encounter.summary ? encounter.summary.correctionHistory : []
  };

  encounter.summary = summaryDraft;
  encounter.status = "ready_for_doctor";
  
  return summaryDraft;
};

module.exports = { generateSummary };

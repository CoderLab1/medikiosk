const express = require('express');
const router = express.Router();
const { getEncounter } = require('../data/demoPatients');
const { generateSummary } = require('../services/summaryEngine');

router.get('/generate/:encounterId', (req, res) => {
  const encounter = getEncounter(req.params.encounterId);
  if (!encounter) return res.status(404).json({ error: "Encounter not found" });
  
  const summary = generateSummary(encounter);
  res.json({ status: "complete", structuredSummary: summary });
});

router.post('/verify/:encounterId', (req, res) => {
  const encounter = getEncounter(req.params.encounterId);
  if (!encounter) return res.status(404).json({ error: "Encounter not found" });
  
  if (encounter.summary) {
    const { edits } = req.body;
    
    // Process edits if they exist and create an audit trail
    if (edits) {
      if (!encounter.summary.correctionHistory) {
        encounter.summary.correctionHistory = [];
      }
      
      const fields = ['chiefComplaint', 'hpi', 'pastMedicalHistory', 'medications', 'allergies'];
      fields.forEach(field => {
        if (edits[field] !== undefined && edits[field] !== encounter.summary[field]) {
          encounter.summary.correctionHistory.push({
            field: field,
            original: encounter.summary[field],
            edited: edits[field],
            editedBy: "Physician",
            timestamp: new Date().toISOString()
          });
          encounter.summary[field] = edits[field];
        }
      });
    }

    encounter.summary.isDraft = false;
    encounter.summary.verifiedAt = new Date().toISOString();
    encounter.status = "verified";
  }
  
  res.json({ status: "success", message: "Summary verified and saved to EMR" });
});

module.exports = router;

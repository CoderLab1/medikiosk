const express = require('express');
const router = express.Router();
const { createEncounter, getEncounter, demoPatient } = require('../data/demoPatients');

router.post('/start', (req, res) => {
  // In demo mode, we automatically use the demoPatient
  const encounter = createEncounter(demoPatient);
  res.json({ status: "success", encounterId: encounter.encounterId, patient: encounter.patient });
});

router.post('/consent', (req, res) => {
  const { encounterId, language } = req.body;
  const encounter = getEncounter(encounterId);
  
  if (!encounter) return res.status(404).json({ error: "Encounter not found" });
  
  encounter.consent = true;
  encounter.language = language || "en";
  encounter.status = "history_in_progress";
  
  res.json({ status: "success", message: "Consent recorded" });
});

router.get('/:encounterId', (req, res) => {
  const encounter = getEncounter(req.params.encounterId);
  if (!encounter) return res.status(404).json({ error: "Encounter not found" });
  
  res.json({ encounter });
});

module.exports = router;

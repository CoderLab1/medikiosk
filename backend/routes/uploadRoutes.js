const express = require('express');
const router = express.Router();
const { getEncounter } = require('../data/demoPatients');
const { processUploadedDocument } = require('../services/documentEngine');

router.post('/upload', async (req, res) => {
  const { encounterId, fileType } = req.body;
  const encounter = getEncounter(encounterId);
  
  if (!encounter) return res.status(404).json({ error: "Encounter not found" });
  
  try {
    const data = await processUploadedDocument(encounter, fileType);
    res.json({ message: "Document processed successfully", data });
  } catch (error) {
    res.status(500).json({ error: "Failed to process document" });
  }
});

module.exports = router;

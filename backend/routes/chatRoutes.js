const express = require('express');
const router = express.Router();
const { getEncounter } = require('../data/demoPatients');
const { processAnswer } = require('../services/historyEngine');

router.post('/answer', async (req, res) => {
  const { encounterId, message } = req.body;
  const encounter = getEncounter(encounterId);
  
  if (!encounter) return res.status(404).json({ error: "Encounter not found" });
  
  // Record conversation
  encounter.conversation.push({ type: 'user', text: message });
  
  try {
    // Process the answer using the clinical engine
    const { reply, options, isComplete } = await processAnswer(encounter, message);
    
    // Record AI response
    encounter.conversation.push({ type: 'ai', text: reply });
    
    res.json({ reply, options, isComplete });
  } catch (error) {
    console.error("Error processing answer:", error);
    res.status(500).json({ error: "Failed to process answer" });
  }
});

module.exports = router;

const { processAnswer } = require('./services/historyEngine');
const { evaluateTriage } = require('./services/triageEngine');
const { aiProvider } = require('./services/aiProvider');

const runTest = async (testName, inputs) => {
  console.log(`\n--- Test: ${testName} ---`);
  
  const encounter = {
    patient: { name: "Test Patient" },
    structuredHistory: { pastHistory: [], medications: [], allergies: [], hpi: {} },
    currentGraphNode: null,
    currentStepIndex: 0
  };
  
  for (const input of inputs) {
    await processAnswer(encounter, input);
  }
  
  const triage = evaluateTriage(encounter.structuredHistory);
  console.log(`Normalized Complaint: ${encounter.structuredHistory.normalizedComplaint}`);
  console.log(`Triage Priority: ${triage?.priority || 'Routine'}`);
  if (triage?.flags) {
     console.log(`Triage Flags: ${triage.flags.join(', ')}`);
  }
};

(async () => {
  try {
    console.log("Using API Key:", process.env.GEMINI_API_KEY ? "YES" : "NO (Fallback Demo Mode)");
    
    // 1. Standard chest pain
    await runTest("Standard 'chest pain'", [
      "chest pain",
      "suddenly yesterday", // onset
      "a few hours", // duration
      "central chest", // location
      "pressure", // character
      "nowhere", // radiation
      "5", // severity
      "nothing", // agg
      "nothing", // rel
      "none" // assoc
    ]);

    // 2. Natural language equivalent
    await runTest("Natural language equivalent 'my heart hurts'", [
      "my heart hurts",
      "suddenly yesterday", 
      "a few hours", 
      "central chest", 
      "pressure", 
      "nowhere", 
      "5", 
      "nothing", 
      "nothing", 
      "none"
    ]);

    // 3. Non-chest complaint
    await runTest("Non-chest complaint 'fever'", [
      "fever",
      "2 days", // duration
      "mild", // temp
      "constant", // pattern
      "no", // chills
      "no", // sweating
      "none" // assoc
    ]);

    // 4. Chest pain + left-arm radiation
    await runTest("Chest pain + left-arm radiation", [
      "chest pain",
      "suddenly yesterday", 
      "a few hours", 
      "central chest", 
      "pressure", 
      "left arm", // radiation
      "8", 
      "nothing", 
      "nothing", 
      "none" 
    ]);

    // 5. Chest pain + breathlessness
    await runTest("Chest pain + breathlessness", [
      "chest pain",
      "suddenly yesterday", 
      "a few hours", 
      "central chest", 
      "pressure", 
      "nowhere", 
      "8", 
      "nothing", 
      "nothing", 
      "breathlessness" // assoc
    ]);
    
  } catch (err) {
    console.error(err);
  }
})();

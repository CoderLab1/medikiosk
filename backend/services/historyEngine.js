const { clinicalGraph } = require('../data/clinicalQuestions');
const { aiProvider } = require('./aiProvider');

const processAnswer = async (encounter, answer) => {
  // If no chief complaint is set, assume the first message is the chief complaint
  if (!encounter.structuredHistory.chiefComplaint) {
    encounter.structuredHistory.chiefComplaint = answer;
    const normalized = await aiProvider.normalizeComplaint(answer);
    
    // Ensure it's a valid node, else fallback to chest_pain for demo
    if (clinicalGraph[normalized]) {
       encounter.currentGraphNode = normalized;
    } else {
       encounter.currentGraphNode = "chest_pain";
    }
    
    encounter.structuredHistory.normalizedComplaint = encounter.currentGraphNode;
    encounter.currentStepIndex = 0;
  } else {
    // Process the answer based on the current step
    const graph = clinicalGraph[encounter.currentGraphNode];
    if (graph && encounter.currentStepIndex < graph.steps.length) {
      const step = graph.steps[encounter.currentStepIndex];
      
      // Use LLM to extract the entity from the natural language
      const extractedValue = await aiProvider.extractClinicalEntities(step.question, answer, step.id);
      
      // Store in structured history
      if (step.id === 'pastHistory') {
        encounter.structuredHistory.pastHistory.push(extractedValue);
      } else if (step.id === 'medications') {
        encounter.structuredHistory.medications.push(extractedValue);
      } else if (step.id === 'allergies') {
        encounter.structuredHistory.allergies.push(extractedValue);
      } else if (step.id === 'associatedSymptoms' || step.id === 'aggravatingFactors' || step.id === 'relievingFactors') {
        encounter.structuredHistory.hpi[step.id] = encounter.structuredHistory.hpi[step.id] || [];
        encounter.structuredHistory.hpi[step.id].push(extractedValue);
      } else {
        encounter.structuredHistory.hpi[step.id] = extractedValue;
      }
      
      encounter.currentStepIndex++;
    }
  }

  // Get next question
  const graph = clinicalGraph[encounter.currentGraphNode];
  if (graph && encounter.currentStepIndex < graph.steps.length) {
    const nextStep = graph.steps[encounter.currentStepIndex];
    return {
      reply: nextStep.question,
      options: nextStep.options,
      isComplete: false
    };
  }

  return {
    reply: "Thank you. Your history has been recorded. Please upload any previous documents.",
    options: ["Go to Upload"],
    isComplete: true
  };
};

module.exports = { processAnswer };

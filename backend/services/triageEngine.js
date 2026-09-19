const { triageRules } = require('../data/clinicalRules');

const evaluateTriage = (structuredHistory) => {
  let highestPriority = "ROUTINE";
  let activeFlags = [];
  let requiresImmediateAttention = false;
  let message = "";

  for (const rule of triageRules) {
    if (rule.condition(structuredHistory)) {
      activeFlags.push(rule.id);
      requiresImmediateAttention = true;
      if (rule.priority === "URGENT") {
        highestPriority = "URGENT";
        message = rule.message;
      } else if (rule.priority === "HIGH" && highestPriority !== "URGENT") {
        highestPriority = "HIGH";
        message = rule.message;
      }
    }
  }

  return {
    priority: highestPriority,
    flags: activeFlags,
    message,
    requiresImmediateAttention
  };
};

module.exports = { evaluateTriage };

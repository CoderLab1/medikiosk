// A clinical question graph for adaptive history taking

const clinicalGraph = {
  "chest_pain": {
    steps: [
      { id: "onset", question: "When did the chest pain start? Did it come on suddenly or gradually?", options: ["Suddenly", "Gradually", "A few hours ago", "Yesterday"] },
      { id: "duration", question: "How long has it been lasting?", options: ["A few minutes", "A few hours", "Constantly since it started"] },
      { id: "location", question: "Where exactly is the pain?", options: ["Central chest", "Left side", "Right side", "All over"] },
      { id: "character", question: "How would you describe the pain?", options: ["Pressure/Tightness", "Sharp/Stabbing", "Burning", "Dull ache"] },
      { id: "radiation", question: "Does the pain travel or radiate anywhere else?", options: ["Left arm", "Neck/Jaw", "Back", "No, stays in chest"] },
      { id: "severity", question: "On a scale of 1 to 10, how severe is it?", options: ["1-3 (Mild)", "4-6 (Moderate)", "7-8 (Severe)", "9-10 (Very Severe)"] },
      { id: "aggravatingFactors", question: "Does anything make the pain worse?", options: ["Walking/Exertion", "Breathing in", "Pressing on chest", "Nothing"] },
      { id: "relievingFactors", question: "Does anything make the pain better?", options: ["Rest", "Leaning forward", "Medications", "Nothing"] },
      { id: "associatedSymptoms", question: "Do you have any other symptoms?", options: ["Breathlessness", "Sweating", "Nausea/Vomiting", "Dizziness", "None"] },
      { id: "pastHistory", question: "Do you have any past medical history we should know about?", options: ["Diabetes", "High Blood Pressure", "Heart Disease", "None"] },
      { id: "medications", question: "Are you taking any current medications?", options: ["Yes (I will upload prescription)", "No"] },
      { id: "allergies", question: "Do you have any known allergies?", options: ["No known allergies", "Penicillin", "Other"] }
    ]
  },
  "fever": {
    steps: [
      { id: "duration", question: "How long have you had the fever?", options: ["1-2 days", "3-5 days", "More than a week"] },
      { id: "temperature", question: "How high is the fever? (if checked)", options: ["Mild (around 99-100°F)", "High (101-103°F)", "Very High (>103°F)", "Not checked"] },
      { id: "pattern", question: "Is the fever constant or does it come and go?", options: ["Constant", "Comes and goes", "Higher in the evening"] },
      { id: "chills", question: "Are you experiencing chills or shivering?", options: ["Yes, severe chills", "Mild chills", "No"] },
      { id: "sweating", question: "Are you experiencing heavy sweating?", options: ["Yes, mostly at night", "Yes, throughout the day", "No"] },
      { id: "associatedSymptoms", question: "Do you have any of these associated symptoms?", options: ["Cough", "Urinary burning", "Rash", "Headache", "None"] },
      { id: "exposure", question: "Have you travelled recently or been exposed to sick contacts?", options: ["Recent travel", "Sick contact", "No exposure"] },
      { id: "pastHistory", question: "Do you have any past medical history we should know about?", options: ["Diabetes", "Asthma", "None"] },
      { id: "medications", question: "Have you taken any medication for the fever?", options: ["Paracetamol/Crocin", "Antibiotics", "None"] },
      { id: "allergies", question: "Do you have any known allergies?", options: ["No known allergies", "Other"] }
    ]
  },
  "cough": {
    steps: [
      { id: "duration", question: "How long have you had the cough?", options: ["Less than a week", "1-3 weeks", "More than a month"] },
      { id: "type", question: "Is it a dry cough or do you bring up phlegm (sputum)?", options: ["Dry cough", "Productive (with phlegm)"] },
      { id: "sputum", question: "If there is phlegm, what color is it?", options: ["Clear/White", "Yellow/Green", "Blood-stained", "No phlegm"] },
      { id: "associatedSymptoms", question: "Are you experiencing any of these other symptoms?", options: ["Breathlessness", "Chest pain", "Fever", "Wheezing", "None"] },
      { id: "smoking", question: "Do you have a history of smoking?", options: ["Current smoker", "Ex-smoker", "Never smoked"] },
      { id: "pastHistory", question: "Do you have any past medical history?", options: ["Asthma/COPD", "TB", "Heart Disease", "None"] },
      { id: "medications", question: "Are you taking any current medications?", options: ["Yes (I will upload prescription)", "No"] },
      { id: "allergies", question: "Do you have any known allergies?", options: ["No known allergies", "Other"] }
    ]
  },
  "abdominal_pain": {
    steps: [
      { id: "location", question: "Where exactly is the abdominal pain?", options: ["Upper abdomen", "Lower abdomen", "Around navel", "All over"] },
      { id: "onset", question: "When did it start?", options: ["Suddenly today", "Gradually over a few days", "It's a chronic pain"] },
      { id: "character", question: "How would you describe the pain?", options: ["Cramping", "Burning", "Sharp/Stabbing", "Dull ache"] },
      { id: "severity", question: "On a scale of 1 to 10, how severe is it?", options: ["1-3 (Mild)", "4-6 (Moderate)", "7-8 (Severe)", "9-10 (Very Severe)"] },
      { id: "associatedSymptoms", question: "Do you have any of these other symptoms?", options: ["Vomiting", "Diarrhea", "Constipation", "Fever", "None"] },
      { id: "foodRelation", question: "Is the pain related to eating food?", options: ["Worse after eating", "Better after eating", "No relation to food"] },
      { id: "pastHistory", question: "Any previous abdominal surgeries or conditions?", options: ["Gallstones", "Ulcer", "Previous surgery", "None"] },
      { id: "medications", question: "Are you taking any current medications?", options: ["Yes (I will upload prescription)", "No"] },
      { id: "allergies", question: "Do you have any known allergies?", options: ["No known allergies", "Other"] }
    ]
  },
  "headache": {
    steps: [
      { id: "onset", question: "When did the headache start?", options: ["Suddenly (Thunderclap)", "Gradually", "I get these often"] },
      { id: "location", question: "Where is the headache worst?", options: ["Front/Forehead", "One side only", "Back of head/Neck", "All over"] },
      { id: "character", question: "How would you describe the pain?", options: ["Throbbing/Pulsating", "Tight band around head", "Sharp"] },
      { id: "severity", question: "On a scale of 1 to 10, how severe is it?", options: ["1-3 (Mild)", "4-6 (Moderate)", "7-8 (Severe)", "9-10 (Very Severe)"] },
      { id: "associatedSymptoms", question: "Do you have any other symptoms?", options: ["Visual changes (blurring/flashes)", "Nausea/Vomiting", "Weakness in limbs", "Speech difficulty", "None"] },
      { id: "pastHistory", question: "Do you have a history of migraines or high blood pressure?", options: ["Migraines", "High BP", "None"] },
      { id: "medications", question: "Are you taking any current medications?", options: ["Yes (I will upload prescription)", "No"] },
      { id: "allergies", question: "Do you have any known allergies?", options: ["No known allergies", "Other"] }
    ]
  }
};

module.exports = { clinicalGraph };

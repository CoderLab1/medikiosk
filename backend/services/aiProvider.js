const { GoogleGenAI, Type, Schema } = require('@google/genai');

class DemoAIProvider {
  async extractClinicalEntities(question, answer, fieldId) {
    // Mock extraction, simply returns the raw answer as fallback
    return answer;
  }

  async normalizeComplaint(answer) {
    const ans = answer.toLowerCase();
    if (ans.includes('chest') || ans.includes('heart')) return 'chest_pain';
    if (ans.includes('fever')) return 'fever';
    if (ans.includes('cough')) return 'cough';
    if (ans.includes('stomach') || ans.includes('abdom')) return 'abdominal_pain';
    if (ans.includes('headache')) return 'headache';
    return 'chest_pain'; // Fallback for demo
  }
}

class GeminiAIProvider {
  constructor(apiKey) {
    this.ai = new GoogleGenAI({ apiKey });
  }
  
  async extractClinicalEntities(question, answer, fieldId) {
    try {
      const prompt = `You are a clinical AI assistant extracting a structured entity from a patient's natural language answer.
      
Question Asked: "${question}"
Patient Answer: "${answer}"

Extract the clinical information into a concise medical term or value. If the answer is vague or uncertain, output the most accurate short summary. Keep it brief.

Return ONLY a JSON object with a single key "extractedValue" containing the string result.`;

      const response = await this.ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              extractedValue: { type: Type.STRING }
            },
            required: ["extractedValue"]
          }
        }
      });
      
      const parsed = JSON.parse(response.text);
      return parsed.extractedValue || answer;
      
    } catch (error) {
      console.error("Gemini AI Provider Error:", error);
      // Graceful fallback to raw answer
      return answer;
    }
  }

  async normalizeComplaint(answer) {
    try {
      const prompt = `Categorize this patient complaint into exactly one of these strings: "chest_pain", "fever", "cough", "abdominal_pain", "headache", "other".
Patient Answer: "${answer}"
Return ONLY a JSON object with a single key "category" containing the string result.`;

      const response = await this.ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: { category: { type: Type.STRING } },
            required: ["category"]
          }
        }
      });
      
      const parsed = JSON.parse(response.text);
      const cat = parsed.category;
      if (['chest_pain', 'fever', 'cough', 'abdominal_pain', 'headache'].includes(cat)) {
        return cat;
      }
      return 'other';
    } catch (error) {
      console.error("Gemini AI Provider Error in normalizeComplaint:", error);
      const ans = answer.toLowerCase();
      if (ans.includes('chest') || ans.includes('heart')) return 'chest_pain';
      if (ans.includes('fever')) return 'fever';
      if (ans.includes('cough')) return 'cough';
      if (ans.includes('stomach') || ans.includes('abdom')) return 'abdominal_pain';
      if (ans.includes('headache')) return 'headache';
      return 'chest_pain'; // Fallback
    }
  }
}

// Instantiate the correct provider based on environment
const aiProvider = process.env.GEMINI_API_KEY 
  ? new GeminiAIProvider(process.env.GEMINI_API_KEY) 
  : new DemoAIProvider();

module.exports = { aiProvider };

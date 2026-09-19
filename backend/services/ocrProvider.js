// Mock OCR Provider for SIH Demo

class MockOCRProvider {
  async processDocument(fileBuffer, mimeType) {
    // In a real scenario, this calls Google Cloud Vision or Textract
    // For the demo, we return a hardcoded structured payload as requested.
    
    return {
      documentType: "lab_report",
      date: "2026-03-12",
      entities: {
        investigations: [
          { name: "HbA1c", value: 8.4, unit: "%", abnormal: true, confidence: 96, source: "OCR" },
          { name: "Hb", value: 11.2, unit: "g/dL", abnormal: true, confidence: 92, source: "OCR" },
          { name: "Creatinine", value: 1.0, unit: "mg/dL", abnormal: false, confidence: 98, source: "OCR" }
        ],
        medications: []
      }
    };
  }

  async processPrescriptionDemo() {
    return {
      documentType: "prescription",
      date: "2026-03-12",
      entities: {
        investigations: [],
        medications: [
          { name: "Metformin", dosage: "500 mg", confidence: 96, source: "Prescription OCR" },
          { name: "Telmisartan", dosage: "?40 mg", confidence: 45, source: "Prescription OCR", requiresVerification: true }
        ]
      }
    };
  }
}

const ocrProvider = new MockOCRProvider();

module.exports = { ocrProvider };

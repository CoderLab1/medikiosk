const { ocrProvider } = require('./ocrProvider');

const processUploadedDocument = async (encounter, fileType) => {
  // In a real app, fileBuffer and mimeType would be passed
  
  // For the SIH Demo, we process both a lab report and a prescription
  const labData = await ocrProvider.processDocument(null, 'image/jpeg');
  const rxData = await ocrProvider.processPrescriptionDemo();
  
  encounter.documents.push(labData);
  encounter.documents.push(rxData);
  
  // Update status
  encounter.status = "documents_processed";
  
  return { labData, rxData };
};

module.exports = { processUploadedDocument };

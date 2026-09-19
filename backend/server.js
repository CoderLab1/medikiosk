const express = require('express');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 3000;

app.use(cors({
  origin: process.env.FRONTEND_URL || '*'
}));
app.use(express.json());

// Routes
const encounterRoutes = require('./routes/encounterRoutes');
const chatRoutes = require('./routes/chatRoutes');
const uploadRoutes = require('./routes/uploadRoutes');
const summaryRoutes = require('./routes/summaryRoutes');

app.use('/api/encounters', encounterRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/documents', uploadRoutes);
app.use('/api/summary', summaryRoutes);

app.get('/health', (req, res) => {
  res.json({ status: 'OK' });
});

app.listen(port, () => {
  console.log(`Backend running at http://localhost:${port}`);
});

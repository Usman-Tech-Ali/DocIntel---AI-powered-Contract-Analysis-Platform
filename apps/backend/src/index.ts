import express from 'express';
import cors from 'cors';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import axios from 'axios';
import { config } from '@docintel/config';

const app = express();
const PORT = process.env.PORT || 3001;
const WORKER_URL = process.env.WORKER_URL || 'http://localhost:8000';

// Middleware
app.use(cors());
app.use(express.json());

// File upload config
const uploadDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 50 * 1024 * 1024 }, // 50MB
  fileFilter: (req, file, cb) => {
    const allowedTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'image/png', 'image/jpeg', 'image/jpg', 'image/webp', 'image/tiff',
      'text/plain'
    ];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type'));
    }
  }
});

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'healthy', service: 'docintel-backend' });
});

// Upload document
app.post('/api/documents/upload', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    // Forward to worker service
    const formData = new FormData();
    const fileBuffer = fs.readFileSync(req.file.path);
    const blob = new Blob([fileBuffer], { type: req.file.mimetype });
    formData.append('file', blob, req.file.originalname);

    const response = await axios.post(`${WORKER_URL}/upload`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });

    // Clean up local file
    fs.unlinkSync(req.file.path);

    res.json(response.data);
  } catch (error: any) {
    console.error('Upload error:', error.message);
    res.status(500).json({ error: 'Upload failed' });
  }
});

// Analyze document
app.post('/api/documents/:id/analyze', async (req, res) => {
  try {
    const { id } = req.params;
    const { language } = req.body;

    const response = await axios.post(
      `${WORKER_URL}/analyze/${id}`,
      null,
      { params: { language } }
    );

    res.json(response.data);
  } catch (error: any) {
    console.error('Analysis error:', error.message);
    res.status(500).json({ error: 'Analysis failed' });
  }
});

// Get analysis
app.get('/api/documents/:id/analysis', async (req, res) => {
  try {
    const { id } = req.params;
    const response = await axios.get(`${WORKER_URL}/analysis/${id}`);
    res.json(response.data);
  } catch (error: any) {
    if (error.response?.status === 404) {
      return res.status(404).json({ error: 'Analysis not found' });
    }
    res.status(500).json({ error: 'Failed to get analysis' });
  }
});

// Chat with document
app.post('/api/documents/:id/chat', async (req, res) => {
  try {
    const { id } = req.params;
    const { message, language, history } = req.body;

    const response = await axios.post(`${WORKER_URL}/chat`, {
      document_id: id,
      message,
      language: language || 'en',
      history: history || []
    });

    res.json(response.data);
  } catch (error: any) {
    console.error('Chat error:', error.message);
    res.status(500).json({ error: 'Chat failed' });
  }
});

// Fix clause
app.post('/api/fix-clause', async (req, res) => {
  try {
    const { clauseText, issue, context } = req.body;

    const response = await axios.post(`${WORKER_URL}/fix-clause`, {
      clause_text: clauseText,
      issue,
      context: context || ''
    });

    res.json(response.data);
  } catch (error: any) {
    console.error('Fix clause error:', error.message);
    res.status(500).json({ error: 'Failed to fix clause' });
  }
});

// Generate report
app.get('/api/documents/:id/report', async (req, res) => {
  try {
    const { id } = req.params;
    const { format } = req.query;

    const response = await axios.get(`${WORKER_URL}/report/${id}`, {
      params: { format: format || 'pdf' },
      responseType: 'stream'
    });

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=contract-analysis-${id.slice(0, 8)}.pdf`);
    response.data.pipe(res);
  } catch (error: any) {
    console.error('Report error:', error.message);
    res.status(500).json({ error: 'Failed to generate report' });
  }
});

// List documents
app.get('/api/documents', async (req, res) => {
  try {
    const response = await axios.get(`${WORKER_URL}/documents`);
    res.json(response.data);
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to list documents' });
  }
});

// Delete document
app.delete('/api/documents/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await axios.delete(`${WORKER_URL}/documents/${id}`);
    res.json({ status: 'deleted' });
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to delete document' });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 DocIntel Backend running on port ${PORT}`);
});

// Configuration for DocIntel

export const config = {
  // API URLs
  api: {
    backend: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001',
    worker: process.env.WORKER_URL || 'http://localhost:8000',
  },
  
  // Gemini API
  gemini: {
    apiKey: process.env.GEMINI_API_KEY || '',
    model: 'gemini-2.0-flash',
    baseUrl: 'https://generativelanguage.googleapis.com/v1beta',
  },
  
  // File upload limits
  upload: {
    maxFileSize: 50 * 1024 * 1024, // 50MB
    allowedMimeTypes: [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'image/png',
      'image/jpeg',
      'image/jpg',
      'image/webp',
      'image/tiff',
      'text/plain',
    ],
    allowedExtensions: ['.pdf', '.doc', '.docx', '.png', '.jpg', '.jpeg', '.webp', '.tiff', '.txt'],
  },
  
  // Risk thresholds
  risk: {
    greenMax: 30,
    yellowMax: 60,
    // Above 60 is red
  },
  
  // Token costs per operation
  tokens: {
    analysis: 10,
    chat: 1,
    report: 5,
  },
  
  // Supported languages
  languages: [
    { code: 'en', name: 'English' },
    { code: 'ur', name: 'Urdu' },
    { code: 'hi', name: 'Hindi' },
    { code: 'ar', name: 'Arabic' },
    { code: 'es', name: 'Spanish' },
    { code: 'fr', name: 'French' },
    { code: 'de', name: 'German' },
    { code: 'zh', name: 'Chinese' },
  ],
};

export default config;

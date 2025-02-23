// Import necessary modules
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { exec } = require('child_process');

// Initialize the Express app
const app = express();

// Use middleware for CORS and JSON parsing
app.use(cors());
app.use(bodyParser.json());

// Define the translation endpoint
app.post('/translate', (req, res) => {
  const { text, fromLanguage, toLanguage, mode } = req.body;
  console.log('Request Body:', req.body);
  console.log('Received Text:', text);
  console.log('From Language:', fromLanguage);
  console.log('To Language:', toLanguage);
  console.log('Mode:', mode);
  if (text && fromLanguage && toLanguage && mode) {
    const command = `python translation_script.py "${text}" ${fromLanguage} ${toLanguage} ${mode}`;
    console.log('Executing Command:', command);
    exec(command, (error, stdout, stderr) => {
      if (error) {
        console.error(`Translation error: ${error.message}`);
        return res.status(500).json({ error: 'Translation failed', details: error.message });
      }
      if (stderr) {
        console.error(`Translation stderr: ${stderr}`);
        return res.status(500).json({ error: 'Translation failed', details: stderr });
      }
      console.log('Translated Text:', stdout.trim());
      res.json({ translated_text: stdout.trim() });
    });
  } else {
    console.error('Text to translate, from language, to language, or mode is missing');
    res.status(400).json({ error: 'Text to translate, from language, to language, or mode is missing' });
  }
});






// Start the server
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

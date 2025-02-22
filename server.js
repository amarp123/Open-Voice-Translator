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
    const { text, outputLanguage } = req.body;
    console.log('Received Text:', text);
    console.log('Output Language:', outputLanguage);

    if (text && outputLanguage) {
        const fromLang = 'en'; // This can be dynamic if required
        const command = `python translation_script.py "${text}" ${fromLang} ${outputLanguage}`;
        console.log('Executing Command:', command);
        exec(command, (error, stdout, stderr) => {
            if (error) {
                console.error(`Translation error: ${error.message}`);
                return res.status(500).json({ error: 'Translation failed' });
            }
            if (stderr) {
                console.error(`Translation stderr: ${stderr}`);
                return res.status(500).json({ error: 'Translation failed' });
            }
            console.log('Translated Text:', stdout.trim());
            res.json({ translated_text: stdout.trim() });
        });
    } else {
        res.status(400).json({ error: 'Text to translate or output language is missing' });
    }
});

// Start the server
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

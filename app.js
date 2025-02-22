const startButton = document.getElementById('start-button');
const output = document.getElementById('output');
const translateButton = document.getElementById('translate-button');
const translatedOutput = document.getElementById('translated-output');
const inputLanguageSelect = document.getElementById('input-language');
const outputLanguageSelect = document.getElementById('output-language');
const darkModeButton = document.getElementById('toggle-dark-mode');
const viewHistoryButton = document.getElementById('view-history-button');
const historySection = document.getElementById('history-section');
const historyList = document.getElementById('history-list');

// Toggle Dark Mode
darkModeButton.addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
    document.body.classList.toggle('light-mode');
});

// Start Speech Recognition
startButton.addEventListener('click', () => {
    const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
    recognition.lang = inputLanguageSelect.value;
    recognition.start();

    recognition.onresult = (event) => {
        const spokenText = event.results[0][0].transcript;
        output.textContent = spokenText;
    };

    recognition.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
    };
});

// Function for Voice Feedback
function giveVoiceFeedback(message) {
    const utterance = new SpeechSynthesisUtterance(message);
    window.speechSynthesis.speak(utterance);
}

// Translate Text
translateButton.addEventListener('click', async () => {
    const textToTranslate = output.textContent;
    const outputLanguage = outputLanguageSelect.value;

    console.log('Text to Translate:', textToTranslate); // Debugging
    console.log('Output Language:', outputLanguage); // Debugging

    if (!textToTranslate || !outputLanguage) {
        console.error('Text to translate or output language is missing');
        return;
    }

    try {
        const response = await fetch('http://localhost:3001/translate', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ text: textToTranslate, outputLanguage: outputLanguage })
        });

        if (response.ok) {
            const result = await response.json();
            console.log('Translated Text:', result.translated_text); // Debugging
            translatedOutput.textContent = result.translated_text;

            // Save to history
            saveToHistory(textToTranslate, result.translated_text);

            // Provide voice feedback
            giveVoiceFeedback(`Translation completed. The translated text is ${result.translated_text}`);
        } else {
            console.error('Translation failed:', response.statusText);
            giveVoiceFeedback('Translation failed. Please try again.');
        }
    } catch (error) {
        console.error('Error:', error);
        giveVoiceFeedback('An error occurred. Please try again.');
    }
});

// Save Translation to History
function saveToHistory(originalText, translatedText) {
    const history = JSON.parse(localStorage.getItem('translationHistory')) || [];
    history.push({ original: originalText, translated: translatedText });
    localStorage.setItem('translationHistory', JSON.stringify(history));
}

// Display Translation History
viewHistoryButton.addEventListener('click', () => {
    const history = JSON.parse(localStorage.getItem('translationHistory')) || [];
    historyList.innerHTML = '';
    history.forEach(item => {
        const listItem = document.createElement('li');
        listItem.textContent =` Original: ${item.original}, Translated: ${item.translated}`;
        historyList.appendChild(listItem);
    });
    historySection.style.display = 'block';
});
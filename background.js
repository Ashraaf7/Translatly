chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === 'translate') {
        fetch('https://api.reverso.net/translate/v1/translation', {
            method: 'POST',
            headers: {
                'accept': 'application/json, text/plain, */*',
                'content-type': 'application/json',
                'origin': 'https://www.reverso.net',
                'referer': 'https://www.reverso.net/',
                'x-reverso-origin': 'translation.web',
            },
            body: JSON.stringify({
                format: "text",
                from: message.sourceLanguage || "eng",  // Default to English if not provided
                to: message.targetLanguage || "ara",    // Default to Arabic if not provided
                input: message.text,
                options: {
                    sentenceSplitter: true,
                    origin: "translation.web",
                    contextResults: true,
                    languageDetection: true
                }
            }),
        })
        .then(response => response.json())
        .then(data => {
            if (data.translation) {
                sendResponse({ translatedText: data.translation[0] });
            } else {
                console.error('No translated text received');
                sendResponse({ translatedText: null });
            }
        })
        .catch(error => {
            console.error('Error during translation:', error);
            sendResponse({ translatedText: null });
        });

        return true; // Keep the message channel open for asynchronous response
    }
});

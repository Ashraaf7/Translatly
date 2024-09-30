chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === 'translate') {
        fetch('https://translatly.glitch.me/translate', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                q: message.text,
                targetLanguage: message.targetLanguage,
            }),
        })
        .then(response => response.json())
        .then(data => {
            console.log("Translation API Response:", data);  // Log the API response
            if (data.translatedText) {
                sendResponse({ translatedText: data.translatedText });
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

console.log('Content script loaded'); // Log to check if the script is running

console.log('Content script loaded');

document.addEventListener('copy', async (event) => {
    const copiedText = window.getSelection().toString().trim();
    console.log('Copied text:', copiedText);

    if (copiedText) {
        try {
            const response = await new Promise((resolve, reject) => {
                chrome.runtime.sendMessage(
                    { 
                        action: 'translate', 
                        text: copiedText, 
                        sourceLanguage: 'eng',    // You can dynamically set this based on user preference
                        targetLanguage: 'ara'     // You can dynamically set this too
                    },
                    (response) => {
                        if (chrome.runtime.lastError) {
                            reject(new Error(chrome.runtime.lastError.message));
                        } else {
                            resolve(response);
                        }
                    }
                );
            });
            console.log('Translation response:', response);
            if (response.translatedText) {
                showOverlay(response.translatedText);
            } else {
                console.error('No translated text received');
            }
        } catch (error) {
            console.error('Error during translation:', error);
        }
    } else {
        console.error('No text copied');
    }
});

function showOverlay(translatedText, copiedText) {
    const overlay = document.createElement('div');
    overlay.className = 'translation-overlay';

    // Show the translated text
    const translatedTextElem = document.createElement('div');
    translatedTextElem.className = 'translated-text';
    translatedTextElem.textContent = translatedText;
    overlay.appendChild(translatedTextElem);
    
    // Create buttons container
    const buttonsContainer = document.createElement('div');
    buttonsContainer.className = 'buttons-container';

    const closeButton = document.createElement('button');
    closeButton.textContent = '✖';
    closeButton.className = 'close-button';
    
    const copyButton = document.createElement('button');
    copyButton.textContent = 'Copy';
    copyButton.className = 'copy-button';
    
    closeButton.addEventListener('click', () => overlay.remove());
    
    copyButton.addEventListener('click', () => {
        navigator.clipboard.writeText(translatedText);
        alert('Text copied to clipboard!');
    });
    
    buttonsContainer.appendChild(closeButton);
    buttonsContainer.appendChild(copyButton);
    overlay.appendChild(buttonsContainer);
    document.body.appendChild(overlay);

    // Automatically remove overlay after 10 seconds (or user-configurable)
    setTimeout(() => {
        overlay.remove();
    }, 10000);
}

// CSS Styles for the overlay
const style = document.createElement('style');
style.textContent = `
    .translation-overlay {
        position: fixed;
        bottom: 20px; /* Position near the bottom */
        right: 20px; /* Position near the right */
        background-color: rgba(255, 255, 255, 0.9);
        color: #333;
        padding: 20px;
        border-radius: 8px;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
        z-index: 9999;
        transition: opacity 0.5s ease, transform 0.5s ease;
        opacity: 0;
        animation: slideIn 0.5s forwards; /* Change to slide-in animation */
        font-size: 16px;
        max-width: 300px;
        font-family: 'Arial', sans-serif;
        border: 1px solid #ccc;
        display: flex;
        flex-direction: column; /* Arrange items in a column */
        gap: 10px; /* Spacing between elements */
    }

    .translated-text {
        line-height: 1.5;
    }

    .buttons-container {
        display: flex; /* Align buttons horizontally */
        justify-content: space-between; /* Space buttons apart */
    }

    .close-button {
        background: #ff4d4d;
        border: none;
        color: white;
        font-size: 15px;
        cursor: pointer;
        border-radius: 50%;
        width: 30px;
        height: 30px;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: background 0.3s ease;
    }

    .close-button:hover {
        background: #ff1a1a;
    }

    .copy-button {
        background: #007bff;
        border: none;
        color: white;
        font-size: 15px;
        cursor: pointer;
        border-radius: 5px;
        padding: 8px 12px;
        transition: background 0.3s ease;
    }

    .copy-button:hover {
        background: #0056b3;
    }

    @keyframes slideIn {
        from {
            opacity: 0;
            transform: translateY(100%); /* Start from below */
        }
        to {
            opacity: 1;
            transform: translateY(0); /* Move to original position */
        }
    }
`;
document.head.appendChild(style);

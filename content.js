console.log('Content script loaded'); // Log to check if the script is running

document.addEventListener('copy', async (event) => {
  const copiedText = window.getSelection().toString().trim();
  console.log('Copied text:', copiedText);

  if (copiedText) {
      try {
          const response = await new Promise((resolve, reject) => {
              chrome.runtime.sendMessage(
                  { action: 'translate', text: copiedText, targetLanguage: 'ar' },
                  (response) => {
                      if (chrome.runtime.lastError) {
                          reject(new Error(chrome.runtime.lastError));
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

// Function to show the translated text in a styled overlay
function showOverlay(translatedText) {
  // Create overlay element
  const overlay = document.createElement('div');
  overlay.className = 'translation-overlay';
  overlay.textContent = translatedText;

  // Create close button
  const closeButton = document.createElement('button');
  closeButton.textContent = '✖'; // Close button
  closeButton.className = 'close-button';
  
  // Add close event listener
  closeButton.addEventListener('click', () => {
      overlay.remove(); // Remove overlay when button is clicked
  });
  

  overlay.appendChild(closeButton);
  document.body.appendChild(overlay);

  // Automatically remove overlay after 10 seconds
  setTimeout(() => {
    overlay.remove();
}, 10000);
}

// CSS Styles for the overlay
const style = document.createElement('style');
style.textContent = `
  .translation-overlay {
      position: fixed;
      bottom: 50px;
      right: 50px;
      background-color: rgba(0, 0, 0, 0.9);
      color: white;
      padding: 20px;
      border-radius: 5px;
      box-shadow: 0 2px 10px rgba(0, 0, 0, 0.5);
      z-index: 9999;
      transition: opacity 0.5s ease;
      opacity: 0;
      animation: fadeIn 0.5s forwards;
      font-size: 15px; /* Increase font size */
  }

  .close-button {
      background: none;
      border: none;
      color: white;
      font-size: 15px;
      cursor: pointer;
      position: absolute;
      top: 5px;
      right: 5px;
  }

  @keyframes fadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
  }
`;
document.head.appendChild(style);

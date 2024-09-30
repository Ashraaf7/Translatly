from flask import Flask, request, jsonify
from flask_cors import CORS
from googletrans import Translator

app = Flask(__name__)
CORS(app)  # Allow CORS for all routes
translator = Translator()

@app.route('/translate', methods=['POST'])
def translate():
    data = request.json
    print("Received data:", data)  # Log the incoming data
    
    # Ensure we have the necessary data
    if 'q' not in data or 'targetLanguage' not in data:
        return jsonify({'error': 'Invalid request data'}), 400
    
    text = data['q']
    target_language = data['targetLanguage']
    
    try:
        translated = translator.translate(text, dest=target_language)
        print("Translated text:", translated.text)  # Log the translation result
        return jsonify({'translatedText': translated.text})
    except Exception as e:
        print(f"Error during translation: {e}")
        return jsonify({'translatedText': None}), 500

if __name__ == '__main__':
    app.run(port=5000)


from flask import Flask, request, jsonify
from flask_cors import CORS
import requests
import os
import logging
from dotenv import load_dotenv
from pathlib import Path

# Load env variables
ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

app = Flask(__name__)
CORS(app, resources={r"/api/*": {"origins": "*"}})

# Logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# IMPORTANT: must be set in Render env variables
N8N_WEBHOOK_URL = os.environ.get('N8N_WEBHOOK_URL')

@app.route('/api/', methods=['GET'])
def root():
    return jsonify({"message": "AI Fact-Checking API"})

@app.route('/api/fact-check', methods=['POST'])
def fact_check():
    try:
        data = request.get_json(silent=True)

        if not data or 'text' not in data:
            return jsonify({"error": "Missing 'text' field"}), 400

        claim_text = data['text']

        if not claim_text.strip():
            return jsonify({"error": "Claim text cannot be empty"}), 400

        if not N8N_WEBHOOK_URL:
            return jsonify({"error": "N8N_WEBHOOK_URL not set"}), 500

        logger.info(f"Checking claim: {claim_text[:100]}")

        response = requests.post(
            N8N_WEBHOOK_URL,
            json={"text": claim_text},
            headers={'Content-Type': 'application/json'},
            timeout=30
        )

        if response.status_code != 200:
            return jsonify({
                "error": "Fact-checking service unavailable",
                "details": response.text
            }), 503

        result = response.json()
        return jsonify(result), 200

    except requests.exceptions.Timeout:
        return jsonify({"error": "Request timed out"}), 504

    except requests.exceptions.ConnectionError:
        return jsonify({"error": "Failed to connect to n8n"}), 503

    except Exception as e:
        logger.error(str(e))
        return jsonify({"error": "Unexpected error", "details": str(e)}), 500


if __name__ == "__main__":
    app.run()



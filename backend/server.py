from flask import Flask, request, jsonify
from flask_cors import CORS
import requests
import os
import logging
from dotenv import load_dotenv
from pathlib import Path

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

app = Flask(__name__)

CORS(app, resources={r"/api/*": {"origins": "*"}})

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

N8N_WEBHOOK_URL = os.environ.get('N8N_WEBHOOK_URL', 'http://localhost:5678/webhook-test/fact-check')

@app.route('/api/', methods=['GET'])
def root():
    return jsonify({"message": "AI Fact-Checking API"})

@app.route('/api/fact-check', methods=['POST'])
def fact_check():
    try:
        data = request.get_json(silent=True)
        
        if not data or 'text' not in data:
            return jsonify({
                "error": "Missing 'text' field in request body"
            }), 400
        
        claim_text = data['text']
        
        if not claim_text or not claim_text.strip():
            return jsonify({
                "error": "Claim text cannot be empty"
            }), 400
        
        logger.info(f"Processing fact-check request for: {claim_text[:100]}...")
        
        response = requests.post(
            N8N_WEBHOOK_URL,
            json={"text": claim_text},
            headers={'Content-Type': 'application/json'},
            timeout=30
        )
        
        if response.status_code != 200:
            logger.error(f"n8n webhook returned status {response.status_code}")
            return jsonify({
                "error": "Fact-checking service unavailable",
                "details": f"Status code: {response.status_code}"
            }), 503
        
        result = response.json()
        logger.info(f"Fact-check completed: {result.get('result', {}).get('verdict', 'UNKNOWN')}")
        
        return jsonify(result), 200
        
    except requests.exceptions.Timeout:
        logger.error("n8n webhook request timed out")
        return jsonify({
            "error": "Request timed out. Please try again."
        }), 504
    
    except requests.exceptions.ConnectionError:
        logger.error("Failed to connect to n8n webhook")
        return jsonify({
            "error": "Unable to connect to fact-checking service. Please ensure n8n is running."
        }), 503
    
    except Exception as e:
        logger.error(f"Unexpected error: {str(e)}")
        return jsonify({
            "error": "An unexpected error occurred",
            "details": str(e)
        }), 500

from asgiref.wsgi import WsgiToAsgi

asgi_app = WsgiToAsgi(app)

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=8001, debug=True)
"""
Example API calls for testing the Freight Rate Optimizer
"""

import requests
import json
from datetime import datetime, timedelta

BASE_URL = "http://localhost:8000/api"

# Example 1: Get multimodal quotes
def get_multimodal_quotes():
    """Get quotes for a shipment from Shanghai to Rotterdam"""
    payload = {
        "shipmentTypes": ["Ocean (FCL)", "Air Cargo", "FTL Trucking"],
        "weight": 1000,
        "weightUnit": "kg",
        "volume": 10,
        "commodity": "Electronics",
        "hsCode": "850231",
        "hazardous": False,
        "temperatureControlled": True,
        "origin": "Shanghai, China",
        "destination": "Rotterdam, Netherlands",
        "departureWindow": (datetime.now() + timedelta(days=7)).isoformat(),
        "incoterms": "CIF",
        "customsClearance": True,
        "insurance": True,
        "lastMileDelivery": True,
        "warehousing": False
    }
    
    response = requests.post(f"{BASE_URL}/multimodal/quote", json=payload)
    return response.json()

# Example 2: Validate shipment
def validate_shipment():
    """Validate shipment details"""
    payload = {
        "shipmentTypes": ["Ocean (FCL)"],
        "weight": 5000,
        "weightUnit": "tons",
        "volume": 50,
        "commodity": "Steel Coils",
        "hazardous": False,
        "temperatureControlled": False,
        "origin": "Shanghai, China",
        "destination": "Hamburg, Germany",
        "incoterms": "FOB"
    }
    
    response = requests.post(f"{BASE_URL}/agent/validate", json=payload)
    return response.json()

# Example 3: Get recommendations
def get_recommendations(quotes):
    """Get AI recommendations based on quotes"""
    payload = {
        "shipmentDetails": {
            "shipmentTypes": ["Ocean (FCL)", "Air Cargo"],
            "weight": 1000,
            "weightUnit": "kg",
            "volume": 10,
            "commodity": "Electronics",
            "hazardous": False,
            "temperatureControlled": False,
            "origin": "Shanghai, China",
            "destination": "Rotterdam, Netherlands",
            "incoterms": "CIF"
        },
        "options": quotes["options"],
        "priorities": {
            "cost": 0.5,
            "speed": 0.3,
            "reliability": 0.2
        }
    }
    
    response = requests.post(f"{BASE_URL}/agent/recommend", json=payload)
    return response.json()

if __name__ == "__main__":
    print("=" * 80)
    print("FREIGHT RATE OPTIMIZER - EXAMPLE API CALLS")
    print("=" * 80)
    
    print("\n1. Getting multimodal quotes...")
    try:
        quotes = get_multimodal_quotes()
        print(json.dumps(quotes, indent=2))
    except Exception as e:
        print(f"Error: {e}")
    
    print("\n" + "=" * 80)
    print("\n2. Validating shipment...")
    try:
        validation = validate_shipment()
        print(json.dumps(validation, indent=2))
    except Exception as e:
        print(f"Error: {e}")
    
    print("\n" + "=" * 80)
    print("\nAPI is running at: http://localhost:8000")
    print("API Docs available at: http://localhost:8000/docs")

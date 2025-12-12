"""Quick test script to verify Gemini API works"""
import httpx
import json

API_KEY = "AIzaSyCHiTmPf-D2XJ-78y4zV2KlbgBl0lMY7Sc"
MODEL = "gemini-2.5-flash"
BASE_URL = "https://generativelanguage.googleapis.com/v1beta"

def test_gemini():
    url = f"{BASE_URL}/models/{MODEL}:generateContent"
    headers = {
        "Content-Type": "application/json",
        "X-goog-api-key": API_KEY
    }
    
    payload = {
        "contents": [{
            "parts": [{"text": "Analyze this contract clause and identify any risks: 'The contractor agrees to unlimited revisions until the client is satisfied, with no additional compensation.'"}]
        }],
        "generationConfig": {
            "temperature": 0.3,
            "maxOutputTokens": 1024
        }
    }
    
    print("Testing Gemini API...")
    response = httpx.post(url, headers=headers, json=payload, timeout=60.0)
    
    if response.status_code == 200:
        result = response.json()
        if "candidates" in result:
            text = result["candidates"][0]["content"]["parts"][0]["text"]
            print("✅ Gemini API working!")
            print("\nResponse:")
            print(text[:500] + "..." if len(text) > 500 else text)
            return True
    
    print(f"❌ Error: {response.status_code}")
    print(response.text)
    return False

if __name__ == "__main__":
    test_gemini()

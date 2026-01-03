#!/usr/bin/env python3
"""Quick test to verify backend endpoints work"""
import requests
import json

print("Testing Cubit Backend API")
print("=" * 50)

# Test health
print("\n1. Testing /health endpoint...")
response = requests.get("http://localhost:8080/health")
print(f"   Status: {response.status_code}")
print(f"   Response: {response.json()}")

# Test execute without teaching
print("\n2. Testing /execute (teaching disabled)...")
response = requests.post(
    "http://localhost:8080/execute",
    json={"code": "print 42", "teaching_enabled": False}
)
print(f"   Status: {response.status_code}")
data = response.json()
print(f"   Output: {data.get('output')}")
print(f"   Result: {data.get('result')}")
print(f"   Error: {data.get('error')}")

# Test execute with teaching
print("\n3. Testing /execute (teaching enabled)...")
response = requests.post(
    "http://localhost:8080/execute",
    json={
        "code": "let x = 5\nprint x", 
        "teaching_enabled": True,
        "verbosity": "normal"
    }
)
print(f"   Status: {response.status_code}")
data = response.json()
print(f"   Output: {data.get('output')}")
print(f"   Result: {data.get('result')}")
print(f"   Skill Level: {data.get('skill_level')}")
print(f"   Progress: {data.get('progress')}")
print(f"   Error: {data.get('error')}")

print("\n" + "=" * 50)
print("✅ All tests completed!")

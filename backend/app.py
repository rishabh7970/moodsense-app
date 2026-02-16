from flask import Flask, request, jsonify
from flask_cors import CORS
from textblob import TextBlob
from datetime import datetime, timedelta
import random

app = Flask(__name__)
CORS(app)

# --- MOCK DATABASE WITH HISTORY ---
# We pre-populate 7 days of data for the demo to look good immediately
def generate_history():
    history = []
    base_date = datetime.now() - timedelta(days=7)
    for i in range(7):
        date_str = (base_date + timedelta(days=i)).strftime("%Y-%m-%d")
        history.append({
            "date": date_str,
            "battery": random.randint(20, 90), # Random energy levels
            "sentiment": random.uniform(-0.5, 0.8)
        })
    return history

db_data = {
    "employees": [
        # Manu is Index 0 (The Active User)
        {"id": 1, "name": "Manu Sharma", "role": "Senior Dev", "dept": "Engineering", "history": generate_history(), "scores": []},
        
        # The rest of the team
        {"id": 2, "name": "Ishika Agarwal", "role": "UX Lead", "dept": "Design", "history": generate_history(), "scores": []},
        {"id": 3, "name": "Gurveer", "role": "Product Owner", "dept": "Product", "history": generate_history(), "scores": []},
        {"id": 4, "name": "Puja", "role": "Sales Rep", "dept": "Sales", "history": generate_history(), "scores": []}
    ]
}

# --- INTELLIGENCE LOGIC ---
def detect_drivers(text):
    drivers = []
    text = text.lower()
    keywords = {
        "🔥 Burnout": ["tired", "exhausted", "drained", "overworked", "late", "sleep"],
        "👔 Management": ["boss", "manager", "micromanage", "leadership", "direction"],
        "💰 Comp": ["pay", "salary", "bonus", "raise", "money"],
        "🤝 Culture": ["toxic", "gossip", "bullying", "politics", "ignored"]
    }
    for category, words_list in keywords.items():
        if any(word in text for word in words_list):
            drivers.append(category)
    return drivers if drivers else []

def analyze_risk(employee):
    # Combine history + recent live scores
    all_data = employee['history'] + employee['scores']
    recent = all_data[-3:] # Last 3 entries
    
    avg_battery = sum(d['battery'] for d in recent) / len(recent)
    
    if avg_battery < 30: return "High Risk"
    elif avg_battery < 60: return "Monitor"
    return "Stable"

# --- API ENDPOINTS ---

@app.route('/api/submit-vibe', methods=['POST'])
def submit_vibe():
    data = request.json
    
    # 1. NLP Analysis (Automatic)
    blob = TextBlob(data.get('ventText', ''))
    sentiment = blob.sentiment.polarity
    auto_drivers = detect_drivers(data.get('ventText', ''))
    
    # 2. Manual Selection (New Feature)
    # We add the user's explicit selection to the list of drivers
    manual_driver = data.get('pressureSource', '')
    
    final_drivers = auto_drivers
    if manual_driver and manual_driver != "Everything is good!":
        # Add a special emoji to distinguish manual selection
        final_drivers.insert(0, f"👉 {manual_driver}")
    
    entry = {
        "date": datetime.now().strftime("%Y-%m-%d"),
        "mood": data['mood'],
        "battery": int(data['battery']),
        "vent": data.get('ventText', ''),
        "sentiment": sentiment,
        "drivers": list(set(final_drivers)) # Remove duplicates
    }
    
    # Save to "John Doe" (ID 1)
    db_data['employees'][0]['scores'].append(entry)
    
    return jsonify({"status": "success", "drivers": final_drivers})
@app.route('/api/hr-dashboard', methods=['GET'])
def get_hr_dashboard():
    employee_list = []
    dept_stats = {"Engineering": 0, "Design": 0, "Sales": 0}
    dept_counts = {"Engineering": 0, "Design": 0, "Sales": 0}

    for emp in db_data['employees']:
        risk = analyze_risk(emp)
        
        # Calculate current average battery
        all_data = emp['history'] + emp['scores']
        avg_battery = int(sum(d['battery'] for d in all_data[-3:]) / 3)
        
        # Get latest drivers if they exist
        drivers = emp['scores'][-1]['drivers'] if emp['scores'] else []

        # Update Dept Stats
        if emp['dept'] in dept_stats:
            dept_stats[emp['dept']] += avg_battery
            dept_counts[emp['dept']] += 1

        employee_list.append({
            "id": emp['id'],
            "name": emp['name'],
            "role": emp['role'],
            "dept": emp['dept'],
            "risk_status": risk,
            "avg_battery": avg_battery,
            "drivers": drivers,
            "history": all_data # Send full history for the chart
        })
    
    final_dept_data = []
    for dept, total in dept_stats.items():
        count = dept_counts[dept]
        final_dept_data.append({"name": dept, "energy": int(total / count) if count > 0 else 100})

    return jsonify({"employees": employee_list, "department_data": final_dept_data})

if __name__ == '__main__':
    app.run(debug=True, port=5000)
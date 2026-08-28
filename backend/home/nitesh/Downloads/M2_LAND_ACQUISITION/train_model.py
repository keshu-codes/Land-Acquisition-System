import os
import sqlite3
import joblib
import numpy as np
import pandas as pd
from sklearn.tree import DecisionTreeClassifier, DecisionTreeRegressor

# Database path
DB_PATH = os.path.join(os.path.dirname(__file__), "land_acquisition.db")

state_map = {
    "Maharashtra": 0,
    "Uttar Pradesh": 1,
    "West Bengal": 2,
    "Tamil Nadu": 3,
    "Madhya Pradesh": 4,
    "Odisha": 5
}

sector_map = {
    "Transport": 0,
    "Energy": 1,
    "Infrastructure": 2
}

def load_data():
    conn = sqlite3.connect(DB_PATH)
    query = "SELECT state, sector, total_area, budget, status FROM project"
    df = pd.read_sql_query(query, conn)
    conn.close()
    return df

def preprocess_and_label(df):
    # Encode categorical fields
    df['state_encoded'] = df['state'].map(state_map).fillna(len(state_map))
    df['sector_encoded'] = df['sector'].map(sector_map).fillna(len(sector_map))
    
    # Fill numeric NaNs
    df['total_area'] = df['total_area'].fillna(50.0)
    df['budget'] = df['budget'].fillna(100.0)
    
    # Generate labels (Delay Risk & Completion Months) mirroring LARR behaviors
    risks = []
    completion = []
    
    for idx, row in df.iterrows():
        status = row['status']
        state = row['state']
        
        if status == "Possession Handover":
            risks.append(0)       # Low Risk
            completion.append(0.0) # Complete
        elif status == "Proposal Submitted":
            risks.append(1)       # Medium Risk
            completion.append(16.0)
        elif status == "GIS Verification":
            if state in ["Maharashtra", "Uttar Pradesh"]:
                risks.append(2)   # High Risk
                completion.append(13.0)
            else:
                risks.append(1)   # Medium Risk
                completion.append(12.0)
        elif status == "Section 11 Notification":
            risks.append(1)       # Medium
            completion.append(8.5)
        elif status == "Award Declared":
            risks.append(0)       # Low
            completion.append(4.0)
        else:
            risks.append(1)
            completion.append(10.0)
            
    df['risk_label'] = risks
    df['completion_months'] = completion
    return df

def train():
    print("Reading SQLite database...")
    df = load_data()
    if len(df) == 0:
        print("Error: No projects found in database. Please seed the database first.")
        return

    print(f"Pre-processing {len(df)} project records...")
    df = preprocess_and_label(df)
    
    X = df[['state_encoded', 'sector_encoded', 'total_area', 'budget']].values
    y_risk = df['risk_label'].values
    y_time = df['completion_months'].values
    
    print("Fitting DecisionTree Models...")
    # Classifier to predict Risk Category (0=Low, 1=Medium, 2=High)
    risk_model = DecisionTreeClassifier(max_depth=5, random_state=42)
    risk_model.fit(X, y_risk)
    
    # Regressor to predict completion time in months
    time_model = DecisionTreeRegressor(max_depth=5, random_state=42)
    time_model.fit(X, y_time)
    
    # Save everything in a single joblib dict
    model_payload = {
        "risk_model": risk_model,
        "time_model": time_model,
        "state_map": state_map,
        "sector_map": sector_map
    }
    
    output_path = os.path.join(os.path.dirname(__file__), "land_delay_model.joblib")
    joblib.dump(model_payload, output_path)
    print(f"Machine Learning models successfully saved to: {output_path}")

if __name__ == "__main__":
    train()

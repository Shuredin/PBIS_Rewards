import pandas as pd
from sklearn.tree import DecisionTreeClassifier
import joblib


data = pd.read_csv("training_data.csv")

X = data[
    [
        "points",
        "rewards_this_month",
        "attendance_rate",
        "behavior_referrals"
    ]
]

y = data["needs_reinforcement"]


model = DecisionTreeClassifier()

model.fit(X, y)


joblib.dump(model, "reinforcement_model.pkl")

print("Model trained successfully")
import joblib
import pandas as pd


model = joblib.load("reinforcement_model.pkl")


def predict_reinforcement(
    points,
    rewards_this_month,
    attendance_rate,
    behavior_referrals
):

    data = pd.DataFrame(
        [[
            points,
            rewards_this_month,
            attendance_rate,
            behavior_referrals
        ]],
        columns=[
            "points",
            "rewards_this_month",
            "attendance_rate",
            "behavior_referrals"
        ]
    )


    prediction = model.predict(data)[0]

    probability = model.predict_proba(data)[0][prediction]


    if prediction == 1:
        result = "Needs Reinforcement"
    else:
        result = "No Immediate Concern"


    return {
        "prediction": result,
        "confidence": round(float(probability), 2)
    }
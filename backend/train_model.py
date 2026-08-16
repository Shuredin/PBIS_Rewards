import pandas as pd
from sklearn.tree import DecisionTreeClassifier
from sklearn.model_selection import train_test_split
from sklearn.metrics import (
    accuracy_score,
    precision_score,
    recall_score,
    f1_score,
    classification_report,
    confusion_matrix
)
import joblib


data = pd.read_csv("training_data.csv")


X = data[
    [
        "rewards_this_week",
        "attendance_rate",
        "behavior_referrals"
    ]
]


y = data["needs_reinforcement"]


X_train, X_test, y_train, y_test = train_test_split(
    X,
    y,
    test_size=0.20,
    random_state=42,
    stratify=y
)


model = DecisionTreeClassifier(
    random_state=42,
    max_depth=5,
    min_samples_leaf=5,
    class_weight="balanced"
)


model.fit(X_train, y_train)


predictions = model.predict(X_test)


accuracy = accuracy_score(y_test, predictions)
precision = precision_score(y_test, predictions, zero_division=0)
recall = recall_score(y_test, predictions, zero_division=0)
f1 = f1_score(y_test, predictions, zero_division=0)


print()
print("Classification Report")
print("---------------------")
print(classification_report(y_test, predictions, zero_division=0))


print("Confusion Matrix")
print("----------------")
print(confusion_matrix(y_test, predictions))


print()
print("Model Evaluation")
print("----------------")
print(f"Training records: {len(X_train)}")
print(f"Testing records: {len(X_test)}")
print(f"Accuracy: {accuracy:.2f}")
print(f"Precision: {precision:.2f}")
print(f"Recall: {recall:.2f}")
print(f"F1 Score: {f1:.2f}")


joblib.dump(model, "reinforcement_model.pkl")


print()
print("successfully trained and saved")
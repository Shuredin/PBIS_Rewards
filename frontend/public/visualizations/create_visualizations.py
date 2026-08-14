import pandas as pd
import matplotlib.pyplot as plt
import os

data = pd.read_csv("backend/training_data.csv")

output_dir = "visualizations"

data["needs_reinforcement_label"] = data["needs_reinforcement"].map({
    0: "No",
    1: "Yes"
})


monthly_rewards = data.groupby(
    "needs_reinforcement_label"
)["rewards_this_month"].mean()

plt.figure(figsize=(8, 5))

monthly_rewards.plot(kind="bar")

plt.title("Average Rewards Earned This Month")
plt.xlabel("Needs Reinforcement")
plt.ylabel("Average Rewards This Month")
plt.xticks(rotation=0)

plt.tight_layout()

plt.savefig(
    os.path.join(output_dir, "average_monthly_rewards.png")
)

plt.close()


attendance = data.groupby(
    "needs_reinforcement_label"
)["attendance_rate"].mean()

plt.figure(figsize=(8, 5))

attendance.plot(kind="bar")

plt.title("Average Attendance Rate")
plt.xlabel("Needs Reinforcement")
plt.ylabel("Attendance Rate (%)")
plt.xticks(rotation=0)

plt.ylim(80, 100)

plt.tight_layout()

plt.savefig(
    os.path.join(output_dir, "average_attendance.png")
)

plt.close()


referrals = data.groupby(
    "needs_reinforcement_label"
)["behavior_referrals"].mean()

plt.figure(figsize=(8, 5))

referrals.plot(kind="bar")

plt.title("Average Behavior Referrals")
plt.xlabel("Needs Reinforcement")
plt.ylabel("Average Behavior Referrals")
plt.xticks(rotation=0)

plt.tight_layout()

plt.savefig(
    os.path.join(output_dir, "average_behavior_referrals.png")
)

plt.close()


print("Three visualizations created successfully.")
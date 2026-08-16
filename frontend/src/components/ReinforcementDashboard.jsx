import { useEffect, useState } from "react";

const giveReward = async (studentId) => {
  await fetch(`${import.meta.env.VITE_API_URL}/reward`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      student_id: studentId,
      amount: 5,
      reason: "AI recommended positive reinforcement",
      teacher_id: teacherId
    }),
  });

    alert("Reward added!");

    loadRecommendations();
};

function ReinforcementDashboard({ teacherId }) {

  const [recommendations, setRecommendations] = useState([]);

  async function loadRecommendations() {
  const response = await fetch(
    `${import.meta.env.VITE_API_URL}/students/recommendations`
  );

  const data = await response.json();

  setRecommendations(data);
}


useEffect(() => {
  loadRecommendations();
}, []);

  return (
  <div>
    <h2>AI Positive Reinforcement Recommendations</h2>

    {recommendations.map((student) => (
      <div key={student.id}>

        <h3>
          {student.name}
        </h3>

        <p>
          Points: {student.points}
        </p>

        <p>
          Attendance: {student.attendance_rate}%
        </p>

        <p>
          Behavior Referrals: {student.behavior_referrals}
        </p>

        {student.prediction.needs_reinforcement ? (
          <p>
            Needs additional positive reinforcement
          </p>
        ) : (
          <p>
            Continue current support
          </p>
        )}

        <p>
          Confidence: {(student.prediction.confidence * 100).toFixed(0)}%
        </p>

        <button onClick={() => giveReward(student.id)}>
            Give Reward
        </button>

        <hr />

      </div>
    ))}
  </div>
);
}

export default ReinforcementDashboard;
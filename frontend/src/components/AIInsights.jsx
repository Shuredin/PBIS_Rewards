import { useEffect, useState } from "react";

function AIInsights({ studentId }) {
  const [insight, setInsight] = useState(null);

  useEffect(() => {
    if (!studentId) return;

    fetch(`${import.meta.env.VITE_API_URL}/students/${studentId}/reinforcement`)
      .then((response) => response.json())
      .then((data) => setInsight(data));
  }, [studentId]);

  if (!studentId) {
    return <p>Select a student to view AI insights.</p>;
  }

  if (!insight) {
    return <p>Loading AI insights...</p>;
  }

  const reasons = [];

  if (insight.weekly_points < 20) {
    reasons.push(
      "The student has earned fewer than 20 PBIS points during the past week."
    );
  }

  if (insight.attendance_rate < 90) {
    reasons.push(
      "Attendance is below 90%."
    );
  }

  if (insight.behavior_referrals > 2) {
    reasons.push(
      "More than two behavior referrals have been recorded."
    );
  }

  return (
    <div>
      <h2>AI Insights</h2>

      <p>
        <strong>Prediction:</strong> {insight.prediction}
      </p>

      <p>
        <strong>Confidence:</strong>{" "}
        {(insight.confidence * 100).toFixed(0)}%
      </p>

      <h3>Why did the AI make this recommendation?</h3>

      {reasons.length === 0 ? (
        <p>No significant risk factors were identified.</p>
      ) : (
        <ul>
          {reasons.map((reason, index) => (
            <li key={index}>{reason}</li>
          ))}
        </ul>
      )}

      <h3>Suggested Actions</h3>

      {insight.needs_reinforcement ? (
        <ul>
          <li>Recognize positive classroom behavior.</li>
          <li>Award PBIS points during the next class period.</li>
          <li>Continue monitoring student progress.</li>
        </ul>
      ) : (
        <ul>
          <li>Continue current positive supports.</li>
          <li>Continue recognizing positive behaviors.</li>
        </ul>
      )}
    </div>
  );
}

export default AIInsights;
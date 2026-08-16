import { useEffect, useState } from "react";

function ReinforcementPrediction({ studentId }) {
  const [prediction, setPrediction] = useState(null);

  useEffect(() => {
    if (!studentId) {
      setPrediction(null);
      return;
    }

    fetch(
      `${import.meta.env.VITE_API_URL}/students/${studentId}/reinforcement`
    )
      .then((response) => response.json())
      .then((data) => setPrediction(data));
  }, [studentId]);

  if (!studentId) {
    return <p>Select a student to see AI recommendations.</p>;
  }

  if (!prediction) {
    return <p>Loading prediction...</p>;
  }

  return (
    <div>
      <h2>AI Reinforcement Recommendation</h2>

      <p>
        Student: {prediction.student}
      </p>

      <p>
        Needs reinforcement:{" "}
        {prediction.needs_reinforcement ? "Yes" : "No"}
      </p>

      <p>
        Confidence: {prediction.confidence}
      </p>
    </div>
  );
}

export default ReinforcementPrediction;
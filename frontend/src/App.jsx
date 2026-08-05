import { useState, useEffect } from "react";

function App() {
  const [studentId, setStudentId] = useState("");
  const [points, setPoints] = useState("");
  const [reason, setReason] = useState("");
  const [message, setMessage] = useState("");
  const [students, setStudents] = useState([]);

  useEffect(() => {
  fetch("http://127.0.0.1:8000/students")
    .then((response) => response.json())
    .then((data) => setStudents(data));
}, []);

  async function giveReward() {
    const response = await fetch("http://127.0.0.1:8000/reward", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        student_id: Number(studentId),
        amount: Number(points),
        reason: reason,
      }),
    });

    const data = await response.json();

    if (response.ok) {
      setMessage(
        `${data.student} received ${data.new_points} total points`
      );
    } else {
      setMessage("Error giving reward");
    }
  }

  return (
    <div>
      <h1>PBIS Rewards</h1>

      <h2>Teacher Dashboard</h2>

      <p>Give students positive reinforcement points.</p>

      <div>
        <label>
          Student ID:
          <select
            value={studentId}
            onChange={(e) => setStudentId(e.target.value)}
          >
            <option value="">Select Student</option>

            {students.map((student) => (
              <option key={student.id} value={student.id}>
                {student.first_name} {student.last_name}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div>
        <label>
          Points:
          <input
            type="number"
            value={points}
            onChange={(e) => setPoints(e.target.value)}
          />
        </label>
      </div>

      <div>
        <label>
          Reason:
          <input
            type="text"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
          />
        </label>
      </div>

      <button onClick={giveReward}>
        Give Reward
      </button>

      <p>{message}</p>
    </div>
  );
}


export default App;
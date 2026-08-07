import { useEffect, useState } from "react";

function StudentProfile({ studentId }) {
  const [student, setStudent] = useState(null);

  useEffect(() => {
    if (!studentId) return;

    fetch(`http://127.0.0.1:8000/students/${studentId}`)
      .then((response) => response.json())
      .then((data) => setStudent(data));
  }, [studentId]);

  if (!studentId) {
    return <p>Select a student to view their profile.</p>;
  }

  if (!student) {
    return <p>Loading...</p>;
  }

  return (
    <div>
      <h2>Student Profile</h2>

      <p>
        <strong>Name:</strong>{" "}
        {student.student.first_name} {student.student.last_name}
      </p>

      <p>
        <strong>Points:</strong> {student.student.points}
      </p>

      <p>
        <strong>Attendance:</strong>{" "}
        {student.student.attendance_rate}%
      </p>

      <p>
        <strong>Behavior Referrals:</strong>{" "}
        {student.student.behavior_referrals}
      </p>

      <h3>Reward History</h3>

      <ul>
        {student.transactions.map((transaction) => (
          <li key={transaction.id}>
            {transaction.reason} (+{transaction.amount})
          </li>
        ))}
      </ul>
    </div>
  );
}

export default StudentProfile;
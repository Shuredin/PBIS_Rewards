import { useEffect, useState } from "react";

function StudentDashboard({ studentId }) {
  const [student, setStudent] = useState(null);

    useEffect(() => {
        if (!studentId) {
            return;
        }

        fetch(`http://127.0.0.1:8000/students/${studentId}`)
            .then((response) => response.json())
            .then((data) => setStudent(data));
    }, [studentId]);

    if (!studentId) {
        return <p>Select a student to view details.</p>;
    }

    if (!student) {
        return <p>Loading...</p>;
    }

  return (
    <div>
      <h2>
        {student.student.first_name} {student.student.last_name}
      </h2>

      <h3>Reward History</h3>

      {student.transactions.map((transaction) => (
        <p key={transaction.id}>
          +{transaction.amount} points - {transaction.reason}
        </p>
      ))}
    </div>
  );
}

export default StudentDashboard;
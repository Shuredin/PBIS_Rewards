import { useEffect, useState } from "react";

function StudentDashboard({ studentId }) {
  const [student, setStudent] = useState(null);

    useEffect(() => {
        if (!studentId) {
            return;
        }

        fetch(`${import.meta.env.VITE_API_URL}/students/${studentId}`)
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

      <h3>Transaction History</h3>

      {student.transactions.length === 0 ? (

          <p>
              No transactions yet.
          </p>

      ) : (

          <table className="student-table">

              <thead>

                  <tr>

                      <th>
                          Date
                      </th>

                      <th>
                          Transaction
                      </th>

                      <th>
                          Points
                      </th>

                      <th>
                          Awarded By / Store
                      </th>

                  </tr>

              </thead>

              <tbody>

                  {student.transactions.map((transaction) => (

                      <tr key={transaction.id}>

                          <td>
                              {new Date(
                                  transaction.created_at
                              ).toLocaleDateString()}
                          </td>

                          <td>
                              {transaction.reason}
                          </td>

                          <td>
                              {transaction.amount > 0
                                  ? `+${transaction.amount}`
                                  : transaction.amount}
                          </td>

                          <td>

                              {transaction.awarded_by
                                  ? transaction.awarded_by
                                  : transaction.store
                                      ? transaction.store
                                      : "—"}

                          </td>

                      </tr>

                  ))}

              </tbody>

          </table>

      )}

    </div>
  );
}

export default StudentDashboard;
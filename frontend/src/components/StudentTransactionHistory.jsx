import { useEffect, useState } from "react";

function StudentTransactionHistory({ studentId }) {

    const [student, setStudent] = useState(null);


    useEffect(() => {

        if (!studentId) {
            return;
        }

        fetch(
            `${import.meta.env.VITE_API_URL}/students/${studentId}`
        )
            .then((response) => response.json())
            .then((data) => setStudent(data));

    }, [studentId]);


    if (!student) {
        return <p>Loading...</p>;
    }


    return (

        <div>

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
                                Points
                            </th>

                            <th>
                                Reason
                            </th>

                            <th>
                                Awarded By/ Store
                            </th>

                        </tr>

                    </thead>


                    <tbody>

                        {student.transactions.map(
                            (transaction) => (

                                <tr key={transaction.id}>

                                    <td>
                                        {new Date(
                                            transaction.created_at
                                        ).toLocaleDateString()}
                                    </td>


                                    <td>

                                        {transaction.amount > 0
                                            ? `+${transaction.amount}`
                                            : transaction.amount
                                        }

                                    </td>


                                    <td>
                                        {transaction.reason}
                                    </td>


                                    <td>

                                        {transaction.awarded_by
                                            ? transaction.awarded_by
                                            : transaction.store
                                                ? transaction.store
                                                : "-"
                                        }

                                    </td>

                                </tr>

                            )
                        )}

                    </tbody>

                </table>

            )}

        </div>

    );

}

export default StudentTransactionHistory;

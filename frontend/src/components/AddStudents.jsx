import { useEffect, useState } from "react";

function AddStudents({ classId, onComplete }) {

    const [students, setStudents] = useState([]);
    const [selectedStudents, setSelectedStudents] = useState([]);
    const [loading, setLoading] = useState(true);

    async function loadAvailableStudents() {

        setLoading(true);

        const response = await fetch(
            `http://127.0.0.1:8000/classes/${classId}/available-students`
        );

        const data = await response.json();

        setStudents(data);
        setSelectedStudents([]);
        setLoading(false);
    }

    useEffect(() => {

        if (!classId) {
            return;
        }

        loadAvailableStudents();

    }, [classId]);

    function toggleStudent(studentId) {

        setSelectedStudents((current) => {

            if (current.includes(studentId)) {

                return current.filter(
                    (id) => id !== studentId
                );

            }

            return [
                ...current,
                studentId
            ];

        });

    }

    async function addStudents() {

        if (selectedStudents.length === 0) {
            alert("Select at least one student.");
            return;
        }

        for (const studentId of selectedStudents) {

            const response = await fetch(
                `http://127.0.0.1:8000/classes/${classId}/students`,
                {
                    method: "POST",

                    headers: {
                        "Content-Type": "application/json"
                    },

                    body: JSON.stringify({
                        student_id: studentId
                    })
                }
            );

            const data = await response.json();

            if (!response.ok || data.error) {

                alert(
                    data.error ||
                    "Unable to add student."
                );

                return;
            }
        }

        alert("Students added to the class.");

        setSelectedStudents([]);

        await loadAvailableStudents();

        if (onComplete) {
            onComplete();
        }
    }

    if (loading) {
        return <p>Loading available students...</p>;
    }

    return (

        <div className="expanded-panel">

            <h2>
                Add Students
            </h2>

            {
                students.length === 0 ? (

                    <p>
                        All students are already in this class.
                    </p>

                ) : (

                    <>

                        <table className="student-table">

                            <thead>

                                <tr>

                                    <th>
                                        Select
                                    </th>

                                    <th>
                                        Last Name
                                    </th>

                                    <th>
                                        First Name
                                    </th>

                                </tr>

                            </thead>

                            <tbody>

                                {
                                    students.map((student) => (

                                        <tr key={student.id}>

                                            <td>

                                                <input
                                                    type="checkbox"
                                                    checked={
                                                        selectedStudents.includes(
                                                            student.id
                                                        )
                                                    }
                                                    onChange={() =>
                                                        toggleStudent(
                                                            student.id
                                                        )
                                                    }
                                                />

                                            </td>

                                            <td>
                                                {student.last_name}
                                            </td>

                                            <td>
                                                {student.first_name}
                                            </td>

                                        </tr>

                                    ))
                                }

                            </tbody>

                        </table>

                        <button
                            onClick={addStudents}
                        >
                            Add Selected Students
                        </button>

                    </>

                )
            }

        </div>

    );
}

export default AddStudents;
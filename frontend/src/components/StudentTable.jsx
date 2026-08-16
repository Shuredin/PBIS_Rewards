import { useState } from "react";


function StudentTable({
    students,
    onSelect,
    refreshStudents,
    classId,
    teacherId
}) {


  async function giveReward(studentId, amount) {

    const response = await fetch(
      `${import.meta.env.VITE_API_URL}/reward`,
      {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          student_id: studentId,
          amount: amount,
          reason: "Classroom Positive Reinforcement",
          teacher_id: teacherId
        }),

      }
    );


    if (response.ok) {

      await refreshStudents();

    }

  }


  async function removeStudent(studentId, studentName) {

    const confirmed = window.confirm(
        `Remove ${studentName} from this class?`
    );

    if (!confirmed) {
        return;
    }

    const response = await fetch(
        `${import.meta.env.VITE_API_URL}/classes/${classId}/students/${studentId}`,
        {
            method: "DELETE"
        }
    );

    const data = await response.json();

    if (!response.ok || data.error) {

        alert(
            data.error ||
            "Unable to remove student."
        );

        return;
    }

    await refreshStudents();
}


  const [sortColumn, setSortColumn] = useState("last_name");
const [sortDirection, setSortDirection] = useState("asc");


function handleSort(column) {

    if (sortColumn === column) {

        setSortDirection((currentDirection) =>
            currentDirection === "asc"
                ? "desc"
                : "asc"
        );

    } else {

        setSortColumn(column);
        setSortDirection("asc");

    }
}



const sortedStudents = [...students].sort((a, b) => {


  let valueA;
  let valueB;


  switch(sortColumn) {


    case "first_name":

      valueA = a.first_name;
      valueB = b.first_name;
      break;


    case "last_name":

      valueA = a.last_name;
      valueB = b.last_name;
      break;


    case "weekly_points":

      valueA = a.weekly_points;
      valueB = b.weekly_points;
      break;


    case "points":

      valueA = a.points;
      valueB = b.points;
      break;


    case "attendance":

      valueA = a.attendance_rate;
      valueB = b.attendance_rate;
      break;


    case "status":

      valueA = a.needs_reinforcement ? 0 : 1;
      valueB = b.needs_reinforcement ? 0 : 1;
      break;


    case "confidence":

      valueA = a.confidence;
      valueB = b.confidence;
      break;


    default:

      return 0;

  }



  if (typeof valueA === "string") {

    return sortDirection === "asc"

      ? valueA.localeCompare(valueB)

      : valueB.localeCompare(valueA);

  }



  return sortDirection === "asc"

    ? valueA - valueB

    : valueB - valueA;


});

function sortIndicator(column) {

    if (sortColumn !== column) {
        return " ↕";
    }

    return sortDirection === "asc"
        ? " ↑"
        : " ↓";
}

  return (

    <table className="student-table">

      <thead>

      <tr>

      <th onClick={() => handleSort("last_name")}>
      Last Name{sortIndicator("last_name")}
      </th>


      <th onClick={() => handleSort("first_name")}>
      First Name{sortIndicator("first_name")}
      </th>


      <th onClick={() => handleSort("weekly_points")}>
      Weekly Points{sortIndicator("weekly_points")}
      </th>


      <th onClick={() => handleSort("points")}>
      Total Points{sortIndicator("points")}
      </th>


      <th onClick={() => handleSort("attendance")}>
      Attendance{sortIndicator("attendance")}
      </th>


      <th onClick={() => handleSort("status")}>
      Status{sortIndicator("status")}
      </th>


      <th>
      Add Points
      </th>

      <th>
      Actions
      </th>


      </tr>

      </thead>


      <tbody>

        {
          sortedStudents.map((student) => (

            <tr

              key={student.id}

              className={
                student.needs_reinforcement
                  ? "needs-reinforcement"
                  : ""
              }

              onClick={() => onSelect(student.id)}

            >


              <td>
                {student.last_name}
              </td>


              <td>
                {student.first_name}
              </td>


              <td>
                {student.weekly_points}
              </td>


              <td>
                {student.points}
              </td>


              <td>
                {student.attendance_rate}%
              </td>


              <td>

                {
                  student.needs_reinforcement
                    ? `Needs Support (${Math.round(student.confidence * 100)}%)`
                    : `Good Standing (${Math.round(student.confidence * 100)}%)`
                }

              </td>


              <td className="points-cell">

                  <div className="points-buttons">

                      <button
                          onClick={(event) => {
                              event.stopPropagation();
                              giveReward(student.id, 5);
                          }}
                      >
                          +5
                      </button>

                      <button
                          onClick={(event) => {
                              event.stopPropagation();
                              giveReward(student.id, 10);
                          }}
                      >
                          +10
                      </button>

                  </div>

              </td>


              <td className="action-cell">
                {
                    classId !== "all" && (
                        <div className="action-button-container">
                            <button
                                onClick={(event) => {

                                    event.stopPropagation();

                                    removeStudent(
                                        student.id,
                                        `${student.first_name} ${student.last_name}`
                                    );

                                }}
                            >
                                Remove
                            </button>
                        </div>
                    )
                }
            </td>


            </tr>


          ))
        }


      </tbody>


    </table>

  );

}


export default StudentTable;
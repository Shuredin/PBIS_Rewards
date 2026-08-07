import { useEffect, useState } from "react";
import StudentTable from "./StudentTable";


function ClassStudentList({ classId, search, onSelect, title }) {


  const [students, setStudents] = useState([]);



  async function loadStudents() {

    let url;

    if (classId === "all") {

        url = "http://127.0.0.1:8000/school/students";

    } else {

        url =
        `http://127.0.0.1:8000/classes/${classId}/students`;

    }

    const response = await fetch(url);

    let data = await response.json();

    data.sort((a, b) =>
        a.last_name.localeCompare(b.last_name)
    );

    if (search) {

        data = data.filter((student) =>

        `${student.first_name} ${student.last_name}`
            .toLowerCase()
            .includes(search.toLowerCase())

        );

    }

    setStudents(data);

    }


  useEffect(() => {

    if (!classId) {
      return;
    }


    loadStudents();


  }, [classId, search]);



  return (

    <div>

      <h2>
        {title}
      </h2>


      {
        students.length === 0 && (

          <p>
            No students have been added to this class.
          </p>

        )
      }



      {
        students.length > 0 && (

          <StudentTable

            students={students}

            onSelect={onSelect}

            refreshStudents={loadStudents}

          />

        )
      }


    </div>

  );

}


export default ClassStudentList;
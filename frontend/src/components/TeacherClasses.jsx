import { useEffect, useState } from "react";


function TeacherClasses({ teacherId, onSelectClass, onSearchStudent }) {


  const [classes, setClasses] = useState([]);

  const [search, setSearch] = useState("");



  useEffect(() => {


    fetch(
      `http://127.0.0.1:8000/teachers/${teacherId}/classes`
    )

      .then((response) => response.json())

      .then((data) => setClasses(data));


  }, [teacherId]);



  function handleSearch(event) {

    const value = event.target.value;

    setSearch(value);


    onSearchStudent(value);

  }



  return (

    <div className="teacher-classes">


      <h2>
        My Classes
      </h2>



      <input

        type="text"

        placeholder="Search student name..."

        value={search}

        onChange={handleSearch}

      />



      <div className="class-buttons">


        <button

          onClick={() =>
            onSelectClass("all")
          }

        >

          All School

        </button>



        {
          classes.map((classGroup) => (


            <button

              key={classGroup.id}

              onClick={() =>
                onSelectClass(classGroup.id)
              }

            >

              {classGroup.name}

            </button>


          ))
        }


      </div>


    </div>

  );

}


export default TeacherClasses;
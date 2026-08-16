import { useEffect, useState } from "react";

function TeacherClasses({
    teacherId,
    onSelectClass,
    onSearchStudent
}) {

    const [classes, setClasses] = useState([]);

    const [search, setSearch] = useState("");

    const [showCreateClass, setShowCreateClass] =
        useState(false);

    const [className, setClassName] =
        useState("");


    async function loadClasses() {

        const response = await fetch(
            `${import.meta.env.VITE_API_URL}/teachers/${teacherId}/classes`
        );

        const data = await response.json();

        setClasses(data);
    }


    useEffect(() => {

        loadClasses();

    }, [teacherId]);


    function handleSearch(event) {

        const value = event.target.value;

        setSearch(value);

        onSearchStudent(value);
    }


    async function createClass() {

        if (!className.trim()) {

            alert("Enter a class name.");

            return;
        }


        const response = await fetch(
            `${import.meta.env.VITE_API_URL}/classes`,
            {
                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({

                    name: className,

                    teacher_id: teacherId

                })
            }
        );


        const data = await response.json();


        if (!response.ok || data.error) {

            alert(
                data.error ||
                "Unable to create class."
            );

            return;
        }


        setClassName("");

        setShowCreateClass(false);

        await loadClasses();


        alert("Class created.");
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
                                onSelectClass(
                                    classGroup.id
                                )
                            }

                        >

                            {classGroup.name}

                        </button>

                    ))
                }


                <button

                    onClick={() =>
                        setShowCreateClass(
                            !showCreateClass
                        )
                    }

                >

                    {
                        showCreateClass
                            ? "Close"
                            : "+ Create Class"
                    }

                </button>


            </div>


            {
                showCreateClass && (

                    <div className="expanded-panel">

                        <h3>
                            Create New Class
                        </h3>


                        <input

                            type="text"

                            placeholder="Class name"

                            value={className}

                            onChange={(event) =>
                                setClassName(
                                    event.target.value
                                )
                            }

                        />


                        <button
                            onClick={createClass}
                        >
                            Create Class
                        </button>

                    </div>

                )
            }


        </div>

    );
}

export default TeacherClasses;
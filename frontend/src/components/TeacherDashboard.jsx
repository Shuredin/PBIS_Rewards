import { useState } from "react";

import TeacherClasses from "./TeacherClasses";
import ClassStudentList from "./ClassStudentList";
import StaffStudentProfile from "../pages/StaffStudentProfile";
import TeacherStorefront from "./TeacherStorefront";
import TeacherPurchaseRequests from "./TeacherPurchaseRequests";
import ReinforcementDashboard from "./ReinforcementDashboard";
import AddStudents from "./AddStudents";
import { useNavigate } from "react-router-dom";

function TeacherDashboard() {
    const teacherId = 3;
    const navigate = useNavigate();

const [selectedClass, setSelectedClass] = useState(null);
const [selectedStudent, setSelectedStudent] = useState(null);
const [activePanel, setActivePanel] = useState(null);
const [studentSearch, setStudentSearch] = useState("");
const [showAddStudents, setShowAddStudents] = useState(false);


function togglePanel(panel) {

    if (activePanel === panel) {

        setActivePanel(null);
        setSelectedClass(null);
        setSelectedStudent(null);
        setShowAddStudents(false);

    } else {

        setActivePanel(panel);
        setSelectedClass(null);
        setSelectedStudent(null);
        setShowAddStudents(false);

    }

}

  return (

    <div className="teacher-dashboard">


<h1 className="dashboard-header">
    <span>Teacher Dashboard</span>

    <button
        className="back-button"
        onClick={() => navigate("/")}
    >
        ← Back to Login
    </button>
</h1>


      <p>
        Manage classes, student rewards, and purchases.
      </p>



      <div className="dashboard-cards">


        <div
            className={`card ${activePanel === "classes" ? "active-card" : ""}`}
            onClick={() => togglePanel("classes")}
        >

            <h3>
                My Classes
            </h3>

            <p>
                View and manage student groups
            </p>

        </div>



        <div className={`card ${activePanel === "rewards" ? "active-card" : ""}`}
        onClick={() => togglePanel("rewards")}
        >

          <h3>
            AI Insights
          </h3>

          <p>
            See who needs extra support and award points
          </p>

        </div>



        <div className={`card ${activePanel === "storefront" ? "active-card" : ""}`}
        onClick={() => togglePanel("storefront")}
        >

          <h3>
            Storefront
          </h3>

          <p>
            Create and update reward items
          </p>

        </div>



        <div
          className={`card ${activePanel === "requests" ? "active-card" : ""}`}
          onClick={() => togglePanel("requests")}
        >

          <h3>
            Purchase Requests
          </h3>

          <p>
            Review student purchases
          </p>

        </div>


      </div>


      {
      activePanel === "classes" &&

      <TeacherClasses

        teacherId={3}

        onSelectClass={setSelectedClass}

        onSearchStudent={setStudentSearch}

      />

      }


      {
          selectedClass && (

              <>

                  <ClassStudentList

                      classId={selectedClass}

                      search={studentSearch}

                      title={
                          selectedClass === "all"
                              ? "All School Students"
                              : "Class Students"
                      }

                      onSelect={setSelectedStudent}

                  />


                  {
                      selectedClass !== "all" && (

                          <div className="add-students-container">

                              <button
                                  onClick={() =>
                                      setShowAddStudents(
                                          !showAddStudents
                                      )
                                  }
                              >
                                  {
                                      showAddStudents
                                          ? "Close Add Students"
                                          : "Add Students"
                                  }
                              </button>

                          </div>

                      )
                  }


                  {
                      showAddStudents && (

                          <AddStudents

                              classId={selectedClass}

                              onComplete={() => {
                                  setShowAddStudents(false);
                              }}

                          />

                      )
                  }

              </>

          )
      }



      {
        selectedStudent &&

        <StaffStudentProfile
          studentId={selectedStudent}
        />

      }


      {
      activePanel === "rewards" &&

      <ReinforcementDashboard
          teacherId={teacherId}
      />

      }


      {
      activePanel === "storefront" &&

      <TeacherStorefront />

      }



      {
      activePanel === "requests" &&

      <TeacherPurchaseRequests />

      }

    </div>


  );

}


export default TeacherDashboard;
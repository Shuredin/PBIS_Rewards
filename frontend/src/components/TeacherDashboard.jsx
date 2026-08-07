import { useState } from "react";

import TeacherClasses from "./TeacherClasses";
import ClassStudentList from "./ClassStudentList";
import StaffStudentProfile from "../pages/StaffStudentProfile";
import TeacherStorefront from "./TeacherStorefront";
import TeacherPurchaseRequests from "./TeacherPurchaseRequests";


function TeacherDashboard() {


const [selectedClass, setSelectedClass] = useState(null);

const [selectedStudent, setSelectedStudent] = useState(null);

const [activePanel, setActivePanel] = useState(null);

const [studentSearch, setStudentSearch] = useState("");

function togglePanel(panel) {

  if (activePanel === panel) {

    setActivePanel(null);

    setSelectedClass(null);

    setSelectedStudent(null);

  } else {

    setActivePanel(panel);

    setSelectedClass(null);

    setSelectedStudent(null);

  }

}


  return (

    <div className="teacher-dashboard">


      <h1>
        Teacher Dashboard
      </h1>


      <p>
        Manage classes, student rewards, and purchases.
      </p>



      <div className="dashboard-cards">


        <div
            className="card"
            onClick={() => togglePanel("classes")}
        >

            <h3>
                My Classes
            </h3>

            <p>
                View and manage student groups
            </p>

        </div>



        <div className="card"
        onClick={() => togglePanel("rewards")}
        >

          <h3>
            Give Rewards
          </h3>

          <p>
            Award students positive reinforcement points
          </p>

        </div>



        <div className="card"
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
          className="card"
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
        selectedClass &&

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

      }



      {
        selectedStudent &&

        <StaffStudentProfile
          studentId={selectedStudent}
        />

      }

      {
      activePanel === "classes" &&

      <TeacherClasses

        teacherId={1}

        onSelectClass={setSelectedClass}

        onSearchStudent={setStudentSearch}

      />

      }

      {
      activePanel === "rewards" &&

      <div className="expanded-panel">

        <h2>
          Give Rewards
        </h2>

        <p>
          Award student points here.
        </p>

      </div>

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
import { useEffect, useState } from "react";


function StaffStudentProfile({ studentId }) {

  const [student, setStudent] = useState(null);
  const [aiData, setAiData] = useState(null);
  const [activeTab, setActiveTab] = useState("overview");


  useEffect(() => {

    fetch(
      `${import.meta.env.VITE_API_URL}/students/${studentId}`
    )
      .then((response) => response.json())
      .then((data) => setStudent(data));


    fetch(
      `${import.meta.env.VITE_API_URL}/students/${studentId}/reinforcement`
    )
      .then((response) => response.json())
      .then((data) => setAiData(data));


  }, [studentId]);



  if (!student) {

    return <p>Loading student profile...</p>;

  }



  return (

    <div className="student-profile">


      <h2>
        Staff Student Profile
      </h2>


      <h3>
        {student.student.first_name}
        {" "}
        {student.student.last_name}
      </h3>



      <div className="profile-tabs">

        <button
          onClick={() => setActiveTab("overview")}
        >
          Overview
        </button>


        <button
          onClick={() => setActiveTab("rewards")}
        >
          Rewards
        </button>


        <button
          onClick={() => setActiveTab("ai")}
        >
          AI Assessment
        </button>


      </div>




      {
        activeTab === "overview" && (

          <div>

            <p>
              Current Points:
              {" "}
              {student.student.points}
            </p>


            <p>
              Attendance:
              {" "}
              {student.student.attendance_rate}%
            </p>


            <p>
              Behavior Referrals:
              {" "}
              {student.student.behavior_referrals}
            </p>


          </div>

        )
      }





      {
        activeTab === "rewards" && (

          <div>

            <h3>
              Reward History
            </h3>


            <ul>

              {
                student.transactions.map((transaction) => (

                  <li key={transaction.id}>

                    {transaction.amount}
                    {" "}
                    points -
                    {" "}
                    {transaction.reason}

                  </li>

                ))

              }

            </ul>


          </div>

        )
      }






      {
        activeTab === "ai" && aiData && (

          <div>

            <h3>
              AI Reinforcement Assessment
            </h3>


            <p>
              Status:
              {" "}

              {
                aiData.prediction === "Needs Reinforcement"
                  ? "Needs Support"
                  : "Good Standing"
              }

            </p>


            <p>
              Confidence:
              {" "}
              {Math.round(aiData.confidence * 100)}%
            </p>


          </div>

        )
      }



    </div>

  );

}


export default StaffStudentProfile;
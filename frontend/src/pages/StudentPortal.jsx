import { useState } from "react";
import { useNavigate } from "react-router-dom";

import StudentStores from "../components/StudentStores";
import StudentTransactionHistory from "../components/StudentTransactionHistory";


function StudentPortal() {

    const studentId = 1;
    const navigate = useNavigate();

    const [activePanel, setActivePanel] = useState(null);


    function togglePanel(panel) {

        if (activePanel === panel) {

            setActivePanel(null);

        } else {

            setActivePanel(panel);

        }

    }


    return (

        <div className="student-dashboard">

            <h1 className="dashboard-header">

                <span>
                    Student Portal
                </span>

                <button
                    className="back-button"
                    onClick={() => navigate("/")}
                >
                    ← Back to Login
                </button>

            </h1>


            <p>
                View your rewards and school stores.
            </p>


            <div className="dashboard-cards">


                <div
                    className={`card ${activePanel === "stores" ? "active-card" : ""}`}
                    onClick={() =>
                        togglePanel("stores")
                    }
                >

                    <h3>
                        School Stores
                    </h3>

                    <p>
                        Browse rewards available
                        from your teachers.
                    </p>

                </div>


                <div
                    className={`card ${activePanel === "transactions" ? "active-card" : ""}`}
                    onClick={() =>
                        togglePanel("transactions")
                    }
                >

                    <h3>
                        Transaction History
                    </h3>

                    <p>
                        View your points and purchases.
                    </p>

                </div>


            </div>


            {activePanel === "stores" && (

                <div className="expanded-panel">

                    <h2>
                        School Stores
                    </h2>

                    <StudentStores
                        studentId={studentId}
                    />

                </div>

            )}


            {activePanel === "transactions" && (

                <div className="expanded-panel">

                    <h2>
                        Transaction History
                    </h2>

                    <StudentTransactionHistory
                        studentId={studentId}
                    />

                </div>

            )}

        </div>

    );

}


export default StudentPortal;
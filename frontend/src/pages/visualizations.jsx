import { useNavigate } from "react-router-dom";

function Visualizations() {

    const navigate = useNavigate();

    return (
        <div className="visualizations-page">

            <button
                type="button"
                onClick={() => navigate("/")}
            >
                Back to Login
            </button>

            <h1>Model Visualizations</h1>

            <p>
                These visualizations show the relationship between
                student rewards, attendance, behavior referrals, and
                reinforcement needs.
            </p>

            <div className="visualization-card">

                <h2>Average Weekly Rewards</h2>

                <img
                    src="/visualizations/average_weekly_rewards.png"
                    alt="Average weekly rewards by reinforcement need"
                />

            </div>


            <div className="visualization-card">

                <h2>Average Attendance Rate</h2>

                <img
                    src="/visualizations/average_attendance.png"
                    alt="Average attendance rate by reinforcement need"
                />

            </div>


            <div className="visualization-card">

                <h2>Average Behavior Referrals</h2>

                <img
                    src="/visualizations/average_behavior_referrals.png"
                    alt="Average behavior referrals by reinforcement need"
                />

            </div>

        </div>
    );
}

export default Visualizations;
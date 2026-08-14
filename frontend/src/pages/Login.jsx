import { useNavigate } from "react-router-dom";

function Login() {
  const navigate = useNavigate();

  return (
    <div className="login-page">

      <h1>PBIS Rewards</h1>

      <p>Choose your account type to continue.</p>

      <div className="login-cards">

        <div
          className="login-card"
          onClick={() => navigate("/teacher")}
        >
          <h2>Teacher</h2>
          <p>Access the Teacher Dashboard</p>
        </div>

        <div
          className="login-card"
          onClick={() => navigate("/student")}
        >
          <h2>Student</h2>
          <p>Access the Student Dashboard</p>
        </div>

      </div>

    </div>
  );
}

export default Login;
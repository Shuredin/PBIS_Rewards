import {
  BrowserRouter,
  Routes,
  Route
} from "react-router-dom";

import TeacherPortal from "./pages/TeacherPortal";
import StudentPortal from "./pages/StudentPortal";
import Login from "./pages/Login";
import Visualizations from "./pages/Visualizations";


function App() {

  return (
    <BrowserRouter>

      <Routes>

        <Route
          path="/"
          element={<Login />}
        />

        <Route
          path="/teacher"
          element={<TeacherPortal />}
        />

        <Route
          path="/student"
          element={<StudentPortal />}
        />

        <Route 
          path="/visualizations" 
          element={<Visualizations />} 
        />

      </Routes>

    </BrowserRouter>
  );
}


export default App;
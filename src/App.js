import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Navbar from "./components/Navbar";
import Login from "./pages/Login";
import Storage from "./pages/Storage";
import Realtime from "./pages/Realtime";
import SignUp from "./components/SignUp";
import Profile from "./pages/profile";
import Settings from "./components/Settings";

// Protected Route Component
const ProtectedRoute = ({ element }) => {
  const token = localStorage.getItem("token"); // Check if token exists
  return token ? element : <Navigate to="/auth/login" replace />;
};

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/auth/signup" element={<SignUp />} />
        <Route path="/auth/login" element={<Login />} />

        {/* Protected Routes */}
        <Route
          path="/storage/images"
          element={<ProtectedRoute element={<Storage />} />}
        />
        <Route
          path="/storage/realtime"
          element={<ProtectedRoute element={<Realtime />} />}
        />
        <Route
          path="/setting"
          element={<ProtectedRoute element={<Settings />} />}
        ></Route>
      </Routes>
    </Router>
  );
}

export default App;

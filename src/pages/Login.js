import { useState } from "react";
import { useNavigate } from "react-router-dom";
import registerFcmToken from "../components/registerFcmToken";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [deviceId, setDeviceId] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(
        "https://smart-box.onrender.com/auth/login",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password, device: deviceId }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("deviceId", deviceId);
        await registerFcmToken();
        navigate("/storage/images");
      } else {
        setError(data.message || "Invalid credentials");
      }
    } catch (error) {
      setError("Server error. Try again later.");
    }

    setLoading(false);
  };

  return (
    <div style={styles.container}>
      <div style={styles.loginBox}>
        <h1 style={styles.logo}>Smart Box</h1>
        <input
          type="text"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={styles.input}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={styles.input}
        />
        <input
          type="text"
          placeholder="Device ID"
          value={deviceId}
          onChange={(e) => setDeviceId(e.target.value)}
          style={styles.input}
        />
        {error && <p style={styles.error}>{error}</p>}
        <button onClick={handleLogin} style={styles.button} disabled={loading}>
          {loading ? "Logging in..." : "Login"}
        </button>
      </div>
      <div style={styles.signupBox}>
        Don't have an account?{" "}
        <span
          style={styles.signupLink}
          onClick={() => navigate("/auth/signup")}
        >
          Sign up
        </span>
      </div>
    </div>
  );
};

const styles = {
  container: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    minHeight: "100vh",
    background: "linear-gradient(to bottom right, #f0f4f8, #d9e2ec)", // Soft blue-grey gradient
    padding: "20px",
  },
  loginBox: {
    background: "#ffffff",
    padding: "25px",
    borderRadius: "12px",
    boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)",
    width: "90%",
    maxWidth: "350px",
    textAlign: "center",
  },
  logo: {
    fontSize: "24px",
    fontWeight: "bold",
    color: "#2c3e50",
    marginBottom: "15px",
  },
  input: {
    width: "100%",
    padding: "12px",
    margin: "8px 0",
    border: "1px solid #b0bec5",
    borderRadius: "6px",
    fontSize: "15px",
    backgroundColor: "#f9fafb",
    outline: "none",
  },
  button: {
    width: "100%",
    padding: "12px",
    background: "#1e88e5",
    border: "none",
    color: "white",
    fontSize: "16px",
    borderRadius: "6px",
    cursor: "pointer",
    marginTop: "12px",
    transition: "background 0.3s ease",
  },
  buttonHover: {
    background: "#1565c0",
  },
  error: {
    color: "#d32f2f",
    fontSize: "14px",
    marginBottom: "10px",
  },
  signupBox: {
    color: "#546e7a",
    textAlign: "center",
    marginTop: "15px",
    fontSize: "14px",
  },
  signupLink: {
    color: "#1e88e5",
    cursor: "pointer",
    fontWeight: "bold",
  },
};

export default Login;

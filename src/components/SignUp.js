import { useState } from "react";
import { useNavigate } from "react-router-dom";

const SignUp = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [deviceId, setDeviceId] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSignUp = async () => {
    if (!name || !email || !password || !confirmPassword || !deviceId) {
      setError("All fields are required!");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match!");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(
        "https://smart-box.onrender.com/auth/signup",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name, email, password, deviceId }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        navigate("/auth/login");
      } else {
        setError(data.message || "Signup failed");
      }
    } catch (error) {
      setError("Server error. Please try again.");
    }

    setLoading(false);
  };

  return (
    <div style={styles.container}>
      <div style={styles.signupBox}>
        <h1 style={styles.logoText}>Smart-Box</h1>
        <input
          type="text"
          placeholder="Full Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          style={styles.input}
        />
        <input
          type="email"
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
          type="password"
          placeholder="Confirm Password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
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
        <button onClick={handleSignUp} style={styles.button} disabled={loading}>
          {loading ? "Signing Up..." : "Sign Up"}
        </button>
      </div>
      <div style={styles.loginBox}>
        Already have an account?{" "}
        <span style={styles.loginLink} onClick={() => navigate("/auth/login")}>
          Log in
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
    backgroundColor: "#F0F2F5", // Soft Grey
    padding: "20px",
  },
  signupBox: {
    background: "#FFFFFF",
    padding: "25px",
    borderRadius: "12px",
    boxShadow: "0px 4px 15px rgba(0, 0, 0, 0.1)",
    width: "100%",
    maxWidth: "340px",
    textAlign: "center",
  },
  logoText: {
    fontSize: "24px",
    fontWeight: "bold",
    color: "#4A90E2", // Soft Blue
    marginBottom: "20px",
  },
  input: {
    width: "100%",
    padding: "12px",
    margin: "8px 0",
    border: "1px solid #D1D5DB",
    borderRadius: "8px",
    fontSize: "16px",
    backgroundColor: "#F9FAFB",
    outline: "none",
    transition: "border-color 0.3s",
  },
  button: {
    width: "100%",
    padding: "12px",
    background: "#4A90E2", // Soft Blue
    border: "none",
    color: "white",
    fontSize: "16px",
    fontWeight: "bold",
    borderRadius: "8px",
    cursor: "pointer",
    marginTop: "12px",
    transition: "background 0.3s ease",
  },
  buttonHover: {
    background: "#357ABD",
  },
  error: {
    color: "red",
    fontSize: "14px",
    marginBottom: "10px",
  },
  loginBox: {
    color: "#333",
    textAlign: "center",
    marginTop: "15px",
    padding: "10px",
    fontSize: "14px",
  },
  loginLink: {
    color: "#4A90E2",
    cursor: "pointer",
    fontWeight: "bold",
  },
};

export default SignUp;

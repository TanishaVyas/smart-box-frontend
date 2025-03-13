import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState({ email: "", deviceId: "" });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/auth/login");
      return;
    }

    const fetchUserProfile = async () => {
      try {
        const response = await fetch(
          "https://smart-box.onrender.com/user/profile",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        if (!response.ok) throw new Error("Failed to fetch profile");

        const data = await response.json();
        setUser({ email: data.email, deviceId: data.deviceId });
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, [navigate]);

  const handleSignout = () => {
    localStorage.removeItem("token");
    navigate("/auth/login");
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>Profile</h2>

      {loading ? <p style={styles.info}>Loading profile...</p> : null}
      {error ? <p style={styles.errorText}>{error}</p> : null}

      {!loading && !error && (
        <div style={styles.profileCard}>
          <p style={styles.info}>
            <strong>Email:</strong> {user.email}
          </p>
          <p style={styles.info}>
            <strong>Device ID:</strong> {user.deviceId}
          </p>
        </div>
      )}

      <button onClick={handleSignout} style={styles.signoutButton}>
        Sign Out
      </button>
    </div>
  );
};

const styles = {
  container: {
    background: "linear-gradient(to right, #fbc2eb, #a6c1ee)",
    minHeight: "100vh",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    padding: "20px",
  },
  heading: {
    fontSize: "28px",
    fontWeight: "bold",
    color: "#333",
    marginBottom: "20px",
  },
  profileCard: {
    backgroundColor: "white",
    padding: "20px",
    borderRadius: "12px",
    boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
    textAlign: "center",
    width: "300px",
  },
  info: {
    fontSize: "16px",
    color: "#555",
    marginBottom: "10px",
  },
  errorText: {
    color: "red",
    fontSize: "16px",
    marginBottom: "10px",
  },
  signoutButton: {
    backgroundColor: "#ff4d4d",
    color: "white",
    border: "none",
    padding: "10px 18px",
    borderRadius: "8px",
    cursor: "pointer",
    fontSize: "14px",
    fontWeight: "bold",
    marginTop: "20px",
    transition: "background 0.3s ease-in-out, transform 0.2s",
  },
};

export default Profile;

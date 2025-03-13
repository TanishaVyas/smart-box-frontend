import React, { useState, useEffect } from "react";

const Settings = () => {
  const [user, setUser] = useState({ username: "", email: "" });
  const [notificationsEnabled, setNotificationsEnabled] = useState(
    localStorage.getItem("notifications") === "true"
  );

  useEffect(() => {
    fetchUserDetails();
  }, []);

  const fetchUserDetails = async () => {
    const token = localStorage.getItem("token");

    try {
      const response = await fetch(
        "https://smart-box.onrender.com/auth/details",
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch user details");
      }

      const data = await response.json();
      setUser({ username: data.username, email: data.email });
    } catch (error) {
      console.error("Error fetching user details:", error);
    }
  };

  const toggleNotifications = () => {
    const newSetting = !notificationsEnabled;
    setNotificationsEnabled(newSetting);
    localStorage.setItem("notifications", newSetting);
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>Settings</h2>

      {/* User Details */}
      <div style={styles.section}>
        <h3>User Details</h3>
        <p>
          <strong>Username:</strong> {user.name}
        </p>
        <p>
          <strong>Email:</strong> {user.email}
        </p>
        <p>
          <strong>Device Id:</strong> {user.deviceId}
        </p>
      </div>

      {/* Notification Settings */}
      <div style={styles.section}>
        <h3>Notifications</h3>
        <label style={styles.label}>
          <input
            type="checkbox"
            checked={notificationsEnabled}
            onChange={toggleNotifications}
          />
          Enable Push Notifications
        </label>
      </div>
    </div>
  );
};

// Styles
const styles = {
  container: {
    maxWidth: "500px",
    margin: "20px auto",
    padding: "20px",
    background: "#fff",
    borderRadius: "8px",
    boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
  },
  heading: {
    textAlign: "center",
    color: "#333",
  },
  section: {
    marginTop: "20px",
    padding: "10px",
    border: "1px solid #ddd",
    borderRadius: "5px",
    backgroundColor: "#f9f9f9",
  },
  label: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    fontSize: "16px",
  },
};

export default Settings;

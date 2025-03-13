import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";

const Navbar = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const handleSignout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("deviceId");
    navigate("/auth/login");
  };

  return (
    <nav style={styles.navbar}>
      <div style={styles.navbarContainer}>
        {/* Logo */}
        <div style={styles.logo} onClick={() => navigate("/")}>
          Smart Bag
        </div>

        {/* Navigation Links (Always Visible) */}
        <div style={styles.navLinks}>
          {token && (
            <Link to="/storage/images" style={styles.link}>
              Storage
            </Link>
          )}
          {token && (
            <Link to="/storage/realtime" style={styles.link}>
              Realtime
            </Link>
          )}
          {token && (
            <Link to="/setting" style={styles.link}>
              Settings
            </Link>
          )}
        </div>

        {/* Auth Buttons */}
        <div style={styles.authButtons}>
          {!token && (
            <Link
              to="/auth/signup"
              style={{ ...styles.authBtn, ...styles.signupBtn }}
            >
              Sign Up
            </Link>
          )}
          {!token && (
            <Link
              to="/auth/login"
              style={{ ...styles.authBtn, ...styles.loginBtn }}
            >
              Login
            </Link>
          )}
          {token && (
            <button onClick={handleSignout} style={styles.signoutButton}>
              Sign Out
            </button>
          )}
        </div>
      </div>
    </nav>
  );
};

const styles = {
  navbar: {
    background: "#ECEFF1",
    padding: "12px 20px",
    display: "flex",
    justifyContent: "center",
    position: "sticky",
    top: "0",
    width: "97.5%", // ✅ Full width
    zIndex: "1000",
    boxShadow: "0px 2px 8px rgba(0, 0, 0, 0.1)",
  },
  navbarContainer: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%", // ✅ Full width on mobile
    maxWidth: "1200px", // ✅ Prevents stretching too much on large screens
    padding: "0 15px", // ✅ Prevents content touching the edges
  },
  logo: {
    fontSize: "22px",
    color: "#37474F",
    fontWeight: "bold",
    cursor: "pointer",
  },
  navLinks: {
    display: "flex",
    gap: "15px",
  },
  link: {
    color: "#37474F",
    textDecoration: "none",
    fontSize: "16px",
    fontWeight: "500",
    transition: "color 0.3s ease-in-out",
  },
  authButtons: {
    display: "flex",
    gap: "12px",
  },
  authBtn: {
    textDecoration: "none",
    padding: "8px 16px",
    borderRadius: "6px",
    fontSize: "14px",
    fontWeight: "bold",
    cursor: "pointer",
    transition: "background 0.3s ease-in-out, transform 0.2s",
  },
  signupBtn: {
    backgroundColor: "#1565C0",
    color: "white",
    border: "none",
    boxShadow: "0px 4px 10px rgba(21, 101, 192, 0.2)",
  },
  loginBtn: {
    backgroundColor: "transparent",
    color: "#1565C0",
    border: "2px solid #1565C0",
  },
  signoutButton: {
    backgroundColor: "#D32F2F",
    color: "white",
    border: "none",
    padding: "8px 16px",
    borderRadius: "6px",
    cursor: "pointer",
    fontSize: "14px",
    fontWeight: "bold",
    transition: "background 0.3s ease-in-out, transform 0.2s",
  },

  // ✅ Mobile adjustments
  "@media (max-width: 768px)": {
    navbarContainer: {
      flexDirection: "column", // ✅ Stack items on mobile
      alignItems: "center",
      padding: "0 0px",
    },
    navLinks: {
      flexDirection: "column",
      gap: "10px",
      alignItems: "center",
    },
    authButtons: {
      flexDirection: "column",
      gap: "10px",
      marginTop: "10px",
    },
  },
};

export default Navbar;

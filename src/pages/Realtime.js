import { useState, useEffect } from "react";

const Realtime = () => {
  const [latestImage, setLatestImage] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLatestImage = async () => {
      try {
        setError(null);
        const token = localStorage.getItem("token");

        if (!token) {
          setError("Unauthorized access. Please log in.");
          setLoading(false);
          return;
        }

        const response = await fetch(
          "https://smart-box.onrender.com/storage/latest-image",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Failed to fetch latest image");
        }

        setLatestImage(data);
      } catch (err) {
        console.error("Error fetching latest image:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchLatestImage();
    const interval = setInterval(fetchLatestImage, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>Latest Image</h2>

      {loading && <p style={styles.loadingText}>Fetching latest image...</p>}
      {error && <p style={styles.errorText}>{error}</p>}

      {latestImage ? (
        <div style={styles.imageCard}>
          <img
            src={`data:image/jpeg;base64,${latestImage.image}`}
            alt="Latest"
            style={styles.latestImage}
          />
          <p style={styles.timestamp}>
            Captured on: {new Date(latestImage.timestamp).toLocaleString()}
          </p>
        </div>
      ) : (
        !loading && <p style={styles.noImageText}>No recent images available</p>
      )}
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
    background: "linear-gradient(to bottom right, #e3eaf5, #cfd8dc)", // Subtle blue-grey gradient
    padding: "20px",
  },
  heading: {
    color: "#37474f",
    fontSize: "clamp(22px, 3vw, 32px)",
    fontWeight: "bold",
    marginBottom: "20px",
  },
  loadingText: {
    color: "#607d8b",
    fontSize: "clamp(14px, 2vw, 18px)",
  },
  errorText: {
    color: "#d32f2f",
    fontSize: "clamp(14px, 2vw, 18px)",
  },
  imageCard: {
    background: "#ffffff",
    padding: "12px",
    borderRadius: "10px",
    boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
    textAlign: "center",
    maxWidth: "90%",
    transition: "transform 0.2s ease-in-out",
  },
  latestImage: {
    width: "100%",
    maxWidth: "clamp(280px, 80vw, 600px)",
    height: "auto",
    borderRadius: "10px",
    transition: "transform 0.3s ease",
  },
  timestamp: {
    fontSize: "clamp(12px, 1.5vw, 16px)",
    color: "#546e7a",
    marginTop: "5px",
  },
  noImageText: {
    color: "#78909c",
    fontSize: "clamp(16px, 2vw, 20px)",
    textAlign: "center",
  },
};

export default Realtime;

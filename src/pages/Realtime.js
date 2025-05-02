import { useState, useEffect } from "react";

const reverseBase64Twice = (base64String) => {
  // Decode the base64 string once
  const decodedOnce = atob(base64String);

  // Decode again the decoded string (reverse the second encoding)
  const decodedTwice = atob(decodedOnce);

  // Return the final base64 string with proper data URL format
  return `data:image/jpeg;base64,${btoa(decodedTwice)}`;
};

const Realtime = () => {
  const [latestImage, setLatestImage] = useState(null);
  const [analogValue, setAnalogValue] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [deviceId, setDeviceId] = useState(null); // Store deviceId

  const THRESHOLD = 200;

  useEffect(() => {
    const fetchData = async () => {
      try {
        setError(null);
        const token = localStorage.getItem("token");
        const storedDeviceId = localStorage.getItem("deviceId");

        if (!token || !storedDeviceId) {
          setError("Unauthorized access. Please log in.");
          setLoading(false);
          return;
        }

        setDeviceId(storedDeviceId);

        // Fetch image
        const imageResponse = await fetch(
          `https://smart-box.onrender.com/storage/latest-image`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        const imageData = await imageResponse.json();

        if (!imageResponse.ok)
          throw new Error(imageData.message || "Image fetch failed");

        setLatestImage(imageData);

        // Fetch analog value
        const analogResponse = await fetch(
          `https://smart-box.onrender.com/analog/${storedDeviceId}`
        );
        const analogData = await analogResponse.json();

        if (analogResponse.ok) {
          setAnalogValue(analogData.value);

          // 🔔 Trigger notification if analog value > threshold
          if (analogData.value < THRESHOLD) {
            await fetch(
              "https://smart-box.onrender.com/api/send-notification",
              {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({
                  deviceId: localStorage.getItem("deviceId"),
                  title: "Alert: new item added",
                  body: `Analog reading (${analogData.value}).`,
                }),
              }
            );
          }
        } else {
          setAnalogValue(null);
        }
      } catch (err) {
        console.error("Error fetching data:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 5000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setError(null);
        const token = localStorage.getItem("token");
        const storedDeviceId = localStorage.getItem("deviceId"); // Assume deviceId is stored after login

        if (!token || !storedDeviceId) {
          setError("Unauthorized access. Please log in.");
          setLoading(false);
          return;
        }

        setDeviceId(storedDeviceId);

        // Fetch latest image
        const imageResponse = await fetch(
          `https://smart-box.onrender.com/storage/latest-image`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        const imageData = await imageResponse.json();

        if (!imageResponse.ok) {
          throw new Error(imageData.message || "Failed to fetch latest image");
        }

        setLatestImage(imageData);

        // Fetch latest analog value
        const analogResponse = await fetch(
          `https://smart-box.onrender.com/analog/${storedDeviceId}`
        );
        const analogData = await analogResponse.json();

        if (analogResponse.ok) {
          setAnalogValue(analogData.value);
        } else {
          setAnalogValue(null);
        }
      } catch (err) {
        console.error("Error fetching data:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 5000); // Fetch data every 5 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>Latest Image</h2>

      {loading && <p style={styles.loadingText}>Fetching latest data...</p>}

      {latestImage ? (
        <div style={styles.imageCard}>
          <img
            src={reverseBase64Twice(latestImage.image)}
            alt="Latest"
            style={styles.latestImage}
          />
          <p style={styles.timestamp}>
            Captured on: {new Date(latestImage.timestamp).toLocaleString()}
          </p>
          <p style={styles.analogValue}>
            Analog Value:{" "}
            {analogValue !== null ? (
              <span style={styles.analogNumber}>{analogValue}</span>
            ) : (
              <span style={styles.noAnalog}>Value not received</span>
            )}
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
    background: "linear-gradient(to bottom right, #e3eaf5, #cfd8dc)", // Soft blue-grey gradient
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
  analogValue: {
    fontSize: "clamp(14px, 1.8vw, 20px)",
    fontWeight: "bold",
    color: "#37474f",
    marginTop: "8px",
  },
  analogNumber: {
    color: "#388e3c", // Green for valid analog values
  },
  noAnalog: {
    color: "#d32f2f", // Red if no value is received
  },
  noImageText: {
    color: "#78909c",
    fontSize: "clamp(16px, 2vw, 20px)",
    textAlign: "center",
  },
};

export default Realtime;

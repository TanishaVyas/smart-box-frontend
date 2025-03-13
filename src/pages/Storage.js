import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Storage = () => {
  const [images, setImages] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);
  const [filter, setFilter] = useState("1W"); // Default: Last 1 week
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchImages = async () => {
      try {
        if (!token) {
          console.error("No token found");
          return;
        }

        const response = await fetch(
          "https://smart-box.onrender.com/storage/images",
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        const data = await response.json();

        if (response.ok) {
          let filteredImages = data;

          const now = new Date();
          filteredImages = data.map((img) => ({
            ...img,
            timestamp: new Date(img.timestamp),
          }));

          switch (filter) {
            case "1W":
              filteredImages = filteredImages.filter(
                (img) => now - img.timestamp <= 7 * 24 * 60 * 60 * 1000
              );
              break;
            case "1M":
              filteredImages = filteredImages.filter(
                (img) => now - img.timestamp <= 30 * 24 * 60 * 60 * 1000
              );
              break;
            case "1Y":
              filteredImages = filteredImages.filter(
                (img) => now - img.timestamp <= 365 * 24 * 60 * 60 * 1000
              );
              break;
            default:
              break;
          }

          filteredImages.sort((a, b) => b.timestamp - a.timestamp);
          setImages(filteredImages);
        } else {
          console.error("Error fetching images:", data.message);
        }
      } catch (error) {
        console.error("Error:", error);
      }
    };

    fetchImages();
  }, [token, filter]);

  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>Stored Images</h2>

      {/* Filter Buttons */}
      <div style={styles.filterButtons}>
        {[
          { label: "1 Week", value: "1W" },
          { label: "1 Month", value: "1M" },
          { label: "1 Year", value: "1Y" },
          { label: "All", value: "ALL" },
        ].map((btn) => (
          <button
            key={btn.value}
            style={
              filter === btn.value ? styles.activeFilterBtn : styles.filterBtn
            }
            onClick={() => setFilter(btn.value)}
          >
            {btn.label}
          </button>
        ))}
      </div>

      <div style={styles.imageGrid}>
        {images.length > 0 ? (
          images.map((imgObj, index) => (
            <div key={index} style={styles.imageCard}>
              <img
                src={`data:image/jpeg;base64,${imgObj.image}`}
                alt={`Image ${index}`}
                style={styles.storedImage}
                onClick={() => setSelectedImage(imgObj.image)}
              />
              <p style={styles.timestamp}>
                Captured on: {imgObj.timestamp.toLocaleString()}
              </p>
            </div>
          ))
        ) : (
          <p style={styles.noImages}>No images found</p>
        )}
      </div>

      {selectedImage && (
        <div style={styles.modal} onClick={() => setSelectedImage(null)}>
          <div style={styles.modalContent}>
            <img
              src={`data:image/jpeg;base64,${selectedImage}`}
              alt="Enlarged"
              style={styles.modalImage}
            />
          </div>
        </div>
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
    backgroundColor: "#F5F7FA", // Light grey background
    padding: "20px",
  },
  heading: {
    color: "#333",
    fontSize: "clamp(22px, 3vw, 28px)",
    fontWeight: "bold",
    marginBottom: "20px",
  },
  filterButtons: {
    display: "flex",
    gap: "12px",
    marginBottom: "20px",
  },
  filterBtn: {
    padding: "8px 14px",
    borderRadius: "20px",
    border: "1px solid #007BFF",
    backgroundColor: "transparent",
    color: "#007BFF",
    cursor: "pointer",
    fontSize: "14px",
    fontWeight: "bold",
    transition: "all 0.3s",
  },
  activeFilterBtn: {
    padding: "8px 14px",
    borderRadius: "20px",
    border: "none",
    backgroundColor: "#007BFF",
    color: "white",
    cursor: "pointer",
    fontSize: "14px",
    fontWeight: "bold",
  },
  imageGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))",
    gap: "10px",
    justifyContent: "center",
    width: "100%",
    maxWidth: "600px",
  },
  imageCard: {
    background: "white",
    padding: "10px",
    borderRadius: "10px",
    boxShadow: "0px 2px 8px rgba(0, 0, 0, 0.1)",
    textAlign: "center",
    transition: "transform 0.2s ease-in-out",
  },
  storedImage: {
    width: "100%",
    height: "auto",
    borderRadius: "8px",
    cursor: "pointer",
    transition: "transform 0.3s",
  },
  storedImageHover: {
    transform: "scale(1.05)",
  },
  timestamp: {
    fontSize: "13px",
    color: "#607d8b",
    marginTop: "5px",
  },
  noImages: {
    color: "#78909c",
    fontSize: "18px",
    textAlign: "center",
    fontWeight: "bold",
  },
  modal: {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "20px",
  },
  modalContent: {
    maxWidth: "90%",
    maxHeight: "90%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  modalImage: {
    width: "auto",
    maxWidth: "90%",
    height: "auto",
    maxHeight: "90%",
    borderRadius: "10px",
  },
};

export default Storage;

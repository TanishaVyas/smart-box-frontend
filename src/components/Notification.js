// src/Notification.js
import { useEffect } from "react";
import { messaging, getToken, onMessage } from "./firebase-config";

const Notification = () => {
  useEffect(() => {
    const registerFCMToken = async () => {
      try {
        const permission = await Notification.requestPermission();

        if (permission !== "granted") {
          console.warn("Notification permission not granted");
          return;
        }

        const token = await getToken(messaging, {
          vapidKey:
            "BJzHsF9mIi9Si3F7YwcbSQenOO-O1o6jTrR-JNFU2hWYdchHUmMXwy32TrkszURUPHUmN5m747y70S4NbCb6Rwk",
        });

        if (token) {
          console.log("FCM Token:", token);

          const deviceId = localStorage.getItem("deviceId");

          if (!deviceId) {
            console.error("Missing deviceId in localStorage.");
            return;
          }

          // Send token and deviceId to backend
          await fetch("http://localhost:5000/api/notifications/save-token", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ token, deviceId }),
          });
        }
      } catch (err) {
        console.error("Error getting notification permission or token:", err);
      }
    };

    registerFCMToken();

    // Handle foreground messages
    onMessage(messaging, (payload) => {
      console.log("Foreground message received:", payload);
      alert(`${payload.notification.title}: ${payload.notification.body}`);
    });
  }, []);

  return null;
};

export default Notification;

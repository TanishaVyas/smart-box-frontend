// src/utils/registerFcmToken.js
import { messaging, getToken } from "./firebase-config";

const registerFcmToken = async () => {
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

    if (!token) {
      console.error("FCM token not available");
      return;
    }

    const deviceId = localStorage.getItem("deviceId");
    if (!deviceId) {
      console.error("Device ID not found in localStorage");
      return;
    }

    // Send token and deviceId to backend
    await fetch("http://localhost:3000/api/save-token", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token, deviceId }),
    });

    console.log("FCM token sent to server");
    console.log(JSON.stringify({ token, deviceId }));
  } catch (err) {
    console.error("FCM registration error:", err);
  }
};

export default registerFcmToken;

import { useEffect } from "react";
import { messaging, getToken, onMessage } from "./firebase-config";

const FCMSetup = () => {
  useEffect(() => {
    const registerToken = async () => {
      try {
        const permission = await Notification.requestPermission();
        if (permission === "granted") {
          const token = await getToken(messaging, {
            vapidKey:
              "BJzHsF9mIi9Si3F7YwcbSQenOO-O1o6jTrR-JNFU2hWYdchHUmMXwy32TrkszURUPHUmN5m747y70S4NbCb6Rwk", // from Firebase Console (Cloud Messaging > Web Push Certificates)
          });
          const deviceId = localStorage.getItem("deviceId");

          if (token) {
            console.log("FCM Token:", token);

            // Save token to backend
            await fetch("https://smart-box.onrender.com/api/save-token", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({ token, deviceId }),
            });
          } else {
            console.warn("No registration token available.");
          }
        } else {
          console.warn("Notification permission denied");
        }
      } catch (err) {
        console.error("FCM error:", err);
      }
    };

    registerToken();

    // Listen for messages when app is open
    onMessage(messaging, (payload) => {
      console.log("Message received. ", payload);
      alert(payload.notification?.title + ": " + payload.notification?.body);
    });
  }, []);

  return null;
};

export default FCMSetup;

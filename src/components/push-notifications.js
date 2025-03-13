const publicVapidKey =
  "BNG2BDTAu1qPmRWI5kXH2KyJR10rzQLltb6h7kBwm5OcmvoU7NToKfR5vwVk6C3yBneNC4Oojfl2Ug_gtuOg68I";

function urlBase64ToUint8Array(base64String) {
  // ✅ Fix: Ensure Base64 format is correct
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");

  // 🔥 Catch potential decoding errors
  try {
    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);
    for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
  } catch (error) {
    console.error("Invalid Base64 VAPID Key:", base64String);
    throw new Error("Failed to decode Base64 VAPID Key");
  }
}

export async function registerPush(deviceId) {
  if (!("Notification" in window) || !("serviceWorker" in navigator)) {
    console.log("Push notifications or service workers are not supported.");
    return;
  }

  const permission = await Notification.requestPermission();
  if (permission !== "granted") {
    console.log("Push notification permission denied.");
    return;
  }

  const register = await navigator.serviceWorker.register(
    "/service-worker.js",
    {
      scope: "/",
    }
  );

  let subscription = await register.pushManager.getSubscription();
  if (!subscription) {
    subscription = await register.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(publicVapidKey),
    });

    console.log(
      "🔹 New Push Subscription:",
      JSON.stringify(subscription, null, 2)
    );

    // ✅ Wait for server response before page change
    await fetch("https://smart-box.onrender.com/subscribe", {
      method: "POST",
      body: JSON.stringify({ deviceId, ...subscription }),
      headers: { "Content-Type": "application/json" },
    });

    console.log("✅ Subscription stored on server!");
  } else {
    console.log(
      "✅ Already Subscribed:",
      JSON.stringify(subscription, null, 2)
    );
  }
}

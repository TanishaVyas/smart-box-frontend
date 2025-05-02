importScripts(
  "https://www.gstatic.com/firebasejs/9.6.10/firebase-app-compat.js"
);
importScripts(
  "https://www.gstatic.com/firebasejs/9.6.10/firebase-messaging-compat.js"
);

firebase.initializeApp({
  apiKey: "AIzaSyBJI861CPvvokYxiZdOQUpgsBUya2kBBSE",
  authDomain: "smart-box-e1cd8.firebaseapp.com",
  projectId: "smart-box-e1cd8",
  messagingSenderId: "40791071305",
  appId: "1:40791071305:web:e61d2fdc8c99400ce07d98",
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage(function (payload) {
  console.log("[Service Worker] Background message", payload);
  const { title, body } = payload.notification;

  self.registration.showNotification(title, {
    body,
    icon: "/logo192.png",
  });
});

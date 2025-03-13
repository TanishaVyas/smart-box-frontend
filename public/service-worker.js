self.addEventListener("push", (event) => {
  if (!event.data) {
    console.error("Push event triggered but no data received.");
    return;
  }

  try {
    const data = event.data.json();

    self.registration.showNotification(data.title || "Notification", {
      body: data.message || "You have a new notification.",
      icon: "/icon.png",
    });
  } catch (error) {
    console.error("Error parsing push event data:", error);
  }
});

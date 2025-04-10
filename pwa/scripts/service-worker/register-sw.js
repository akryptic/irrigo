if ("serviceWorker" in navigator) {
  navigator.serviceWorker
    .register("scripts/service-worker/sw.js")
    .then(() => console.log("Service Worker Registered"))
    .catch((error) =>
      console.error("Service Worker Registration Failed:", error)
    );
}

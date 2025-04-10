class NotificationManager {
  constructor() {
    this.stack = document.createElement("notify-stack");
    document.body.appendChild(this.stack);
    this.notifications = new Set();
  }

  push(type, message) {
    const notification = document.createElement("notification");
    notification.className = `${type}`;
    notification.textContent = message;

    const closeButton = document.createElement("span");
    closeButton.className = "close-btn";
    closeButton.innerHTML = "&times;";
    closeButton.onclick = () => this.remove(notification);
    notification.appendChild(closeButton);

    this.stack.appendChild(notification);
    this.notifications.add(notification);

    let timeout = setTimeout(() => this.remove(notification), 3000); // 5 seconds timeout

    notification.addEventListener("mouseenter", () => clearTimeout(timeout)); // Pause timeout on hover
    notification.addEventListener("mouseleave", () => {
      timeout = setTimeout(() => this.remove(notification), 1000);
    });

    return notification;
  }

  remove(notification) {
    if (this.notifications.has(notification)) {
      this.notifications.delete(notification);
      notification.classList.add("fade-out");
      notification.remove();
    }
  }
}

const manager = new NotificationManager();
export const notify = {
  inform: (msg) => manager.push("inform", msg),
  warn: (msg) => manager.push("warn", msg),
  error: (msg) => manager.push("error", msg),
  success: (msg) => manager.push("success", msg),
};

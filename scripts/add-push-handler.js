const fs = require("fs");
const path = require("path");

const swPath = path.join(__dirname, "../public/sw.js");

if (!fs.existsSync(swPath)) {
    console.error("sw.js not found — skipping push handler injection");
    process.exit(0);
}

const existing = fs.readFileSync(swPath, "utf8");

if (existing.includes("push-handler-injected")) {
    console.log("Push handlers already injected — skipping");
    process.exit(0);
}

const pushHandlers = `
// push-handler-injected

// ---- Bypass SW for admin and API routes ----
self.addEventListener("fetch", function(event) {
  const url = new URL(event.request.url);
  if (
    url.pathname.startsWith("/admin") ||
    url.pathname.startsWith("/api") ||
    url.pathname.startsWith("/_next/")
  ) {
    // Let the browser handle it — do not cache or intercept
    event.respondWith(fetch(event.request));
  }
});

// ---- Push notification handler ----
self.addEventListener("push", function(event) {
  if (!event.data) return;
  let data = {};
  try { data = event.data.json(); } catch { data = { title: "JMA UK", body: event.data.text() }; }

  const title = data.title || "JMA UK";
  const options = {
    body: data.body || "",
    icon: "/icons/icon-192.png",
    badge: "/icons/icon-192.png",
    data: { url: data.url || "/" },
  };

  event.waitUntil(self.registration.showNotification(title, options));
});

// ---- Notification click handler ----
self.addEventListener("notificationclick", function(event) {
  event.notification.close();
  const url = (event.notification.data && event.notification.data.url) || "/";
  event.waitUntil(
    clients.matchAll({ type: "window", includeUncontrolled: true }).then(function(clientList) {
      for (const client of clientList) {
        if (client.url === url && "focus" in client) return client.focus();
      }
      if (clients.openWindow) return clients.openWindow(url);
    })
  );
});
`;

fs.writeFileSync(swPath, existing + pushHandlers);
console.log("Push handlers injected into sw.js");
// scripts/add-push-handler.js
// Appends push notification handlers to the generated sw.js after every build

const fs = require("fs");
const path = require("path");

const swPath = path.join(__dirname, "../public/sw.js");

const pushHandlers = `

// ── Push notification handlers ──────────────────────────────────────────────

self.addEventListener("push", function(event) {
    if (!event.data) return;
    var data = event.data.json();
    var title = data.title || "JMA UK";
    var options = {
        body: data.body || "",
        icon: "/icons/icon-192.png",
        badge: "/icons/icon-192.png",
        data: { url: data.url || "/" },
    };
    event.waitUntil(self.registration.showNotification(title, options));
});

self.addEventListener("notificationclick", function(event) {
    event.notification.close();
    var url = (event.notification.data && event.notification.data.url) || "/";
    event.waitUntil(
        self.clients.matchAll({ type: "window", includeUncontrolled: true }).then(function(clientList) {
            for (var i = 0; i < clientList.length; i++) {
                var client = clientList[i];
                if (client.url === url && "focus" in client) return client.focus();
            }
            if (self.clients.openWindow) return self.clients.openWindow(url);
        })
    );
});
`;

const existing = fs.readFileSync(swPath, "utf8");

if (existing.includes("Push notification handlers")) {
    console.log("[add-push-handler] Handlers already present, skipping.");
} else {
    fs.writeFileSync(swPath, existing + pushHandlers);
    console.log("[add-push-handler] Push handlers appended to sw.js ✓");
}
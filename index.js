require("./config/env");
const http = require("http");
const WebSocket = require("ws");
const clients = new Map();

// Create a raw HTTP server (no Express)
const server = http.createServer((req, res) => {
  res.writeHead(404);
  res.end("WebSocket Server Only");
});

const wss = new WebSocket.Server({ server });

// IMPORT SOCKET HANDLERS
const userSocket = require("./handlers/userSocket");
const bookingSocket = require("./handlers/bookingSocket");
const masterSocket = require("./handlers/MasterSocket");
const comonApiSocket = require("./handlers/comonApiSocket")
const invoiceSocket = require("./handlers/invoiceSocket")

// 🧠 Available WebSocket handlers mapped by endpoint root
const wsHandlers = {
  user: userSocket,
  booking: bookingSocket,
  master: masterSocket,
  comonapi: comonApiSocket,
  invoice: invoiceSocket
};

const AuthNotRequire = ["user/login"];

// 🌐 Unified WebSocket handler
wss.on("connection", (ws) => {
  console.log("🔌 WebSocket client connected");
  // Temporary UUID if userId not yet known
  const tempId = `guest_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
  clients.set(tempId, { ws, meta: { connectedAt: Date.now(), temp: true } });

  // Attach metadata to ws itself
  ws._clientId = tempId;

  ws.on("message", async (msg) => {
    try {
      const data = JSON.parse(msg);
      const { type, command, token, body = {} } = data;

      if (type && type != "auth") {
        console.log(data);
      }

      if (!type) {
        return ws.send(
          JSON.stringify({ msg: "Missing request Type", type: "error" })
        );
      }

      if (!command && type != 'page-change') {
        return ws.send(
          JSON.stringify({ msg: "Missing endpoint", type: "error" })
        );
      }

      if (type == "auth") {
        if (!token) {
          ws.send(
            JSON.stringify({
              msg: "Authentication token required",
              type: "warn",
            })
          );
          return;
        }

        if (ws._authenticated) {
          ws.send(
            JSON.stringify({ msg: "Already authenticated", type: "success" })
          );
          return;
        }

        const { verifyToken } = require("./middlewares/auth");
        const user = verifyToken(token);
        if (!user) {
          ws.send(
            JSON.stringify({
              msg: "Invalid authentication token",
              type: "error",
              command: "goToLogin",
            })
          );
          return;
        }

        ws._authenticated = true;
        ws._user = user;
        ws.send(
          JSON.stringify({ msg: "Authentication successful", type: "success" })
        );
        return;
      }

      if (!ws._authenticated && AuthNotRequire.includes(command)) {
        const { verifyToken } = require("./middlewares/auth");
        if (!token) {
          return ws.send(
            JSON.stringify({
              msg: "Authentication token required",
              type: "warn",
            })
          );
        }
      }

      if (type == "page-change") {
        ws.pageId = data.pageId;
        return;
      }

      const parts = command.split("/").filter(Boolean);
      const service = parts[0];
      parts.shift();
      const handler = wsHandlers[service];
      if (!handler) {
        console.log(data);
        return ws.send(
          JSON.stringify({ msg: "Unknown WebSocket endpoint", type: "error" })
        );
      }

      const context = {
        type,
        command,
        parts,
        body,
        ws,
        clients,
      };

      await handler(context);
    } catch (err) {
      console.error("WebSocket error:", err);
      ws.send(
        JSON.stringify({
          msg: "Invalid WebSocket message format",
          type: "error",
        })
      );
    }
  });

  ws.on("close", () => {
    clients.delete(ws._clientId);
  });
});

// 🚀 Start server
const PORT = process.env.PORT || 80;
server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});

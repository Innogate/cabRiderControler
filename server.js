require('./core/env');

const http = require("http");
const WebSocket = require("ws");
const Registry = require("./core/Registry");

// Auto-load all handlers
require("fs")
  .readdirSync("./handlers")
  .forEach((f) => f.endsWith("Handler.js") && require(`./handlers/${f}`));

const server = http.createServer((req, res) => {
  res.writeHead(404);
  res.end("WebSocket Only");
});

const wss = new WebSocket.Server({ server });

wss.on("connection", (ws) => {
  ws.on("message", async (raw) => {
    try {
      const { command, body = {} } = JSON.parse(raw);
      const [namespace, method] = command.split(".");

      const handler = Registry.get(namespace);
      if (!handler) throw new Error(`No handler for '${namespace}'`);

      await handler._dispatch(method, { ws, wss, command, body });
    } catch (err) {
      ws.send(JSON.stringify({ status: "error", msg: err.message }));
    }
  });
});

const PORT = process.env.PORT || 8080;
server.listen(PORT, () => {
  console.log(`🚀 WebSocket server running on port ${PORT}`);
});

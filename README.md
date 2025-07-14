# 📘 WebSocket Handler Server - Full Documentation

A powerful, scalable, and class-based WebSocket server architecture using Node.js with hot-reload development support. This project provides clean namespacing for commands, JWT-based authentication, automatic handler registration, and developer-friendly APIs.

---

## 🔧 Project Structure

```
/project-root
├── handlers/
│   ├── UserHandler.js        # Handles user-related WebSocket commands
│   └── ...                   # Other handlers like BookingHandler, etc.
├── core/
│   ├── WebSocketHandler.js   # Base class for all handlers
│   ├── Registry.js           # Central registry to map namespace to handler
│   └── jwt.js                # JWT sign/verify helper
├── config/
│   └── env.js                # Loads .env variables safely
├── server.js                 # WebSocket server entry point
├── .env                      # Environment variables
├── package.json              # Node project manifest
└── README.md                 # Project documentation
```

---

## 🧠 Core Concepts

### 1. **Handlers**

* Each handler is a class that extends `WebSocketHandler`.
* The namespace is auto-inferred from the class name (e.g. `UserHandler` → `user`).
* Handlers must export a single instance.

### 2. **Command Mapping**

* Every WebSocket message must include a `command` string in the format: `namespace.method`
* The framework auto-dispatches the message to `NamespaceHandler.method()`

### 3. **Authentication**

* Token is passed in the `body.token` field.
* Validated JWT is attached to `ws._user` and made available as `this.user` inside handlers.
* Methods not listed in `this.publicCommands` require authentication.

---

## 💡 Example Payloads

### 🔐 Login (no auth required)

```json
{
  "command": "user.login",
  "body": {
    "username": "admin",
    "password": "1234"
  }
}
```

### 🧾 Authenticated Command

```json
{
  "command": "user.profile",
  "body": {
    "token": "<JWT_TOKEN_FROM_LOGIN>"
  }
}
```

### ❌ Unauthenticated Command

```json
{
  "command": "user.profile",
  "body": {}
}
```

*Response:*

```json
{
  "type": "error",
  "msg": "Authentication required"
}
```

---


## 🧪 Testing

You can test with any WebSocket client:

* Chrome DevTools (WebSocket tab)
* `wscat -c ws://localhost:8080`
* Node.js script

Payload format:

```json
{
  "command": "user.login",
  "body": {
    "username": "admin",
    "password": "1234"
  }
}
```

---

## 🧼 Linting & Dev Server

Install dev tools:

```bash
npm install -D nodemon vite-node
```

`nodemon.json`:

```json
{
  "watch": ["."],
  "ext": "js,json",
  "ignore": ["node_modules"],
  "exec": "vite-node server.js"
}
```

Run dev mode:

```bash
npm run dev
```

`package.json`:

```json
{
  "scripts": {
    "dev": "nodemon"
  }
}
```

---

## ✅ Summary

* Class-based WebSocket architecture
* Auto command routing via Registry
* JWT secured method access
* Dev-friendly live reload
* Easy to extend and maintain

Perfect for real-time apps like dashboards, chat, booking systems, and admin panels.


## Intense Method

| Method                        | Description                                                                                                                                             |
| ----------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **`setContext(context)`**     | Initializes the handler with the current request’s WebSocket, server instance, command, and payload. Also extracts and verifies JWT token (if present). |
| **`send(payload)`**           | Sends a message (object) back to the connected client. Must be a valid JSON-serializable object.                                                        |
| **`broadcast(payload)`**      | Sends the given payload to **all** connected WebSocket clients, including the current client.                                                           |
| **`onlyOthers(payload)`**     | Sends the payload to **all** clients **except** the one who triggered the command.                                                                      |
| **`get user()`**              | Returns the decoded JWT user object (if authenticated). Otherwise returns `null`.                                                                       |
| **`requireAuth()`**           | Throws an error if the user is not authenticated. Useful to protect methods without relying on external conditionals.                                   |
| **`authenticate(token)`**     | Manually decode and validate a JWT token. Sets the internal `this._user` field.                                                                         |
| **`getVariable(key)`**        | Returns a stored variable scoped to the current handler instance.                                                                                       |
| **`setVariable(key, value)`** | Sets a variable scoped to the current handler. Can be used for temporary flags or caching.                                                              |
| **`log(...args)`**            | Logs messages to console with the handler namespace as a prefix. Useful for debugging or tracing actions.                                               |

const Registry = require("./Registry");

let jwt = null;
try {
  jwt = require("./jwt"); // optional
} catch (_) {}

class WebSocketHandler {
  constructor(namespace) {
    if (!namespace) {
      const className = this.constructor.name;
      namespace = className.replace(/Handler$/, "").toLowerCase();
    }

    this._namespace = namespace;
    Registry.register(namespace, this);
    this._variables = new Map();

    // 👇 Set public method list here
    this.publicCommands = []; // can be overridden in child
  }

  // Called for each new command dispatch
  setContext(context) {
    this.ws = context.ws;
    this.wss = context.wss;
    this.command = context.command;
    this.body = context.body || {};
    this.token = this.body.token || null;
    this._user = null;

    // Already authenticated on this socket
    if (this.ws._authenticated) {
      this._user = this.ws._user;
      return;
    }

    if (this.token && jwt) {
      const user = jwt.verify(this.token);
      if (user) {
        this._user = user;
        this.ws._authenticated = true;
        this.ws._user = user;
      }
    }
  }

  // Client send
  send(payload) {
    try {
      this.ws.send(JSON.stringify(payload));
    } catch (_) {}
  }

  // Send to everyone (including self)
  broadcast(payload) {
    const msg = JSON.stringify(payload);
    for (const client of this.wss.clients) {
      if (client.readyState === 1) client.send(msg);
    }
  }

  // Send to all except self
  onlyOthers(payload) {
    const msg = JSON.stringify(payload);
    for (const client of this.wss.clients) {
      if (client !== this.ws && client.readyState === 1) {
        client.send(msg);
      }
    }
  }

  log(...args) {
    console.log(`[${this._namespace}]`, ...args);
  }

  // Per-handler state
  getVariable(key) {
    return this._variables.get(key);
  }

  setVariable(key, value) {
    this._variables.set(key, value);
  }

  get user() {
    return this._user;
  }

  authenticate(token) {
    if (!jwt) throw new Error("JWT module not available");

    const user = jwt.verify(token);
    if (!user) throw new Error("Invalid token");

    // Save auth state to the socket
    this._user = user;
    this.ws._authenticated = true;
    this.ws._user = user;

    return user;
  }

  logout() {
    this._user = null;
    this.ws._authenticated = false;
    this.ws._user = null;
  }

  requireAuth() {
    console.log(this._user);
    if (!this._user) {
      throw new Error("Authentication required");
    }
  }

  async onBeforeDispatch(methodName) {}

  async onAfterDispatch(methodName) {}

  // ✨ AUTO AUTH CHECK
  async _dispatch(methodName, context) {
    if (typeof this[methodName] !== "function") {
      throw new Error(`Method '${methodName}' not found in ${this._namespace}`);
    }

    this.setContext(context);

    const isPublic = this.publicCommands.includes(methodName);
    if (!isPublic && !this.user) {
      return this.send({ type: "error", msg: "Authentication required" });
    }

    await this.onBeforeDispatch(methodName);
    const result = await this[methodName]();
    await this.onAfterDispatch(methodName);
    return result;
  }
}

module.exports = WebSocketHandler;

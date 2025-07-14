const WebSocketHandler = require("../core/WebSocketHandler");
const jwt = require("../core/jwt");
const { loginUser } = require("../controllers/userController");

class UserHandler extends WebSocketHandler {
  constructor() {
    super();
    this.publicCommands = ["login", "register"];
  }

  async login() {
    const { ...params } = this.body;
    const result = await loginUser(params.email, params.password);
    if (result.status == 1 && result.user) {
      result.token = jwt.sign(result.user);
      this.authenticate(result.token);
      this.send({
        msg: "Login successful",
        type: "success",
        ...result,
      });
    } else {
      this.send({
        msg: "Invalid credentials",
        type: "error",
        ...result,
      });
    }
    this.onlyOthers({ type: "info", msg: `Someone targeted login` });
    // this.broadcast({ type: "info", msg: `Someone targeted login` });
    // this.broadcastTo({ event: 'refresh' }, { role: 'admin', branch: '001' });

  }

  async logout() {
    this.send({ type: "success", msg: "Logout logic placeholder" });
    this.destroy();
  }

  async register() {
    this.send({ type: "info", msg: "Registration logic placeholder" });
  }

  async profile() {
    this.requireAuth();
    this.send({ type: "success", user: this.user });
  }

  async auth() {
    this.authenticate(this.body.token)
    this.send({ type: "success", msg: "Authenticated" });
  }
}

module.exports = new UserHandler();

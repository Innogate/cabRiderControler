const WebSocketHandler = require("../core/WebSocketHandler");
const jwt = require("../core/jwt");
//controllers
const {
  appAllotmentBooking,
} = require("../controllers/dutyController");

class DutyHandler extends WebSocketHandler {
  constructor() {
    super();
    this.publicCommands = [];
  }

  async allotBooking() {
    this.requireAuth();
    const params = {
      ...this.body,
      user_id: this._user.Id,
      company_id: this._user.company_id,
    };
    const result = await appAllotmentBooking(params);

    if (result.status == null) {
      this.send({
        type: "warn",
        msg: "Booking allotment failed!",
        ...result,
      });
    } else {
      this.send({
        for: "bookingAllotted",
        msg: "Booking successfully allotted!",
        type: "success",
        ...result,
      });
    }
  }
}

module.exports = new DutyHandler();

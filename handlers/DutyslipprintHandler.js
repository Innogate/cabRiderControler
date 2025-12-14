const { dutySlipPrint } = require("../controllers/dutySlipPrintController");
const WebSocketHandler = require("../core/WebSocketHandler");
const jwt = require("../core/jwt");

class DutySlipPrintHandler extends WebSocketHandler {
  constructor() {
    super();
    this.publicCommands = []; // No public commands
  }

  async dutySlipPrint() {
    this.requireAuth();

    const params = {
      ...this.body,
      company_id: this._user.company_id,
      user_id: this._user.Id,
    };

    const result = await dutySlipPrint(params);

    // result.StatusID --- not result.status
    if (result.StatusID === 0) {
      // Error Occurred
      this.send({
        type: "error",
        msg: result.StatusMessage || "Failed to fetch duty slip!",
        ...result,
      });
    } 
    else if (result.StatusID === 2) {
      // No Data Found
      this.send({
        type: "warn",
        msg: "No duty slip found for this Booking ID!",
        ...result,
      });
    } 
    else {
      // Success
      this.send({
        for: "dutySlipPrint",
        type: "success",
        msg: "Duty slip data retrieved successfully!",
        ...result,
      });
    }
  }
}

module.exports = new DutySlipPrintHandler();

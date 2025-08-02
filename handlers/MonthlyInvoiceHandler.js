const WebSocketHandler = require("../core/WebSocketHandler");
const jwt = require("../core/jwt");
const { getDutySetupCode } = require("../controllers/MonthlyInvoiceController");

class MInvoiceHandler extends WebSocketHandler {
  constructor() {
    super();
    this.publicCommands = [];
  }

  async getMonthlySetupCode(){
    this.requireAuth();
    const result = await getDutySetupCode(this.body);
    if (result) {
      this.send({
        type: "success",
        msg: "Booking details retrieved successfully",
        data: result,
      });
    } else {
      this.send({
        type: "error",
        msg: "Failed to retrieve Dusty Setup details",
      });
    }
  }
}
module.exports = new MInvoiceHandler();

const WebSocketHandler = require("../core/WebSocketHandler");
const jwt = require("../core/jwt");
const { getDutySetupCode } = require("../controllers/MonthlyInvoiceController");

class MInvoiceHandler extends WebSocketHandler {
  constructor() {
    super();
    this.publicCommands = [];
  }

 async getMonthlySetupCode() {
  this.requireAuth();
  const result = await getDutySetupCode(this.body);

  if (result) {
    this.send({
      type: "success",
      for: "minvoice.getMonthlySetupCode",  // ✅ Add this line
      msg: "Booking details retrieved successfully",
      data: result,
    });
  } else {
    this.send({
      type: "error",
      for: "minvoice.getMonthlySetupCode",  // ✅ Add here too (optional but consistent)
      msg: "Failed to retrieve Duty Setup details",
    });
  }
}

}
module.exports = new MInvoiceHandler();

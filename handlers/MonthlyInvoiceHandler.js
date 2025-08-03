const WebSocketHandler = require("../core/WebSocketHandler");
const jwt = require("../core/jwt");
const { getDutySetupCode, getMBookingList } = require("../controllers/MonthlyInvoiceController");

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
        for: "minvoice.getMonthlySetupCode",
        msg: "Booking details retrieved successfully",
        data: result,
      });
    } else {
      this.send({
        type: "error",
        for: "minvoice.getMonthlySetupCode",
        msg: "Failed to retrieve Duty Setup details",
      });
    }
  }

  async getMonthlyBookingList() {
    this.requireAuth();
    const params = {
      ...this.body
    }
    const result = await getMBookingList(params);

    if (result) {
      this.send({
        type: "success",
        for: "minvoice.getMonthlyBookingList",
        msg: "Booking details retrieved successfully",
        data: result,
      });
    } else {
      this.send({
        type: "error",
        for: "minvoice.getMonthlyBookingList",
        msg: "Failed to retrieve Duty Setup details",
      });
    }
  }


}
module.exports = new MInvoiceHandler();

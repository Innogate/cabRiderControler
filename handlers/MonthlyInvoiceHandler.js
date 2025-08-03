const WebSocketHandler = require("../core/WebSocketHandler");
const jwt = require("../core/jwt");
const { getDutySetupCode, getMBookingList,getAllBranch, getAllCompany } = require("../controllers/MonthlyInvoiceController");

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

  async getAllBranchDropdown() {
    this.requireAuth();
    const result = await getAllBranch(this.body);

    if (result) {
      this.send({
        type: "success",
        for: "getAllBranchDropdown",
        msg: "Booking details retrieved successfully",
        data: result,
      });
    } else {
      this.send({
        type: "error",
        for: "getAllBranchDropdown",
        msg: "Failed to retrieve Duty Setup details",
      });
    }
  }



  async getAllCompanyDropdown() {
    this.requireAuth();
    const result = await getAllCompany(this.body);

    if (result) {
      this.send({
        type: "success",
        for: "getAllCompanyDropdown",
        msg: "Booking details retrieved successfully",
        data: result,
      });
    } else {
      this.send({
        type: "error",
        for: "getAllCompanyDropdown",
        msg: "Failed to retrieve Duty Setup details",
      });
    }
  }

  async getMonthlyBookingList() {
    this.requireAuth();
    const params = {
      // company_id: this._user.company_id,
      ...this.body
    }
    const result = await getMBookingList(this.body);

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

const WebSocketHandler = require("../core/WebSocketHandler");
const jwt = require("../core/jwt");
const { getDutySetupCode, getMBookingList,getInvoiceList, createMonthlyBill, getBookingListByInvoiceId, getMonthlyBillById } = require("../controllers/MonthlyInvoiceController");

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


  async createMonthlyBilling() {
    this.requireAuth();

    const payload = {
      ...this.body,
      parent_company_id: this._user.company_id,
      user_id: this._user.Id,
    };
    const result = await createMonthlyBill(payload);
    this.send({
      type: "success",
      for: "createMonthlyBilling",
      msg: "Billing form created successfully",
      data: result, 
    });
  }



  async getMonthlyInvoiceList() {
    this.requireAuth();
    const params = {
      ...this.body,
      parent_company_id: this._user.company_id,
      user_id: this._user.Id,
    }
    const result = await getInvoiceList(params);

    if (result) {
      this.send({
        for: "minvoice.getMonthlyInvoiceList",
        data: result,
      });
    } else {
      this.send({
        type: "error",
        for: "minvoice.getMonthlyInvoiceList",
        msg: "Failed to retrieve Monthly Invoice details",
      });
    }
  }

async getBookingListByInvoiceIdService() {
  this.requireAuth();
  console.log("body", this.body);

  const { booking_entry_id, company_id } = this.body;

  if (!booking_entry_id) {
    return this.send({
      type: "error",
      for: "minvoice.getBookingListByInvoiceIdService",
      msg: "booking_entry_id is required",
    });
  }

  const params = {
    booking_entry_id,
    company_id: this._user.company_id,
  };

  console.log("[getBookingsListByMID] Final Params:", params);

  const result = await getBookingListByInvoiceId(params);

  if (result) {
    this.send({
      type: "success",
      for: "minvoice.getBookingListByInvoiceIdService",
      msg: "Monthly Invoice details retrieved successfully",
      data: result,
    });
  } else {
    this.send({
      type: "error",
      for: "minvoice.getBookingListByInvoiceIdService",
      msg: "Failed to retrieve Monthly Invoice details",
    });
  }
}


async getMonthlyInvoiceById() {
  this.requireAuth();
  const { BillId } = this.body;

  if (!BillId) {
    return this.send({
      status: 2,
      type: "error",
      for: "minvoice.getMonthlyInvoiceById",
      msg: "BillId is required",
    });
  }

  try {
    const result = await getMonthlyBillById(this.body);

    return this.send({
      status: 1,
      type: "success",
      for: "minvoice.getMonthlyInvoiceById",
      data: result,
    });

  } catch (error) {
    console.error("[getMonthlyInvoiceById] Error:", error);
    return this.send({
      status: 2,
      type: "error",
      for: "minvoice.getMonthlyInvoiceById",
      msg: error.message || "Something went wrong",
    });
  }
}
}

module.exports = new MInvoiceHandler();

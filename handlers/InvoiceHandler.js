const WebSocketHandler = require("../core/WebSocketHandler");
const jwt = require("../core/jwt");
// Controllers
const {
  getInvoiceAdjustmentDetails,
  getBookingInvoiceEntryList,
} = require("../controllers/invoiceController");

class InvoiceHandler extends WebSocketHandler {
  constructor() {
    super(); // namespace: 'user'
    this.publicCommands = [];
  }

  async search() {
    this.requireAuth();
    const params = {
      ...this.body,
      company_id: this._user.company_id,
      user_id: this._user.Id,
    };
    const result = await getInvoiceAdjustmentDetails(params);
    if (result.status != 1) {
      this.send({
        msg: "Something went wrong please try again later",
        type: "warn",
        ...result,
      });
    }
    this.send({
      for: "invoiceTableData",
      ...result,
    });
  }

  async getBookings(){
    this.requireAuth();
    const params = {
      ...this.body,
      company_id: this._user.company_id,
      user_id: this._user.Id,
    };
    console.log("Innput is : ",params)
    const result = await getBookingInvoiceEntryList(params);
    if (result.status != 1) {
      this.send({
        msg: "Something went wrong please try again later",
        type: "warn",
        ...result,
      });
    }
    this.send({
      for: "bookingInvoiceEntryList",
      ...result,
    });
    console.log("output is",result)
  }
}

module.exports = new InvoiceHandler();

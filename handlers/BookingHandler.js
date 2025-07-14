const WebSocketHandler = require("../core/WebSocketHandler");
const jwt = require("../core/jwt");
// Controllers
const { getBookingSearch } = require("../controllers/bookingController");
const { createBookingDetails } = require("../controllers/bookingController");

class BookingHandler extends WebSocketHandler {
  constructor() {
    super();
    this.publicCommands = [];
  }

  async search() {
    this.requireAuth();
    const params = {
      ...this.body,
      company_id: this._user.company_id,
      user_id: this._user.Id,
    };
    const result = await getBookingSearch(params);
    if (result.status != 1) {
      this.send({
        msg: "Something went wrong please try again later",
        type: "warn",
        ...result,
      });
    }
    this.send({
      for: "bookingTableData",
      ...result,
    });
  }

  async create() {
    this.requireAuth();
    const params = {
      ...this.body,
      company_id: this._user.company_id,
      user_id: this._user.Id,
    };
    const result = await createBookingDetails(params);
    if (result.status != 1) {
      this.send({
        msg: "Something went wrong please try again later",
        type: "warn",
        ...result,
      });
    }
    this.send({
      for: "bookingTableData",
      ...result,
    });
  }


}

module.exports = new BookingHandler();

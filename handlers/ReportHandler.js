const WebSocketHandler = require("../core/WebSocketHandler");
const jwt = require("../core/jwt");
const {
  bookingRegister,
  driverDutyDetail,
  dueInvoiceRegister,
  invoiceRegister,
} = require("../controllers/reportController");


class ReportHandler extends WebSocketHandler {
    constructor() {
        super();
        this.publicCommands = [];
    }

    async getBookingRegister() {
        this.requireAuth();
        const params = {
            ...this.body,
            company_id: this._user.company_id,
            user_id: this._user.Id,
        };
        const result = await bookingRegister(params);
        if (result.StatusID === 1) {
            this.send({
                for: "getBookingRegister",
                ...result,
            });
        } else {
            this.send({
                msg: result.StatusMessage || "Something went wrong",
                type: "error",
                ...result,
            });
        }
    }

    async getDriverDutyDetail() {
        this.requireAuth();
        const params = {
            ...this.body,
            company_id: this._user.company_id,
            user_id: this._user.Id,
        };
        const result = await driverDutyDetail(params);
        if (result) {
            this.send({
                for: "getDriverDutyDetail",
                ...result,
            });
        } else {
            this.send({
                msg: result.StatusMessage || "Something went wrong",
                type: "error",
                ...result,
            });
        }
    }

    async getDueInvoiceRegister() {
        this.requireAuth();
        const params = {
            ...this.body,
            company_id: this._user.company_id,
            user_id: this._user.Id,
        };
        const result = await dueInvoiceRegister(params);
        if (result.StatusID === 1) {
            this.send({
                for: "getDueInvoiceRegister",
                ...result,
            });
        } else {
            this.send({
                msg: result.StatusMessage || "Something went wrong",
                type: "error",
                ...result,
            });
        }
    }

    async getInvoiceRegister() {
        this.requireAuth();
        const params = {
            ...this.body,
            company_id: this._user.company_id,
            user_id: this._user.Id,
        };
        const result = await invoiceRegister(params);
        if (result.StatusID === 1) {
            this.send({
                for: "getInvoiceRegister",
                ...result,
            });
        } else {
            this.send({
                msg: result.StatusMessage || "Something went wrong",
                type: "error",
                ...result,
            });
        }
    }


}

module.exports = new ReportHandler();

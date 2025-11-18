const WebSocketHandler = require("../core/WebSocketHandler");
const { getVendorDutyCloseById, closeVendorDuty } = require("../controllers/vendorDutyCloseController");


class VendorDutyCloseHandler extends WebSocketHandler {
    constructor() {
        super();
        this.publicCommands = [];
    }

    async getVendorDutyDetailsById() {
        this.requireAuth();
        const params = {
            ...this.body,
            company_id: this._user.company_id,
            user_id: this._user.Id,
        };
        const result = await getVendorDutyCloseById(params);
        if (result?.StatusID === 1) {
            this.send({
                for: "getVendorDutyDetailsById",
                ...result,
            });
        } else {
            this.send({
                ...result,
            });
        }
    }

    async closeVendorDuty() {
        this.requireAuth();
        const params = {
            ...this.body,
            company_id: this._user.company_id,
            user_id: this._user.Id,
        };

        const result = await closeVendorDuty(params);

        if (result) {
            this.send({
                for: "closeVendorDuty",
                msg: result.StatusMessage || "Vendor duty closed successfully.",
                type: "success",
                ...result,
            });
        } else {
            this.send({ msg: result.StatusMessage || "Failed to close vendor duty.", type: "error", ...result });
        }
    }
}
module.exports = new VendorDutyCloseHandler();

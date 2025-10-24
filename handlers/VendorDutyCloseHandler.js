const WebSocketHandler = require("../core/WebSocketHandler");
const { getVendorDutyCloseById } = require("../controllers/vendorDutyCloseController");


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
}
module.exports = new VendorDutyCloseHandler();

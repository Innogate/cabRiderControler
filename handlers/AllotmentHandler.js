const WebSocketHandler = require("../core/WebSocketHandler");
const jwt = require("../core/jwt");
const { allotment } = require("../controllers/allotmentController");


class AllotmentHandler extends WebSocketHandler {
    constructor() {
        super();
        this.publicCommands = [];
    }

    async allotment() {
        this.requireAuth();
        const params = {
            ...this.body,
            company_id: this._user.company_id,
            user_id: this._user.Id,
        };
        const result = await allotment(params);
        if (result) {
            this.send({ msg: result.StatusMessage, type: "success" });
            this.broadcastTo(
                {
                    for: "createUpdateAllotment",
                    StatusID: result.StatusID,
                    data: result.data,
                },
                { company_id: this._user.company_id }
            );
        } else {
            this.send({
                msg: "Somthing Want wrong",
                type: "error",
                ...result,
            });
        }

    }



}

module.exports = new AllotmentHandler();

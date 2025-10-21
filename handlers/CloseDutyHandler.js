const WebSocketHandler = require("../core/WebSocketHandler");
const { closeDuty } = require("../controllers/closeDutyController");


class CloseDutyHandler extends WebSocketHandler {
    constructor() {
        super();
        this.publicCommands = [];
    }

    async closeDuty() {
        this.requireAuth();
        const params = {
            ...this.body,
            company_id: this._user.company_id,
            user_id: this._user.Id,
        };
        const result = await closeDuty(params);
        if (result) {
            this.send({ msg: result.StatusMessage, type: "success" });
            this.broadcastTo(
                {
                    for: "closeDuty",
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

module.exports = new CloseDutyHandler();

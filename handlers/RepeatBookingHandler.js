const { repeatBooking } = require("../controllers/repeatBookingController");
const WebSocketHandler = require("../core/WebSocketHandler");
const jwt = require("../core/jwt");


class RepeatBookingHandler extends WebSocketHandler {
    constructor() {
        super();
        this.publicCommands = [];
    }

    async repeatBooking() {
        this.requireAuth();
        const params = {
            ...this.body,
            company_id: this._user.company_id,
            user_id: this._user.Id,
        };
        const result = await repeatBooking(params);
        if (result) {
            this.send({ msg: result.StatusMessage, type: "success" });
            this.broadcastTo(
                {
                    for: "repeatBooking",
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

module.exports = new RepeatBookingHandler();

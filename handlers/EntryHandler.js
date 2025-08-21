const { createJournal, getJournalsByCompany } = require("../controllers/journalEntryController");
const WebSocketHandler = require("../core/WebSocketHandler");
const jwt = require("../core/jwt");


class EntryHandler extends WebSocketHandler {
    constructor() {
        super();
        this.publicCommands = [];
    }

    async getAllJournal() {
        this.requireAuth();
        const params = {
            ...this.body,
            company_id: this._user.company_id,
            user_id: this._user.Id,
        };
        const result = await getJournalsByCompany(params);
        if (result.StatusID === 1) {
            this.send({
                for: "getJournalsByCompany",
                ...result,
            });
        } else {
            this.send({
                msg: "No data found",
                type: "warning",
                ...result,
            });
        }
    }

    async createJournalEntry() {
        this.requireAuth();
        const params = {
            ...this.body,
            company_id: this._user.company_id,
            user_id: this._user.Id,
        };

        const result = await createJournal(params);

        if (result.StatusID === 1) {
            this.send({ msg: result.StatusMessage, type: "success" });
            this.broadcastTo(
                {
                    for: "createJournal",
                    StatusID: result.StatusID,
                    data: result.data,
                },
                { company_id: this._user.company_id }
            );
        } else if (result.StatusID === 2) {
            this.send({ msg: result.StatusMessage, type: "error" });
            this.broadcastTo(
                {
                    for: "createJournal",
                    StatusID: result.StatusID,
                    data: result.data,
                },
                { company_id: this._user.company_id }
            );
        } else {
            this.send({
                msg: result.StatusMessage || "No data found",
                type: "warning",
                ...result,
            });
        }
    }




}

module.exports = new EntryHandler();


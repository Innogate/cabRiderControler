const WebSocketHandler = require("../core/WebSocketHandler.js");
const { getPartyListDropdown, getBranchDropdownList, getCompanyDropdownList } = require("../controllers/MasterHelperController.js");

class HelperHandler extends WebSocketHandler {
    constructor() {
        super();
        this.publicCommands = [];
    }

    async getPartyDropdown() {
        this.requireAuth();
        let result = await getPartyListDropdown(
            this._user.company_id,
            this._user.Id
        );
        if (!result || result.length == 0) {
            result = [];
        }
        this.send({ "for": "partyDropdown", "data": result });
    }

    async getBranchDropdown() {
        this.requireAuth();
        let result = await getBranchDropdownList(
            this._user.company_id,
            this._user.Id
        );

        if (!result || result.length == 0) {
            result = [];
        }

        this.send({
            for: "branchDropdown",
            data: result,
        });
    }



    async getCompanyDropdown() {
        this.requireAuth();
        let result = await getCompanyDropdownList(
            this.body.company_id
        );

        if (!result || result.length == 0) {
            result = [];
        }
        this.send({
            for: "companyDropdown",
            data: result,
        });
    }
}

module.exports = new HelperHandler();

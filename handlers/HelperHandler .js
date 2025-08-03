const WebSocketHandler = require("../core/WebSocketHandler.js");
const { getPartyListDropdown, getBranchDropdownList, getCompanyDropdownList } = require("../controllers/MasterHelperController.js");

class HelperHandler extends WebSocketHandler {
    constructor() {
        super();
        this.publicCommands = [];
    }

    async getPartyDropdown() {
        this.requireAuth();
        let result = getPartyListDropdown();
        if (!result) {
            result = [];
        }
        this.send({ "for": "partyDropdown", "data": result });
    }

    async getBranchDropdown() {
        this.requireAuth();
        let result = await getBranchDropdownList(this.body);

        if (!result) {
            result = [];
        }

        this.send({
            for: "branchDropdown",
            data: result,
        });
    }



    async getCompanyDropdown() {
        this.requireAuth();
        let result = await getCompanyDropdownList(this.body);

        if (!result) {
            result = [];
        }
        this.send({
            for: "companyDropdown",
            data: result,
        });
    }
}

module.exports = new HelperHandler();

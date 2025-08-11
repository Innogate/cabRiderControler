const WebSocketHandler = require("../core/WebSocketHandler.js");
const { getPartyListDropdown, getBranchDropdownList, getCompanyDropdownList, getPartyMasterById, getOtherCharges } = require("../controllers/MasterHelperController.js");

class HelperHandler extends WebSocketHandler {
    constructor() {
        super();
        this.publicCommands = [];
    }

    async getPartyDropdown() {
        this.requireAuth();
        let result = await getPartyListDropdown();
        if (!result || result.length == 0) {
            result = [];
        }
        this.send({ "for": "partyDropdown", "data": result });
    }

    async getBranchDropdown() {
        this.requireAuth();
        let result = await getBranchDropdownList(
            this.body.company_id
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
            this._user.company_id,
            this._user.Id
        );

        if (!result || result.length == 0) {
            result = [];
        }
        this.send({
            for: "companyDropdown",
            data: result,
        });
    }

    async getPartyById() {
        this.requireAuth();
        const params = {
            ...this.body,
        };
        const result = await getPartyMasterById(params);
        this.send({
            for: "getPartyById",
            data: result[0],
        });
    }

    async getOtherChargesForBookingList(){
        this.requireAuth();
        const params = {
            ...this.body,
        };
        const result = await getOtherCharges(params);
        this.send({
            for: "getOtherChargesForBookingList",
            data: result,
        });
    }
}

module.exports = new HelperHandler();

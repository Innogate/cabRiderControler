const WebSocketHandler = require("../core/WebSocketHandler.js");
const { getPartyListDropdown, getBranchDropdownList,
    getCompanyDropdownList, getPartyMasterById, getOtherCharges,
    getOtherChargesUsingId, getOtherTaxableChargesUsingId, getOtherNonTaxableChargesUsingId,
    getMonthlyInvoice,
    getOtherTaxableChargesList, 
    getMonthlyInvoiceDutyList} = require("../controllers/MasterHelperController.js");

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

    async getOtherChargesForBookingList() {
        this.requireAuth();
        const params = {
            ...this.body,
            company_id: this._user.company_id
        };
        const result = await getOtherCharges(params);
        this.send({
            for: "getOtherChargesForBookingList",
            data: result,
        });
    }

    async getOtherChargesForMonthlyInvoice() {
        this.requireAuth();

        // Extract booking_entry_id from request body
        const { booking_entry_id } = this.body;

        if (!booking_entry_id) {
            throw new Error("booking_entry_id is required");
        }

        // Call service with only booking_entry_id
        const result = await getOtherChargesUsingId({ booking_entry_id });

        this.send({
            for: "getOtherChargesForMonthlyInvoice",
            data: result,
        });
    }


    async getTaxableOtherChargesForMonthlyInvoice() {
        this.requireAuth();

        // Extract booking_entry_id from request body
        const { booking_entry_id } = this.body;

        if (!booking_entry_id) {
            throw new Error("booking_entry_id is required");
        }

        // Call service with only booking_entry_id
        const result = await getOtherTaxableChargesUsingId({ booking_entry_id, CompanyID: this._user.company_id });

        this.send({
            for: "getOtherTaxableChargesUsingId",
            data: result,
        });
    }

    async getNonTaxableOtherChargesForMonthlyInvoice() {
        this.requireAuth();

        // Extract booking_entry_id from request body
        const { booking_entry_id } = this.body;


        if (!booking_entry_id) {
            throw new Error("booking_entry_id is required");
        }

        // Call service with only booking_entry_id
        const result = await getOtherNonTaxableChargesUsingId({ booking_entry_id, CompanyID: this._user.company_id });

        this.send({
            for: "getOtherNonTaxableChargesUsingId",
            data: result,
        });
    }



    async getTaxableChargesList() {
        this.requireAuth();
        // Extract booking_entry_id from request body
        const { booking_entry_id, taxType } = this.body;

        if (!booking_entry_id) {
            throw new Error("booking_entry_id is required");
        }

        // Call service with only booking_entry_id
        const result = await getOtherTaxableChargesList({ booking_entry_id, CompanyID: this._user.company_id, taxType: taxType });

        this.send({
            for: "taxableChargesList",
            data: result,
        });
    }

    // async getPartyinfoForPdf() {
    //     this.requireAuth();

    //         const params = {
    //     InvoiceID: this.body.invoice_id,  // convert to number
    //     CompanyID: this._user.company_id
    // };

    //     console.log("Input is : ", params);

    //     const result = await getMonthlyInvoice(params);

    //     if (result.status != 1) {
    //         this.send({
    //             msg: "Something went wrong, please try again later",
    //             type: "warn",
    //             ...result,
    //         });
    //         return;
    //     }

    //     this.send({
    //         for: "getPartyInfoForPdf",
    //         ...result,
    //     });

    //     console.log("Output is : ", result);
    // }

    async getPartyinfoForPdf() {
        this.requireAuth();

        // Extract invoice_id from the request body
        const invoiceId = this.body.invoice_id;

        // Validate and convert to number
        if (!invoiceId) {
            this.send({
                msg: "Invoice ID is required",
                type: "warn"
            });
            return;
        }

        const InvoiceID = Number(invoiceId);
        const CompanyID = Number(this._user.company_id);

        // Call the SP with parameters
        let result = await getMonthlyInvoice(InvoiceID, CompanyID);

        // If no data, return empty array
        if (!result || result.length === 0) {
            result = [];
        }

        this.send({
            for: "partyinfo",
            data: result
        });
    }

    async getMonthlyInvoiceDutyList() {
        this.requireAuth();
        // Extract invoice_id from the request body
        const invoiceId = this.body.invoice_id;
        console.log("invoiceId", invoiceId)

        // Validate and convert to number
        if (!invoiceId) {
            this.send({
                msg: "Invoice ID is required",
                type: "warn"
            });
            return;
        }

        const InvoiceID = Number(invoiceId);
        const CompanyID = Number(this._user.company_id);

        console.log("InvoiceID", InvoiceID)
        console.log("CompanyID", CompanyID)

        // Call the SP with parameters
        let result = await getMonthlyInvoiceDutyList({InvoiceID, CompanyID});

        // If no data, return empty array
        if (!result || result.length === 0) {
            result = [];
        }

        this.send({
            for: "getMonthlyInvoiceDutyList",
            data: result
        });
    }


}

module.exports = new HelperHandler();

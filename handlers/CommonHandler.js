const WebSocketHandler = require("../core/WebSocketHandler");
const jwt = require("../core/jwt");

// Controllers
const {
  gatAllCityList,
  gatAllDriverListDropdown,
  deleteTableData,
  gatAllBranchListDropdown,
  getAllPartyDropDown,
  getAllPartyRateByCityDropdown,
  getAllCompanyDropdown,
  getAllVendorDropdown,
} = require("../controllers/comonApiController");

class CommonHandler extends WebSocketHandler {
  constructor() {
    super();
    this.publicCommands = [];
  }

  async gatAllCityDropDown() {
    this.requireAuth();
    const params = {
      ...this.body,
      company_id: this._user.company_id,
      user_id: this._user.Id,
    };
    const result = await gatAllCityList(params);
    if (result?.data?.length > 0) {
      this.send({
        for: "getAllCityDropdown",
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

  async deleteData() {
    this.requireAuth();
    const params = {
      ...this.body,
      company_id: this._user.company_id,
      user_id: this._user.Id,
    };
    const result = await deleteTableData(params);
    if (result) {
      this.send({
        for: "deleteData",
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

  async gatAllDriverDropDown() {
    this.requireAuth();
    const params = {
      ...this.body,
      company_id: this._user.company_id,
      user_id: this._user.Id,
    };
    const result = await gatAllDriverListDropdown(params);
    if (result?.data?.length > 0) {
      this.send({
        for: "getAllDriverDropdown",
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

  async gatAllBranchDropDown() {
    this.requireAuth();
    const params = {
      ...this.body,
      company_id: this._user.company_id,
      user_id: this._user.Id,
    };
    const result = await gatAllBranchListDropdown(params);
    if (result?.data?.length > 0) {
      this.send({
        for: "getAllBranchDropdown",
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

  async getAllPartyNameDropdown() {
    this.requireAuth();
    const params = {
      ...this.body,
      company_id: this._user.company_id,
      user_id: this._user.Id,
    };
    const result = await getAllPartyDropDown(params);
    if (result?.data?.length > 0) {
      this.send({
        for: "getAllPartyDropdown",
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

  async getAllPartyRateByCity() {
    this.requireAuth();
    const params = {
      ...this.body,
      company_id: this._user.company_id,
      user_id: this._user.Id,
    };
    const result = await getAllPartyRateByCityDropdown(params);
    if (result?.data?.length > 0) {
      this.send({
        for: "getAllPartyRateByCityDropdown",
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

  async getAllCompany() {
    this.requireAuth();
    const params = {
      company_id: this._user.company_id,
      user_id: this._user.Id,
    };
    const result = await getAllCompanyDropdown(params);
    if (result?.data) {
      this.send({
        for: "getAllCompanyDropdown",
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


  async getAllVendor() {
    this.requireAuth();
    const params = {
      company_id: this._user.company_id,
      user_id: this._user.Id,
    };
    const result = await getAllVendorDropdown(params);
    if (result?.data) {
      this.send({
        for: "getAllVendorDropdown",
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


}

module.exports = new CommonHandler();

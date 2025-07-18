const WebSocketHandler = require("../core/WebSocketHandler");
const jwt = require("../core/jwt");
// Controllers
const {
  gateAllCartype,
  createCartype,
  deleteCartype,
} = require("../controllers/carTypeMasterController");
const {
  gatAllChargesList,
  create_update_charges,
  deleteCharges,
} = require("../controllers/chargeListMasterController");
const {
  gatAllDriverList,
  create_update_driver,
} = require("../controllers/driverMasterController");
const {
  gatAllDriverSalarySetupList,
} = require("../controllers/driverSalarySetupMasterController");
const {
  getAllPartyRateList,
  createUpdatePartyRate,
} = require("../controllers/partyRateMasterController");
const {
  gatAllPartyMaster,
  createUpdateParty,
} = require("../controllers/partyMasterController");
const { gateAllVendor, createUpdateVendorMaster } = require("../controllers/vendorMasterController");
const { gateAllGuest, createUpdateGuest } = require("../controllers/guestMasterController");
const { getAllUserList, createUpdateUser } = require("../controllers/userMasterController")
const { getAllMonthlyDuty, createUpdateMonthlyDuty } = require("../controllers/monthlyDutyMasterController")

class MasterHandler extends WebSocketHandler {
  constructor() {
    super();
    this.publicCommands = [];
  }

  async getCarTypes() {
    this.requireAuth();
    const params = {
      ...this.body,
      company_id: this._user.company_id,
      user_id: this._user.Id,
    };
    const result = await gateAllCartype(params);
    if (result?.data?.length > 0) {
      this.send({
        for: "CarTypeGate",
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

  async createCartype() {
    this.requireAuth();
    const params = {
      ...this.body,
      company_id: this._user.company_id,
      user_id: this._user.Id,
    };
    const result = await createCartype(params);
    if (result) {
      this.send({
        for: "CarTypeAddUpdate",
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

  async deleteCartype() {
    this.requireAuth();
    const params = {
      ...this.body,
    };

    const result = await deleteCartype(params);
    if (result) {
      this.send({
        for: "CarTypeDel",
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

  async gatAllChargesList() {
    this.requireAuth();
    const params = {
      ...this.body,
      company_id: this._user.company_id,
      user_id: this._user.Id,
    };
    const result = await gatAllChargesList(params);
    if (result) {
      this.send({
        for: "gatAllCharges",
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

  async createUpdateChargesMaster() {
    this.requireAuth();
    const params = {
      ...this.body,
      company_id: this._user.company_id,
      user_id: this._user.Id,
    };

    const result = await create_update_charges(params);
    if (result) {
      this.send({
        for: "chargesAddUpdate",
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

  async deleteCharges() {
    this.requireAuth();
    const params = {
      ...this.body,
      company_id: this._user.company_id,
      user_id: this._user.Id,
    };
    const result = await deleteCharges(params);
    if (result) {
      this.send({
        for: "chargesDelete",
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

  async gatAllDriver() {
    this.requireAuth();
    const params = {
      ...this.body,
      company_id: this._user.company_id,
      user_id: this._user.Id,
    };
    const result = await gatAllDriverList(params);
    if (result) {
      this.send({
        for: "getalldriver",
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

  async createUpdateDriver() {
    this.requireAuth();
    const params = {
      ...this.body,
      company_id: this._user.company_id,
      user_id: this._user.Id,
    };
    const result = await create_update_driver(params);
    if (result) {
      this.send({
        for: "CreateUpdateDriver",
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

  async gatAllDriverSalary() {
    this.requireAuth();
    const params = {
      ...this.body,
      company_id: this._user.company_id,
      user_id: this._user.Id,
    };
    const result = await gatAllDriverSalarySetupList(params);
    if (result) {
      this.send({
        for: "getalldriversalarysetup",
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

  async getAllPartyRate() {
    this.requireAuth();
    const params = {
      ...this.body,
      company_id: this._user.company_id,
      user_id: this._user.Id,
    };
    const result = await getAllPartyRateList(params);
    if (result) {
      this.send({
        for: "getallpartyrate",
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

async createUpdatePartyRateMaster() {
  this.requireAuth();

  const params = {
    ...this.body,
    postJsonData: JSON.stringify(this.body.postJsonData), // 👈 serialize it
    company_id: this._user.company_id,
    user_id: this._user.Id
  }

  console.log("params", params);

  const result = await createUpdatePartyRate(params);
  console.log("result", result);

  if (result) {
    this.broadcastTo({
      for: "createUpdatePartyRate",
      ...result
    }, { company_id: this._user.company_id });
  } else {
    this.send({
      StatusMessage: "Failed to add data",
      data: result.data
    });
  }
}


  async gatAllParty() {
    this.requireAuth();
    const params = {
      ...this.body,
      company_id: this._user.company_id,
      user_id: this._user.Id,
    };
    const result = await gatAllPartyMaster(params);
    if (result) {
      this.send({
        for: "getAllParty",
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

  async createUpdateParty() {
    this.requireAuth();
    const params = {
      ...this.body,
      company_id: this._user.company_id,
      user_id: this._user.Id,
    };
    const result = await createUpdateParty(params);
    if (result) {
      // this.send({
      //   for: "createUpdateParty",
      //   ...result,
      // });
      this.broadcastTo({
        for: "createUpdateParty",
        ...result
      }, { company_id: this._user.company_id })
    } else {
      this.send({
        msg: "No data found",
        type: "warning",
        ...result,
      });
    }
  }

  //get all vendor master

  async gatAllVendorMaster() {
    this.requireAuth();
    const params = {
      ...this.body,
      company_id: this._user.company_id,
      user_id: this._user.Id,
    };
    const result = await gateAllVendor(params);
    if (result) {
      this.send({
        for: "getallvendor",
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

  // create update vendor master
  async createUpdateVendor() {
    this.requireAuth();
    const params = {
      ...this.body,
      company_id: this._user.company_id,
      user_id: this._user.Id,
    };
    const result = await createUpdateVendorMaster(params);
    if (result) {
      this.broadcastTo({
        for: "createUpdateVendorMaster",
        ...result
      }, { company_id: this._user.company_id })
    } else {
      this.send({
        msg: "No data found",
        type: "warning",
        ...result,
      });
    }
  }

  async gatAllGuestMaster() {
    this.requireAuth();
    const params = {
      ...this.body,
      company_id: this._user.company_id,
      user_id: this._user.Id,
    };
    const result = await gateAllGuest(params);
    if (result) {
      this.send({
        for: "getallguest",
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

  /// user list
  async getAllUserMaster() {
    this.requireAuth();
    const params = {
      ...this.body,
      company_id: this._user.company_id,
      user_id: this._user.Id,
    };
    const result = await getAllUserList(params);
    if (result) {
      this.send({
        for: "getAllUserList",
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


  // create update user master
  async createUpdateUserMaster() {
    this.requireAuth();
    const params = {
      ...this.body,
      user_id: this._user.Id,
      company_id: this._user.company_id
    }

    const result = await createUpdateUser(params)

    if (result.StatusID === 1) {
      this.broadcastTo({
        for: "createUpdateUser",
        ...result
      }, { company_id: this._user.company_id })
    } else {
      this.send({
        msg: result.StatusMessage,
        type: "error",
        ...result,
      });
    }
  }




  
  async getAllMonthlyDutyMaster() {
    this.requireAuth();
    const params = {
      ...this.body,
      company_id: this._user.company_id,
      user_id: this._user.Id,
    };
    const result = await getAllMonthlyDuty(params);
    if (result) {
      this.send({
        for: "getAllMonthlyDutyList",
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

module.exports = new MasterHandler();

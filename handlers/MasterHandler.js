const WebSocketHandler = require("../core/WebSocketHandler");
const jwt = require("../core/jwt");
// Controllers
const {
  gateAllCartype,
  createCartype,
  deleteCartype,
} = require("../controllers/carTypeMasterController");
const {
  deleteCharges,
  getAllChargesList,
  createUpdateCharges,
} = require("../controllers/chargeListMasterController");
const {
  gatAllDriverList,
  create_update_driver,
} = require("../controllers/driverMasterController");
const {
  getAllDriverSalarySetupList,
  createDriverSalarySetupList,
} = require("../controllers/driverSalarySetupMasterController");
const {
  getAllPartyRateList,
  createUpdatePartyRate,
} = require("../controllers/partyRateMasterController");
const {
  gatAllPartyMaster,
  createUpdateParty,
} = require("../controllers/partyMasterController");
const { gateAllVendor } = require("../controllers/vendorMasterController");
const {
  getAllUserList,
  createUpdateUser,
} = require("../controllers/userMasterController");
const {
  getAllMonthlyDuty,
  createUpdateMonthlyDuty,
} = require("../controllers/monthlyDutyMasterController");
const {
  getAllGuest,
  updateGuest,
  createGuest,
} = require("../controllers/guestMasterController");
const {
  getAllGlList,
  getAllGlTypes,
  createGl,
  updateGl,
} = require("../controllers/glMasterController");

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
    if (result.StatusID === 1) {
      this.send({ msg: "Data Insert Updated", type: "success" });
      this.broadcastTo(
        {
          for: "CarTypeAddUpdate",
          StatusID: result.StatusID,
          data: result.data,
        },
        { company_id: this._user.company_id }
      );
    } else if (result.StatusID === 2) {
      this.send({ msg: "Cartype name alrady exit", type: "error" });
      this.broadcastTo(
        {
          for: "CarTypeAddUpdate",
          StatusID: result.StatusID,
          data: result.data,
        },
        { company_id: this._user.company_id }
      );
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
      this.send({ msg: "Delete Data", type: "success" });
      this.broadcastTo(
        {
          for: "CarTypeDel",
          StatusID: result.StatusID,
          data: result.data || null,
        },
        { company_id: this._user.company_id }
      );
    } else {
      this.send({
        msg: "No data found",
        type: "warning",
        ...result,
      });
    }
  }

  async getAllChargesList() {
    this.requireAuth();
    const params = {
      ...this.body,
      company_id: this._user.company_id,
      user_id: this._user.Id,
    };
    const result = await getAllChargesList(params);
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

    try {
      const params = {
        ...this.body,
        company_id: this._user.company_id,
        user_id: this._user.Id,
      };

      const result = await createUpdateCharges(params);

      if (result?.StatusID === 1) {
        this.send({ msg: result.StatusMessage, type: "success" });

        this.broadcastTo(
          {
            for: "chargesAddUpdate",
            StatusID: result.StatusID,
            data: result.data || null,
          },
          { company_id: this._user.company_id }
        );
      } else {
        this.send({
          msg: result?.msg || "Something went wrong",
          type: "warning",
          ...result,
        });
      }
    } catch (error) {
      this.send({
        msg: "An unexpected error occurred. Please try again.",
        type: "error",
        error: error.message || error,
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
    if (result.StatusID === 1) {
      this.send({ msg: result.StatusMessage, type: "success" });
      this.broadcastTo(
        {
          for: "CreateUpdateDriver",
          StatusID: result.StatusID,
          data: result.data || null,
        },
        { company_id: this._user.company_id }
      );
    } else {
      this.send({
        msg: "No data found",
        type: "warning",
        ...result,
      });
    }
  }

  async getAllDriverSalary() {
    this.requireAuth();
    const params = {
      ...this.body,
      company_id: this._user.company_id,
      user_id: this._user.Id,
    };
    const result = await getAllDriverSalarySetupList(params);
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

  async createDriverSalarySetup() {
    this.requireAuth();
    const params = {
      ...this.body,
      company_id: this._user.company_id,
      user_id: this._user.Id,
    };
    const result = await createDriverSalarySetupList(params);
    if (result) {
      this.broadcastTo(
        {
          for: "createDriverSalarySetupList",
          ...result,
        },
        { company_id: this._user.company_id }
      );
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
      user_id: this._user.Id,
    };

    console.log("params", params);

    const result = await createUpdatePartyRate(params);
    console.log("result", result);

    if (result) {
      this.broadcastTo(
        {
          for: "createUpdatePartyRate",
          ...result,
        },
        { company_id: this._user.company_id }
      );
    } else {
      this.send({
        StatusMessage: "Failed to add data",
        data: result.data,
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
      this.broadcastTo(
        {
          for: "createUpdateParty",
          ...result,
        },
        { company_id: this._user.company_id }
      );
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
      this.broadcastTo(
        {
          for: "createUpdateVendorMaster",
          ...result,
        },
        { company_id: this._user.company_id }
      );
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
    const result = await getAllGuest(params);
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
      company_id: this._user.company_id,
    };

    const result = await createUpdateUser(params);

    if (result.StatusID === 1) {
      this.broadcastTo(
        {
          for: "createUpdateUser",
          ...result,
        },
        { company_id: this._user.company_id }
      );
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

  async createUpdateMonthlyDutyMaster() {
    this.requireAuth();
    const params = {
      ...this.body,
      company_id: this._user.company_id,
      user_id: this._user.Id,
    };
    const result = await createUpdateMonthlyDuty(params);
    if (result) {
      this.broadcastTo(
        {
          for: "createUpdateMonthlyDuty",
          ...result,
        },
        { company_id: this._user.company_id }
      );
    } else {
      this.send({
        StatusMessage: result.StatusMessage,
        data: result.data,
      });
    }
  }

  async createGuestMaster() {
    this.requireAuth();
    const params = {
      ...this.body,
      company_id: this._user.company_id,
      user_id: this._user.Id,
    };
    const result = await createGuest(params);
    if (result) {
      this.broadcastTo(
        {
          for: "createUpdateGuest",
          ...result,
        },
        { company_id: this._user.company_id }
      );
    } else {
      this.send({
        msg: result.StatusMessage,
        type: "warning",
        ...result,
      });
    }
  }

  async updateGuestMaster() {
    this.requireAuth();
    const params = {
      ...this.body,
      company_id: this._user.company_id,
      user_id: this._user.Id,
    };
    const result = await updateGuest(params);
    if (result.StatusID === 1) {
      this.broadcastTo(
        {
          for: "UpdateGuest",
          ...result,
        },
        { company_id: this._user.company_id }
      );
    } else {
      this.send({
        StatusMessage: result.StatusMessage,
        StatusID: result.StatusID,
        data: result.data,
      });
    }
  }

  async getAllGlMaster() {
    this.requireAuth();
    const params = {
      ...this.body,
      company_id: this._user.company_id,
      user_id: this._user.Id,
    };
    const result = await getAllGlList(params);
    if (result) {
      this.send({
        for: "getAllGlList",
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

  async getAllGlTypeDropdown() {
    this.requireAuth();
    const params = {
      ...this.body,
    };
    const result = await getAllGlTypes(params);
    if (result) {
      this.send({
        for: "getAllGlTypes",
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

  async createGlMaster() {
    this.requireAuth();

    try {
      const params = {
        ...this.body,
        company_id: this._user.company_id,
        user_id: this._user.Id,
      };

      const result = await createGl(params);

      if (result?.StatusID === 1) {
        this.send({ msg: result.StatusMessage, type: "success" });

        this.broadcastTo(
          {
            for: "createGl",
            StatusID: result.StatusID,
            data: result.data || null,
          },
          { company_id: this._user.company_id }
        );
      } else {
        this.send({
          msg: result?.msg || "Something went wrong",
          type: "warning",
          ...result,
        });
      }
    } catch (error) {
      this.send({
        msg: "An unexpected error occurred. Please try again.",
        type: "error",
        error: error.message || error,
      });
    }
  }

  async updateGlMaster() {
    this.requireAuth();

    try {
      const params = {
        ...this.body,
        company_id: this._user.company_id,
        user_id: this._user.Id,
      };

      const result = await updateGl(params);

      if (result?.StatusID === 1) {
        this.send({ msg: result.StatusMessage, type: "success" });

        this.broadcastTo(
          {
            for: "updateGl",
            StatusID: result.StatusID,
            data: result.data || null,
          },
          { company_id: this._user.company_id }
        );
      } else {
        this.send({
          msg: result?.msg || "Something went wrong",
          type: "warning",
          ...result,
        });
      }
    } catch (error) {
      this.send({
        msg: "An unexpected error occurred. Please try again.",
        type: "error",
        error: error.message || error,
      });
    }
  }
}

module.exports = new MasterHandler();

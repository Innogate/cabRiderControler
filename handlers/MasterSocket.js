const { gateAllCartype, createCartype, deleteCartype } = require("../controllers/carTypeMasterController");
const { gatAllChargesList, create_update_charges, deleteCharges } = require("../controllers/chargeListMasterController");
const { gatAllDriverList, create_update_driver } = require("../controllers/driverMasterController");
const { gatAllDriverSalarySetupList } = require("../controllers/driverSalarySetupMasterController")






const { gatAllPartyRateList } = require("../controllers/partyRateMasterController");
const { gatAllPartyMaster, createUpdateParty } = require("../controllers/partyMasterController")
const { gateAllVendor } = require("../controllers/vendorMasterController")
module.exports = async function handleWS(context) {
  try {
    const { ws, type, command, body, parts, clients } = context;
    console.log("part", parts);
    console.log("User", ws._user);

    // car type master

    if (type === "POST" && parts[0] === "getCarTypes") {
      const user = ws._user;

      const params = {
        ...body,
        company_id: user?.company_id,
        user_id: user?.Id
      };
      try {
        const result = await gateAllCartype(params);
        if (result?.data?.length > 0) {
          ws.send(
            JSON.stringify({
              for: 'CarTypeGate',
              ...result,
            })
          );
        } else {
          ws.send(
            JSON.stringify({
              msg: "No data found",
              type: "warning",
              ...result,
            })
          );
        }
      } catch (err) {
        console.error("getCarTypes error:", err);
        ws.send(JSON.stringify({ msg: "Server error", type: "error" }));
      }
    } else if (type === "POST" && parts[0] === "createCartype") {
      const user = ws._user;
      const params = {
        ...body,
        company_id: user?.company_id,
        user_id: user?.Id
      };
      try {
        console.log("User", ws._user);
        const result = await createCartype(params);
        if (result) {
          ws.send(
            JSON.stringify({
              for: 'CarTypeAddUpdate',
              ...result,
            })
          );
        } else {
          ws.send(
            JSON.stringify({
              msg: "No data found",
              type: "warning",
              ...result,
            })
          );
        }
      } catch (err) {
        console.error("getCarTypes error:", err);
        ws.send(JSON.stringify({ msg: "Server error", type: "error" }));
      }
    } else if (type === "POST" && parts[0] === "deleteCartype") {
      const user = ws._user;
      const params = {
        ...body
      };
      try {
        console.log("User", ws._user);
        const result = await deleteCartype(params);
        if (result) {
          ws.send(
            JSON.stringify({
              for: 'CarTypeDel',
              ...result,
            })
          );
        } else {
          ws.send(
            JSON.stringify({
              msg: "No data found",
              type: "warning",
              ...result,
            })
          );
        }
      } catch (err) {
        console.error("getCarTypes error:", err);
        ws.send(JSON.stringify({ msg: "Server error", type: "error" }));
      }
    }


    // charges list 

    else if (type === "POST" && parts[0] === "gatAllChargesList") {
      const user = ws._user;
      const params = {
        ...body,
        company_id: user?.company_id,
        user_id: user?.Id
      };
      try {
        const result = await gatAllChargesList(params);
        if (result) {
          ws.send(
            JSON.stringify({
              for: 'gatAllCharges',
              ...result,
            })
          );
        } else {
          ws.send(
            JSON.stringify({
              msg: "No data found",
              type: "warning",
              ...result,
            })
          );
        }
      } catch (err) {
        console.error("getCarTypes error:", err);
        ws.send(JSON.stringify({ msg: "Server error", type: "error" }));
      }
    }
    else if (type === "POST" && parts[0] === "createUpdateChargesMaster") {
      const user = ws._user;
      const params = {
        ...body,
        company_id: user?.company_id,
        user_id: user?.Id
      };
      try {
        console.log("User", ws._user);
        const result = await create_update_charges(params);
        if (result) {
          ws.send(
            JSON.stringify({
              for: 'chargesAddUpdate',
              ...result,
            })
          );
        } else {
          ws.send(
            JSON.stringify({
              msg: "No data found",
              type: "warning",
              ...result,
            })
          );
        }
      } catch (err) {
        ws.send(JSON.stringify({ msg: "Server error", type: "error" }));
      }
    }

    else if (type === "POST" && parts[0] === "deleteCharges") {
      const user = ws._user;
      const params = {
        ...body,
        company_id: user?.company_id,
        user_id: user?.Id
      };
      try {
        console.log("parms", params)
        const result = await deleteCharges(params);
        if (result) {
          ws.send(
            JSON.stringify({
              for: 'chargesDelete',
              ...result,
            })
          );
        } else {
          ws.send(
            JSON.stringify({
              msg: "No data found",
              type: "warning",
              ...result,
            })
          );
        }
      } catch (err) {
        ws.send(JSON.stringify({ msg: "Server error", type: "error" }));
      }
    }


    // Driver master
    else if (type === "POST" && parts[0] === "gatAllDriver") {
      const user = ws._user;
      const params = {
        ...body,
        company_id: user?.company_id,
        user_id: user?.Id
      };
      try {
        const result = await gatAllDriverList(params);
        if (result) {
          ws.send(
            JSON.stringify({
              for: 'getalldriver',
              ...result,
            })
          );
        } else {
          ws.send(
            JSON.stringify({
              msg: "No data found",
              type: "warning",
              ...result,
            })
          );
        }
      } catch (err) {
        ws.send(JSON.stringify({ msg: "Server error", type: "error" }));
      }
    } else if (type === "POST" && parts[0] === "createUpdateDriver") {
      const user = ws._user;
      const params = {
        ...body,
        company_id: user?.company_id,
        user_id: user?.Id
      };
      try {
        const result = await create_update_driver(params);
        if (result) {
          ws.send(
            JSON.stringify({
              for: 'CreateUpdateDriver',
              ...result,
            })
          );
        } else {
          ws.send(
            JSON.stringify({
              msg: "No data found",
              type: "warning",
              ...result,
            })
          );
        }
      } catch (err) {
        ws.send(JSON.stringify({ msg: "Server error", type: "error" }));
      }
    }


    // driver salary setup
    else if (type === "POST" && parts[0] === "gatAllDriverSalary") {
      const user = ws._user;
      const params = {
        ...body,
        company_id: user?.company_id,
        user_id: user?.Id
      };
      try {
        const result = await gatAllDriverSalarySetupList(params);
        if (result) {
          ws.send(
            JSON.stringify({
              for: 'getalldriversalarysetup',
              ...result,
            })
          );
        } else {
          ws.send(
            JSON.stringify({
              msg: "No data found",
              type: "warning",
              ...result,
            })
          );
        }
      } catch (err) {
        ws.send(JSON.stringify({ msg: "Server error", type: "error" }));
      }
    }

   // party rate master
    else if (type === "POST" && parts[0] === "gatAllPartyRate") {
      const user = ws._user;
      const params = {
        ...body,
        company_id: user?.company_id,
        user_id: user?.Id
      };
      try {
        const result = await gatAllPartyRateList(params);
        if (result) {
          ws.send(
            JSON.stringify({
              for: 'getallpartyrate',
              ...result,
            })
          );
        } else {
          ws.send(
            JSON.stringify({
              msg: "No data found",
              type: "warning",
              ...result,
            })
          );
        }
      } catch (err) {
        ws.send(JSON.stringify({ msg: "Server error", type: "error" }));
      }
    }



    // party master
    else if (type === "POST" && parts[0] === "gatAllParty") {
      const user = ws._user;
      const params = {
        ...body,
        company_id: user?.company_id,
        user_id: user?.Id
      };
      try {
        const result = await gatAllPartyMaster(params);
        if (result) {
          ws.send(
            JSON.stringify({
              for: 'getAllParty',
              ...result,
            })
          );
        } else {
          ws.send(
            JSON.stringify({
              msg: "No data found",
              type: "warning",
              ...result,
            })
          );
        }
      } catch (err) {
        ws.send(JSON.stringify({ msg: "Server error", type: "error" }));
      }
    }

    else if (type === "POST" && parts[0] === "createUpdatePart") {
      const user = ws._user;
      const params = {
        ...body,
        company_id: user?.company_id,
        user_id: user?.Id
      };
      try {
        const result = await createUpdateParty(params);
        if (result) {
          ws.send(
            JSON.stringify({
              for: 'createUpdateParty',
              ...result,
            })
          );
        } else {
          ws.send(
            JSON.stringify({
              msg: "No data found",
              type: "warning",
              ...result,
            })
          );
        }
      } catch (err) {
        ws.send(JSON.stringify({ msg: "Server error", type: "error", massage: err.message }));
      }
    }



    // Vendor master
 else if (type === "POST" && parts[0] === "gatAllVendorMaster") {
      const user = ws._user;
      const params = {
        ...body,
        company_id: user?.company_id,
        user_id: user?.Id
      };
      try {
        const result = await gateAllVendor(params);
        if (result) {
          ws.send(
            JSON.stringify({
              for: 'getallvendor',
              ...result,
            })
          );
        } else {
          ws.send(
            JSON.stringify({
              msg: "No data found",
              type: "warning",
              ...result,
            })
          );
        }
      } catch (err) {
        ws.send(JSON.stringify({ msg: "Server error", type: "error" }));
      }
    }


  } catch (e) {
    console.error("WS Handler Error:", e);
    context.ws.send(
      JSON.stringify({ msg: "Bad request format", type: "error" })
    );
  }
};

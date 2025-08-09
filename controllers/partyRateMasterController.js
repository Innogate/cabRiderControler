const sql = require("mssql");
const PDO = require("../core/pod.js");


exports.getAllPartyRateList = async (params) => {
  const {
    id,
    PageNo,
    PageSize,
    Search = '',
    user_id,
    company_id,
  } = params;
  const pdo = new PDO();
  const { data, output } = await pdo.callProcedure({
    procName: "sp_get_list_partyratemast",
    inputParams: [
      { name: "id", type: sql.Int, value: id },
      { name: "PageNo", type: sql.Int, value: PageNo },
      { name: "PageSize", type: sql.Int, value: PageSize },
      { name: "Search", type: sql.VarChar(200), value: Search },
      { name: "user_id", type: sql.Int, value: user_id },
      { name: "company_id", type: sql.Int, value: company_id },
    ],
    outputParams: [
      { name: "StatusID", type: sql.Int },
      { name: "StatusMessage", type: sql.VarChar(200) },
      { name: "TotalCount", type: sql.Int },
    ],
  });

  return {
    data: data,
    StatusID: output.StatusID,
    StatusMessage: output.StatusMessage,
    TotalCount: output.TotalCount
  };
};


exports.createUpdatePartyRate = async (params) => {
  const {
    id,
    party_id,
    city_id,
    postJsonData,
    PartyAddr,
    PinCode,
    GSTNo,
    ContactPersonName,
    ContactNo,
    EMailID,
    user_id,
    company_id,
  } = params;
  const pdo = new PDO();
  const { data, output } = await pdo.callProcedure({
    procName: "sp_app_create_partyratemast",
    inputParams: [
      { name: "id", type: sql.Int, value: id },
      { name: "party_id", type: sql.Int, value: party_id },
      { name: "city_id", type: sql.Int, value: city_id },
      { name: "postJsonData", type: sql.VarChar(sql.MAX), value: postJsonData},
      { name: "PartyAddr", type: sql.NVarChar(sql.MAX), value: PartyAddr },
      { name: "PinCode", type: sql.NVarChar(10), value:PinCode },
      { name: "GSTNo", type: sql.NVarChar(15), value: GSTNo},
      { name: "ContactPersonName", type: sql.NVarChar(50), value: ContactPersonName},
      { name: "ContactNo", type: sql.NVarChar(50), value: ContactNo},
      { name: "EMailID", type: sql.NVarChar(50), value: EMailID},
      { name: "user_id", type: sql.Int, value: user_id },
      { name: "company_id", type: sql.Int, value: company_id },
    ],
    outputParams: [
      { name: "StatusID", type: sql.Int },
      { name: "StatusMessage", type: sql.VarChar(200) },
      { name: "TotalCount", type: sql.Int },
    ],
  });

  return {
    data: data,
    StatusID: output.StatusID,
    StatusMessage: output.StatusMessage,
    TotalCount: output.TotalCount
  };
};
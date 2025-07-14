const sql = require("mssql");
const PDO = require("../core/pod.js");


exports.gatAllPartyMaster = async (params) => {
  const {
    id = 0,
    PageNo = 1,
    PageSize = 0,
    Search = '',
    user_id = 0,
    company_id = 0,
  } = params;
  const pdo = new PDO();
  const { data, output } = await pdo.callProcedure({
    procName: "sp_get_list_PartyMast",
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


exports.createUpdateParty = async (params) => {

  const {
    id = 0,
    party_name = '',
    address = '',
    city_id = 0,
    pin_code = '',
    mobileno = '', 
    whatsappno = '',
    gstno = '',
    panno = '',
    refby = '',
    active = '',
    crdays = 0,
    crlimit = 0.00,
    email = '',
    CGST = 0.00,
    SGST = 0.00,
    IGST = 0.00,
    phone_no = '',
    credit_days = 0,
    credit_limit = 0.00,
    tax_type = '',
    rcm = '',
    cinno = '',
    msmeno = '',
    billing_instruction = '',
    alias = '',
    user_id = 0,
    company_id = 0
  } = params;
  const pdo = new PDO();
  const { data, output } = await pdo.callProcedure({
    procName: "sp_app_create_PartyMast",
    inputParams: [
      { name: "id", type: sql.Int, value: id },
      { name: "party_name", type: sql.VarChar(500), value: party_name || '' },
      { name: "address", type: sql.VarChar(500), value: address || '' },
      { name: "city_id", type: sql.Int, value: city_id || 0 },
      { name: "pin_code", type: sql.VarChar(10), value: pin_code || '' },
      { name: "mobileno", type: sql.VarChar(15), value: mobileno || '' },
      { name: "whatsappno", type: sql.VarChar(15), value: whatsappno || '' },
      { name: "gstno", type: sql.VarChar(50), value: gstno || '' },
      { name: "panno", type: sql.VarChar(50), value: panno || '' },
      { name: "refby", type: sql.VarChar(50), value: refby || '' },
      { name: "active", type: sql.VarChar(1), value: active || '' },
      { name: "crdays", type: sql.Int, value: crdays || 0 },
      { name: "crlimit", type: sql.Money, value: crlimit || 0.00 },
      { name: "email", type: sql.VarChar(150), value: email || '' },
      { name: "CGST", type: sql.Money, value: CGST || 0.00 },
      { name: "SGST", type: sql.Money, value: SGST || 0.00 },
      { name: "IGST", type: sql.Money, value: IGST || 0.00 },
      { name: "phone_no", type: sql.VarChar(15), value: phone_no || '' },
      { name: "credit_days", type: sql.Int, value: credit_days || 0 },
      { name: "credit_limit", type: sql.Money, value: credit_limit || 0.00 },
      { name: "tax_type", type: sql.VarChar(10), value: tax_type || '' },
      { name: "rcm", type: sql.VarChar(1), value: rcm || '' },
      { name: "cinno", type: sql.VarChar(50), value: cinno || '' },
      { name: "msmeno", type: sql.VarChar(50), value: msmeno || '' },
      { name: "billing_instruction", type: sql.VarChar(500), value: billing_instruction || '' },
      { name: "alias", type: sql.VarChar(50), value: alias || '' },
      { name: "user_id", type: sql.Int, value: user_id || 0 },
      { name: "company_id", type: sql.Int, value: company_id || 0 }
    ],
    outputParams: [
      { name: "StatusID", type: sql.Int },
      { name: "StatusMessage", type: sql.VarChar(200) },
      { name: "TotalCount", type: sql.Int },
    ],
  })
  
  return {
    data: data,
    StatusID: output.StatusID,
    StatusMessage: output.StatusMessage,
    TotalCount: output.TotalCount
  };
};

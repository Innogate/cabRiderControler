const sql = require("mssql");
const PDO = require("../core/pod.js");

exports.gatAllDriverList = async (params) => {
  const {
    id = 0,
    PageNo = 1,
    PageSize = 10,
    Search = '',
    user_id = 0,
    company_id = 1,
  } = params;
  const pdo = new PDO();
  const { data, output } = await pdo.callProcedure({
    procName: "sp_get_list_DriverMast",
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



exports.create_update_driver = async (params) => {
  const {
    id,
    drv_name,
    address,
    city_id,
    pin_code,
    mobileno,
    whatsappno,
    drv_licenseno,
    drv_license_expdate,
    aadhar_cardno,
    bank_name,
    bank_branch,
    bank_acno,
    bank_actype,
    bank_ifsc,
    active,
    ref_by,
    licensePath,
    adharPath,
    enable_login,
    username,
    password,
    user_id,
    company_id
  } = params;
  const pdo = new PDO();
  const { data, output } = await pdo.callProcedure({
    procName: "sp_app_create_DriverMast",
    inputParams: [
      { name: "id", type: sql.Int, value: id },
      { name: "drv_name", type: sql.VarChar(50), value: drv_name },
      { name: "address", type: sql.VarChar(500), value: address },
      { name: "city_id", type: sql.Int, value: city_id },
      { name: "pin_code", type: sql.VarChar(10), value: pin_code },
      { name: "mobileno", type: sql.VarChar(50), value: mobileno },
      { name: "whatsappno", type: sql.VarChar(50), value: whatsappno },
      { name: "drv_licenseno", type: sql.VarChar(50), value: drv_licenseno },
      { name: "drv_license_expdate", type: sql.DateTime2(7), value: drv_license_expdate },
      { name: "aadhar_cardno", type: sql.VarChar(50), value: aadhar_cardno },
      { name: "bank_name", type: sql.VarChar(50), value: bank_name },
      { name: "bank_branch", type: sql.VarChar(50), value: bank_branch },
      { name: "bank_acno", type: sql.VarChar(50), value: bank_acno },
      { name: "bank_actype", type: sql.VarChar(50), value: bank_actype },
      { name: "bank_ifsc", type: sql.VarChar(50), value: bank_ifsc },
      { name: "active", type: sql.VarChar(1), value: active },
      { name: "ref_by", type: sql.VarChar(50), value: ref_by },
      { name: "licensePath", type: sql.VarChar(200), value: licensePath },
      { name: "adharPath", type: sql.VarChar(200), value: adharPath },
      { name: "enable_login", type: sql.Int, value: enable_login },
      { name: "username", type: sql.VarChar(50), value: username },
      { name: "password", type: sql.VarChar(50), value: password },
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





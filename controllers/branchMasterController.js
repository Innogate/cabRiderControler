const sql = require("mssql");
const PDO = require("../core/pod.js");

exports.getAllBranch = async (params) => {
  const {
    id = 0,
    PageNo = 1,
    PageSize = 10,
    Search = '',
    SortColumn = '1',
    SortOrder = 'ASC',
    user_id,
    company_id,
  } = params;
  const pdo = new PDO();
  const { data, output } = await pdo.callProcedure({
    procName: "sp_get_list_BranchMast",
    inputParams: [
      { name: "id", type: sql.Int, value: id },
      { name: "PageNo", type: sql.Int, value: PageNo },
      { name: "PageSize", type: sql.Int, value: PageSize },
      { name: "Search", type: sql.VarChar(200), value: Search },
      { name: "SortColumn", type: sql.NVarChar(20), value: SortColumn },
      { name: "SortOrder", type: sql.NVarChar(20), value: SortOrder },
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


exports.createUpdateBranch = async (params) => {
  const {
    id,
    branch_name,
    address,
    city,
    state,
    pin_code,
    gst,
    pan,
    phone,
    email,
    short_name,
    smtp_host,
    smtp_username,
    smtp_password,
    smtp_email,
    smtp_port,
    smtp_ssl,
    wp_token,
    sms_username,
    sms_password,
    sms_sender,
    footer,
    comp_id,
    user_id,
    company_id
  } = params;

  const pdo = new PDO();

  const { data, output } = await pdo.callProcedure({
    procName: "sp_app_create_branchmast", // Change to your actual stored procedure name
    inputParams: [
      { name: "Id", type: sql.Int, value: id },
      { name: "BranchName", type: sql.VarChar(200), value: branch_name },
      { name: "Address", type: sql.VarChar(sql.MAX), value: address },
      { name: "City", type: sql.VarChar(200), value: city },
      { name: "State", type: sql.VarChar(200), value: state },
      { name: "PinCode", type: sql.VarChar(200), value: pin_code },
      { name: "Gst", type: sql.VarChar(200), value: gst },
      { name: "Pan", type: sql.VarChar(200), value: pan },
      { name: "Phone", type: sql.VarChar(200), value: phone },
      { name: "email", type: sql.VarChar(200), value: email },
      { name: "ShortName", type: sql.VarChar(200), value: short_name },
      { name: "smpt_host", type: sql.NVarChar(255), value: smtp_host },
      { name: "smtp_username", type: sql.NVarChar(255), value: smtp_username },
      { name: "smtp_password", type: sql.NVarChar(255), value: smtp_password },
      { name: "smtp_email", type: sql.NVarChar(255), value: smtp_email },
      { name: "smtp_port", type: sql.Int, value: smtp_port },
      { name: "smtp_ssl", type: sql.Bit, value: smtp_ssl },
      { name: "wp_token", type: sql.NVarChar(255), value: wp_token },
      { name: "sms_username", type: sql.NVarChar(255), value: sms_username },
      { name: "sms_password", type: sql.NVarChar(255), value: sms_password },
      { name: "sms_sender", type: sql.NVarChar(255), value: sms_sender },
      { name: "Footer", type: sql.NVarChar(255), value: footer },
      { name: "comp_id", type: sql.Int, value: comp_id },
      { name: "user_id", type: sql.Int, value: user_id },
      { name: "company_id", type: sql.Int, value: company_id }
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
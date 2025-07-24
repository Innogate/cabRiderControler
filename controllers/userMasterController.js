const sql = require("mssql");
const PDO = require("../core/pod.js");


exports.getAllUserList = async (params) => {
  const {
    id,
    PageNo,
    PageSize,
    Search,
    user_id,
    company_id,
  } = params;

  const pdo = new PDO();
  const { data, output } = await pdo.callProcedure({
    procName: "sp_get_list_UserMast",
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


exports.createUpdateUser = async (params) => {
  const {
    id,
    Name,
    mobile,
    email,
    username,
    password,
    user_id,
    company_id
  } = params;

  const pod = new PDO();
  const { data, output } = await pod.callProcedure({
    procName: "sp_app_create_Usermast",
    inputParams: [
      { name: "id", type: sql.Int, value: id },
      { name: "Name", type: sql.NVarChar(50), value: Name },
      { name: "mobile", type: sql.NVarChar(50), value: mobile },
      { name: "email", type: sql.NVarChar(50), value: email },
      { name: "username", type: sql.NVarChar(50), value: username },
      { name: "password", type: sql.NVarChar(50), value: password},
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

}

const sql = require("mssql");
const PDO = require("../config/database");


exports.gatAllPartyRateList = async (params) => {
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

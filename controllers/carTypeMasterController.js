const sql = require("mssql");
const PDO = require("../core/pod.js");

exports.gateAllCartype = async (params) => {
  const {
    id = 0,
    PageNo = 1,
    PageSize = 10,
    Search = '',
    SortColumn = '1',
    SortOrder = 'ASC',
    user_id = 0,
    company_id = 1,
  } = params;
  const pdo = new PDO();
  const { data, output } = await pdo.callProcedure({
    procName: "sp_get_list_CarTypeMast",
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


exports.createCartype = async (params) => {
  const {
    id = 0,
    car_type = '',
    index_order = 0,
    sitting_capacity = 0,
    user_id = 0,
    company_id = 1,
  } = params;
  const pdo = new PDO();
  const { data, output } = await pdo.callProcedure({
    procName: "sp_app_create_CarTypeMast",
    inputParams: [
      { name: "id", type: sql.Int, value: id },
      { name: "car_type", type: sql.NVarChar(50), value: car_type },
      { name: "index_order", type: sql.Int, value: index_order },
      { name: "sitting_capacity", type: sql.Int, value: sitting_capacity },
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


exports.deleteCartype = async (params) => {
  const {
    id = 0,
  } = params;
  const pdo = new PDO();
  const { data, output } = await pdo.callProcedure({
    procName: "sp_app_delete_CarTypeMaster",
    inputParams: [
      { name: "id", type: sql.Int, value: id },
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
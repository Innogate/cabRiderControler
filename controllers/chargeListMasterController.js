const sql = require("mssql");
const PDO = require("../config/database");

exports.gatAllChargesList = async (params) => {
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
    procName: "sp_get_list_chargesmast",
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


exports.create_update_charges = async (params) => {
  const {
    id = 0,
    charge_name = '',
    TallyName = '',
    taxable = '',
    user_id = 0,
    company_id = 1,
  } = params;
  const pdo = new PDO();
  const { data, output } = await pdo.callProcedure({
    procName: "sp_app_create_chargesmast",
    inputParams: [
      { name: "id", type: sql.Int, value: id },
      { name: "charge_name", type: sql.VarChar(50), value: charge_name },
      { name: "TallyName", type: sql.VarChar(200), value: TallyName },
      { name: "taxable", type: sql.VarChar(1), value: taxable },
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



exports.deleteCharges = async (params) => {
  const {
    table_name = '',
    column_name = '',
    column_value = '',
    user_id = 0,
    company_id = 1,
  } = params;
  const pdo = new PDO();
  const { data, output } = await pdo.callProcedure({
    procName: "sp_app_delete_data",
    inputParams: [
      {name: "table_name", type: sql.VarChar(200), value: table_name},
      {name: "column_name", type: sql.VarChar(200), value: column_name},
      {name: "column_value", type: sql.VarChar(200), value: column_value},
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

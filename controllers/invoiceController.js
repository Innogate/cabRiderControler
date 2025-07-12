const sql = require("mssql");
const PDO = require("../config/database");

exports.getInvoiceAdjustmentDetails = async (params) => {
  const {
    id = 0,
    user_id,
    company_id,
    page = 1,
    pageSize = 10,
    sortColumn = "1",
    sortOrder = "ASC",
    sub_company_id = null,
    search = "",
  } = params;

  const pdo = new PDO();

  const { data, output } = await pdo.callProcedure({
    procName: "sp_get_list_booking_entry",
    inputParams: [
      { name: "id", type: sql.Int, value: id },
      { name: "PageNo", type: sql.Int, value: page },
      { name: "PageSize", type: sql.Int, value: pageSize },
      { name: "SortColumn", type: sql.NVarChar(20), value: sortColumn },
      { name: "SortOrder", type: sql.NVarChar(20), value: sortOrder },
      { name: "sub_company_id", type: sql.Int, value: sub_company_id },
      { name: "Search", type: sql.VarChar(200), value: search },
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
    data,
    status: output.StatusID,
    message: output.StatusMessage,
    total: output.TotalCount,
  };
};

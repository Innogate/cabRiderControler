const sql = require("mssql");
const PDO = require("../core/pod.js");

exports.getAllGuest = async (params) => {
  const {
    id = 0,
    PageNo = 1,
    PageSize = 10,
    Search = '',
    SortColumn = '1',
    SortOrder = 'ASC',
    user_id = 0,
    company_id = 0,
  } = params;
  const pdo = new PDO();
  const { data, output } = await pdo.callProcedure({
    procName: "sp_get_list_GuestMast",
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

exports.createGuest = async (params) => {
  const {
    id,
    PartyID,
    GuestName,
    AddrType,
    Addrr,
    ContactNo,
    WhatsappNo,
    Email_ID,
    Honorific,
    user_id,
    company_id,
  } = params;
  const pdo = new PDO();
  const { data, output } = await pdo.callProcedure({
    procName: "sp_app_create_Guest",
    inputParams: [
      { name: "id", type: sql.Int, value: id },
      { name: "PartyID", type: sql.Int, value: PartyID },
      { name: "GuestName", type: sql.NVarChar(500), value: GuestName },
      { name: "AddrType", type: sql.NVarChar(500), value: AddrType },
      { name: "Addrr", type: sql.NVarChar(500), value: Addrr },
      { name: "ContactNo", type: sql.NVarChar(50), value: ContactNo },
      { name: "WhatsappNo", type: sql.NVarChar(50), value: WhatsappNo },
      { name: "Email_ID", type: sql.NVarChar(50), value: Email_ID },
      { name: "Honorific", type: sql.NVarChar(50), value: Honorific },
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


exports.updateGuest = async (params) =>{
  
} 


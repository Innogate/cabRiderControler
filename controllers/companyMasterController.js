const sql = require("mssql");
const PDO = require("../core/pod.js");

exports.getAllCompany = async (params) => {
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
    procName: "sp_get_list_CompanyMast",
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


exports.createUpdateCompany = async (params) => {
  const {
    id,
    companyName,
    companyAddress,
    companyPhone,
    companyEmail,
    companyWebsite,
    companyCity,
    companyGSTNo,
    companyPANNo,
    companyCGST,
    companySGST,
    companyIGST,
    companyCINNo,
    HSNCode,
    companyBenificaryName,
    companyBankAccountNo,
    companyBankAddress,
    companyBankName,
    companyBankIFSC,
    Tally_CGSTAcName,
    Tally_SGSTAcName,
    Tally_IGSTAcName,
    Tally_RndOffAcName,
    Tally_CarRentSaleAc,
    Tally_CarRentPurchaseAc,
    Tally_SaleVouchType,
    Tally_PurVouchType,
    user_id,
    company_id
  } = params;

  const pdo = new PDO();

  const { data, output } = await pdo.callProcedure({
    procName: "sp_app_create_Companymast",
    inputParams: [
      { name: "Id", type: sql.Int, value: id || 0 },
      { name: "companyName", type: sql.VarChar(200), value: companyName || '' },
      { name: "companyAddress", type: sql.VarChar(sql.MAX), value: companyAddress || '' },
      { name: "companyPhone", type: sql.VarChar(50), value: companyPhone || '' },
      { name: "companyEmail", type: sql.VarChar(200), value: companyEmail || '' },
      { name: "companyWebsite", type: sql.VarChar(200), value: companyWebsite || '' },
      { name: "companyCity", type: sql.VarChar(50), value: companyCity || '' },
      { name: "companyGSTNo", type: sql.VarChar(50), value: companyGSTNo || '' },
      { name: "companyPANNo", type: sql.VarChar(50), value: companyPANNo || '' },
      { name: "companyCGST", type: sql.VarChar(50), value: companyCGST || '' },
      { name: "companySGST", type: sql.VarChar(50), value: companySGST || '' },
      { name: "companyIGST", type: sql.VarChar(50), value: companyIGST || '' },
      { name: "companyCINNo", type: sql.VarChar(50), value: companyCINNo || '' },
      { name: "HSNCode", type: sql.VarChar(50), value: HSNCode || null },
      { name: "companyBenificaryName", type: sql.VarChar(sql.MAX), value: companyBenificaryName || '' },
      { name: "companyBankAccountNo", type: sql.VarChar(sql.MAX), value: companyBankAccountNo || '' },
      { name: "companyBankAddress", type: sql.VarChar(sql.MAX), value: companyBankAddress || '' },
      { name: "companyBankName", type: sql.VarChar(sql.MAX), value: companyBankName || '' },
      { name: "companyBankIFSC", type: sql.VarChar(sql.MAX), value: companyBankIFSC || '' },
      { name: "Tally_CGSTAcName", type: sql.NVarChar(50), value: Tally_CGSTAcName || '' },
      { name: "Tally_SGSTAcName", type: sql.NVarChar(50), value: Tally_SGSTAcName || '' },
      { name: "Tally_IGSTAcName", type: sql.NVarChar(50), value: Tally_IGSTAcName || '' },
      { name: "Tally_RndOffAcName", type: sql.NVarChar(50), value: Tally_RndOffAcName || '' },
      { name: "Tally_CarRentSaleAc", type: sql.NVarChar(50), value: Tally_CarRentSaleAc || '' },
      { name: "Tally_CarRentPurchaseAc", type: sql.NVarChar(50), value: Tally_CarRentPurchaseAc || '' },
      { name: "Tally_SaleVouchType", type: sql.NVarChar(50), value: Tally_SaleVouchType || '' },
      { name: "Tally_PurVouchType", type: sql.NVarChar(50), value: Tally_PurVouchType || '' },
      { name: "user_id", type: sql.Int, value: user_id },
      { name: "company_id", type: sql.Int, value: company_id },
    ],
    outputParams: [
      { name: "StatusID", type: sql.Int },
      { name: "StatusMessage", type: sql.VarChar(200) },
      { name: "TotalCount", type: sql.Int }
    ]
  });

  return {
    data: data,
    StatusID: output.StatusID,
    StatusMessage: output.StatusMessage,
    TotalCount: output.TotalCount
  };
};

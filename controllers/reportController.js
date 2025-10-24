const sql = require("mssql");
const PDO = require("../core/pod.js");

exports.bookingRegister = async (params) => {
  const {
    StartDate,
    EndDate,
    PartyID = "",
    Project = "",
    CityID = "",
    company_id,
    user_id,
  } = params;

  const pdo = new PDO();
  const {  data } = await pdo.callProcedure({
    procName: "spRpt_BookingRegister",
    inputParams: [
      { name: "StartDate", type: sql.SmallDateTime, value: StartDate },
      { name: "EndDate", type: sql.SmallDateTime, value: EndDate },
      { name: "PartyID", type: sql.BigInt, value: PartyID },
      { name: "Project", type: sql.NVarChar(50), value: Project },
      { name: "CityID", type: sql.BigInt, value: CityID },
      { name: "company_id", type: sql.BigInt, value: company_id },
    ],
  });

  return {
    data: data,
    StatusID: 1, // Assuming success if we get here
    StatusMessage: "Report generated successfully.",
  };
};

exports.dueInvoiceRegister = async (params) => {
  const {
    SDate,
    EDate,
    CompShortName, // This is the sub-company ID
    PartyName = "",
    CityName = "",
    ShowOnlyDueAmt = "No",
    company_id, // This is the main company ID from user context
    user_id,
  } = params;

  const pdo = new PDO();
  const { data } = await pdo.callProcedure({
    procName: "spRpt_DueInvRegister",
    inputParams: [
      { name: "SDate", type: sql.SmallDateTime, value: SDate },
      { name: "EDate", type: sql.SmallDateTime, value: EDate },
      { name: "CompanyID", type: sql.Int, value: company_id },
      { name: "CompShortName", type: sql.Int, value: CompShortName },
      { name: "PartyName", type: sql.NVarChar(50), value: PartyName },
      { name: "CityName", type: sql.NVarChar(50), value: CityName },
      { name: "ShowOnlyDueAmt", type: sql.NVarChar(10), value: ShowOnlyDueAmt },
    ],
  });

  return { data, StatusID: 1, StatusMessage: "Report generated successfully." };
};




exports.driverDutyDetail  = async (params) => {
  const {
    StartDate,
    EndDate,
    DriverName = "",
    PartyName = "",
    CityName = "",
    company_id,
    user_id,
  } = params;

  const pdo = new PDO();
  const {  data } = await pdo.callProcedure({
    procName: "spRpt_DriverDutyDetail",
    inputParams: [
      { name: "StartDate", type: sql.SmallDateTime, value: StartDate },
      { name: "EndDate", type: sql.SmallDateTime, value: EndDate },
      { name: "DriverName", type: sql.NVarChar(50), value: DriverName },
      { name: "PartyName", type: sql.NVarChar(50), value: PartyName },
      { name: "CityName", type: sql.NVarChar(50), value: CityName },
      { name: "company_id", type: sql.Int, value: company_id },
    ],
  });

  return {
    data: data,
    StatusID: 1, // Assuming success if we get here
    StatusMessage: "Report generated successfully.",
  };
};

exports.invoiceRegister = async (params) => {
  const {
    SDate,
    EDate,
    PartyName = "",
    CityName = "",
    CompanyShortName = "",
    company_id, // from context, not used in SP but good practice to have
    user_id,
  } = params;

  const pdo = new PDO();
  const { data } = await pdo.callProcedure({
    procName: "spRpt_InvoiceReg",
    inputParams: [
      { name: "SDate", type: sql.SmallDateTime, value: SDate },
      { name: "EDate", type: sql.SmallDateTime, value: EDate },
      { name: "PartyName", type: sql.NVarChar(50), value: PartyName },
      { name: "CityName", type: sql.NVarChar(50), value: CityName },
      { name: "CompanyShortName", type: sql.NVarChar(50), value: CompanyShortName },
    ],
  });

  return { data, StatusID: 1, StatusMessage: "Report generated successfully." };
};

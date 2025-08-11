const sql = require("mssql");
const PDO = require("../core/pod.js");

exports.getAllDriverSalarySetupList = async (params) => {
  const {
    id = 0,
    PageNo = 1,
    PageSize = 10,  // default matches stored proc
    Search = '',
    user_id = 0,
    company_id = 0,
  } = params;

  const pdo = new PDO();
  const { data, output } = await pdo.callProcedure({
    procName: "sp_get_list_DriverSalarySetup",
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


function convertToSQLTime(timeStr) {
  // timeStr: "08:00:00"
  const [hours, minutes, seconds] = timeStr.split(':').map(Number);
  const date = new Date();
  date.setHours(hours || 0);
  date.setMinutes(minutes || 0);
  date.setSeconds(seconds || 0);
  date.setMilliseconds(0); // ensure clean
  return date;
}

exports.createDriverSalarySetupList = async (params) => {
   const {
    id,
    branch_id,
    DriverID,
    SetupDate,
    SalaryCalcOnDaysInMonth,
    SalaryCalcOnDays,
    SalaryType,
    SalaryPerDay,
    BasicSalary,
    SundayAmt,
    WashingAmt,
    MobileAmt,
    DayTotalWorkHours,
    WorkStartTime,
    WorkEndTime,
    OTRate,
    KMRun,
    KMRunAmt,
    KhurakiStartTime,
    KhurakiEndTime,
    KhurakiAmt,
    LocalNightAmt,
    OutStationNightAmt,
    OverTimeType,
    user_id,
    company_id
  } = params;
  const pdo = new PDO();
  const { data, output } = await pdo.callProcedure({
    procName: "sp_app_create_DriverSalarySetup",
    inputParams: [
      // Input parameters all
      { name: "id", type: sql.Int, value: id },
      { name: "branch_id", type: sql.Int, value: branch_id || 0 },
      { name: "driver_id", type: sql.Int, value: DriverID},
      { name: "SetupDate", type: sql.Date, value: SetupDate || new Date() },
      { name: "SalaryCalcOnDaysInMonth", type: sql.VarChar(50), value: SalaryCalcOnDaysInMonth || '' },
      { name: "SalaryCalcOnDays", type: sql.Int, value: SalaryCalcOnDays || 0 },
      { name: "SalaryType", type: sql.VarChar(50), value: SalaryType || '' },
      { name: "SalaryPerDay", type: sql.Decimal(18, 2), value: SalaryPerDay || 0.00 },
      { name: "BasicSalary", type: sql.Decimal(18, 2), value: BasicSalary || 0.00 },
      { name: "SundayAmt", type: sql.Decimal(18, 2), value: SundayAmt || 0.00 },
      { name: "WashingAmt", type: sql.Decimal(18, 2), value: WashingAmt || 0.00 },
      { name: "MobileAmt", type: sql.Decimal(18, 2), value: MobileAmt || 0.00 },
      { name: "DayTotalWorkHours", type: sql.Decimal(18, 2), value: DayTotalWorkHours || 0.00 },
      { name: "WorkStartTime", type: sql.Time, value: convertToSQLTime(WorkStartTime)},
      { name: "WorkEndTime", type: sql.Time, value: convertToSQLTime(WorkEndTime)},
      { name: "OTRate", type: sql.Decimal(18, 2), value: OTRate || 0.00 },
      { name: "KMRun", type: sql.Decimal(18, 2), value: KMRun || 0.00 },
      { name: "KMRunAmt", type: sql.Decimal(18, 2), value: KMRunAmt || 0.00 },
      { name: "KhurakiStartTime", type: sql.Time, value: convertToSQLTime(KhurakiStartTime)},
      { name: "KhurakiEndTime", type: sql.Time, value: convertToSQLTime(KhurakiEndTime)},
      { name: "KhurakiAmt", type: sql.Decimal(18, 2), value: KhurakiAmt || 0.00 },
      { name: "LocalNightAmt", type: sql.Decimal(18, 2), value: LocalNightAmt || 0.00 },
      { name: "OutStationNightAmt", type: sql.Decimal(18, 2), value: OutStationNightAmt || 0.00 },
      { name: "OverTimeType", type: sql.NVarChar(50), value: OverTimeType || '' },
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
const sql = require("mssql");
const PDO = require("../config/database");

exports.gatAllDriverSalarySetupList = async (params) => {
  const {
    id = 0,
    PageNo = 1,
    PageSize = 0,
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

exports.createDriverSalarySetupList = async (params) => {
   const {
    id = 0,
    branch_id = 0,
    driver_id = 0,
    SetupDate = null,
    SalaryCalcOnDaysInMonth = '',
    SalaryCalcOnDays = 0,
    SalaryType = '',
    SalaryPerDay = 0.00,
    BasicSalary = 0.00,
    SundayAmt = 0.00,
    WashingAmt = 0.00,
    MobileAmt = 0.00,
    DayTotalWorkHours = 0.00,
    WorkStartTime = '00:00',
    WorkEndTime = '00:00',
    OTRate = 0.00,
    KMRun = 0.00,
    KMRunAmt = 0.00,
    KhurakiStartTime = '00:00',
    KhurakiEndTime = '00:00',
    KhurakiAmt = 0.00,
    LocalNightAmt = 0.00,
    OutStationNightAmt = 0.00,
    OverTimeType = '',
    user_id = 0,
    company_id = 0
  } = params;
  const pdo = new PDO();
  const { data, output } = await pdo.callProcedure({
    procName: "sp_app_create_DriverSalarySetup",
    inputParams: [
      // Input parameters all
      { name: "id", type: sql.Int, value: id },
      { name: "branch_id", type: sql.Int, value: branch_id || 0 },
      { name: "driver_id", type: sql.Int, value: driver_id || 0 },
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
      { name: "WorkStartTime", type: sql.Time, value: WorkStartTime},
      { name: "WorkEndTime", type: sql.Time, value: WorkEndTime || '00:00' },
      { name: "OTRate", type: sql.Decimal(18, 2), value: OTRate || 0.00 },
      { name: "KMRun", type: sql.Decimal(18, 2), value: KMRun || 0.00 },
      { name: "KMRunAmt", type: sql.Decimal(18, 2), value: KMRunAmt || 0.00 },
      { name: "KhurakiStartTime", type: sql.Time, value: KhurakiStartTime || '00:00' },
      { name: "KhurakiEndTime", type: sql.Time, value: KhurakiEndTime || '00:00' },
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
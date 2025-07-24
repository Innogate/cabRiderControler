const sql = require("mssql");
const PDO = require("../core/pod.js");


exports.getAllMonthlyDuty = async (params) => {
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
    procName: "sp_get_list_MonthlyDuty",
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


exports.createUpdateMonthlyDuty = async (params) => {
  const pdo = new PDO();
  const {
    id,
    branch_id,
    PartyID,
    UsedBy,
    CityID,
    CarTypeID,
    CarNo,
    SetupType,
    DutyAmt,
    NoofDays,
    ExceptDay,
    OutStationDuty,
    ExtraDayHrRate,
    ExtraDayKMRate,
    ExtraDayMinHr,
    CompareKMTime,
    FromTime,
    ToTime,
    TotHrs,
    ExtraMonthHrsRate,
    TotalKM,
    KMRate,
    OTRate,
    NightAmt,
    OutNightRt,
    FuelRt,
    MobilRt,
    FuelAvrg,
    MobilAvrg,
    NHaltTime,
    GrgOutTime,
    GrgInTime,
    GrgOutKM,
    GrgInKM,
    CalcOnRptTime,
    OutStationAmt,
    ExtraDesc,
    ExtraAmt,
    PerDayAmt,
    user_id,
    company_id,
  } = params;

  const { data, output } = await pdo.callProcedure({
    procName: "sp_app_create_MonthlyDuty",
    inputParams: [
      { name: "id", type: sql.Int, value: id },
      { name: "branch_id", type: sql.Int, value: branch_id },
      { name: "PartyID", type: sql.Int, value: PartyID },
      { name: "UsedBy", type: sql.NVarChar, value: UsedBy },
      { name: "CityID", type: sql.Int, value: CityID },
      { name: "CarTypeID", type: sql.Int, value: CarTypeID },
      { name: "CarNo", type: sql.NVarChar, value: CarNo },
      { name: "SetupType", type: sql.NVarChar, value: SetupType },
      { name: "DutyAmt", type: sql.Decimal(18, 2), value: DutyAmt },
      { name: "NoofDays", type: sql.Int, value: NoofDays },
      { name: "ExceptDay", type: sql.NVarChar, value: ExceptDay },
      { name: "OutStationDuty", type: sql.NVarChar, value: OutStationDuty },
      { name: "ExtraDayHrRate", type: sql.Decimal(18, 2), value: ExtraDayHrRate },
      { name: "ExtraDayKMRate", type: sql.Decimal(18, 2), value: ExtraDayKMRate },
      { name: "ExtraDayMinHr", type: sql.Decimal(18, 2), value: ExtraDayMinHr },
      { name: "CompareKMTime", type: sql.NVarChar, value: CompareKMTime },
      { name: "FromTime", type: sql.Time, value: convertToSQLTime(FromTime) },
      { name: "ToTime", type: sql.Time, value: convertToSQLTime(ToTime) },
      { name: "TotHrs", type: sql.Decimal(18, 2), value: TotHrs },
      { name: "ExtraMonthHrsRate", type: sql.Decimal(18, 2), value: ExtraMonthHrsRate },
      { name: "TotalKM", type: sql.Decimal(18, 2), value: TotalKM },
      { name: "KMRate", type: sql.Decimal(18, 2), value: KMRate },
      { name: "OTRate", type: sql.Decimal(18, 2), value: OTRate },
      { name: "NightAmt", type: sql.Decimal(18, 2), value: NightAmt },
      { name: "OutNightRt", type: sql.Decimal(18, 2), value: OutNightRt },
      { name: "FuelRt", type: sql.Decimal(18, 2), value: FuelRt },
      { name: "MobilRt", type: sql.Decimal(18, 2), value: MobilRt },
      { name: "FuelAvrg", type: sql.Decimal(18, 2), value: FuelAvrg },
      { name: "MobilAvrg", type: sql.Decimal(18, 2), value: MobilAvrg },
      { name: "NHaltTime", type: sql.Time, value: convertToSQLTime(NHaltTime) },
      { name: "GrgOutTime", type: sql.Time, value: convertToSQLTime(GrgOutTime) },
      { name: "GrgInTime", type: sql.Time, value: convertToSQLTime(GrgInTime)},
      { name: "GrgOutKM", type: sql.Decimal(18, 2), value: GrgOutKM },
      { name: "GrgInKM", type: sql.Decimal(18, 2), value: GrgInKM },
      { name: "CalcOnRptTime", type: sql.NVarChar, value: CalcOnRptTime},
      { name: "OutStationAmt", type: sql.Decimal(18, 2), value: OutStationAmt },
      { name: "ExtraDesc", type: sql.NVarChar, value: ExtraDesc },
      { name: "ExtraAmt", type: sql.Decimal(18, 2), value: ExtraAmt },
      { name: "PerDayAmt", type: sql.Decimal(18, 2), value: PerDayAmt },
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
    TotalCount: output.TotalCount,
  };
};

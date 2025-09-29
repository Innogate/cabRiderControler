const sql = require("mssql");
const PDO = require("../core/pod.js");

exports.getBookingDetails = async (params) => {
  const {
    id = 0,
    pageNo = 1,
    pageSize = 10,
    search = "",
    from_date = null,
    to_date = null,
    user_id,
    company_id,
  } = params;
  const pdo = new PDO();

  const { data, output } = await pdo.callProcedure({
    procName: "sp_get_list_BookingDetails",
    inputParams: [
      { name: "id", type: sql.Int, value: id },
      { name: "PageNo", type: sql.Int, value: pageNo },
      { name: "PageSize", type: sql.Int, value: pageSize },
      { name: "Search", type: sql.VarChar(200), value: search },
      { name: "from_date", type: sql.VarChar(200), value: from_date },
      { name: "to_date", type: sql.VarChar(200), value: to_date },
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

exports.getBookingSearch = async (params) => {
  const {
    pageNo = 1,
    pageSize = 10,
    searchValue = "",
    from_date,
    to_date,
    status = "All",
    sortBy = "id desc",
    user_id,
    company_id,
  } = params;

  const pdo = new PDO();

  const { data, output } = await pdo.callProcedure({
    procName: "sp_get_list_Booking_search",
    inputParams: [
      { name: "PageNo", type: sql.Int, value: pageNo },
      { name: "PageSize", type: sql.Int, value: pageSize },
      { name: "SearchValue", type: sql.NVarChar(50), value: searchValue },
      { name: "from_date", type: sql.VarChar(200), value: from_date },
      { name: "to_date", type: sql.VarChar(200), value: to_date },
      { name: "Status", type: sql.NVarChar(50), value: status },
      { name: "sortBy", type: sql.NVarChar(250), value: sortBy },
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

exports.createBookingDetails = async (params) => {
  const {
    id = 0,
    EntryDate,
    EntryTime,
    RentalDate,
    ReportingDatetime,
    DutyType,
    Party,
    ReportAt = "",
    Email = "",
    Flight_train_No = "",
    Project = "",
    CarType,
    DropAt = "",
    BookingMode,
    BookedBy = "",
    FromCityID,
    ToCityID,
    ContactNo,
    postJsonData,
    PartyRateType,
    PartyRate,
    Price,
    KMRate,
    HourRate,
    BookedEmail = "",
    branch_id,
    isCash = 0,
    Advance = 0,
    user_id,
    company_id,
  } = params;

  const pdo = new PDO();

  const { data, output } = await pdo.callProcedure({
    procName: "sp_app_create_bookingdetails",
    inputParams: [
      { name: "id", type: sql.Int, value: id },
      { name: "EntryDate", type: sql.VarChar(100), value: EntryDate },
      { name: "EntryTime", type: sql.VarChar(100), value: EntryTime },
      { name: "RentalDate", type: sql.DateTime, value: RentalDate },
      { name: "ReportingDatetime", type: sql.VarChar(100), value: ReportingDatetime },
      { name: "DutyType", type: sql.VarChar(100), value: DutyType },
      { name: "Party", type: sql.Int, value: Party },
      { name: "ReportAt", type: sql.VarChar(100), value: ReportAt },
      { name: "Email", type: sql.VarChar(100), value: Email },
      { name: "Flight_train_No", type: sql.VarChar(50), value: Flight_train_No },
      { name: "Project", type: sql.VarChar(100), value: Project },
      { name: "CarType", type: sql.Int, value: CarType },
      { name: "DropAt", type: sql.VarChar(500), value: DropAt },
      { name: "BookingMode", type: sql.VarChar(100), value: BookingMode },
      { name: "BookedBy", type: sql.VarChar(100), value: BookedBy },
      { name: "FromCityID", type: sql.Int, value: FromCityID },
      { name: "ToCityID", type: sql.Int, value: ToCityID },
      { name: "ContactNo", type: sql.VarChar(50), value: ContactNo },
      { name: "postJsonData", type: sql.VarChar(sql.MAX), value: postJsonData },
      { name: "PartyRateType", type: sql.VarChar(50), value: PartyRateType },
      { name: "PartyRate", type: sql.Int, value: PartyRate },
      { name: "Price", type: sql.Int, value: Price },
      { name: "KMRate", type: sql.Int, value: KMRate },
      { name: "HourRate", type: sql.Int, value: HourRate },
      { name: "BookedEmail", type: sql.VarChar(100), value: BookedEmail },
      { name: "branch_id", type: sql.Int, value: branch_id },
      { name: "isCash", type: sql.Int, value: isCash },
      { name: "Advance", type: sql.Int, value: Advance },
      { name: "user_id", type: sql.Int, value: user_id },
      { name: "company_id", type: sql.Int, value: company_id },
    ],
    outputParams: [
      { name: "StatusMessage", type: sql.VarChar(200) },
      { name: "StatusID", type: sql.Int },
      { name: "TotalCount", type: sql.Int },
    ],
  });

  return {
    data,
    StatusID: output.StatusID,
    StatusMessage: output.StatusMessage,
    total: output.TotalCount,
  };
};
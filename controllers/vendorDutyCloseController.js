const sql = require("mssql");
const PDO = require("../core/pod.js");


exports.getVendorDutyCloseById = async (params) => {
    const { id, company_id } = params;
    const pdo = new PDO();

    if (!id) {
        return { StatusID: 0, StatusMessage: "Booking ID is required", data: [] };
    }

    const sqlQuery = `
  DECLARE @AMPM VARCHAR(4) = 'AMPM';
  
SELECT 
    bd.id, 
    bd.company_id,
    FORMAT(bd.RentalDate,'dd-MM-yyyy') AS RentalDate,
    bd.CarType AS cartype_id,
    CASE WHEN @AMPM = 'AMPM' 
        THEN FORMAT(CONVERT(DATETIME, bd.ReportingDatetime, 108), 'hh:mm tt') 
        ELSE LEFT(CONVERT(VARCHAR(8), bd.ReportingDatetime, 108), 5) 
    END AS ReportingDatetime,

    dt.name AS DutyType, 
    pm.party_name AS Party,
    pm.id AS party_id,
    pm.gstno AS party_gstno,
    bd.Flight_train_No,
    cm.car_type AS CarType,
    bd.DropAt, 
    bd.BookingMode, 
    bd.BookedBy,
    bd.VendorAdvanced,
    bd.Advance,
    bd.ExtraHrs,
    bd.ExtraKM,
    bd.ExtraHrsAmount,
    bd.ExtraKMAmount,

    CASE WHEN @AMPM = 'AMPM' 
        THEN FORMAT(CONVERT(DATETIME, bd.VendorGarageOutTime, 108), 'hh:mm tt') 
        ELSE LEFT(CONVERT(VARCHAR(8), bd.VendorGarageOutTime, 108), 5) 
    END AS VendorGarageOutTime,

    bd.ContactNo,
    IIF(be.BillNo IS NOT NULL, 'Billed', bd.BookingStatus) AS BookingStatus,
    bd.Email,
    FORMAT(bd.EntryDate, 'yyyy-MM-dd') AS EntryDate,
    bd.EntryTime,
    bd.SlipNo,
    bd.Project,
    cms.car_type AS CarTypeSend,
    bd.CarNo AS VehicleNo,
    bd.PartyRateType,
    bd.GarageOutKM,
    bd.ReportKM,
    bd.ReleaseKM,
    bd.GarageInKM,
    bd.TotalHour,
    bd.TotalKM,
    bd.HourRate,
    bd.KMRate,
    bd.Price,
    bd.ExtraKMRate,
    bd.ExtraHrsRate,
    CONCAT(bd.DriverName, '/', bd.DriverContact) AS driver,
    bd.NetAmt AS NetAmt,
    bd.TotalAmt,
    fc.CityName AS from_city,
    tc.CityName AS to_city,
    bd.FromCityID AS from_city_id,
    CONCAT(v.vendor_name, '/', bd.VendorContact) AS supplier,
    v.vendor_name AS Vendor_name,
    v.mobileno AS Vendor_mobile,
    bd.DriverContact,
    bs.Remarks AS Remarks,
    bd.VendorContact,
    br.branch_name,
    bd.VendorName AS vendor_id,
    bd.attachment,
    bd.VendorPartyRateType,
    bd.VendorPartyRate,
    bd.VendorGarageInKm,
    bd.VendorGarageInDate,
    bd.VendorReleaseKm,
    bd.VendorReleasingDate,
    bd.VendorReportKm,
    bd.VendorGarageOutKm,
    bd.VendorTotalKm,
    bd.VendorTotalHour,
    bd.VendorNetAmt,
    bd.VendorTotalOtherCharge,
    bd.VendorTotalAmt,
    bd.VendorExtraHrs,
    bd.VendorExtraHrsRate,
    bd.VendorExtraHrsAmount,

    bd.VendorExtraKM,
    bd.VendorExtraKMRate,
    bd.VendorExtraKMAmount,

    bd.VendorReportDate,
    bd.VendorGarageOutDate,
    bd.HigherRate,

    bd.VendorKMRate,
    bd.VendorHourRate,
    bd.VendorPrice,
    bd.VendorCalon,
    bd.vendor_extra_hrs_rate,
    bd.vendor_extra_km_rate,
    bd.VendorBasePrice,
    bd.vendor_min_hour,

    CONCAT(bd.DriverName, '/', bd.DriverContact) AS DriverName,
    bd.GarageOutTime,
    FORMAT(bd.GarageInDate, 'dd/MM/yyyy HH:mm') AS GarageInDateTime,
    FORMAT(bd.ReleasingDate, 'dd/MM/yyyy HH:mm') AS ReleasingDateTime,
    FORMAT(bd.GarageOutDate, 'dd/MM/yyyy HH:mm') AS GarageOutDateTime,
    [isBookerMail], [isDriverMail], [isGuestMail], [isPartyMail],
    [isVendorMail], [isGuestwp], [isGuestSMS], [isVendorwp],
    [isVendorSMS], [isBookertwp], [isBookerSMS],
    [isPartywp], [isPartySMS], [isDriverwp], [isDriverSMS],
    bs.GustName AS ViewGustName,
    bs.Address AS ViewAddress,
    pm.mobileno AS party_mobileNo,
    bs.ContactNo AS ViewGustContact,
    ISNULL(be.BillNo, '') AS InvoiceNo,
    bs.ViewDropAddress,
    bd.PartyRate AS Party_rate_id,
    bd.ReportAt,
    bd.ReleaseAt,
    bd.PartyMinHour,
    bd.PartyMinKM,
    (
        SELECT s.ChargeId, s.Amount AS amount, c.charge_name, c.taxable
        FROM [dbo].tbl_booking_charge_summery s
        INNER JOIN charges_mast c ON c.id = s.ChargeId
        WHERE BookingId = bd.id AND s.charge_type = 'party'
        FOR JSON PATH
    ) AS other_charge_json,
     (
        SELECT s.ChargeId, s.Amount AS amount, c.charge_name, c.taxable
        FROM [dbo].tbl_booking_charge_summery s
        INNER JOIN charges_mast c ON c.id = s.ChargeId
        WHERE BookingId = bd.id AND s.charge_type = 'vendor'
        FOR JSON PATH
    ) AS other_charge_json_vendor
FROM [dbo].[booking_details] bd
LEFT JOIN party_mast pm ON bd.Party = pm.id AND pm.company_id = @company_id
LEFT JOIN car_type_mast cm ON bd.CarType = cm.id AND cm.company_id = @company_id
LEFT JOIN car_type_mast cms ON bd.CarTypeSend = cms.id AND cms.company_id = @company_id
LEFT JOIN vendor_mast v ON v.id = bd.VendorName AND v.company_id = @company_id
LEFT JOIN city_mast fc ON fc.id = bd.FromCityID
LEFT JOIN city_mast tc ON tc.id = bd.ToCityID
LEFT JOIN duty_type_mast dt ON dt.id = bd.DutyType
LEFT JOIN tbl_branch br ON br.Id = bd.branch_id AND br.company_id = @company_id
LEFT JOIN tbl_booking_entry_map emap ON bd.id = emap.booking_id AND emap.company_id = @company_id
LEFT JOIN [dbo].[tbl_booking_entry] be ON be.id = emap.booking_entry_id AND be.parent_company_id = @company_id
OUTER APPLY (
    SELECT TOP 1 GustName, Address, ContactNo, Remarks, drop_address AS ViewDropAddress
    FROM [Bookingsummery]
    WHERE bookingID = bd.id
) bs
WHERE 
    bd.company_id = @company_id
    AND bd.id = @id;
  `;

    try {
        const data = await pdo.execute({
            sqlQuery: sqlQuery,
            params: { id, company_id },
        });

        return {
            data: data[0] || null,
            StatusID: data.length > 0 ? 1 : 2,
            StatusMessage: data.length > 0 ? "Data found" : "No data found",
        };
    } catch (error) {
        console.error("Error in getVendorDutyCloseById:", error);
        return { data: null, StatusID: 0, StatusMessage: error.message };
    }
};



exports.closeVendorDuty = async (params) => {
    const {
        id,
        VendorRateType,
        VendorRate,
        VendorReleasingDate,
        VendorReleaseKm,
        VendorGarageInDate,
        VendorGarageInKm,
        VendorGarageOutKm,
        VendorReportKm,
        VendorTotalHour,
        VendorTotalKm,
        VendorTotalAmt,
        VendorTotalOtherCharge,
        VendorNetAmt,
        VendorGarageOutDate,
        VendorReportDate,
        VendorpostChargesData = null,
        VendorKMRate,
        VendorHourRate,
        VendorPrice,
        VendorExtraHrs,
        VendorExtraHrsRate,
        VendorExtraHrsAmount,
        VendorExtraKM,
        VendorExtraKMRate,
        VendorExtraKMAmount,
        company_id,
        user_id,
    } = params;

    const pod = new PDO();
    try {
        const { data, output } = await pod.callProcedure({
            procName: "sp_app_Close_Vendor_booking",
            inputParams: [
                { name: "id", type: sql.Int, value: id },
                { name: "VendorRateType", type: sql.VarChar(200), value: VendorRateType },
                { name: "VendorRate", type: sql.VarChar(200), value: VendorRate },
                { name: "VendorReleasingDate", type: sql.DateTime, value: VendorReleasingDate },
                { name: "VendorReleaseKm", type: sql.Int, value: VendorReleaseKm },
                { name: "VendorGarageInDate", type: sql.DateTime, value: VendorGarageInDate },
                { name: "VendorGarageInKm", type: sql.Int, value: VendorGarageInKm },
                { name: "VendorGarageOutKm", type: sql.Int, value: VendorGarageOutKm },
                { name: "VendorReportKm", type: sql.Int, value: VendorReportKm },
                { name: "VendorTotalHour", type: sql.Decimal(18, 2), value: VendorTotalHour },
                { name: "VendorTotalKm", type: sql.Int, value: VendorTotalKm },
                { name: "VendorTotalAmt", type: sql.Decimal(18, 2), value: VendorTotalAmt },
                { name: "VendorTotalOtherCharge", type: sql.Decimal(18, 2), value: VendorTotalOtherCharge },
                { name: "VendorNetAmt", type: sql.Decimal(18, 2), value: VendorNetAmt },
                { name: "VendorGarageOutDate", type: sql.DateTime, value: VendorGarageOutDate },
                { name: "VendorReportDate", type: sql.DateTime, value: VendorReportDate },
                { name: "VendorpostChargesData", type: sql.VarChar(sql.MAX), value: VendorpostChargesData },
                { name: "VendorKMRate", type: sql.Decimal(18, 2), value: VendorKMRate },
                { name: "VendorHourRate", type: sql.Decimal(18, 2), value: VendorHourRate },
                { name: "VendorPrice", type: sql.Decimal(18, 2), value: VendorPrice },
                { name: "VendorExtraHrs", type: sql.Decimal(18, 2), value: VendorExtraHrs },
                { name: "VendorExtraHrsRate", type: sql.Decimal(18, 2), value: VendorExtraHrsRate },
                { name: "VendorExtraHrsAmount", type: sql.Decimal(18, 2), value: VendorExtraHrsAmount },
                { name: "VendorExtraKM", type: sql.Decimal(18, 2), value: VendorExtraKM },
                { name: "VendorExtraKMRate", type: sql.Decimal(18, 2), value: VendorExtraKMRate },
                { name: "VendorExtraKMAmount", type: sql.Decimal(18, 2), value: VendorExtraKMAmount },
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
    } catch (error) {
        console.error("Error in closeVendorDuty:", error);
        return { data: null, StatusID: 0, StatusMessage: error.message };
    }
};

const sql = require("mssql");
const PDO = require("../core/pod.js");

exports.dutySlipPrint = async (params) => {
    const { id, company_id } = params;
    const pdo = new PDO();

    // Validate required field
    if (!id) {
        return { 
            StatusID: 0, 
            StatusMessage: "Booking ID is required", 
            data: [] 
        };
    }

    // FINAL & CORRECT SQL QUERY
    const sqlQuery = `
        SELECT
            -- Vendor / Company Details
            tc.Name AS CompanyName,
            tc.Address AS CompanyAddress,
            tc.GSTNo AS CompanyGSTNo,

            vm.vendor_name AS VendorName,
            vm.address AS VendorAddress,
            vm.gstno AS VendorGSTNo,

            -- Booking Details
            bd.id AS BookingID,
            bd.SlipNo,
            bd.ReportingDateTime,
            bd.RentalDate,
            bd.ReportAt,
            bd.BookedBy,
            bd.ContactNo,
            bd.Email AS BookedEmail,

            -- Party Details
            pm.party_name AS PartyName,
            pm.Address AS address,
            pm.GSTNo AS PartyGSTNo,
            pm.city_id,
            pm.pin_code,
            pm.gstno,

            -- Guest Details (From BookingSummary)
            bs.GustName as GuestName,
            bs.ContactNo as GuestContactNo,
            bs.Address as GuestAddress,
            bs.Remarks as GuestRemarks,
            bs.AditionalContactNo as GuestAditionalContactNo,
            bs.drop_address as GuestDropAddress,


            -- CAB Details
            cm.car_type AS CabType,
            bd.CarNo AS CabNumber,

            -- Driver Details
            bd.DriverName,
            bd.DriverContact,

            -- Duty / Travel Summary (From booking_details)
            bd.GarageOutDate,
            bd.GarageOutTime,
            bd.GarageOutKm,
            bd.ReportKm,
            bd.ReleaseKm,
            bd.GarageInDate,
            bd.GarageInKm,
            bd.TotalHour,
            bd.TotalKm,
            bd.Remarks,
            (
                SELECT 
                    c.charge_type,
                    c.Amount,
                    c.ChargeId
                FROM tbl_booking_charge_summery c
                WHERE c.BookingId = bd.id
                FOR JSON PATH
            ) AS OtherChargesJson

        FROM booking_details bd
        LEFT JOIN tbl_company tc ON bd.company_id = tc.id
        LEFT JOIN party_mast pm ON bd.Party = pm.ID
        LEFT JOIN car_type_mast cm ON bd.CarTypeSend = cm.id
        LEFT JOIN vendor_mast vm ON bd.VendorName = vm.id
        LEFT JOIN Bookingsummery bs ON bd.id = bs.bookingID

        WHERE bd.id = @id
    `;

    try {
        const data = await pdo.execute({
            sqlQuery: sqlQuery,
            params: { id, company_id }
        });

        return {
            StatusID: data.length > 0 ? 1 : 2,
            StatusMessage: data.length > 0 ? "Data found" : "No data found",
            data: data[0] || null
        };

    } catch (error) {
        console.error("Error in dutySlipPrint:", error);
        return { 
            StatusID: 0, 
            StatusMessage: error.message,
            data: null 
        };
    }
};

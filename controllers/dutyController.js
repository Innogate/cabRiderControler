const sql = require("mssql");
const PDO = require("../core/pod.js");

exports.appAllotmentBooking = async (params) => {
    const {
    id,
    CarType,
    CarNo,
    DriverName,
    DriverContact,
    VendorContact,
    VendorName,
    GarageOutTime,
    VendorGarageOutTime,
    VendorAdvanced,
    driver_id,
    user_id,
    company_id, 
    } = params;

    const pdo = new PDO();

    const { output } = await pdo.callProcedure({
        procName: "sp_app_allotment_booking",
        inputParams: [
            { name: "id", type: sql.Int, value: id },
            { name: "CarType", type: sql.VarChar(50), value: CarType },
            { name: "CarNo", type: sql.VarChar(50), value: CarNo },
            { name: "DriverName", type: sql.VarChar(50), value: DriverName },
            { name: "DriverContact", type: sql.VarChar(50), value: DriverContact },
            { name: "VendorContact", type: sql.VarChar(50), value: VendorContact },
            { name: "VendorName", type: sql.VarChar(50), value: VendorName },
            { name: "GarageOutTime", type: sql.VarChar(50), value: GarageOutTime },
            { name: "VendorGarageOutTime", type: sql.VarChar(50), value: VendorGarageOutTime },
            { name: "VendorAdvanced", type: sql.Decimal(18, 2), value: VendorAdvanced },
            { name: "driver_id", type: sql.Int, value: driver_id },
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
        message: output.StatusMessage,
        status: output.StatusID,
        total: output.TotalCount,
    };
}; 
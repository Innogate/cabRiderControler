const sql = require("mssql");
const PDO = require("../core/pod.js");

exports.closeDuty = async (params) => {
    const {
        id,
        PartyRateType,
        PartyRate,
        GarageOutKm,
        GarageOutDate = null,
        ReportKm,
        ReportDate = null,
        // ReportTime = null,
        ReleasingDate,
        ReleaseKm,
        GarageInDate,
        GarageInKm,
        BillingMode,
        ReleaseAt = '',
        ReportAt,
        TotalHour,
        TotalKm,
        postChargesData = null,
        TotalAmt,
        TotalOtherCharge,
        NetAmt,
        ExtraHrs,
        ExtraKM,
        ExtraHrsRate,
        ExtraHrsAmount,
        ExtraKMRate,
        ExtraKMAmount,
        Calon,
        attachment = null,
        HourRate = null,
        KMRate = null,
        Price = null,
        GarageOutTime = null,
        Advance = 0,
        VendorAdvanced = null,
        IgnoreLastDay,
        PartyMinHour,
        PartyMinKM,
        user_id,
        company_id
    } = params;

    console.log("Close Duty Params:", params);
    
    const pod = new PDO();
    const { data,output } = await pod.callProcedure({
        procName: "sp_app_Close_booking",
        inputParams: [
            { name: "id", type: sql.Int, value: id },
            { name: "PartyRateType", type: sql.VarChar(200), value: PartyRateType },
            { name: "PartyRate", type: sql.VarChar(200), value: PartyRate },
            { name: "GarageOutKm", type: sql.Int, value: GarageOutKm },
            { name: "GarageOutDate", type: sql.DateTime, value: GarageOutDate },
            { name: "ReportKm", type: sql.Int, value: ReportKm },
            { name: "ReportDate", type: sql.DateTime, value: ReportDate },
            // { name: "ReportTime", type: sql.VarChar(10), value: ReportTime },
            { name: "ReleasingDate", type: sql.DateTime, value: ReleasingDate },
            { name: "ReleaseKm", type: sql.Int, value: ReleaseKm },
            { name: "GarageInDate", type: sql.DateTime, value: GarageInDate },
            { name: "GarageInKm", type: sql.Int, value: GarageInKm },
            { name: "BillingMode", type: sql.VarChar(200), value: BillingMode },
            { name: "ReleaseAt", type: sql.VarChar(200), value: ReleaseAt },
            { name: "ReportAt", type: sql.VarChar(200), value: ReportAt },
            { name: "TotalHour", type: sql.Decimal(18, 2), value: TotalHour },
            { name: "TotalKm", type: sql.Int, value: TotalKm },
            { name: "postChargesData", type: sql.VarChar(sql.MAX), value: postChargesData },
            { name: "TotalAmt", type: sql.Decimal(18, 2), value: TotalAmt },
            { name: "TotalOtherCharge", type: sql.Decimal(18, 2), value: TotalOtherCharge },
            { name: "NetAmt", type: sql.Decimal(18, 2), value: NetAmt },
            { name: "ExtraHrs", type: sql.Decimal(18, 2), value: ExtraHrs },
            { name: "ExtraKM", type: sql.Decimal(18, 2), value: ExtraKM },
            { name: "ExtraHrsRate", type: sql.Decimal(18, 2), value: ExtraHrsRate },
            { name: "ExtraHrsAmount", type: sql.Decimal(18, 2), value: ExtraHrsAmount },
            { name: "ExtraKMRate", type: sql.Decimal(18, 2), value: ExtraKMRate },
            { name: "ExtraKMAmount", type: sql.Decimal(18, 2), value: ExtraKMAmount },
            { name: "Calon", type: sql.VarChar(50), value: Calon },
            { name: "attachment", type: sql.VarChar(sql.MAX), value: attachment },
            { name: "HourRate", type: sql.Decimal(18, 2), value: HourRate },
            { name: "KMRate", type: sql.Decimal(18, 2), value: KMRate },
            { name: "Price", type: sql.Decimal(18, 2), value: Price },
            { name: "GarageOutTime", type: sql.VarChar(10), value: GarageOutTime },
            { name: "Advance", type: sql.Decimal(18, 2), value: Advance },
            { name: "VendorAdvanced", type: sql.Decimal(18, 2), value: VendorAdvanced },
            { name: "IgnoreLastDay", type: sql.Bit, value: IgnoreLastDay },
            { name: "PartyMinHour", type: sql.Decimal(18, 2), value: PartyMinHour },
            { name: "PartyMinKM", type: sql.BigInt, value: PartyMinKM },
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

}

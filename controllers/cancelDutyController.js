const sql = require("mssql");
const PDO = require("../core/pod.js");

exports.cancelDuty = async (params) => {
    const {
        id,
        remarks,
        user_id,
        company_id
    } = params;

    const pod = new PDO();
    const { data, output } = await pod.callProcedure({
        procName: "sp_app_Cancel_Duty",
        inputParams: [
            { name: "id", type: sql.Int, value: id },
            { name: "remarks", type: sql.VarChar(500), value: remarks },
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

const sql = require("mssql");
const PDO = require("../core/pod.js");

exports.getDutySetupCode = async (params) => {
    const pdo = new PDO();
    const result = await pdo.execute({
            sqlQuery: "select id, DutyNo from dbo.MonthDutySetup WHERE DutyNo != '';",
            ttl: 300, 
        });
    return result;
}
const sql = require("mssql");
const PDO = require("../core/pod.js");

// GIVING ALL PARTY MASTER AS DROPDOWN OPTION
exports.getPartyListDropdown = async () => {
    const pdo = new PDO();
    const result = await pdo.execute({
        sqlQuery: `select id, party_name FROM dbo.party_mast WHERE party_name != '' ORDER BY party_name ASC;`,
        params: {},
        ttl: 300
    });

    return result;
}


exports.getBranchDropdownList = async () => {
    const pdo = new PDO();
    const result = await pdo.execute({
        sqlQuery: "select Id, branch_name from dbo.tbl_branch WHERE branch_name!= '' ORDER BY branch_name ASC;",
        ttl: 300,
    });
    return result;
}


exports.getCompanyDropdownList = async () => {
    const pdo = new PDO();
    const result = await pdo.execute({
        sqlQuery: "select Id, Name from dbo.tbl_company WHERE Name!= '' ORDER BY Name ASC;",
        ttl: 300,
    });
    return result;
}
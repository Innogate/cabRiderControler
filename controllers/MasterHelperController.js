const sql = require("mssql");
const PDO = require("../core/pod.js");

// GIVING ALL PARTY MASTER AS DROPDOWN OPTION
exports.getPartyListDropdown = async () => {
    const pdo = new PDO();
    const result = await pdo.execute({
        sqlQuery: `select id, party_name FROM dbo.party_mast WHERE party_name != '' ORDER BY party_name ASC;`
    });

    return result;
}


exports.getBranchDropdownList = async () => {
    const pdo = new PDO();
    const result = await pdo.execute({
        sqlQuery: "SELECT id, CASE WHEN ISNULL(branch_name, '') = '' AND ISNULL(ShortName, '') = '' AND ISNULL([address], '') = '' THEN 'N/A' ELSE ISNULL(NULLIF(branch_name, ''), 'Branch N/A') + ' / ' + ISNULL(NULLIF(ShortName, ''), 'ShortName N/A') + ' / ' + ISNULL(NULLIF([address], ''), 'Address N/A') END AS branch_name FROM dbo.tbl_branch ORDER BY branch_name ASC;",
        ttl: 300,
    });
    return result;
}


exports.getCompanyDropdownList = async () => {
    const pdo = new PDO();
    const result = await pdo.execute({
        sqlQuery: "SELECT Id, CASE WHEN ISNULL(Name, '') = '' AND ISNULL(ShortName, '') = '' AND ISNULL(City, '') = '' THEN 'N/A' ELSE ISNULL(Name, '') + ' / ' + ISNULL(ShortName, '') + ' / ' + ISNULL(City, '') END AS Name FROM dbo.tbl_company;",
        ttl: 300,
    });
    return result;
}
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

exports.getAllBranch= async (params) => {
    const pdo = new PDO();
    const result = await pdo.execute({
        sqlQuery: "select Id, branch_name from dbo.tbl_branch WHERE branch_name!= '';",
        ttl: 300,
    });
    return result;
}


exports.getAllCompany= async (params) => {
    const pdo = new PDO();
    const result = await pdo.execute({
        sqlQuery: "select Id, Name from dbo.tbl_company WHERE Name!= '';",
        ttl: 300,
    });
    return result;
}


exports.getMBookingList = async (params) => {
    const {
        party_id = 0,
        from_city_id = 0,
        branch_id = 0,
        company_id = 0,
    } = params;
    const pdo = new PDO();
    const result = await pdo.execute({
        sqlQuery: `
    SELECT * 
    FROM dbo.booking_details bd 
    WHERE bd.Party = @Party 
      AND bd.branch_id = @branch_id
      AND bd.FromCityID = @from_city_id 
      AND bd.company_id = @company_id 
      AND bd.BookingStatus = 'Closed' 
      AND NOT EXISTS (
          SELECT 1 
          FROM tbl_booking_entry_map bem 
          WHERE bem.booking_id = bd.id
      );
  `,
        params: {
            Party: party_id,
            branch_id: branch_id,
            company_id: company_id,
            from_city_id: from_city_id
        },
        ttl: 300
    });

    return result;
}
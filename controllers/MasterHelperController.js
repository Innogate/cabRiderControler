const sql = require("mssql");
const PDO = require("../core/pod.js");

// GIVING ALL PARTY MASTER AS DROPDOWN OPTION
exports.getPartyListDropdown = async () => {
    const pdo = new PDO();
    const result = await pdo.execute({
        sqlQuery: `select id, party_name FROM dbo.party_mast WHERE party_name != '' ORDER BY party_name ASC`
    });

    return result;
}


exports.getBranchDropdownList = async (
    company_id = 0
) => {
    const pdo = new PDO();
    const result = await pdo.execute({
        sqlQuery: "SELECT id, branch_name FROM dbo.tbl_branch WHERE  company_id = " + company_id + " ORDER BY branch_name ASC;",
        ttl: 300,
    });
    return result;
}


exports.getCompanyDropdownList = async (
    company_id,
    user_id
) => {
    const pdo = new PDO();
    const result = await pdo.execute({
        sqlQuery: "SELECT Id, ShortName AS Name FROM dbo.tbl_company where (ID  = " + company_id + " OR company_id = " + company_id + ");",
        ttl: 300,
    });
    return result;
}

exports.getOtherCharges = async (params) => {
  const { booking_ids } = params;
  const pdo = new PDO();

  if (!Array.isArray(booking_ids) || booking_ids.length === 0) {
    throw new Error("booking_ids must be a non-empty array");
  }

  const paramNames = booking_ids.map((_, index) => `@id${index}`);
  const inClause = paramNames.join(", ");
  const sqlParams = {};
  booking_ids.forEach((id, index) => {
    sqlParams[`id${index}`] = id;
  });

  // 🔹 Query for taxable
  const sqlTaxable = `
    SELECT 
    charges_mast.charge_name,
    charges_mast.taxable,
    charges_mast.company_id,
    charges_mast.TallyName,
    SUM(tbl_booking_charge_summery.Amount) AS total_amount
FROM charges_mast
JOIN tbl_booking_charge_summery 
    ON charges_mast.id = tbl_booking_charge_summery.ChargeId
WHERE tbl_booking_charge_summery.BookingId IN (${inClause})
  AND charges_mast.taxable = 'Y'
GROUP BY 
    charges_mast.charge_name,
    charges_mast.taxable,
    charges_mast.company_id,
    charges_mast.TallyName
ORDER BY charges_mast.charge_name;
  `;

  // 🔹 Query for non-taxable
  const sqlNonTaxable = `
    SELECT 
    charges_mast.charge_name,
    charges_mast.taxable,
    charges_mast.company_id,
    charges_mast.TallyName,
    SUM(tbl_booking_charge_summery.Amount) AS total_amount
FROM charges_mast
JOIN tbl_booking_charge_summery 
    ON charges_mast.id = tbl_booking_charge_summery.ChargeId
WHERE tbl_booking_charge_summery.BookingId IN (${inClause})
  AND charges_mast.taxable = 'N'
GROUP BY 
    charges_mast.charge_name,
    charges_mast.taxable,
    charges_mast.company_id,
    charges_mast.TallyName
ORDER BY charges_mast.charge_name;
  `;

  // 🔹 Execute both
  const [taxable, nonTaxable] = await Promise.all([
    pdo.execute({ sqlQuery: sqlTaxable, params: sqlParams, ttl: 300 }),
    pdo.execute({ sqlQuery: sqlNonTaxable, params: sqlParams, ttl: 300 }),
  ]);

  // 🔹 Return clean JS object
  return {
    taxable,
    nonTaxable,
  };
};


exports.getPartyMasterById = async (params) => {
  const { party_id = 0 } = params;
  const pdo = new PDO();
  return pdo.execute({
    sqlQuery: `SELECT * FROM party_mast WHERE id = ${party_id}`,
    ttl: 300,
  });
}
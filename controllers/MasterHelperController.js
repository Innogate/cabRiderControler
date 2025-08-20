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


exports.getOtherChargesUsingId = async (params) => {
  const { booking_entry_id } = params;
  const pdo = new PDO();

  if (!booking_entry_id) {
    throw new Error("booking_entry_id is required");
  }

  // 🔹 Step 1: Fetch booking_ids from MonthlyBillMap
  const sqlBookingIds = `
    SELECT mbm.booking_id
    FROM MonthlyBillMap mbm
    JOIN tbl_booking_charge_summery bd 
      ON mbm.booking_id = bd.id
    WHERE mbm.booking_entry_id = @entryId
  `;

  const bookingRows = await pdo.execute({
    sqlQuery: sqlBookingIds,
    params: { entryId: booking_entry_id },
    ttl: 300,
  });

  const booking_ids = bookingRows.map((row) => row.booking_id);

  if (!Array.isArray(booking_ids) || booking_ids.length === 0) {
    throw new Error("No booking_ids found for given booking_entry_id");
  }

  // 🔹 Step 2: Build IN clause dynamically
  const paramNames = booking_ids.map((_, index) => `@id${index}`);
  const inClause = paramNames.join(", ");
  const sqlParams = {};
  booking_ids.forEach((id, index) => {
    sqlParams[`id${index}`] = id;
  });

  // 🔹 Step 3: Queries for taxable & non-taxable
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

  // 🔹 Step 4: Execute both queries
  const [taxable, nonTaxable] = await Promise.all([
    pdo.execute({ sqlQuery: sqlTaxable, params: sqlParams, ttl: 300 }),
    pdo.execute({ sqlQuery: sqlNonTaxable, params: sqlParams, ttl: 300 }),
  ]);

  // 🔹 Step 5: Return result
  return {
    taxable,
    nonTaxable,
  };
};

exports.getOtherTaxableChargesUsingId = async (params) => {
  const { booking_entry_id } = params;
  const pdo = new PDO();

  if (!booking_entry_id) {
    throw new Error("booking_entry_id is required");
  }

  // 🔹 Step 1: Fetch booking_ids from MonthlyBillMap
  const sqlBookingIds = `
    SELECT mbm.booking_id
    FROM MonthlyBillMap mbm
    JOIN tbl_booking_charge_summery bd 
      ON mbm.booking_id = bd.id
    WHERE mbm.booking_entry_id = @entryId
  `;

  const bookingRows = await pdo.execute({
    sqlQuery: sqlBookingIds,
    params: { entryId: booking_entry_id },
    ttl: 300,
  });

  const booking_ids = bookingRows.map((row) => row.booking_id);

  if (!Array.isArray(booking_ids) || booking_ids.length === 0) {
    throw new Error("No booking_ids found for given booking_entry_id");
  }

  // 🔹 Step 2: Build IN clause dynamically
  const paramNames = booking_ids.map((_, index) => `@id${index}`);
  const inClause = paramNames.join(", ");
  const sqlParams = {};
  booking_ids.forEach((id, index) => {
    sqlParams[`id${index}`] = id;
  });

  // 🔹 Step 3: Queries for taxable & non-taxable
  const sqlTaxable = `
    SELECT 
    charges_mast.charge_name,
    charges_mast.taxable,
    charges_mast.company_id,
    charges_mast.TallyName,
    tbl_booking_charge_summery.Amount AS total_amount
FROM charges_mast
JOIN tbl_booking_charge_summery 
    ON charges_mast.id = tbl_booking_charge_summery.ChargeId
WHERE tbl_booking_charge_summery.BookingId IN (${inClause})
  AND charges_mast.taxable = 'Y'
ORDER BY charges_mast.charge_name;
  `;


  // 🔹 Step 4: Execute both queries
  const [taxable] = await Promise.all([
    pdo.execute({ sqlQuery: sqlTaxable, params: sqlParams, ttl: 300 }),
    
  ]);

  // 🔹 Step 5: Return result
  return {
    taxable,
  };
};

exports.getOtherNonTaxableChargesUsingId = async (params) => {
  const { booking_entry_id } = params;
  const pdo = new PDO();

  if (!booking_entry_id) {
    throw new Error("booking_entry_id is required");
  }

  // 🔹 Step 1: Fetch booking_ids from MonthlyBillMap
  const sqlBookingIds = `
    SELECT mbm.booking_id
    FROM MonthlyBillMap mbm
    JOIN tbl_booking_charge_summery bd 
      ON mbm.booking_id = bd.id
    WHERE mbm.booking_entry_id = @entryId
  `;

  const bookingRows = await pdo.execute({
    sqlQuery: sqlBookingIds,
    params: { entryId: booking_entry_id },
    ttl: 300,
  });

  const booking_ids = bookingRows.map((row) => row.booking_id);

  if (!Array.isArray(booking_ids) || booking_ids.length === 0) {
    throw new Error("No booking_ids found for given booking_entry_id");
  }

  // 🔹 Step 2: Build IN clause dynamically
  const paramNames = booking_ids.map((_, index) => `@id${index}`);
  const inClause = paramNames.join(", ");
  const sqlParams = {};
  booking_ids.forEach((id, index) => {
    sqlParams[`id${index}`] = id;
  });

  // 🔹 Step 3: Queries for taxable & non-taxable
  const sqlNonTaxable = `
 SELECT 
    charges_mast.charge_name,
    charges_mast.taxable,
    charges_mast.company_id,
    charges_mast.TallyName,
    tbl_booking_charge_summery.Amount AS total_amount
FROM charges_mast
JOIN tbl_booking_charge_summery 
    ON charges_mast.id = tbl_booking_charge_summery.ChargeId
WHERE tbl_booking_charge_summery.BookingId IN (${inClause})
  AND charges_mast.taxable = 'N'
ORDER BY charges_mast.charge_name;
  `;


  // 🔹 Step 4: Execute both queries
  const [nonTaxable] = await Promise.all([
    pdo.execute({ sqlQuery: sqlNonTaxable, params: sqlParams, ttl: 300 }),
  ]);

  // 🔹 Step 5: Return result
  return {
    nonTaxable,
  };
};
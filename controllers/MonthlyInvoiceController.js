const sql = require("mssql");
const PDO = require("../core/pod.js");

exports.getDutySetupCode = async (params) => {
    const pdo = new PDO();
    const result = await pdo.execute({
        sqlQuery: "select * from dbo.MonthDutySetup WHERE DutyNo != '';",
        ttl: 300,
    });
    return result;
}



exports.getMBookingList = async (params) => {
    console.log(params)
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
    WHERE bd.Party = @party_id 
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
            party_id: party_id,
            branch_id: branch_id,
            company_id: company_id,
            from_city_id: from_city_id
        },
        ttl: 300
    });

    return result;
}

exports.getInvoiceList = async (params) => {
  const {
    for_company_id = 0,
    search = "",
    current_page = 0,
    page_size = 10,
    company_id = 0,
    user_id = 0,
  } = params;

  const pdo = new PDO();

  // 1️⃣ Base SQL for filtering
  let whereClause = `WHERE (parent_company_id = @company_id OR user_id = @user_id)`;
  let sqlParams = {
    company_id,
    user_id,
  };

  // 2️⃣ Add search condition (if provided)
  if (search && search.trim() !== "") {
    whereClause += ` AND (bill_no LIKE @search OR remarks LIKE @search)`;
    sqlParams.search = `%${search}%`;
  }

  // for_company_id
  if (for_company_id) {
    whereClause += ` AND company_id = @for_company_id`;
    sqlParams.for_company_id = for_company_id;
  }

  // 3️⃣ Count query (for pagination total)
  const countQuery = `
    SELECT COUNT(*) as total 
    FROM "MonthlyBillHead" 
    ${whereClause};
  `;
  const countResult = await pdo.execute({
    sqlQuery: countQuery,
    params: sqlParams,
  });

  const totalRecords = countResult[0]?.total || 0;

  // 4️⃣ Data query with pagination
  const dataQuery = `
    SELECT *
    FROM "MonthlyBillHead"
    ${whereClause}
    ORDER BY id DESC
    OFFSET @offset ROWS FETCH NEXT @limit ROWS ONLY;
  `;

  const dataParams = {
    ...sqlParams,
    offset: current_page * page_size,
    limit: page_size,
  };

  const dataResult = await pdo.execute({
    sqlQuery: dataQuery,
    params: dataParams,
  });

  // 5️⃣ Return structured response
  return {
    total: totalRecords,
    current_page,
    page_size,
    data: dataResult,
  };
};

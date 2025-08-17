const sql = require("mssql");
const PDO = require("../core/pod.js");

exports.getDutySetupCode = async (params) => {
  const pdo = new PDO();
  const { party_id = 0 } = params;
  const result = await pdo.execute({
    sqlQuery: "select * from dbo.MonthDutySetup WHERE PartyID = @party_id;",
    params: { party_id: party_id },
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

  const sqlQuery = `SELECT
  mbh.*,
  pm.party_name AS PartyName,
  cm.CityName   AS CityName,
  tb.ShortName  AS BranchShortName
FROM dbo.MonthlyBillHead AS mbh
LEFT JOIN dbo.party_mast AS pm
  ON pm.id = mbh.party_id
LEFT JOIN dbo.city_mast AS cm
  ON cm.Id = mbh.city_id
LEFT JOIN dbo.tbl_branch AS tb
  ON tb.Id = mbh.branch_id
WHERE
  (mbh.user_id = @user_id OR mbh.parent_company_id = @for_company_id);`;

  const data = await pdo.execute({
    sqlQuery,
    params: {
      company_id,
      user_id,
      for_company_id,
      search: search && search.trim() !== "" ? `%${search}%` : "",
      offset: current_page * page_size,
      limit: page_size,
    },
  });

  const total = data.length ? Number(data[0].total_count) || 0 : 0;
  const rows = data.map(({ total_count, ...rest }) => rest);

  return {
    total,
    current_page,
    page_size,
    data: rows,
  };
};

exports.createMonthlyBill = async (params) => {
  const pdo = new PDO();

  return await pdo.executeInTransaction(async (trx) => {
    // Bind only the fields used in the INSERT below
    const bindList = [
      'taxtype','BillDate','company_id','parent_company_id','branch_id','city_id','party_id',
      'GrossAmount','OtherCharges','IGSTPer','CGSTPer','SGSTPer','IGST','CGST','SGST','OtherCharges2',
      'round_off','Advance','Discount','NetAmount','user_id','rcm','monthly_duty_id','fixed_amount',
      'no_of_days','fixed_amount_total','extra_hours','extra_hours_rate','extra_hours_amount',
      'extra_km','extra_km_rate','extra_km_amount','except_day_hrs','except_day_hrs_rate',
      'except_day_hrs_amount','except_day_km','except_day_km_rate','except_day_km_amount',
      'fuel_amount','mobil_amount','parking_amount','night_amount','outstation_amount','proportionate',
      'bill_total','amount_payable','remarks','Invcancel','InvcancelOn','Invcancelby','InvcancelReason'
    ];

    for (const key of bindList) {
      trx.input(key, params[key] ?? null);
    }

    const insertHeadSql = `
      INSERT INTO MonthlyBillHead (
        taxtype, BillDate, company_id, parent_company_id, branch_id, city_id, party_id,
        GrossAmount, OtherCharges, IGSTPer, CGSTPer, SGSTPer, IGST, CGST, SGST, OtherCharges2,
        round_off, Advance, Discount, NetAmount, user_id, rcm, monthly_duty_id, fixed_amount,
        no_of_days, fixed_amount_total, extra_hours, extra_hours_rate, extra_hours_amount,
        extra_km, extra_km_rate, extra_km_amount, except_day_hrs, except_day_hrs_rate,
        except_day_hrs_amount, except_day_km, except_day_km_rate, except_day_km_amount,
        fuel_amount, mobil_amount, parking_amount, night_amount, outstation_amount, proportionate,
        bill_total, amount_payable, remarks, Invcancel, InvcancelOn, Invcancelby, InvcancelReason
      ) VALUES (
        @taxtype, @BillDate, @company_id, @parent_company_id, @branch_id, @city_id, @party_id,
        @GrossAmount, @OtherCharges, @IGSTPer, @CGSTPer, @SGSTPer, @IGST, @CGST, @SGST, @OtherCharges2,
        @round_off, @Advance, @Discount, @NetAmount, @user_id, @rcm, @monthly_duty_id, @fixed_amount,
        @no_of_days, @fixed_amount_total, @extra_hours, @extra_hours_rate, @extra_hours_amount,
        @extra_km, @extra_km_rate, @extra_km_amount, @except_day_hrs, @except_day_hrs_rate,
        @except_day_hrs_amount, @except_day_km, @except_day_km_rate, @except_day_km_amount,
        @fuel_amount, @mobil_amount, @parking_amount, @night_amount, @outstation_amount, @proportionate,
        @bill_total, @amount_payable, @remarks, @Invcancel, @InvcancelOn, @Invcancelby, @InvcancelReason
      );
      SELECT SCOPE_IDENTITY() AS id;
    `;

    const headInsertResult = await trx.query(insertHeadSql);
    const newId = headInsertResult.recordset?.[0].id;

    // 2) Insert mappings
    const dutyIds = Array.isArray(params.duty_ids) ? params.duty_ids : [];
    if (dutyIds.length) {
      // Build a single VALUES block for efficiency
      const values = dutyIds
        .map((bid) => `(${Number(bid)}, ${newId}, @company_id, @user_id)`)
        .join(",\n");

      const mapSql = `
        INSERT INTO MonthlyBillMap (booking_id, booking_entry_id, company_id, user_id)
        VALUES
        ${values};
      `;
      await trx.query(mapSql);
    }

    return { id: newId };
  });
};
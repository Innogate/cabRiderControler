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
    sqlQuery: `exec spGet_DutyList @PartyID = ${party_id}, @CompanyID = ${company_id}, @CityID = ${from_city_id}`,
    ttl: 300
  });

  return result;
}
exports.getInvoiceList = async (params) => {
  const {
    for_company_id = 0,
    search = "",
    current_page = 1,
    page_size = 10,
    parent_company_id = 0,
    user_id = 0,
  } = params;

  const pdo = new PDO();

  // ✅ Pagination
  const offset = Math.max(0, (current_page > 0 ? current_page - 1 : 0) * page_size);
  const limit = parseInt(page_size, 10);

  const queryParams = { user_id };

  let whereClause = "";
  if (for_company_id && for_company_id > 0) {
    // 🔹 Filter by specific company
    whereClause = "mbh.company_id = @for_company_id";
    queryParams.for_company_id = for_company_id;
  } else {
    // 🔹 Default: parent company wise
    whereClause = "mbh.parent_company_id = @parent_company_id";
    queryParams.parent_company_id = parent_company_id;
  }

  let searchQuery = "";
  if (search && search.trim() !== "") {
    searchQuery = `
      AND (
        mbh.BillNo LIKE @search OR
        pm.party_name LIKE @search OR
        cm.CityName LIKE @search
      )
    `;
    queryParams.search = `%${search.trim()}%`;
  }

  const sqlQuery = `
    SELECT
      mbh.*,
      pm.party_name AS PartyName,
      cm.CityName   AS CityName,
      tb.ShortName  AS BranchShortName,
      COUNT(*) OVER() as total_count
    FROM dbo.MonthlyBillHead AS mbh
    LEFT JOIN dbo.party_mast AS pm ON pm.id = mbh.party_id
    LEFT JOIN dbo.city_mast AS cm ON cm.Id = mbh.city_id
    LEFT JOIN dbo.tbl_branch AS tb ON tb.Id = mbh.branch_id
    WHERE
      ${whereClause}
      ${searchQuery}
    ORDER BY mbh.id DESC
    OFFSET ${offset} ROWS
    FETCH NEXT ${limit} ROWS ONLY;
  `;

  const data = await pdo.execute({
    sqlQuery,
    params: queryParams,
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




// exports.createMonthlyBill = async (params) => {
//   params.AutoBill = 1;
//   const pdo = new PDO();
//   return await pdo.executeInTransaction(async (trx) => {

//     let billNo = null;

//     if (params.AutoBill === 1) {
//       trx.input('company_id', params.company_id);
//       trx.input('branch_id', params.branch_id);
//       trx.input('CurrDatea', params.BillDate || new Date());

//       const billNoGenerationSql = `
//         DECLARE @Year VARCHAR(20);
//         DECLARE @ShortName VARCHAR(20);
//         DECLARE @CurrentSaleCode VARCHAR(20) = '0';
//         DECLARE @BillNo VARCHAR(100);

//         -- Determine financial year suffix
//         SELECT @Year = CASE
//           WHEN MONTH(@CurrDatea) <= 3 THEN
//             CONVERT(VARCHAR(4), YEAR(@CurrDatea) - 1) + '-' + RIGHT(CONVERT(VARCHAR(4), YEAR(@CurrDatea)), 2)
//           ELSE
//             CONVERT(VARCHAR(4), YEAR(@CurrDatea)) + '-' + RIGHT(CONVERT(VARCHAR(4), YEAR(@CurrDatea) + 1), 2)
//         END;

//         -- Get company short name
//         SELECT TOP 1 @ShortName = ShortName
//         FROM tbl_company
//         WHERE Id = @company_id;

//         -- Get last code from MonthlyBillHead
//         SELECT TOP 1 @CurrentSaleCode = COALESCE(
//           NULLIF(
//             SUBSTRING(
//               BillNo,
//               CHARINDEX('/', BillNo) + 1,
//               CHARINDEX('/', BillNo, CHARINDEX('/', BillNo) + 1)
//                 - CHARINDEX('/', BillNo) - 1
//             ),
//             ''
//           ),
//           '0'
//         )
//         FROM MonthlyBillHead
//         WHERE company_id = @company_id
//           AND branch_id  = @branch_id
//           AND RIGHT(BillNo, LEN(@Year)) = @Year
//         ORDER BY id DESC;

//         -- Build new bill number
//         SET @BillNo = CONCAT(@ShortName, '/', CAST(CAST(@CurrentSaleCode AS INT) + 1 AS VARCHAR), '/', @Year);

//         SELECT @BillNo AS BillNo;
//       `;

//       const billResult = await trx.query(billNoGenerationSql);
//       billNo = billResult.recordset?.[0]?.BillNo || null;
//     }

//     const bindList = [
//       'taxtype', 'BillDate', 'parent_company_id', 'city_id', 'party_id',
//       'GrossAmount', 'OtherCharges', 'IGSTPer', 'CGSTPer', 'SGSTPer', 'IGST', 'CGST', 'SGST', 'OtherCharges2',
//       'round_off', 'Advance', 'Discount', 'NetAmount', 'user_id', 'rcm', 'monthly_duty_id', 'fixed_amount',
//       'no_of_days', 'fixed_amount_total', 'extra_hours', 'extra_hours_rate', 'extra_hours_amount',
//       'extra_km', 'extra_km_rate', 'extra_km_amount', 'except_day_hrs', 'except_day_hrs_rate',
//       'except_day_hrs_amount', 'except_day_km', 'except_day_km_rate', 'except_day_km_amount',
//       'fuel_amount', 'mobil_amount', 'parking_amount', 'night_amount', 'outstation_amount', 'proportionate',
//       'bill_total', 'amount_payable', 'remarks', 'Invcancel', 'InvcancelOn', 'Invcancelby', 'InvcancelReason'
//     ];

//     for (const key of bindList) {
//       trx.input(key, params[key] ?? null);
//     }

//     trx.input('BillNo', billNo);

//     const insertHeadSql = `
//       INSERT INTO MonthlyBillHead (
//         BillNo, taxtype, BillDate, company_id, parent_company_id, branch_id, city_id, party_id,
//         GrossAmount, OtherCharges, IGSTPer, CGSTPer, SGSTPer, IGST, CGST, SGST, OtherCharges2,
//         round_off, Advance, Discount, NetAmount, user_id, rcm, monthly_duty_id, fixed_amount,
//         no_of_days, fixed_amount_total, extra_hours, extra_hours_rate, extra_hours_amount,
//         extra_km, extra_km_rate, extra_km_amount, except_day_hrs, except_day_hrs_rate,
//         except_day_hrs_amount, except_day_km, except_day_km_rate, except_day_km_amount,
//         fuel_amount, mobil_amount, parking_amount, night_amount, outstation_amount, proportionate,
//         bill_total, amount_payable, remarks, Invcancel, InvcancelOn, Invcancelby, InvcancelReason
//       ) VALUES (
//         @BillNo, @taxtype, @BillDate, @company_id, @parent_company_id, @branch_id, @city_id, @party_id,
//         @GrossAmount, @OtherCharges, @IGSTPer, @CGSTPer, @SGSTPer, @IGST, @CGST, @SGST, @OtherCharges2,
//         @round_off, @Advance, @Discount, @NetAmount, @user_id, @rcm, @monthly_duty_id, @fixed_amount,
//         @no_of_days, @fixed_amount_total, @extra_hours, @extra_hours_rate, @extra_hours_amount,
//         @extra_km, @extra_km_rate, @extra_km_amount, @except_day_hrs, @except_day_hrs_rate,
//         @except_day_hrs_amount, @except_day_km, @except_day_km_rate, @except_day_km_amount,
//         @fuel_amount, @mobil_amount, @parking_amount, @night_amount, @outstation_amount, @proportionate,
//         @bill_total, @amount_payable, @remarks, @Invcancel, @InvcancelOn, @Invcancelby, @InvcancelReason
//       );
//       SELECT SCOPE_IDENTITY() AS id;
//     `;

//     const headInsertResult = await trx.query(insertHeadSql);
//     const newId = headInsertResult.recordset?.[0].id;

//     const dutyIds = Array.isArray(params.duty_ids) ? params.duty_ids : [];
//     if (dutyIds.length) {
//       const values = dutyIds
//         .map(bid => `(${Number(bid)}, ${newId}, ${params.company_id}, ${params.user_id})`)
//         .join(',\n');

//       const mapSql = `
//         INSERT INTO MonthlyBillMap (booking_id, booking_entry_id, company_id, user_id)
//         VALUES
//         ${values};
//       `;
//       await trx.query(mapSql);
//     }

//     return { id: newId, billNo };
//   });
// };


exports.createMonthlyBill = async (params) => {
  params.AutoBill = 1;
  const pdo = new PDO();
  return await pdo.executeInTransaction(async (trx) => {

    let billNo = null;
    let billId = params.id || null; // ✅ if id is passed → update

    // Only generate BillNo when inserting
    if (!billId && params.AutoBill === 1) {
      trx.input('company_id', params.company_id);
      trx.input('branch_id', params.branch_id);
      trx.input('CurrDatea', params.BillDate || new Date());

      const billNoGenerationSql = `
        DECLARE @Year VARCHAR(20);
        DECLARE @ShortName VARCHAR(20);
        DECLARE @CurrentSaleCode VARCHAR(20) = '0';
        DECLARE @BillNo VARCHAR(100);

        -- Determine financial year suffix
        SELECT @Year = CASE
          WHEN MONTH(@CurrDatea) <= 3 THEN
            CONVERT(VARCHAR(4), YEAR(@CurrDatea) - 1) + '-' + RIGHT(CONVERT(VARCHAR(4), YEAR(@CurrDatea)), 2)
          ELSE
            CONVERT(VARCHAR(4), YEAR(@CurrDatea)) + '-' + RIGHT(CONVERT(VARCHAR(4), YEAR(@CurrDatea) + 1), 2)
        END;

        -- Get company short name
        SELECT TOP 1 @ShortName = ShortName
        FROM tbl_company
        WHERE Id = @company_id;

        -- Get last code from MonthlyBillHead
        SELECT TOP 1 @CurrentSaleCode = COALESCE(
          NULLIF(
            SUBSTRING(
              BillNo,
              CHARINDEX('/', BillNo) + 1,
              CHARINDEX('/', BillNo, CHARINDEX('/', BillNo) + 1)
                - CHARINDEX('/', BillNo) - 1
            ),
            ''
          ),
          '0'
        )
        FROM MonthlyBillHead
        WHERE company_id = @company_id
          AND branch_id  = @branch_id
          AND RIGHT(BillNo, LEN(@Year)) = @Year
        ORDER BY id DESC;

        -- Build new bill number
        SET @BillNo = CONCAT(@ShortName, '/', CAST(CAST(@CurrentSaleCode AS INT) + 1 AS VARCHAR), '/', @Year);

        SELECT @BillNo AS BillNo;
      `;

      const billResult = await trx.query(billNoGenerationSql);
      billNo = billResult.recordset?.[0]?.BillNo || null;
    }

    // Bind params
    const bindList = [
      'taxtype', 'BillDate', 'parent_company_id', 'city_id', 'party_id',
      'GrossAmount', 'OtherCharges', 'IGSTPer', 'CGSTPer', 'SGSTPer', 'IGST', 'CGST', 'SGST', 'OtherCharges2',
      'round_off', 'Advance', 'Discount', 'NetAmount', 'user_id', 'rcm', 'monthly_duty_id', 'fixed_amount',
      'no_of_days', 'fixed_amount_total', 'extra_hours', 'extra_hours_rate', 'extra_hours_amount',
      'extra_km', 'extra_km_rate', 'extra_km_amount', 'except_day_hrs', 'except_day_hrs_rate',
      'except_day_hrs_amount', 'except_day_km', 'except_day_km_rate', 'except_day_km_amount',
      'fuel_amount', 'mobil_amount', 'parking_amount', 'night_amount', 'outstation_amount', 'proportionate',
      'bill_total', 'amount_payable', 'remarks', 'Invcancel', 'InvcancelOn', 'Invcancelby', 'InvcancelReason'
    ];

    for (const key of bindList) {
      trx.input(key, params[key] ?? null);
    }

    trx.input('BillNo', billNo);

    if (!billId) {
      // ✅ INSERT case
      const insertHeadSql = `
        INSERT INTO MonthlyBillHead (
          BillNo, taxtype, BillDate, company_id, parent_company_id, branch_id, city_id, party_id,
          GrossAmount, OtherCharges, IGSTPer, CGSTPer, SGSTPer, IGST, CGST, SGST, OtherCharges2,
          round_off, Advance, Discount, NetAmount, user_id, rcm, monthly_duty_id, fixed_amount,
          no_of_days, fixed_amount_total, extra_hours, extra_hours_rate, extra_hours_amount,
          extra_km, extra_km_rate, extra_km_amount, except_day_hrs, except_day_hrs_rate,
          except_day_hrs_amount, except_day_km, except_day_km_rate, except_day_km_amount,
          fuel_amount, mobil_amount, parking_amount, night_amount, outstation_amount, proportionate,
          bill_total, amount_payable, remarks, Invcancel, InvcancelOn, Invcancelby, InvcancelReason
        ) VALUES (
          @BillNo, @taxtype, @BillDate, @company_id, @parent_company_id, @branch_id, @city_id, @party_id,
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
      billId = headInsertResult.recordset?.[0].id;
    } else {
      // ✅ UPDATE case
      trx.input('id', billId);

      const updateHeadSql = `
        UPDATE MonthlyBillHead SET
          taxtype=@taxtype, BillDate=@BillDate, parent_company_id=@parent_company_id,
          city_id=@city_id, party_id=@party_id, GrossAmount=@GrossAmount, OtherCharges=@OtherCharges,
          IGSTPer=@IGSTPer, CGSTPer=@CGSTPer, SGSTPer=@SGSTPer, IGST=@IGST, CGST=@CGST, SGST=@SGST, OtherCharges2=@OtherCharges2,
          round_off=@round_off, Advance=@Advance, Discount=@Discount, NetAmount=@NetAmount, user_id=@user_id, 
          rcm=@rcm, monthly_duty_id=@monthly_duty_id, fixed_amount=@fixed_amount, no_of_days=@no_of_days, 
          fixed_amount_total=@fixed_amount_total, extra_hours=@extra_hours, extra_hours_rate=@extra_hours_rate, 
          extra_hours_amount=@extra_hours_amount, extra_km=@extra_km, extra_km_rate=@extra_km_rate, 
          extra_km_amount=@extra_km_amount, except_day_hrs=@except_day_hrs, except_day_hrs_rate=@except_day_hrs_rate, 
          except_day_hrs_amount=@except_day_hrs_amount, except_day_km=@except_day_km, except_day_km_rate=@except_day_km_rate, 
          except_day_km_amount=@except_day_km_amount, fuel_amount=@fuel_amount, mobil_amount=@mobil_amount, 
          parking_amount=@parking_amount, night_amount=@night_amount, outstation_amount=@outstation_amount, 
          proportionate=@proportionate, bill_total=@bill_total, amount_payable=@amount_payable, 
          remarks=@remarks, Invcancel=@Invcancel, InvcancelOn=@InvcancelOn, Invcancelby=@Invcancelby, 
          InvcancelReason=@InvcancelReason
        WHERE id=@id;
      `;
      await trx.query(updateHeadSql);

      // Remove old map entries before inserting fresh
      await trx.query(`DELETE FROM MonthlyBillMap WHERE booking_entry_id=@id;`);
    }

    // Insert mapping rows
    const dutyIds = Array.isArray(params.duty_ids) ? params.duty_ids : [];
    if (dutyIds.length) {
      const values = dutyIds
        .map(bid => `(${Number(bid)}, ${billId}, ${params.company_id}, ${params.user_id})`)
        .join(',\n');

      const mapSql = `
        INSERT INTO MonthlyBillMap (booking_id, booking_entry_id, company_id, user_id)
        VALUES
        ${values};
      `;
      await trx.query(mapSql);
    }

    return { id: billId, billNo };
  });
};


exports.getMonthlyBillById = async (params) => {
  const { BillId } = params;

  if (!BillId) {
    throw new Error("BillId is required");
  }

  const pdo = new PDO();

  const headerQuery = `
    -- 1. Bill Header
    SELECT 
        mbh.*,
        c.ShortName AS CompanyName,
        b.branch_name AS BranchName,
        cm.CityName AS CityName,
        pm.party_name AS PartyName,
        (SELECT mds.* FROM MonthDutySetup mds WHERE mds.id = mbh.monthly_duty_id FOR JSON PATH, WITHOUT_ARRAY_WRAPPER) AS DutySetupJSON
    FROM MonthlyBillHead mbh
    LEFT JOIN tbl_company c ON c.Id = mbh.company_id
    LEFT JOIN tbl_branch b ON b.Id = mbh.branch_id
    LEFT JOIN city_mast cm ON cm.Id = mbh.city_id
    LEFT JOIN party_mast pm ON pm.id = mbh.party_id
    WHERE mbh.id = @BillId;
  `;

  const bookingsQuery = `
    -- 2. Booking List
    SELECT TOP 100
        bk.ID AS BookingID,
        bk.SlipNo,
        CONVERT(VARCHAR, bk.RentalDate, 103) AS StartDate,
        FORMAT(bk.GarageInDate, 'dd/MM/yyyy') AS EndDate,
        ct.Car_Type,
        bk.CarNo,
        (SELECT TOP 1 G.GustName 
         FROM Bookingsummery AS G 
         WHERE BookingID = bk.ID) AS GuestName,
        FORMAT(CONVERT(DATETIME, ISNULL(bk.GarageOutTime, '00:00')), 'HH:mm') AS GarageOutTime,
        FORMAT(bk.GarageInDate, 'HH:mm') AS GarageInTime,
        bk.GarageOutKm,
        bk.GarageInKm,
        bk.TotalHour,
        bk.TotalKm,
        ISNULL(
            (SELECT STRING_AGG(c.charge_name + ' Rs. ' + CONVERT(VARCHAR, a.Amount), '#')
             FROM tbl_booking_charge_summery AS a
             LEFT JOIN charges_mast AS c 
                ON a.ChargeId = c.ID
             WHERE a.BookingID = bk.ID 
               AND a.charge_Type = 'party'), 
            ''
        ) AS ChargesDetl,
        ISNULL(bk.Project,'') AS Project,
        ISNULL(bk.BookedBy, '') AS BookedBy,
        w.Name AS DutyType,
        v.Party_Name,
        ISNULL(bk.Advance, 0) AS Advance,
        fc.CityName AS FromCity,
        tc.CityName AS ToCity,
        '' AS CarTypeName,
        '' AS DutyTypeName,
        CAST(1 AS BIT) AS selected
    FROM MonthlyBillMap AS mbm
    JOIN booking_details AS bk 
        ON bk.id = mbm.booking_id
    LEFT JOIN Car_Type_Mast AS ct 
        ON bk.CarType = ct.ID
    LEFT JOIN duty_type_mast AS w 
        ON bk.DutyType = w.ID
    LEFT JOIN Party_Mast AS v 
        ON bk.Party = v.ID
    LEFT JOIN city_mast AS fc 
        ON bk.FromCityID = fc.Id
    LEFT JOIN city_mast AS tc 
        ON bk.ToCityID = tc.Id
    WHERE mbm.booking_entry_id = @BillId
    ORDER BY mbm.id DESC;
  `;

  const taxableQuery = `
    -- 3. Taxable Charges
    SELECT 
        c.charge_name,
        c.taxable,
        c.company_id,
        c.TallyName,
        SUM(bc.Amount) AS total_amount
    FROM charges_mast c
    JOIN tbl_booking_charge_summery bc 
        ON c.id = bc.ChargeId
    JOIN MonthlyBillMap mbm 
        ON bc.BookingId = mbm.booking_id
    WHERE mbm.booking_entry_id = @BillId
      AND c.taxable = 'Y' AND bc.charge_Type='party'
    GROUP BY c.charge_name, c.taxable, c.company_id, c.TallyName
    ORDER BY c.charge_name;
  `;

  const nonTaxableQuery = `
    -- 4. Non-Taxable Charges
    SELECT 
        c.charge_name,
        c.taxable,
        c.company_id,
        c.TallyName,
        SUM(bc.Amount) AS total_amount
    FROM charges_mast c
    JOIN tbl_booking_charge_summery bc 
        ON c.id = bc.ChargeId
    JOIN MonthlyBillMap mbm 
        ON bc.BookingId = mbm.booking_id
    WHERE mbm.booking_entry_id = @BillId
      AND c.taxable = 'N' AND bc.charge_Type='party'
    GROUP BY c.charge_name, c.taxable, c.company_id, c.TallyName
    ORDER BY c.charge_name;
  `;

  const [headerResult, bookingsResult, taxableResult, nonTaxableResult] = await Promise.all([
    pdo.execute({ sqlQuery: headerQuery, params: { BillId }, ttl: 300 }),
    pdo.execute({ sqlQuery: bookingsQuery, params: { BillId }, ttl: 300 }),
    pdo.execute({ sqlQuery: taxableQuery, params: { BillId }, ttl: 300 }),
    pdo.execute({ sqlQuery: nonTaxableQuery, params: { BillId }, ttl: 300 }),
  ]);

  let billHeader = headerResult?.[0] || null;
  const bookings = bookingsResult || [];
  const taxable = taxableResult || [];
  const nonTaxable = nonTaxableResult || [];

  // Restructure Header
  if (billHeader) {
    let dutySetup = null;
    if (billHeader.DutySetupJSON) {
      try {
        dutySetup = JSON.parse(billHeader.DutySetupJSON);
      } catch (e) {
        console.error("Error parsing DutySetupJSON:", e);
      }
    }

    const restructuredHeader = {
      ...billHeader,
      company: { id: billHeader.company_id, name: billHeader.CompanyName },
      branch: { id: billHeader.branch_id, name: billHeader.BranchName },
      city: { id: billHeader.city_id, name: billHeader.CityName },
      party: { id: billHeader.party_id, name: billHeader.PartyName },
      monthly_duty: dutySetup,
    };
    delete restructuredHeader.CompanyName;
    delete restructuredHeader.BranchName;
    delete restructuredHeader.CityName;
    delete restructuredHeader.PartyName;
    delete restructuredHeader.DutySetupJSON;

    billHeader = restructuredHeader;
  }

  return {
    billHeader,
    bookings,
    taxable,
    nonTaxable,
  };
};


exports.getBookingListByInvoiceId = async (params) => {
  const { booking_entry_id = 0 } = params;
  if (!booking_entry_id) {
    console.warn(`[getBookingsListByMID] 'booking_entry_id' is missing or zero. Received params:`, params);
    return []; // Return empty array if no valid ID is provided
  }

  const pdo = new PDO();
  const sqlQuery = `
SELECT TOP 100
    bk.ID AS BookingID,
    bk.SlipNo,
    CONVERT(VARCHAR, bk.RentalDate, 103) AS StartDate,
    FORMAT(bk.GarageInDate, 'dd/MM/yyyy') AS EndDate,
    ct.Car_Type,
    bk.CarNo,
    (SELECT TOP 1 G.GustName 
     FROM Bookingsummery AS G 
     WHERE BookingID = bk.ID) AS GuestName,
    FORMAT(CONVERT(DATETIME, ISNULL(bk.GarageOutTime, '00:00')), 'HH:mm') AS GarageOutTime,
    FORMAT(bk.GarageInDate, 'HH:mm') AS GarageInTime,
    bk.GarageOutKm,
    bk.GarageInKm,
    bk.TotalHour,
    bk.TotalKm,
    ISNULL(
        (SELECT STRING_AGG(c.charge_name + ' Rs. ' + CONVERT(VARCHAR, a.Amount), '#')
         FROM tbl_booking_charge_summery AS a
         LEFT JOIN charges_mast AS c 
            ON a.ChargeId = c.ID
         WHERE a.BookingID = bk.ID 
           AND a.charge_Type = 'party'), 
        ''
    ) AS ChargesDetl,  -- ✅ Added
    ISNULL(bk.Project,'') AS Project, -- ✅ Added
    ISNULL(bk.BookedBy, '') AS BookedBy,
    w.Name AS DutyType,
    v.Party_Name,
    ISNULL(bk.Advance, 0) AS Advance,
    fc.CityName AS FromCity,
    tc.CityName AS ToCity,
    '' AS CarTypeName,
    '' AS DutyTypeName,
    CAST(1 AS BIT) AS selected
FROM MonthlyBillMap AS mbm
JOIN booking_details AS bk 
    ON bk.id = mbm.booking_id
LEFT JOIN Car_Type_Mast AS ct 
    ON bk.CarType = ct.ID
LEFT JOIN duty_type_mast AS w 
    ON bk.DutyType = w.ID
LEFT JOIN Party_Mast AS v 
    ON bk.Party = v.ID
LEFT JOIN city_mast AS fc 
    ON bk.FromCityID = fc.Id
LEFT JOIN city_mast AS tc 
    ON bk.ToCityID = tc.Id
WHERE mbm.booking_entry_id = @booking_entry_id
ORDER BY mbm.id DESC;`;
  const result = await pdo.execute({
    sqlQuery,
    params: { booking_entry_id: booking_entry_id },
    ttl: 300,
  });
  return result;
}

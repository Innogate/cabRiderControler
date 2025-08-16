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


exports.createMonthlyBill = async (params) => {
    const {
        taxtype = null,
        BillDate = null,
        BillNo = null,
        company_id = null,
        parent_company_id = 0,
        branch_id = null,
        city_id = null,
        party_id = null,
        GrossAmount = 0.00,
        OtherCharges = 0.00,
        IGSTPer = 0.00,
        CGSTPer = 0.00,
        SGSTPer = 0.00,
        IGST = 0.00,
        CGST = 0.00,
        SGST = 0.00,
        OtherCharges2 = 0.00,
        round_off = 0.00,
        Advance = 0.00,
        Discount = 0.00,
        NetAmount = 0.00,
        user_id = 0,
        rcm = null,
        monthly_duty_id = null,
        fixed_amount = 0.00,
        no_of_days = null,
        fixed_amount_total = 0.00,
        extra_hours = 0.00,
        extra_hours_rate = 0.00,
        extra_hours_amount = 0.00,
        extra_km = 0.00,
        extra_km_rate = 0.00,
        extra_km_amount = 0.00,
        except_day_hrs = 0.00,
        except_day_hrs_rate = 0.00,
        except_day_hrs_amount = 0.00,
        except_day_km = 0.00,
        except_day_km_rate = 0.00,
        except_day_km_amount = 0.00,
        fuel_amount = 0.00,
        mobil_amount = 0.00,
        parking_amount = 0.00,
        night_amount = 0.00,
        outstation_amount = 0.00,
        proportionate = 0.00,
        bill_total = 0.00,
        amount_payable = 0.00,
        remarks = null,
        Invcancel = 'N',
        InvcancelOn = null,
        Invcancelby = null,
        InvcancelReason = null
    } = params;

    const pdo = new PDO();
    
    const result = await pdo.execute({
        sqlQuery: `
            INSERT INTO "MonthlyBillHead" (
                taxtype, "BillDate", "BillNo", company_id, parent_company_id, branch_id, city_id, party_id,
                "GrossAmount", "OtherCharges", "IGSTPer", "CGSTPer", "SGSTPer", "IGST", "CGST", "SGST", "OtherCharges2",
                round_off, "Advance", "Discount", "NetAmount", user_id, rcm, monthly_duty_id, fixed_amount,
                no_of_days, fixed_amount_total, extra_hours, extra_hours_rate, extra_hours_amount,
                extra_km, extra_km_rate, extra_km_amount, except_day_hrs, except_day_hrs_rate,
                except_day_hrs_amount, except_day_km, except_day_km_rate, except_day_km_amount,
                fuel_amount, mobil_amount, parking_amount, night_amount, outstation_amount,
                proportionate, bill_total, amount_payable, remarks, "Invcancel", "InvcancelOn",
                "Invcancelby", "InvcancelReason"
            )
            OUTPUT INSERTED.id
            VALUES (
                @taxtype, @BillDate, @BillNo, @company_id, @parent_company_id, @branch_id, @city_id, @party_id,
                @GrossAmount, @OtherCharges, @IGSTPer, @CGSTPer, @SGSTPer, @IGST, @CGST, @SGST, @OtherCharges2,
                @round_off, @Advance, @Discount, @NetAmount, @user_id, @rcm, @monthly_duty_id, @fixed_amount,
                @no_of_days, @fixed_amount_total, @extra_hours, @extra_hours_rate, @extra_hours_amount,
                @extra_km, @extra_km_rate, @extra_km_amount, @except_day_hrs, @except_day_hrs_rate,
                @except_day_hrs_amount, @except_day_km, @except_day_km_rate, @except_day_km_amount,
                @fuel_amount, @mobil_amount, @parking_amount, @night_amount, @outstation_amount,
                @proportionate, @bill_total, @amount_payable, @remarks, @Invcancel, @InvcancelOn,
                @Invcancelby, @InvcancelReason
            );
        `,
        params: {
            taxtype,
            BillDate,
            BillNo,
            company_id,
            parent_company_id,
            branch_id,
            city_id,
            party_id,
            GrossAmount,
            OtherCharges,
            IGSTPer,
            CGSTPer,
            SGSTPer,
            IGST,
            CGST,
            SGST,
            OtherCharges2,
            round_off,
            Advance,
            Discount,
            NetAmount,
            user_id,
            rcm,
            monthly_duty_id,
            fixed_amount,
            no_of_days,
            fixed_amount_total,
            extra_hours,
            extra_hours_rate,
            extra_hours_amount,
            extra_km,
            extra_km_rate,
            extra_km_amount,
            except_day_hrs,
            except_day_hrs_rate,
            except_day_hrs_amount,
            except_day_km,
            except_day_km_rate,
            except_day_km_amount,
            fuel_amount,
            mobil_amount,
            parking_amount,
            night_amount,
            outstation_amount,
            proportionate,
            bill_total,
            amount_payable,
            remarks,
            Invcancel,
            InvcancelOn,
            Invcancelby,
            InvcancelReason
        }
    });

    return result;
};

// Optional: Update function
exports.updateMonthlyBill = async (params) => {
    const {
        id,
        taxtype = null,
        BillDate = null,
        BillNo = null,
        company_id = null,
        parent_company_id = 0,
        branch_id = null,
        city_id = null,
        party_id = null,
        GrossAmount = 0.00,
        OtherCharges = 0.00,
        IGSTPer = 0.00,
        CGSTPer = 0.00,
        SGSTPer = 0.00,
        IGST = 0.00,
        CGST = 0.00,
        SGST = 0.00,
        OtherCharges2 = 0.00,
        round_off = 0.00,
        Advance = 0.00,
        Discount = 0.00,
        NetAmount = 0.00,
        user_id = 0,
        rcm = null,
        monthly_duty_id = null,
        fixed_amount = 0.00,
        no_of_days = null,
        fixed_amount_total = 0.00,
        extra_hours = 0.00,
        extra_hours_rate = 0.00,
        extra_hours_amount = 0.00,
        extra_km = 0.00,
        extra_km_rate = 0.00,
        extra_km_amount = 0.00,
        except_day_hrs = 0.00,
        except_day_hrs_rate = 0.00,
        except_day_hrs_amount = 0.00,
        except_day_km = 0.00,
        except_day_km_rate = 0.00,
        except_day_km_amount = 0.00,
        fuel_amount = 0.00,
        mobil_amount = 0.00,
        parking_amount = 0.00,
        night_amount = 0.00,
        outstation_amount = 0.00,
        proportionate = 0.00,
        bill_total = 0.00,
        amount_payable = 0.00,
        remarks = null,
        Invcancel = 'N',
        InvcancelOn = null,
        Invcancelby = null,
        InvcancelReason = null
    } = params;

    const pdo = new PDO();
    
    const result = await pdo.execute({
        sqlQuery: `
            UPDATE "MonthlyBillHead" 
            SET 
                taxtype = @taxtype,
                "BillDate" = @BillDate,
                "BillNo" = @BillNo,
                company_id = @company_id,
                parent_company_id = @parent_company_id,
                branch_id = @branch_id,
                city_id = @city_id,
                party_id = @party_id,
                "GrossAmount" = @GrossAmount,
                "OtherCharges" = @OtherCharges,
                "IGSTPer" = @IGSTPer,
                "CGSTPer" = @CGSTPer,
                "SGSTPer" = @SGSTPer,
                "IGST" = @IGST,
                "CGST" = @CGST,
                "SGST" = @SGST,
                "OtherCharges2" = @OtherCharges2,
                round_off = @round_off,
                "Advance" = @Advance,
                "Discount" = @Discount,
                "NetAmount" = @NetAmount,
                user_id = @user_id,
                rcm = @rcm,
                monthly_duty_id = @monthly_duty_id,
                fixed_amount = @fixed_amount,
                no_of_days = @no_of_days,
                fixed_amount_total = @fixed_amount_total,
                extra_hours = @extra_hours,
                extra_hours_rate = @extra_hours_rate,
                extra_hours_amount = @extra_hours_amount,
                extra_km = @extra_km,
                extra_km_rate = @extra_km_rate,
                extra_km_amount = @extra_km_amount,
                except_day_hrs = @except_day_hrs,
                except_day_hrs_rate = @except_day_hrs_rate,
                except_day_hrs_amount = @except_day_hrs_amount,
                except_day_km = @except_day_km,
                except_day_km_rate = @except_day_km_rate,
                except_day_km_amount = @except_day_km_amount,
                fuel_amount = @fuel_amount,
                mobil_amount = @mobil_amount,
                parking_amount = @parking_amount,
                night_amount = @night_amount,
                outstation_amount = @outstation_amount,
                proportionate = @proportionate,
                bill_total = @bill_total,
                amount_payable = @amount_payable,
                remarks = @remarks,
                "Invcancel" = @Invcancel,
                "InvcancelOn" = @InvcancelOn,
                "Invcancelby" = @Invcancelby,
                "InvcancelReason" = @InvcancelReason
            WHERE id = @id;
        `,
        params: {
            id,
            taxtype,
            BillDate,
            BillNo,
            company_id,
            parent_company_id,
            branch_id,
            city_id,
            party_id,
            GrossAmount,
            OtherCharges,
            IGSTPer,
            CGSTPer,
            SGSTPer,
            IGST,
            CGST,
            SGST,
            OtherCharges2,
            round_off,
            Advance,
            Discount,
            NetAmount,
            user_id,
            rcm,
            monthly_duty_id,
            fixed_amount,
            no_of_days,
            fixed_amount_total,
            extra_hours,
            extra_hours_rate,
            extra_hours_amount,
            extra_km,
            extra_km_rate,
            extra_km_amount,
            except_day_hrs,
            except_day_hrs_rate,
            except_day_hrs_amount,
            except_day_km,
            except_day_km_rate,
            except_day_km_amount,
            fuel_amount,
            mobil_amount,
            parking_amount,
            night_amount,
            outstation_amount,
            proportionate,
            bill_total,
            amount_payable,
            remarks,
            Invcancel,
            InvcancelOn,
            Invcancelby,
            InvcancelReason
        }
    });

    return result;
};

exports.getMonthlyBillById = async (params) => {
    const { id } = params;
    const pdo = new PDO();
    
    const result = await pdo.execute({
        sqlQuery: `SELECT * FROM "MonthlyBillHead" WHERE id = @id;`,
        params: { id },
        ttl: 300
    });
    
    return result[0] || null;
};
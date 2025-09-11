const PDO = require("../core/pod.js");


exports.getAllGeneralSaleBillHeaders = async (params) => {
  const { Parent_CompanyID, pageSize = 10, page = 1 } = params;
  try {
    const pdo = new PDO();
    const offset = (page - 1) * pageSize;

    const totalResult = await pdo.execute({
      sqlQuery: `
        SELECT COUNT(*) AS total 
        FROM GenSaleBillHead 
        WHERE Parent_CompanyID = @Parent_CompanyID
      `,
      params: { Parent_CompanyID },
    });

    const totalRecords = totalResult[0]?.total || 0;
    if (totalRecords === 0) {
      return {
        data: [],
        totalRecords,
        StatusID: 2,
        StatusMessage: "No bill found",
      };
    }
    const rows = await pdo.execute({
      sqlQuery: `
        SELECT 
          id,
          InvNo,
          InvDate,
          DueDate,
          InvType,
          GrossAmt,
          EntryDate
        FROM GenSaleBillHead
        WHERE Parent_CompanyID = @Parent_CompanyID
        ORDER BY EntryDate DESC
        OFFSET @offset ROWS FETCH NEXT @pageSize ROWS ONLY
      `,
      params: { Parent_CompanyID, offset, pageSize },
    });

    return {
      data: rows,
      totalRecords,
      currentPage: page,
      pageSize,
      totalPages: Math.ceil(totalRecords / pageSize),
      StatusID: 1,
      StatusMessage: "fetched successfully",
    };

  } catch (error) {
    return {
      data: [],
      StatusID: 0,
      StatusMessage: error.message,
    };
  }
};


exports.createGeneRaleSaleBill = async (params) => {
  const {
    company_id,
    BranchID,
    Parent_CompanyID,
    CityID,
    InvNo,
    InvDate,
    DueDate,
    PartyID,
    InvType,
    TaxType,
    RCM,
    GrossAmt,
    TaxChargesName1,
    TaxChargeAmt1,
    TaxChargesName2,
    TaxChargeAmt2,
    DiscPer,
    DiscAmt,
    CGSTPer,
    CGSTAmt,
    SGSTPer,
    SGSTAmt,
    IGSTPer,
    IGSTAmt,
    NonTaxChargeName1,
    NonTaxChargeAmt1,
    NonTaxChargeName2,
    NonTaxChargeAmt2,
    RndOffAmt,
    NetAmt,
    user_id,
    AmtAdjusted,
    transactions = []
  } = params;

  try {
    const pdo = new PDO();
   const moment = require("moment");

    const headResult = await pdo.execute({
      sqlQuery: `
        INSERT INTO GenSaleBillHead (
          Company_ID, BranchID, Parent_CompanyID, CityID, InvNo, InvDate, DueDate, PartyID,
          InvType, TaxType, RCM, GrossAmt, TaxChargesName1, TaxChargeAmt1, TaxChargesName2,
          TaxChargeAmt2, DiscPer, DiscAmt, CGSTPer, CGSTAmt, SGSTPer, SGSTAmt, IGSTPer, IGSTAmt,
          NonTaxChargeName1, NonTaxChargeAmt1, NonTaxChargeName2, NonTaxChargeAmt2,
          RndOffAmt, NetAmt, UserID, EntryDate, AmtAdjusted
        )
        OUTPUT INSERTED.id
        VALUES (
          @company_id, @BranchID, @Parent_CompanyID, @CityID, @InvNo, @InvDate, @DueDate,
          @PartyID, @InvType, @TaxType, @RCM, @GrossAmt, @TaxChargesName1, @TaxChargeAmt1,
          @TaxChargesName2, @TaxChargeAmt2, @DiscPer, @DiscAmt, @CGSTPer, @CGSTAmt,
          @SGSTPer, @SGSTAmt, @IGSTPer, @IGSTAmt, @NonTaxChargeName1, @NonTaxChargeAmt1,
          @NonTaxChargeName2, @NonTaxChargeAmt2, @RndOffAmt, @NetAmt, @user_id,
          @EntryDate, @AmtAdjusted
        )
      `,
      params: {
        company_id,
        BranchID,
        Parent_CompanyID,
        CityID,
        InvNo,
        InvDate,
        DueDate,
        PartyID,
        InvType,
        TaxType,
        RCM,
        GrossAmt,
        TaxChargesName1,
        TaxChargeAmt1,
        TaxChargesName2,
        TaxChargeAmt2,
        DiscPer,
        DiscAmt,
        CGSTPer,
        CGSTAmt,
        SGSTPer,
        SGSTAmt,
        IGSTPer,
        IGSTAmt,
        NonTaxChargeName1,
        NonTaxChargeAmt1,
        NonTaxChargeName2,
        NonTaxChargeAmt2,
        RndOffAmt,
        NetAmt,
        user_id,
        EntryDate: moment().format("YYYY-MM-DD HH:mm:ss"),
        AmtAdjusted,
      },
    });

    const headerId = headResult?.[0]?.id;
    if (!headerId) throw new Error("GenSaleBillHead insert failed");

    for (const tran of transactions) {
      await pdo.execute({
        sqlQuery: `
      INSERT INTO GenSaleBillTran
        (HeaderID, Description, UnitName, Qty, Rate, Amt, EntryDate)
      VALUES
        (@headerId, @Description, @UnitName, @Qty, @Rate, @Amt, @EntryDate)
    `,
        params: {
          headerId,
          Description: tran.Description,
          UnitName: tran.UnitName,
          Qty: tran.Qty || 0,
          Rate: tran.Rate || 0,
          Amt: tran.Amt || 0,
          EntryDate: moment().format("YYYY-MM-DD HH:mm:ss"),
        },
      });
    }


    const headData = await pdo.execute({
      sqlQuery: `SELECT * FROM GenSaleBillHead WHERE id = @HeaderID`,
      params: { HeaderID: headerId },
    });

    const tranData = await pdo.execute({
      sqlQuery: `SELECT * FROM GenSaleBillTran WHERE HeaderID = @HeaderID`,
      params: { HeaderID: headerId },
    });

    return {
      data: {
        ...headData[0],
        transactions: tranData,
      },
      StatusID: 1,
      StatusMessage: "Bill created successfully",
    };

  } catch (error) {
    return {
      data: [],
      StatusID: 0,
      StatusMessage: error.message,
    };
  }
};

const PDO = require("../core/pod.js");

exports.getJournalsByCompany = async (params) => {
  const { company_id, pageSize, page } = params;
  try {
    const pdo = new PDO();
    const offset = (page - 1) * pageSize;

    const totalResult = await pdo.execute({
      sqlQuery: `
        SELECT COUNT(*) AS total
        FROM JournalHead 
        WHERE Parent_CompanyID = @company_id
      `,
      params: { company_id },
    });

    const totalRecords = totalResult[0]?.total || 0;
    if (totalRecords === 0) {
      return {
        data: [],
        totalRecords,
        StatusID: 2,
        StatusMessage: "No journals found for this company",
      };
    }

    const rows = await pdo.execute({
      sqlQuery: `
       SELECT 
       h.id AS HeadID,
       h.Company_ID,
       h.BranchID,
       h.Parent_CompanyID,
       h.VouchNo,
       h.VouchDate,
       h.Narr,               
       h.TotalDebitAmt,
       h.TotalCreditAmt,
       h.AmtAdjusted,
       h.CancelYN,
       h.CancelBy,
       h.CancelOn,
       h.CancelReason,
       h.CreatedBy,
       h.CreatedAt,
       h.UpdatedBy,
       h.UpdatedAt,

  -- JournalTran columns
  t.id AS TranID,
  t.HeaderID,
  t.LedgerType,
  t.PartyID,
  t.DebitAmt,
  t.CreditAmt,
  t.CreatedOn AS TranCreatedOn,
  t.CreatedBy AS TranCreatedBy,
  t.UpdatedAt AS TranUpdatedAt,
  t.UpdatedBy AS TranUpdatedBy

FROM JournalHead h
LEFT JOIN JournalTran t ON h.ID = t.HeaderID
WHERE h.Parent_CompanyID = @company_id
ORDER BY h.CreatedAt DESC
OFFSET @offset ROWS FETCH NEXT @pageSize ROWS ONLY;

      `,
      params: { company_id, offset, pageSize },
    });

    const grouped = Object.values(
      rows.reduce((acc, row) => {
        if (!acc[row.HeadID]) {
          acc[row.HeadID] = {
            id: row.HeadID,
            Company_ID: row.Company_ID,
            BranchID: row.BranchID,
            Parent_CompanyID: row.Parent_CompanyID,
            VouchNo: row.VouchNo,
            VouchDate: row.VouchDate,
            Narr: row.Narr,
            TotalDebitAmt: row.TotalDebitAmt,
            TotalCreditAmt: row.TotalCreditAmt,
            AmtAdjusted: row.AmtAdjusted,
            CancelYN: row.CancelYN,
            CancelBy: row.CancelBy,
            CancelOn: row.CancelOn,
            CancelReason: row.CancelReason,
            CreatedBy: row.CreatedBy,
            CreatedAt: row.CreatedAt,
            UpdatedBy: row.UpdatedBy,
            UpdatedAt: row.UpdatedAt,
            transactions: [],
          };
        }
        if (row.TranID) {
          acc[row.HeadID].transactions.push({
            ID: row.TranID,
            HeaderID: row.HeaderID,
            AccountID: row.AccountID,
            DebitAmt: row.DebitAmt,
            CreditAmt: row.CreditAmt,
            Narr: row.TranNarr,
          });
        }
        return acc;
      }, {})
    );

    return {
      data: grouped,
      totalRecords,
      currentPage: page,
      pageSize,
      totalPages: Math.ceil(totalRecords / pageSize),
      StatusID: 1,
      StatusMessage: "Journals fetched successfully",
    };

  } catch (error) {
    return {
      data: [],
      StatusID: 0,
      StatusMessage: error.message,
    };
  }
};




exports.createJournal = async (params) => {
  const {
    company_id,
    seletedCompany,
    branchId,
    vouchNo,
    vouchDate,
    narr,
    totalDebitAmt,
    totalCreditAmt,
    amtAdjusted = 0,
    cancelYN = "N",
    cancelBy = null,
    cancelOn = null,
    cancelReason = null,
    user_id,
    createdAt = new Date(),
    updatedAt = new Date(),
    transactions = []
  } = params;

  try {
    const pdo = new PDO();

    const headResult = await pdo.execute({
      sqlQuery: `
        INSERT INTO JournalHead
          (Company_ID, BranchID, Parent_CompanyID, VouchNo, VouchDate, Narr,
           TotalDebitAmt, TotalCreditAmt, AmtAdjusted, CancelYN, CancelBy, CancelOn, CancelReason,
           CreatedBy, CreatedAt, UpdatedBy, UpdatedAt)
        OUTPUT INSERTED.ID
        VALUES
          (@seletedCompany, @branchId, @company_id, @vouchNo, @vouchDate, @narr,
           @totalDebitAmt, @totalCreditAmt, @amtAdjusted, @cancelYN, @cancelBy, @cancelOn, @cancelReason,
           @user_id, @createdAt, @user_id, @updatedAt)
      `,
      params: {
        seletedCompany,
        company_id,
        branchId,
        vouchNo,
        vouchDate,
        narr,
        totalDebitAmt,
        totalCreditAmt,
        amtAdjusted,
        cancelYN,
        cancelBy,
        cancelOn,
        cancelReason,
        user_id,
        createdAt,
        updatedAt
      },
    });

    const headerId = headResult[0]?.ID;
    if (!headerId) throw new Error("JournalHead insert failed");

    for (const tran of transactions) {
      await pdo.execute({
        sqlQuery: `
          INSERT INTO JournalTran
            (HeaderID, LedgerType, PartyID, DebitAmt, CreditAmt,
             CreatedOn, CreatedBy, UpdatedAt, UpdatedBy)
          VALUES
            (@headerId, @ledgerType, @partyId, @debitAmt, @creditAmt,
             @createdAt, @user_id, @updatedAt, @user_id)
        `,
        params: {
          headerId,
          ledgerType: tran.ledgerType,
          partyId: tran.partyId,
          debitAmt: tran.debitAmt || 0,
          creditAmt: tran.creditAmt || 0,
          createdAt,
          updatedAt,
          user_id
        },
      });
    }

    const headData = await pdo.execute({
      sqlQuery: `SELECT * FROM JournalHead WHERE ID = @headerId`,
      params: { headerId },
    });

    const tranData = await pdo.execute({
      sqlQuery: `SELECT * FROM JournalTran WHERE HeaderID = @headerId`,
      params: { headerId },
    });

    return {
      data: {
        ...headData[0],
        transactions: tranData,
      },
      StatusID: 1,
      StatusMessage: "Journal created successfully",
    };
  } catch (error) {
    return {
      data: [],
      StatusID: 0,
      StatusMessage: error.message,
    };
  }
};

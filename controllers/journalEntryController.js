const PDO = require("../core/pod.js");
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

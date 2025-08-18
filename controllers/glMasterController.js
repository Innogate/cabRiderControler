const sql = require("mssql");
const PDO = require("../core/pod.js");

exports.getAllGlList = async (params) => {
  try {
    const { page, pageSize, company_id } = params;
    const offset = (page - 1) * pageSize;
    const pdo = new PDO();
    // Get paginated data
    const result = await pdo.execute({
      sqlQuery: `
    SELECT *
    FROM GLMast
    WHERE company_id = ${company_id}
    ORDER BY id
    OFFSET ${offset} ROWS FETCH NEXT ${pageSize} ROWS ONLY
  `,
    });
    // Get total count
    const totalCountResult = await pdo.execute({
      sqlQuery: `SELECT COUNT(*) as TotalCount FROM GLMast WHERE company_id = ${company_id}`,
    });

    const totalCount = totalCountResult[0]?.TotalCount || 0;
    return {
      data: result,
      StatusID: 1,
      StatusMessage: "Data fetched successfully",
      TotalCount: totalCount,
      Page: page,
      PageSize: pageSize,
      TotalPages: Math.ceil(totalCount / pageSize),
    };
  } catch (error) {
    return {
      data: [],
      StatusID: 0,
      StatusMessage: error.message,
      TotalCount: 0,
      Page: params.page || 1,
      PageSize: params.pageSize || 10,
      TotalPages: 0,
    };
  }
};

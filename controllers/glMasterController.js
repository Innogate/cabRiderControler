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
    WHERE company_id = ${company_id} AND active_status = 1
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

exports.getAllGlTypes = async (params) => {
  try {
    const pdo = new PDO();
    const result = await pdo.execute({
      sqlQuery: `
    SELECT *
    FROM GlTypes
  `,
    });
    const totalCountResult = await pdo.execute({
      sqlQuery: `SELECT COUNT(*) as TotalCount FROM GlTypes`,
    });

    const totalCount = totalCountResult[0]?.TotalCount || 0;
    return {
      data: result,
      StatusID: 1,
      StatusMessage: "Data fetched successfully",
      TotalCount: totalCount,
    };
  } catch (error) {
    return {
      data: [],
      StatusID: 0,
      StatusMessage: error.message,
      TotalCount: 0,
    };
  }
};

exports.createGl = async (params) => {
  const { GLName, GLType, company_id, user_id } = params;

  try {
    const pdo = new PDO();
    const now = new Date();

    // Insert new record and return inserted row
    const result = await pdo.execute({
      sqlQuery: `
        INSERT INTO GLMast 
        (GLName, GLType, company_id, CreatedBy, CreatedAt, UpdatedBy, UpdatedAt)
        OUTPUT INSERTED.*
        VALUES 
        (@GLName, @GLType, @company_id, @user_id, @now, @user_id, @now)
      `,
      params: { GLName, GLType, company_id, user_id, now },
    });

    const totalCountResult = await pdo.execute({
      sqlQuery: `SELECT COUNT(*) as TotalCount FROM GLMast WHERE company_id = @company_id`,
      params: { company_id },
    });

    const totalCount = totalCountResult[0]?.TotalCount || 0;

    return {
      data: result[0], // returning inserted record
      StatusID: 1,
      StatusMessage: "GL Create successfully",
      TotalCount: totalCount,
    };
  } catch (error) {
    return {
      data: [],
      StatusID: 0,
      StatusMessage: error.message,
      TotalCount: 0,
    };
  }
};

exports.updateGl = async (params) => {
  const { id, GLName, GLType, company_id, user_id } = params;
  try {
    const pdo = new PDO();
    const now = new Date();

    // Update record and return updated row
    const result = await pdo.execute({
      sqlQuery: `
        UPDATE GLMast
        SET 
          GLName = @GLName,
          GLType = @GLType,
          company_id = @company_id,
          UpdatedBy = @user_id,
          UpdatedAt = @now
        OUTPUT INSERTED.*
        WHERE id = @id
      `,
      params: { id, GLName, GLType, company_id, user_id, now },
    });

    if (!result.length) {
      return {
        data: [],
        StatusID: 0,
        StatusMessage: "GL not found or no changes applied",
        TotalCount: 0,
      };
    }

    const totalCountResult = await pdo.execute({
      sqlQuery: `SELECT COUNT(*) as TotalCount FROM GLMast WHERE company_id = @company_id`,
      params: { company_id },
    });

    const totalCount = totalCountResult[0]?.TotalCount || 0;

    return {
      data: result[0], // returning updated record
      StatusID: 1,
      StatusMessage: "GL updated successfully",
      TotalCount: totalCount,
    };
  } catch (error) {
    return {
      data: [],
      StatusID: 0,
      StatusMessage: error.message,
      TotalCount: 0,
    };
  }
};

exports.deleteGl = async (params) => {
  const { id, company_id } = params;
  try {
    const pdo = new PDO();
    const now = new Date();

    // Update record and return updated row
    const result = await pdo.execute({
      sqlQuery: `
        UPDATE GLMast
        SET 
         active_status = 0
        OUTPUT INSERTED.*
        WHERE id = @id
      `,
      params: { id },
    });

    if (!result.length) {
      return {
        data: [],
        StatusID: 0,
        StatusMessage: "GL not found or no changes applied",
        TotalCount: 0,
      };
    }

    const totalCountResult = await pdo.execute({
      sqlQuery: `SELECT COUNT(*) as TotalCount FROM GLMast WHERE company_id = @company_id`,
      params: { company_id },
    });

    const totalCount = totalCountResult[0]?.TotalCount || 0;

    return {
      data: result[0], // returning updated record
      StatusID: 1,
      StatusMessage: "GL delete successfully",
      TotalCount: totalCount,
    };
  } catch (error) { 
    return {
      data: [],
      StatusID: 0,
      StatusMessage: error.message,
      TotalCount: 0,
    };
  }
};
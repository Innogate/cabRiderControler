const sql = require("mssql");
const PDO = require("../core/pod.js");

// Get user by ID with Redis-cached SELECT query
exports.getUser = async (id) => {
  const pdo = new PDO();
  const data = await pdo.execute({
    key: `user:${id}`, // Redis key
    sqlQuery: `SELECT * FROM users WHERE id = '${id}'`,
    ttl: 120,
  });
  return data;
};

// Login user via stored procedure
exports.loginUser = async (username, password) => {
  const pdo = new PDO();

  const { data, output } = await pdo.callProcedure({
    procName: "sp_ui_login_user",
    inputParams: [
      { name: "username", type: sql.VarChar(50), value: username },
      { name: "password", type: sql.VarChar(50), value: password },
      { name: "PageNo", type: sql.Int, value: 1 },
      { name: "PageSize", type: sql.Int, value: 10 },
      { name: "Search", type: sql.VarChar(200), value: "" },
      { name: "user_id", type: sql.Int, value: 1 },
      { name: "company_id", type: sql.Int, value: 1 },
    ],
    outputParams: [
      { name: "StatusID", type: sql.Int },
      { name: "StatusMessage", type: sql.VarChar(200) },
      { name: "TotalCount", type: sql.Int },
    ],
  });

  return {
    user: data[0] || null,
    status: output.StatusID,
    message: output.StatusMessage,
  };
};

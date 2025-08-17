const sql = require("mssql");
const redis = require("redis");

let globalPool = null;
let globalRedis = null;

// Initialize SQL Pool
async function initPool() {
  if (!globalPool) {
    globalPool = await sql.connect({
      user: process.env.DB_USER,
      password: process.env.DB_PASS,
      database: process.env.DB_NAME,
      server: process.env.DB_HOST,
      port: Number(process.env.DB_PORT),
      options: {
        trustServerCertificate: true,
        encrypt: false,
      },
    });
  }
  return globalPool;
}

// Initialize Redis
async function initRedis() {
  if (!globalRedis && process.env.USE_REDIS === "true") {
    globalRedis = redis.createClient({
      socket: {
        host: process.env.REDIS_HOST,
        port: Number(process.env.REDIS_PORT),
      },
    });
    globalRedis.on("error", (err) => console.error("❌ Redis error:", err));
    await globalRedis.connect();
  }
  return globalRedis;
}

class PDO {
  constructor() {
    this.pool = null;
    this.redis = null;
  }

  async connect() {
    this.pool = await initPool();
    this.redis = await initRedis();
  }

  /**
   * Execute raw SQL with optional Redis caching
   * @param {Object} options
   * @param {string} options.sqlQuery - SQL string to execute
   * @param {object} options.params - Named params object
   * @param {number} options.ttl - Time to live in Redis (in seconds)
   */
  async execute({ sqlQuery = "", params = {}, ttl = 120 }) {
    if (!this.pool || (process.env.USE_REDIS === "true" && !this.redis)) {
      await this.connect();
    }

    const key = this.redis
      ? `sql:${sqlQuery.replace(/\s+/g, " ")}:${JSON.stringify(params)}`
      : null;

    if (this.redis && key) {
      const cached = await this.redis.get(key);
      if (cached) return JSON.parse(cached);
    }

    const request = this.pool.request();

    // Bind all parameters
    for (const [name, value] of Object.entries(params)) {
      request.input(name, value);
    }

    const result = await request.query(sqlQuery);
    const data = result.recordset;

    if (this.redis && key) {
      await this.redis.set(key, JSON.stringify(data), { EX: ttl });
    }

    return data;
  }

  /**
   * Execute a stored procedure with in/out parameters, optionally cache result
   * @param {Object} options
   * @param {string} options.procName
   * @param {Array<{name:string,type:any,value:any}>} options.inputParams
   * @param {Array<{name:string,type:any}>} options.outputParams
   * @param {string|null} options.key
   * @param {number} options.ttl
   */
  async callProcedure({
    procName,
    inputParams = [],
    outputParams = [],
    key = null,
    ttl = 120,
  }) {
    if (!this.pool || (process.env.USE_REDIS === "true" && !this.redis)) {
      await this.connect();
    }

    // Auto key
    if (this.redis && process.env.USE_REDIS === "true") {
      if (!key) {
        const inputStr = inputParams.map((p) => `${p.name}=${p.value}`).join("|");
        key = `proc:${procName}:${inputStr}`;
      }
      const cached = await this.redis.get(key);
      if (cached) return JSON.parse(cached);
    }

    const request = this.pool.request();

    for (const param of inputParams) {
      request.input(param.name, param.type, param.value);
    }
    for (const param of outputParams) {
      request.output(param.name, param.type);
    }

    const result = await request.execute(procName);

    const response = {
      data: result.recordset || [],
      output: result.output || {},
    };

    if (this.redis && key) {
      await this.redis.set(key, JSON.stringify(response), { EX: ttl });
    }

    return response;
  }

  // ===============================
  // NEW: Transaction helpers (additive)
  // ===============================

  /**
   * Begin a SQL transaction and return { transaction, request } bound to it.
   * You can chain multiple requests using the same transaction.
   */
  async beginTransaction() {
    if (!this.pool) {
      await this.connect();
    }
    const transaction = new sql.Transaction(this.pool);
    await transaction.begin();
    const request = new sql.Request(transaction);
    return { transaction, request };
  }

  /**
   * Commit a given transaction
   */
  async commitTransaction(transaction) {
    if (transaction) {
      await transaction.commit();
    }
  }

  /**
   * Rollback a given transaction
   */
  async rollbackTransaction(transaction) {
    if (transaction) {
      try {
        await transaction.rollback();
      } catch (e) {
        // swallow rollback errors
      }
    }
  }

  /**
   * Convenience wrapper to run a set of queries atomically.
   * The callback receives a Request bound to the transaction.
   * Example:
   *   await pdo.executeInTransaction(async (trxRequest) => {
   *     trxRequest.input('x', 1);
   *     await trxRequest.query('INSERT ...');
   *     // Do more...
   *   });
   */
  async executeInTransaction(callback) {
    const { transaction, request } = await this.beginTransaction();
    try {
      const result = await callback(request);
      await this.commitTransaction(transaction);
      return result;
    } catch (err) {
      await this.rollbackTransaction(transaction);
      throw err;
    }
  }
}

module.exports = PDO;

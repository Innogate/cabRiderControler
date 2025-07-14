const sql = require("mssql");
const redis = require("redis");

let globalPool = null;
let globalRedis = null;

// Initialize SQL Pool
async function initPool() {
  if (!globalPool) {
    console.log("⏳ Connecting to SQL Server...");
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
    console.log("✅ SQL Server connected.");
  }
  return globalPool;
}

// Initialize Redis
async function initRedis() {
  if (!globalRedis && process.env.USE_REDIS === "true") {
    console.log("⏳ Connecting to Redis...");
    globalRedis = redis.createClient({
      socket: {
        host: process.env.REDIS_HOST,
        port: Number(process.env.REDIS_PORT),
      },
    });
    globalRedis.on("error", (err) => console.error("❌ Redis error:", err));
    await globalRedis.connect();
    console.log("✅ Redis connected.");
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
   * @param {string|null} options.key - Redis key
   * @param {string} options.sqlQuery - SQL string to execute
   * @param {number} options.ttl - Time to live in Redis (in seconds)
   */
  async execute({ sqlQuery = "", ttl = 120 }) {
    if (!this.pool || (process.env.USE_REDIS === "true" && !this.redis)) {
      await this.connect();
    }

    // Auto-generate Redis key based on query string
    const key = this.redis ? `sql:${sqlQuery.replace(/\s+/g, " ")}` : null;

    if (this.redis && key) {
      const cached = await this.redis.get(key);
      if (cached) {
        console.log(`🟢 Data retrieved from Redis cache for SQL key: ${key}`);
        return JSON.parse(cached);
      }
    }

    console.log("🟡 Executing SQL query from DB...");
    const result = await this.pool.request().query(sqlQuery);
    const data = result.recordset;

    if (this.redis && key) {
      console.log(
        `📝 Caching SQL result in Redis with key: ${key} (TTL: ${ttl}s)`
      );
      await this.redis.set(key, JSON.stringify(data), { EX: ttl });
    }

    return data;
  }

  /**
   * Execute a stored procedure with in/out parameters, optionally cache result
   * @param {Object} options
   * @param {string} options.procName - Name of the stored procedure
   * @param {Array} options.inputParams - Input parameters [{ name, type, value }]
   * @param {Array} options.outputParams - Output parameters [{ name, type }]
   * @param {string|null} options.key - Optional Redis key for caching
   * @param {number} options.ttl - TTL for Redis cache
   */
  // ✅ Stored procedure call with automatic Redis key handling
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

    // 🔑 Auto-generate Redis key from procName + input param values
    if (this.redis && process.env.USE_REDIS === "true") {
      if (!key) {
        const inputStr = inputParams
          .map((p) => `${p.name}=${p.value}`)
          .join("|");
        key = `proc:${procName}:${inputStr}`;
      }

      // Try Redis
      const cached = await this.redis.get(key);
      if (cached) {
        console.log(
          `🟢 Data retrieved from Redis cache for procedure key: ${key}`
        );
        return JSON.parse(cached);
      }
    }

    console.log(`🛠️ Calling stored procedure: ${procName}`);
    const request = this.pool.request();

    for (const param of inputParams) {
      console.log(`➡️ Input: ${param.name} = ${param.value}`);
      request.input(param.name, param.type, param.value);
    }

    for (const param of outputParams) {
      console.log(`⬅️ Output: ${param.name}`);
      request.output(param.name, param.type);
    }

    const result = await request.execute(procName);

    console.log(`✅ Procedure ${procName} executed.`);
    if (result.output) {
      console.log("🔁 Output values:", result.output);
    }

    const response = {
      data: result.recordset || [],
      output: result.output || {},
    };

    // Cache the result in Redis
    if (this.redis && key) {
      console.log(
        `📝 Caching procedure result in Redis with key: ${key} (TTL: ${ttl}s)`
      );
      await this.redis.set(key, JSON.stringify(response), { EX: ttl });
    }

    return response;
  }
}

module.exports = PDO;
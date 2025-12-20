require("../app/config-env");

const databaseConfig = {
  define: {
    charset: "utf8mb4",
    collate: "utf8mb4_bin",
    underscored: false
  },
  pool: {
    max: parseInt(process.env.POSTGRES_POOL_MAX || "100"),
    min: parseInt(process.env.POSTGRES_POOL_MIN || "10"),
    acquire: parseInt(process.env.POSTGRES_POOL_ACQUIRE || "30000"),
    idle: parseInt(process.env.POSTGRES_POOL_IDLE || "10000")
  },
  dialect: "postgres" as const,
  timezone: "UTC",
  host: process.env.DB_HOST || "postgres",
  port: parseInt(process.env.DB_PORT || "5432"),
  database: process.env.DB_NAME || "chatex",
  username: process.env.DB_USER || "chatex",
  password: process.env.DB_PASS || "chatex",
  logging: false
};

export = databaseConfig;  // ← Compatível com CommonJS e ES Modules

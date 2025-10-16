import oracledb from "oracledb";


// Configure oracledb
oracledb.outFormat = oracledb.OUT_FORMAT_OBJECT;
oracledb.autoCommit = true;

interface PoolConfig {
    user: string;
    password: string;
    connectString: string;
    poolMin: number;
    poolMax: number;
    poolIncrement: number;
}

let pool: oracledb.Pool | null = null;

export async function getPool(): Promise<oracledb.Pool> {
    if (pool) {
        return pool;
    }

    const config: PoolConfig = {
        user: process.env.ORACLE_USER || "",
        password: process.env.ORACLE_PASSWORD || "",
        connectString: process.env.ORACLE_CONNECTION_STRING || "",
        poolMin: 2,
        poolMax: 10,
        poolIncrement: 1,
    };

    try {
        pool = await oracledb.createPool(config);
        console.log("✅ Oracle connection pool created");
        return pool;
    } catch (err) {
        console.error("❌ Error creating Oracle connection pool", err);
        throw err;
    }
}


export async function getConnection(): Promise<oracledb.Connection> {
    const pool = await getPool();
    return pool.getConnection();
}

export async function closePool(): Promise<void> {
    if (pool) {
        await pool.close(10);
        pool = null;
        console.log("Connection pool closed");
    }
}


// Graceful shutdown
process.on("SIGTERM", async () => {
    await closePool();
    process.exit(0);
});

process.on("SIGINT", async () => {
    await closePool();
    process.exit(0);
});
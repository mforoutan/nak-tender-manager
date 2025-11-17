import oracledb from "oracledb";


// Configure oracledb - remove autoCommit: true to allow manual transaction control
oracledb.outFormat = oracledb.OUT_FORMAT_OBJECT;
oracledb.fetchAsString = [oracledb.CLOB]; // Fetch CLOBs as strings

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

// Helper function for executing queries
export async function query(
    sql: string,
    params: any[] = [],
    options: oracledb.ExecuteOptions = {}
): Promise<any[]> {
    let connection: oracledb.Connection | null = null;
    try {
        connection = await getConnection();
        
        // Convert positional parameters to named parameters
        // Oracle named parameters use :paramName format
        let namedSql = sql;
        const namedParams: any = {};
        
        params.forEach((param, index) => {
            const paramName = `param${index + 1}`;
            namedSql = namedSql.replace(`:search${index + 1}`, `:${paramName}`);
            namedSql = namedSql.replace(`:type${index + 1}`, `:${paramName}`);
            namedSql = namedSql.replace(`:category${index + 1}`, `:${paramName}`);
            namedParams[paramName] = param;
        });
        
        const result = await connection.execute(namedSql, namedParams, {
            outFormat: oracledb.OUT_FORMAT_OBJECT,
            ...options,
        });
        
        return result.rows || [];
    } catch (error) {
        console.error('Database query error:', error);
        throw error;
    } finally {
        if (connection) {
            try {
                await connection.close();
            } catch (err) {
                console.error('Error closing connection:', err);
            }
        }
    }
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
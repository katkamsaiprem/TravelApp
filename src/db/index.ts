//Database connection pool
//instead of creating db connections ,every time for every query which is slow ,takes time ,so to solve it we use connection pool
//Connection pool maintains a pool of db connections ready to use.


import { env } from "../config/env.js"
import { drizzle } from "drizzle-orm/node-postgres"
import { Pool } from "pg"



const pool = new Pool({
    connectionString: env.DATABASE_URL,
    max: 20, // Render Free Postgres allows up to 50 active connections, 20 is safe
    idleTimeoutMillis: 30000,// if connection is not used within 30sec then close    
    connectionTimeoutMillis: 2000, // if a req is waiting for more than 2 seconds then give up and throw error
    


})




/**
 * create drizzle orm instance 
 * @param pool - postgres connection pool
 * @param schema - drizzle schema
 * @param logger - prints sql queries on console
 */
export const db = drizzle(pool, { logger: true, casing: "snake_case" })



export { pool }//export pool so we can close connections on server shutdown


/**
 * export the infered database type so compiler can know data type of db anywhere 
 * - Usefull for passing db as a parameter in tests
 */
export type Database = typeof db;
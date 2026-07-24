import dotenv from "dotenv";
import type { StringValue } from "ms"; // the duration-string type that jsonwebtoken uses for expiresIn


// Environment variables validation

// Instead of writing process.env.SOMETHING throughout your codebase, we create a single file that load .env config file on startup and validates all environment variables

// If any variable is missing ,it caches immediately with clear error message log


// Why ? if you deploy to production and forget to set value to env variable , your app craches on startup with clear log message like Misssing env variable : variable name

// instead of craching 3 minutes later with unclear log message like cannnot read property of undefined when you first query


//first load .env file into process.env before anything else reads it
dotenv.config();


const requireEnv = (key: string) => {

    const value = process.env[key] // we used bracket notation to check if the variable value is present inside obj as key

    if (!value) {
        throw new Error(`Missing required Environment variable: ${key}]\n` +
            `Make sure it is defined in your .env file `
        );
    }
    return value;
}

export const env = {
    NODE_ENV: (process.env.NODE_ENV ?? "development") as NodeEnv, // if left value is null or undefined then return default value as development
    PORT: parseInt(process.env.PORT ?? "3000", 10), // converts string into base 10 mathematical integer
    DATABASE_URL: requireEnv("DATABASE_URL"),// if not present then requireEnv stops backend
    CORS_ORIGIN: process.env.CORS_ORIGIN ?? "http://localhost:5173",
    ACCESS_TOKEN_SECRET: requireEnv("ACCESS_TOKEN_SECRET"),
    REFRESH_TOKEN_SECRET: requireEnv("REFRESH_TOKEN_SECRET"),
    ACCESS_TOKEN_EXPIRY: requireEnv("ACCESS_TOKEN_EXPIRY") as StringValue, // cast so jwt.sign accepts it as a valid duration (e.g. "15m","7d")
    REFRESH_TOKEN_EXPIRY: requireEnv("REFRESH_TOKEN_EXPIRY") as StringValue,
    COOKIE_SECRET: requireEnv("COOKIE_SECRET"),
    RAZORPAY_KEY_ID: requireEnv("RAZORPAY_KEY_ID"),
    RAZORPAY_KEY_SECRET: requireEnv("RAZORPAY_KEY_SECRET"),
} as const; // as const(const assertion) makes two things happens ,properties becomes readonly , values becomes literal(custom data )types ("development" instead of string,...)


//Type helper to check the env anywhere
export type NodeEnv = "development" | "production" | "test"; // union type (means only these three values are allowed)

//env flags
export const isDevelopment = env.NODE_ENV === "development";
export const isProduction = env.NODE_ENV === "production";
export const isTest = env.NODE_ENV === "test";



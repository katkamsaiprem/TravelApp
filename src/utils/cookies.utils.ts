import { env, isProduction } from "../config/env.js";
import { Response } from "express"


// code related to set and clear cookies 


export const COOKIE_NAMES = {
    ACCESS_TOKEN: "access_token",
    REFRESH_TOKEN: "refresh_token"
} as const; // as const makes prop as custom data type and readonly values

const BASE_COOKIE_CONFIG = {

    httpOnly: true,
    secure: isProduction, // https only in production , false in dev
    sameSite: isProduction ? "none" : "strict", // 'none' is required for cross-origin cookies in production
} as const


/**
 * setAccessToken
 *  get res.cookie and token then give token and config to res.cookie()
 *    
 */

export const setAccessToken = (res: Response, token: string): void => {
    res.cookie(COOKIE_NAMES.ACCESS_TOKEN, token, {
        ...BASE_COOKIE_CONFIG,
        path: "/",
        maxAge: parseInt(env.ACCESS_TOKEN_EXPIRY) * 60 * 1000// converts in milliseconds
    })
}

export const setRefreshToken = (res: Response, token: string): void => {
    res.cookie(COOKIE_NAMES.REFRESH_TOKEN, token, {
        ...BASE_COOKIE_CONFIG,
        path: "/api/v1/auth/refresh", // only sent to this specific endpoint
        maxAge: parseInt(env.REFRESH_TOKEN_EXPIRY) * 24 * 60 * 60 * 1000, //converts into milliseconds
    })
}


/**
 * clearCookies 
 *  clear both access token and refresh token
 *   used on logout , to clear it, send same options with empty values(tokens)
 */

export const clearCookies = (res: Response): void => {
    res.clearCookie(COOKIE_NAMES.ACCESS_TOKEN, {
        ...BASE_COOKIE_CONFIG,
        path: "/",
    })
    res.clearCookie(COOKIE_NAMES.REFRESH_TOKEN, {
        ...BASE_COOKIE_CONFIG,
        path: "/api/v1/auth/refresh"
    })
}




// code related to prevent brute force attack
/**
 * @description
 *  - Brute force attack ,attacker tries thousands of passwords per second
 *  - Rate Limiting - "After N failed request in x time,then block the IP"
 *  - we are just sending cofig data to rateLimit func ,it internally calls next()
 */

import rateLimit from "express-rate-limit";

export const authRateLimiter = (rateLimit as any)({
    windowMs: 15 * 60 * 1000, // 15 min
    max: 10,
    standardHeaders: true, // include rate limit info in response headers
    legacyHeaders: false, // disable legacy headers
    message: {
        success: false,
        message: "Too many authentication requests. Please try again after 15 minutes"
    },

    skipSuccessfulRequests: false, //count all requests , not just failures , so by counting success req too , you stop the script after 10min, regardless of whether correct or not



});

export const generalRateLimiter = (rateLimit as any)({
    windowMs: 15 * 60 * 1000,
    max: 1000,
    standardHeaders: true,
    legacyHeaders: false,
    message: {
        success: false,
        message: "Too many request from same IP , Please slow down"
    },

    skipSuccessfulRequests: false, 
});

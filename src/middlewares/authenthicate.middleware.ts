
import { COOKIE_NAMES } from "../utils/cookies.utils.js"
import { NextFunction, Request, Response } from "express"
import { AppError } from "./globalErrorHandler.middlewares.js";
import { verifyAccessToken } from "../utils/jwt.utils.js";
import { findUserById } from "../auth/auth.repository.js";
import { SafeUser } from "../auth/auth.service.js";


//code realted to verifing access token
// gatekeeper


// ts keep all types in declare global file (this is called module scoping)
// so we are breaking the file rule to extend express Request type with SafeUser type

declare global {
    namespace Express {
        interface Request {
            user?: SafeUser; // by ? means that property is optional , because when public routes req comes into server ,user obj might not have attacted to it ,but not in the case of protected routes
        }
    }
}



/**
 * @description
 * - read access token from cookies 
 * - if not found then throw error
 * - verify token sign and expiry 
 * - verify user still exist in db and active 
 * - attach safe user to req, so downstream controllers or middlewares can access
 * 
 */

export const authenticate = async (req: Request, _res: Response, next: NextFunction) => {

    const authHeader = req.headers.authorization;
    let accessToken = req.cookies[COOKIE_NAMES.ACCESS_TOKEN];

    if (!accessToken && authHeader && authHeader.startsWith("Bearer ")) {
        accessToken = authHeader.split(" ")[1];
    }
    console.log("Raw Token received:", accessToken);

    if (!accessToken) {
        throw new AppError(" Authentication required. No accessToken provided ", 401)
    }

    let decoded;
    try {
        decoded = verifyAccessToken(accessToken)
    }
    catch (err) { // ts types err as unknown 
        console.error("Token verification failed:", err);
        if (err instanceof Error) { // this check tell ts that from here on ,err is an Error instance ,this unlocks access to its props
            //instanceof checks objects prototype chain and it returns true ,if Error.prototype is exists anywhere in err
            if (err.name === "TokenExpiredError")
                throw new AppError("Access Token has expired. Please refresh", 401);
        }
        throw new AppError("Invalid access Token", 401);
    }

    const userId = Number(decoded.sub);
    if (!Number.isFinite(userId)) {
        throw new AppError("Invalid access Token", 401);
    }

    const user = await findUserById({ id: userId })
    if (!user || !user.isActive) {
        throw new AppError("User not found or deactivated", 401)
    }

    //remove sensitive info
    const { passwordHash, refreshTokenHash, issuedRefreshTokenAt, ...safeUser } = user;

    req.user = safeUser;

    next();// express go to the next middleware or controller in execution flow

}
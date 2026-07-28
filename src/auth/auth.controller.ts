import { Request, Response } from "express";
import * as authService from "./auth.service.js";
import { clearCookies, COOKIE_NAMES, setAccessToken, setRefreshToken } from "../utils/cookies.utils.js";
import { AppError } from "../middlewares/globalErrorHandler.middlewares.js";
import { ApiResponse } from "../types/index.js";
import { registerSchema, loginSchema } from "./auth.schema.zod.js";




new Date().toISOString();//?

export const registerController = async (req: Request, res: Response<ApiResponse>): Promise<void> => {

    const parseResult = registerSchema.safeParse({ body: req.body });
    if (!parseResult.success) {
        throw new AppError(parseResult.error.issues.map(e => e.message).join(", "), 400);
    }
    const body = parseResult.data.body;


    const { tokens, user } = await authService.createUserService(body)





    // set cookies that browser stores them automatically 
    setAccessToken(res, tokens.accessToken)
    setRefreshToken(res, tokens.refreshToken)

    res.status(201).json({
        success: true,
        data: { user },
        message: "Account created successfully"
    })

}

export const loginController = async (req: Request, res: Response<ApiResponse>): Promise<void> => {

    const parseResult = loginSchema.safeParse({ body: req.body });
    if (!parseResult.success) {
        throw new AppError(parseResult.error.issues.map(e => e.message).join(", "), 400);
    }
    const { email, password } = parseResult.data.body;

    const { tokens, user } = await authService.loginService({ email, password })

    setAccessToken(res, tokens.accessToken);
    setRefreshToken(res, tokens.refreshToken);

    res.status(200).json({
        success: true,
        data: { user },
        message: "Login successful"
    })

}



/**
 * @description 
 *  - read cookies from client side
 *  - if not found then error
 *  - send tokens to service ,it returns user and tokens 
 *  - set new tokens to jwt
 *  - send success res
 * @param req 
 * @param res 
 */
export const refreshController = async (req: Request, res: Response<ApiResponse>): Promise<void> => {

    const incomingRefreshToken = req.cookies[COOKIE_NAMES.REFRESH_TOKEN]

    if (!incomingRefreshToken) {
        throw new AppError("No refresh Token provided", 401)
    }

    const { user, tokens } = await authService.refreshToken(incomingRefreshToken);

    setAccessToken(res, tokens.accessToken);
    setRefreshToken(res, tokens.refreshToken);

    res.status(200).json({
        success: true,
        data: { user },
        message: "Successfully refreshed Tokens"
    })

}



/**
 * @description
 *  - get and send user obj from req
 *  - clear client cookies 
 *  - send success res
 */
export const logoutController = async (req: Request, res: Response<ApiResponse>): Promise<void> => {

    await authService.logoutUser({ id: req.user!.id }); // "!" tells ts that trust me i know this property will not be undefined 
    // "!" tell ts that i know this req.user looks undefined to you ,but  auth middleware will do runtime validation to gurantee user exists

    clearCookies(res);

    res.status(200).json({
        success: true,
        message: "Logout successfully"
    })
}

/**
 * @description 
 *  -req.user set by authenticate middleware
 *  - send user data to client
 */
export const getMeController = (req: Request, res: Response<ApiResponse>): void => {
    // req.user already has the safe user data from authenticate middleware 
    res.status(200).json({
        success: true,
        data: { user: req.user },
        message: "User fetched successfully"
    })

}
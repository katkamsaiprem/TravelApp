import express from "express"
import { Request, Response } from "express"
import cookieParser from 'cookie-parser'
import { env } from "./config/env.js"
import { globalErrorHandler } from "./middlewares/globalErrorHandler.middlewares.js";
import { notFoundHandler } from "./middlewares/routeNotFound.middlewares.js";
import authRouter from "./auth/auth.router.js";
import helmet from "helmet";
import cors from "cors"
import { generalRateLimiter } from "./middlewares/reateLimiter.middleware.js";
import { ApiResponse } from "./types/index.js";
import { corsOptions } from "./middlewares/cors.middleware.js";
import { wishlistRouter } from "./wishlist/wishlist.router.js";
import venueRouter from "./venues/venues.router.js";
import categoriesRouter from "./categories/categories.router.js";
import bookingsRouter from "./bookings/bookings.router.js";




const app = express()

//-----------Security-------------------------

app.use((helmet as any)()) // set security HTTP headers

// cors controls which origins (domains) are allowed to send req
// in prod , it should be frontend domain only
app.use(cors(corsOptions))

//------------- Body Parsing---------------------

// middleware to parse req body into js object , limit to 10kb prevents large payloads from crashing the server 
app.use(express.json({ limit: "10kb" }));

// Parse url encoded data like html form submissions with extended true to support nested obj and arr to parse
app.use(express.urlencoded({ extended: true, limit: "10kb" }))

//-------------Cookie Parsing----------------

// cookie - parser read the cookie header and we can add cookies in req.cookie
//The cookie secret is used by cookie-parser to sign cookies (HMAC), which prevents clients from tampering with cookie values
app.use(cookieParser(env.COOKIE_SECRET))

//---------------Rate Limiting---------------


app.use(generalRateLimiter);

//---------------Routes---------------

app.use("/api/v1/auth", authRouter);
app.use("/api/v1/wishlist", wishlistRouter);
app.use("/api/v1/venues", venueRouter);
app.use("/api/v1/categories", categoriesRouter);
app.use("/api/v1/bookings", bookingsRouter);

app.get("/health-check", (_req: Request, res: Response<ApiResponse>) => {
    res.status(200).json({
        success: true,
        message: "server is healthy"
    })
})



//Route not Found

app.use(notFoundHandler)

//GlobalError Handler Middleware

app.use(globalErrorHandler)






export { app }
export default app;
import { env } from "../config/env.js"
import { CorsOptions } from "cors"
import { AppError } from "./globalErrorHandler.middlewares.js";


export const corsOptions: CorsOptions = {
    origin: (incomingOrigin: string | undefined, sendResultCallBack: (err: Error | null, allow?: boolean) => void) => {

        const allowedOrigins = env.CORS_ORIGIN.split(',').map(origin => origin.trim().replace(/\/$/, ''));
        // allows client requests with no origin like postman, mobile apps or server to server
        if (!incomingOrigin) {
            return sendResultCallBack(null, true)
        }

        // check if incoming website is allowed
        if (allowedOrigins.includes(incomingOrigin)) {
            return sendResultCallBack(null, true);
        } else {
            return sendResultCallBack(new AppError('Access denied: This origin is not allowed by CORS security policies', 403));
        }
    },
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-type", "Authorization"],  // authorization allows client to send jwt and bearer safely to back, 
    //without contenttytpe backend never recongize data format , your body will
    //end up as empty or undefined
    // ct tell backend to middleware like express.json to parse the body
    credentials: true,
    //credentials true tell backend to accept cookies ,session and authorization headers 

}
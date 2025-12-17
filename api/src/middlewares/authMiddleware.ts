import { NextFunction, Request, Response } from "express";
import AdminServices from "../services/admin";
import { db } from "../config";
import { ErrorCodes } from "../common/errors";
import { verifyJWT } from "../common/jwt";

export function middlewareVerifyAdminJWT(required = true) {
    return async (req: Request, res: Response, next: NextFunction) => {
        const adminServices = new AdminServices(db);

        // First if the admin table is empty we skip it
        if (await adminServices.countAdmins() === 0) {
            console.log("No fucking admins");
            return next();
        }

        const authorization = (req.header("Authorization") || "").replaceAll(/\s+/g, " ");
        if (!authorization) {
            if (!required) return next();

            return res.status(401)
                .json({
                    "error": "Missing authorization header",
                    "code": ErrorCodes.InvalidJWT
                });
        }

        // Split auth header
        const tokenParts = authorization.split(" "); // Bearer <JWT>
        if (tokenParts.length !== 2) {
            if (!required) return next();

            console.error("Invalid JWT token");
            return res.status(401)
                .json({
                    "error": "Invalid token",
                    "code": ErrorCodes.Unauthorized
                });
        }

        // Get token from header
        const token = tokenParts[1];
        if (!token) {
            if (!required) return next();

            return res.status(401)
                .json({
                    "error": "Invalid token",
                    "code": ErrorCodes.Unauthorized
                });
        }

        try {
            if (!process.env.JWT_SECRET_KEY) {
                return res.status(500)
                    .json({
                        "error": "Internal server error",
                        "code": ErrorCodes.InternalServerError
                    });
            }

            const payload = await verifyJWT(token, process.env.JWT_SECRET_KEY);

            // Save payload for downstream handlers
            res.locals.jwtPayload = payload;

            return next();
        } catch (error) {
            console.error("Error on auth middleware level: ", error);

            if (!required) return next();

            return res.status(401)
                .json({
                    "error": "Invalid or expired token",
                    "code": ErrorCodes.InvalidJWT
                });
        }
    };
}

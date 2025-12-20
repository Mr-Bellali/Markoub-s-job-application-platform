import { Router, Request, Response } from "express";
import { middlewareVerifyAdminJWT } from "../middlewares/authMiddleware";
import { createPositionSchema } from "../types/position.validator";
import { ErrorCodes } from "../common/errors";
import PositionServices from "../services/position";
import { db } from "../config";

// Create route for positions
const setupPositionRoutes = Router();

// First we will have endpoint to create positions by admins
setupPositionRoutes.post("/positions", middlewareVerifyAdminJWT(true), async (req: Request, res: Response) => {
    try {
        // Validate the request's body data
        const validateData = createPositionSchema.safeParse(req.body);
        if (validateData.success === false) {
            return res.status(400).json({
                error: validateData.error.format(),
                code: ErrorCodes.BadRequest
            });
        }

        // Destruct all the data from validated data
        const { title, category, workType, location, description } = validateData.data;

        // Create the positionServices object
        const positionServices = new PositionServices(db as any);

        // Get payload to get the admin about to create this position
        const jwtPayload = res.locals.jwtPayload;

        // Create the position with data
        const position = await positionServices.createPosition(validateData.data, jwtPayload.sub);

        return res.status(201).json(position);
    } catch (error) {
        console.error("Error in create position endpoint: ", error)
        res.status(500).json({
            error: "Internal server error",
            code: ErrorCodes.InternalServerError
        });
    }
});

// Endpoint to get all the positions paginated
setupPositionRoutes.get("/positions", async (req: Request, res: Response) => {
    try {
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 10;
        const category = req.query.category as string || undefined;

        const positionServices = new PositionServices(db as any);

        // Get the paginated positions from the database
        const positions = await positionServices.getPaginatedPositions(page, limit, category);

        return res.json(positions);
    } catch (error) {
        console.error("Error in get admins endpoint: ", error)
        res.status(500).json({
            error: "Internal server error",
            code: ErrorCodes.InternalServerError
        });
    }
});

// Get a detailed position by ID
setupPositionRoutes.get("/positions/:id", async (req: Request, res: Response) => {
    try {
        const id = parseInt(req.params.id);
        if (isNaN(id)) {
            return res.status(400).json({
                error: "Invalid position ID",
                code: ErrorCodes.BadRequest
            });
        }

        const positionServices = new PositionServices(db as any);

        // Retrieve the requested position
        const position = await positionServices.getPositionById(id);

        // Check first if the position exist in the first place
        if (!position) {
            return res.status(404).json({
                error: "Admin not found",
                code: ErrorCodes.BadRequest
            });
        }

        return res.json(position);
    } catch (error) {
        console.error("Error in getting position by id endpoint: ", error);
        res.status(500).json({
            error: "Internal server error",
            code: ErrorCodes.InternalServerError
        });
    }
})


// Endpoint to update a position by admin


export default setupPositionRoutes;
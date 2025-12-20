import { Router, Request, Response } from "express";
import { middlewareVerifyAdminJWT } from "../middlewares/authMiddleware";
import { createPositionSchema } from "../types/position.validator";
import { ErrorCodes } from "../common/errors";
import PositionServices from "../services/position";
import { db } from "../config";

// Create route for positions
const setupPositionRoutes = Router();

/**
 * @swagger
 * /positions:
 *   post:
 *     summary: Create a new position
 *     description: Creates a new job position. Only superadmins can create positions.
 *     tags:
 *       - Positions
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - category
 *               - description
 *             properties:
 *               title:
 *                 type: string
 *               category:
 *                 type: string
 *               workType:
 *                 type: string
 *                 enum: [remote, hybrid, onsite, freelancer]
 *                 default: onsite
 *               location:
 *                 type: string
 *               description:
 *                 type: string
 *     responses:
 *       201:
 *         description: Position created successfully
 *       400:
 *         description: Bad request - Invalid input data
 *       401:
 *         description: Unauthorized - Invalid or missing JWT token
 *       403:
 *         description: Forbidden - Insufficient permissions
 *       500:
 *         description: Internal server error
 */
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

/**
 * @swagger
 * /positions:
 *   get:
 *     summary: Get paginated list of positions
 *     description: Retrieves a paginated list of all active positions. Can be filtered by category.
 *     tags:
 *       - Positions
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number for pagination
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Number of items per page
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *         description: Filter positions by category
 *     responses:
 *       200:
 *         description: Successfully retrieved positions list
 *       500:
 *         description: Internal server error
 */
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

/**
 * @swagger
 * /positions/{id}:
 *   get:
 *     summary: Get a position by ID
 *     description: Retrieves detailed information about a specific position.
 *     tags:
 *       - Positions
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Position ID
 *     responses:
 *       200:
 *         description: Successfully retrieved position details
 *       400:
 *         description: Bad request - Invalid position ID
 *       404:
 *         description: Position not found
 *       500:
 *         description: Internal server error
 */
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
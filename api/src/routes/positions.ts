import { Router, Request, Response } from "express";
import { fileTypeFromBuffer } from 'file-type';
import { middlewareVerifyAdminJWT } from "../middlewares/authMiddleware";
import { createPositionSchema } from "../types/position.validator";
import { ErrorCodes } from "../common/errors";
import PositionServices from "../services/position";
import { db } from "../config";
import { createApplicationSchema } from "../types/application.validator";
import ApplicationServices from "../services/applications";
import MediaServices from "../services/mediaServices";

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

/**
 * @swagger
 * /positions/{id}/apply:
 *   post:
 *     summary: Apply to a position
 *     description: Submit a job application for a specific position with a resume file (PDF only).
 *     tags:
 *       - Positions
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Position ID to apply for
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - fullName
 *               - email
 *               - fileB64
 *               - fileName
 *             properties:
 *               fullName:
 *                 type: string
 *                 description: Full name of the applicant
 *               email:
 *                 type: string
 *                 format: email
 *                 description: Email address of the applicant
 *               fileB64:
 *                 type: string
 *                 format: byte
 *                 description: Base64 encoded PDF file (resume)
 *               fileName:
 *                 type: string
 *                 description: Original filename of the uploaded file
 *     responses:
 *       201:
 *         description: Application submitted successfully
 *       400:
 *         description: Bad request - Invalid input data, invalid file type, or file too large
 *       404:
 *         description: Position not found
 *       500:
 *         description: Internal server error
 */
// Endpoint for users to apply for a position
setupPositionRoutes.post("/positions/:id/apply", async (req: Request, res: Response) => {
    try {
        // First we get the position ID
        const positionId = parseInt(req.params.id);
        if (isNaN(positionId)) {
            return res.status(400).json({
                error: "Invalid position ID it should be a valid integer",
                code: ErrorCodes.BadRequest
            });
        }

        // We check if the position exist so we wont create upload a pdf for a none existing position
        const positionServices = new PositionServices(db as any);
        const existingPosition = await positionServices.getPositionById(positionId);
        if(!existingPosition){
            return res.status(404).json({
                error: "Position not found",
                code: ErrorCodes.NotFound
            })
        }

        // Validate the requested body data
        const validateData = createApplicationSchema.safeParse(req.body);
        if (validateData.success === false) {
            return res.status(400).json({
                error: validateData.error.format(),
                code: ErrorCodes.BadRequest
            });
        }

        // Destruct the data
        const { fullName, email, fileB64, fileName } = validateData.data;

        // Validate file size

        const decoded = Buffer.from(fileB64, "base64");
        const mediaServices = new MediaServices();
        if (decoded.length > mediaServices.getMaxFileSize()) {
            console.error("File is too large");
            return res.status(400).json({
                error: `File is larger than ${mediaServices.getMaxFileSize()}`,
                code: ErrorCodes.BadRequest
            });
        }

        // Detect the file type
        const type = await fileTypeFromBuffer(decoded);

        if (!type) {
            return res.status(400).json({
                error: "Could not detect file type",
                code: ErrorCodes.BadRequest
            });
        }

        const allowedMimes = mediaServices.getAllowedMimeTypes();
        if (!allowedMimes.includes(type.mime)) {
            return res.status(400).json({
                error: "Invalid file type. Only PDF is allowed.",
                code: ErrorCodes.BadRequest
            });
        }

        // Upload file to s3 bucket
        const filePath = `${Date.now()}_${fileName}`;
        await mediaServices.uploadFileToBucket(decoded, filePath, type.mime);

        // Create the application for the user
        const applicationServices = new ApplicationServices(db as any);

        const application = await applicationServices.createApplication({
            positionId,
            fullName,
            email,
            fileName,
            filePath
        });

        return res.status(201).json(application);

    } catch (error: any) {
        console.error("Error in the endpoint of applying to a position: ", error)
        return res.status(500).json({
            error: "Failed to upload resume",
            code: ErrorCodes.InternalServerError
        });
    }
})

// Endpoint to update a position by admin


export default setupPositionRoutes;
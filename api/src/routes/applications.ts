import { Router, Request, Response } from "express";
import { ErrorCodes } from "../common/errors";
import ApplicationServices from "../services/applications";
import MediaServices from "../services/mediaServices";
import { db } from "../config";
import { middlewareVerifyAdminJWT } from "../middlewares/authMiddleware";

// Route for applications
const setupApplicationRoutes = Router();

/**
 * @swagger
 * /applications:
 *   get:
 *     summary: Get paginated list of applications
 *     description: Retrieves a paginated list of all applications with candidate and position details.
 *     tags:
 *       - Applications
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
 *     responses:
 *       200:
 *         description: Successfully retrieved applications list
 *       500:
 *         description: Internal server error
 */
// Endpoint to get all the applications paginated
setupApplicationRoutes.get("/applications", middlewareVerifyAdminJWT(true), async (req: Request, res: Response) => {
    try {
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 10;

        const applicationServices = new ApplicationServices(db as any);

        // Get the paginated applications from the database
        const applications = await applicationServices.getPaginatedApplications(page, limit);

        return res.json(applications);
    } catch (error) {
        console.error("Error in get applications endpoint: ", error)
        res.status(500).json({
            error: "Internal server error",
            code: ErrorCodes.InternalServerError
        });
    }
});

/**
 * @swagger
 * /applications/{id}:
 *   get:
 *     summary: Get an application by ID
 *     description: Retrieves detailed information about a specific application including resume in base64 format.
 *     tags:
 *       - Applications
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Application ID
 *     responses:
 *       200:
 *         description: Successfully retrieved application details with resume
 *       400:
 *         description: Bad request - Invalid application ID
 *       404:
 *         description: Application not found
 *       500:
 *         description: Internal server error
 */
// Get a detailed application by ID with resume in base64
setupApplicationRoutes.get("/applications/:id", middlewareVerifyAdminJWT(true), async (req: Request, res: Response) => {
    try {
        const id = parseInt(req.params.id);
        if (isNaN(id)) {
            return res.status(400).json({
                error: "Invalid application ID",
                code: ErrorCodes.BadRequest
            });
        }

        const applicationServices = new ApplicationServices(db as any);

        // Retrieve the requested application
        const application = await applicationServices.getApplicationById(id);

        // Check first if the application exist in the first place
        if (!application) {
            return res.status(404).json({
                error: "Application not found",
                code: ErrorCodes.NotFound
            });
        }

        // Get resume from S3 and convert to base64
        const mediaServices = new MediaServices();

        try {
            // Get the file from S3 bucket
            const fileBuffer = await mediaServices.getFileFromBucket(application.resumeFilePath);

            // Convert buffer to base64
            const fileB64 = fileBuffer.toString('base64');

            return res.json({
                ...application,
                resumeFileB64: fileB64
            });
        } catch (error) {
            console.error(`Error fetching resume for application ${id}:`, error);
            return res.json({
                ...application,
                resumeFileB64: null
            });
        }
    } catch (error) {
        console.error("Error in getting application by id endpoint: ", error);
        res.status(500).json({
            error: "Internal server error",
            code: ErrorCodes.InternalServerError
        });
    }
});

export default setupApplicationRoutes;
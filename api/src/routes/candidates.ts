import { Router, Request, Response } from "express";
import { ErrorCodes } from "../common/errors";
import CandidateServices from "../services/candidates";
import MediaServices from "../services/mediaServices";
import { db } from "../config";

// Create route for candidates
const setupCandidateRoutes = Router();

/**
 * @swagger
 * /candidates:
 *   get:
 *     summary: Get paginated list of candidates
 *     description: Retrieves a paginated list of all candidates with their application count.
 *     tags:
 *       - Candidates
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
 *         description: Successfully retrieved candidates list
 *       500:
 *         description: Internal server error
 */
// Endpoint to get all the candidates paginated
setupCandidateRoutes.get("/candidates", async (req: Request, res: Response) => {
    try {
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 10;

        const candidateServices = new CandidateServices(db as any);

        // Get the paginated candidates from the database
        const candidates = await candidateServices.getPaginatedCandidates(page, limit);

        return res.json(candidates);
    } catch (error) {
        console.error("Error in get candidates endpoint: ", error)
        res.status(500).json({
            error: "Internal server error",
            code: ErrorCodes.InternalServerError
        });
    }
});

/**
 * @swagger
 * /candidates/{id}:
 *   get:
 *     summary: Get a candidate by ID
 *     description: Retrieves detailed information about a specific candidate including all their applications and resumes in base64 format.
 *     tags:
 *       - Candidates
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Candidate ID
 *     responses:
 *       200:
 *         description: Successfully retrieved candidate details with resumes
 *       400:
 *         description: Bad request - Invalid candidate ID
 *       404:
 *         description: Candidate not found
 *       500:
 *         description: Internal server error
 */
// Get a detailed candidate by ID with resumes in base64
setupCandidateRoutes.get("/candidates/:id", async (req: Request, res: Response) => {
    try {
        const id = parseInt(req.params.id);
        if (isNaN(id)) {
            return res.status(400).json({
                error: "Invalid candidate ID",
                code: ErrorCodes.BadRequest
            });
        }

        const candidateServices = new CandidateServices(db as any);

        // Retrieve the requested candidate
        const candidate = await candidateServices.getCandidateById(id);

        // Check first if the candidate exist in the first place
        if (!candidate) {
            return res.status(404).json({
                error: "Candidate not found",
                code: ErrorCodes.NotFound
            });
        }

        // Get resumes from S3 and convert to base64
        const mediaServices = new MediaServices();
        
        const applicationsWithResumes = await Promise.all(
            candidate.applications.map(async (application: any) => {
                try {
                    // Get the file from S3 bucket
                    const fileBuffer = await mediaServices.getFileFromBucket(application.resumeFilePath);
                    
                    // Convert buffer to base64
                    const fileB64 = fileBuffer.toString('base64');
                    
                    return {
                        ...application,
                        resumeFileB64: fileB64
                    };
                } catch (error) {
                    console.error(`Error fetching resume for application ${application.id}:`, error);
                    return {
                        ...application,
                        resumeFileB64: null
                    };
                }
            })
        );

        return res.json({
            ...candidate,
            applications: applicationsWithResumes
        });
    } catch (error) {
        console.error("Error in getting candidate by id endpoint: ", error);
        res.status(500).json({
            error: "Internal server error",
            code: ErrorCodes.InternalServerError
        });
    }
});

export default setupCandidateRoutes;
import {
    Router,
    type Request,
    type Response,
} from "express";
import AdminServices from "../services/admin";
import { db } from "../config";
import { middlewareVerifyAdminJWT } from "../middlewares/authMiddleware";
import { createAdminSchema } from "../types/admin.validator";
import { ErrorCodes } from "../common/errors";
import bcrypt from "bcryptjs";

// Create the routes for the admins
const setupAdminRoutes = Router();

/**
 * @swagger
 * /admins:
 *   post:
 *     summary: Create a new admin
 *     description: Creates a new admin user. This endpoint can be accessed without authorization only if there are no admins in the database. Used mainly by superadmins to manage other admins.
 *     tags:
 *       - Admins
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: admin@example.com
 *               password:
 *                 type: string
 *                 format: password
 *                 example: securePassword123
 *               role:
 *                 type: string
 *                 enum: [STANDARD, SUPERADMIN]
 *                 example: STANDARD
 *     responses:
 *       200:
 *         description: Admin created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 result:
 *                   type: string
 *       401:
 *         description: Unauthorized - Invalid or missing JWT token
 *       403:
 *         description: Forbidden - Insufficient permissions
 *       400:
 *         description: Bad request - Invalid input data
 */
setupAdminRoutes.post("/admins", middlewareVerifyAdminJWT(false), async(req: Request, res: Response) => {
    try {
        // Validate the request body using Zod
        const validatedData = createAdminSchema.safeParse(req.body);
        if (validatedData.success === false){
            return res.status(400).json({
                error: validatedData.error.format(),
                code: ErrorCodes.BadRequest
            });
        }

        // Get all the data from the body
        const {email, role, firstName, lastName, password} = validatedData.data;

        // Get the count of the admins
        const adminServices = new AdminServices(db);
        const adminCount = await adminServices.countAdmins();

        if(adminCount === 0) {
            const hash = await bcrypt.hash(password, 10);

            // Create the first admin account in the database
            const account = await adminServices.createAdmin({
                firstName,
                lastName,
                email,
                password: hash,
                role: role? role : "superadmin"
            });

            res.status(201).json(account);
        }

        res.status(201).json({
            message: "Admin validation successful",
            data: {
                // email: validatedData.email,
                // role: validatedData.role,
                // firstName: validatedData.firstName,
                // lastName: validatedData.lastName
            }
        });
    } catch (error) {
        console.error("Error in create admin endpoint: ", error)
        res.status(500).json({
            error: "Internal server error",
            code: ErrorCodes.InternalServerError 
        });
    }
})

/**
 * @swagger
 * /admins:
 *   get:
 *     summary: Get paginated list of admins
 *     description: Retrieves a paginated list of all admin users in the system
 *     tags:
 *       - Admins
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
 *         description: Successfully retrieved admins list
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                       email:
 *                         type: string
 *                       role:
 *                         type: string
 *                         enum: [STANDARD, SUPERADMIN]
 *                       createdAt:
 *                         type: string
 *                         format: date-time
 *                 total:
 *                   type: integer
 *                 page:
 *                   type: integer
 *                 limit:
 *                   type: integer
 *       500:
 *         description: Internal server error
 */
setupAdminRoutes.get("/admins", async (req: Request, res: Response) => {
    const adminServices = new AdminServices(db);

    // Get the admins from the database
    const admins = await adminServices.getPaginatedAdmins();

    // Return the admins response
    res.json(admins)
})

export default setupAdminRoutes;
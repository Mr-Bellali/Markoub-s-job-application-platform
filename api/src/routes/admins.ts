import {
    Router,
    type Request,
    type Response,
} from "express";
import AdminServices from "../services/admin";
import { db } from "../config";
import { middlewareVerifyAdminJWT } from "../middlewares/authMiddleware";
import { createAdminSchema, loginSchema } from "../types/admin.validator";
import { ErrorCodes } from "../common/errors";
import bcrypt from "bcryptjs";
import { generateSignedJWT } from "../common/jwt";

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
setupAdminRoutes.post("/admins", middlewareVerifyAdminJWT(false), async (req: Request, res: Response) => {
    try {
        // Validate the request body using Zod
        const validatedData = createAdminSchema.safeParse(req.body);
        if (validatedData.success === false) {
            return res.status(400).json({
                error: validatedData.error.format(),
                code: ErrorCodes.BadRequest
            });
        }

        // Destruct all the data fro validated data
        const { email, role, firstName, lastName, password } = validatedData.data;

        // Get the count of the admins
        const adminServices = new AdminServices(db);
        const adminCount = await adminServices.countAdmins();

        if (adminCount === 0) {
            const hash = await bcrypt.hash(password, 10);

            // Create the first admin account in the database - always superadmin
            const account = await adminServices.createAdmin({
                firstName,
                lastName,
                email,
                hashedPassword: hash,
                role: "superadmin"
            });

            return res.status(201).json(account);
        }
        // Otherwise we check the jwt and see if the connected account is a superadmin 
        // First we will get the payload stored
        const jwtPayload = res.locals.jwtPayload;

        if (!jwtPayload) {
            return res.status(401).json({
                error: "Unauthorized",
                code: ErrorCodes.Unauthorized
            });
        }

        if (jwtPayload.role !== "superadmin") {
            return res.status(403).json({
                error: "Forbidden - Only superadmins can create new admins",
                code: ErrorCodes.Forbidden
            });
        }

        // Check if admin already exists
        const existingAdmin = await adminServices.getAdminByEmail(email);
        if (existingAdmin) {
            return res.status(409).json({
                error: "Admin with this email already exists",
                code: ErrorCodes.AlreadyExist
            });
        }

        const hash = await bcrypt.hash(password, 10);

        const account = await adminServices.createAdmin({
            firstName,
            lastName,
            email,
            hashedPassword: hash,
            role: role as "standard" | "superadmin",
            createdByAdminId: jwtPayload.sub ? parseInt(jwtPayload.sub) : null
        });

        return res.status(201).json(account);
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
setupAdminRoutes.get("/admins", middlewareVerifyAdminJWT(true), async (req: Request, res: Response) => {
    try {
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 10;

        const adminServices = new AdminServices(db);

        // Get the admins from the database
        const admins = await adminServices.getPaginatedAdmins(page, limit);

        // Return the admins response
        res.json(admins)
    } catch (error) {
        console.error("Error in get admins endpoint: ", error)
        res.status(500).json({
            error: "Internal server error",
            code: ErrorCodes.InternalServerError
        });
    }
})

// Login route
/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Admin login
 *     description: Authenticates an admin user and returns a JWT token
 *     tags:
 *       - Auth
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: admin@example.com
 *               password:
 *                 type: string
 *                 format: password
 *                 example: securePassword123
 *     responses:
 *       200:
 *         description: Login successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                   description: JWT access token
 *                 admin:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                     email:
 *                       type: string
 *                     role:
 *                       type: string
 *                       enum: [STANDARD, SUPERADMIN]
 *       400:
 *         description: Bad request - Invalid input data
 *       401:
 *         description: Unauthorized - Invalid credentials
 *       500:
 *         description: Internal server error
 */
setupAdminRoutes.post("/auth/login", async (req: Request, res: Response) => {
    // Get the requested data
    const validateData = loginSchema.safeParse(req.body);
    if (validateData.success === false) {
        return res.status(400).json({
            error: validateData.error.format(),
            code: ErrorCodes.BadRequest
        });
    }

    // Destruct all the data fro validated data
    const { email, password } = validateData.data;

    // Check if the admin exist in the database first
    const adminServices = new AdminServices(db);
    const admin = await adminServices.getAdminByEmail(email);
    if (!admin) {
        return res.status(400).json({
            error: 'Incorrect Email or password',
            code: ErrorCodes.BadRequest
        });
    }

    // Check if the password is valid
    const validPassword = await bcrypt.compare(password, admin.hashedPassword);
    if (!validPassword) {
        return res.status(400).json({
            error: 'Incorrect Email or password',
            code: ErrorCodes.BadRequest
        });
    }

    // Generate a JWT token
    const token = await generateSignedJWT({
        ...admin,
        hashedPassword: null
    })

    return res.json({
        account: {
            ...admin,
            hashedPassword: null
        },
        token
    })
})
export default setupAdminRoutes;
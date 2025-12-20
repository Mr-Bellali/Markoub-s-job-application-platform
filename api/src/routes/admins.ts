import { Router, Request, Response } from "express";
import AdminServices from "../services/admin";
import { db } from "../config";
import { middlewareVerifyAdminJWT } from "../middlewares/authMiddleware";
import { createAdminSchema, loginSchema, updateAdminSchema } from "../types/admin.validator";
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
 *     security:
 *       - bearerAuth: []
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
 *         name: status
 *         schema:
 *           type: string
 *           enum: [active, deleted, all]
 *           default: active
 *         description: Filter admins by status
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
 *                       status:
 *                         type: string
 *                         enum: [active, deleted]
 *                       createdAt:
 *                         type: string
 *                         format: date-time
 *                       updatedAt:
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
        const status = (req.query.status as "active" | "deleted" | "all") || "active";

        const adminServices = new AdminServices(db);

        // Get the admins from the database
        const admins = await adminServices.getPaginatedAdmins(page, limit, status);

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

/**
 * @swagger
 * /admins/{id}:
 *   put:
 *     summary: Update an admin
 *     description: Updates an existing admin user. Only superadmins can update admins. Password cannot be updated via this endpoint.
 *     tags:
 *       - Admins
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Admin ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               firstName:
 *                 type: string
 *               lastName:
 *                 type: string
 *               email:
 *                 type: string
 *                 format: email
 *               role:
 *                 type: string
 *                 enum: [STANDARD, SUPERADMIN]
 *     responses:
 *       200:
 *         description: Admin updated successfully
 *       400:
 *         description: Bad request - Invalid input data
 *       401:
 *         description: Unauthorized - Invalid or missing JWT token
 *       403:
 *         description: Forbidden - Only superadmins can update admins
 *       404:
 *         description: Admin not found
 *       500:
 *         description: Internal server error
 */
setupAdminRoutes.put("/admins/:id", middlewareVerifyAdminJWT(true), async (req: Request, res: Response) => {
    try {
        const id = parseInt(req.params.id);
        if (isNaN(id)) {
            return res.status(400).json({
                error: "Invalid admin ID",
                code: ErrorCodes.BadRequest
            });
        }

        // Check if the requester is a superadmin
        const jwtPayload = res.locals.jwtPayload;
        if (jwtPayload.role !== "superadmin") {
            return res.status(403).json({
                error: "Forbidden - Only superadmins can update admins",
                code: ErrorCodes.Forbidden
            });
        }

        // Validate the request body
        const validatedData = updateAdminSchema.safeParse(req.body);
        if (validatedData.success === false) {
            return res.status(400).json({
                error: validatedData.error.format(),
                code: ErrorCodes.BadRequest
            });
        }

        const adminServices = new AdminServices(db);

        // Update the admin
        const updatedAdmin = await adminServices.updateAdmin(id, validatedData.data);

        if (!updatedAdmin) {
            // Check if admin exists but is deleted
            const existingAdmin = await adminServices.getAdminById(id);
            if (existingAdmin && existingAdmin.status === 'deleted') {
                return res.status(400).json({
                    error: "Cannot update deleted admin",
                    code: ErrorCodes.BadRequest
                });
            }

            return res.status(404).json({
                error: "Admin not found",
                code: ErrorCodes.BadRequest
            });
        }

        return res.json(updatedAdmin);
    } catch (error) {
        console.error("Error in update admin endpoint: ", error);
        res.status(500).json({
            error: "Internal server error",
            code: ErrorCodes.InternalServerError
        });
    }
});

/**
 * @swagger
 * /admins/{id}:
 *   delete:
 *     summary: Toggle admin status (active/deleted)
 *     description: Toggles the admin status between 'active' and 'deleted'. Only superadmins can perform this action.
 *     tags:
 *       - Admins
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Admin ID
 *     responses:
 *       200:
 *         description: Admin status toggled successfully
 *       400:
 *         description: Bad request - Invalid admin ID
 *       401:
 *         description: Unauthorized - Invalid or missing JWT token
 *       403:
 *         description: Forbidden - Only superadmins can delete admins
 *       404:
 *         description: Admin not found
 *       500:
 *         description: Internal server error
 */
setupAdminRoutes.delete("/admins/:id", middlewareVerifyAdminJWT(true), async (req: Request, res: Response) => {
    try {
        const id = parseInt(req.params.id);
        if (isNaN(id)) {
            return res.status(400).json({
                error: "Invalid admin ID",
                code: ErrorCodes.BadRequest
            });
        }

        // Check if the requester is a superadmin
        const jwtPayload = res.locals.jwtPayload;
        if (jwtPayload.role !== "superadmin") {
            return res.status(403).json({
                error: "Forbidden - Only superadmins can delete admins",
                code: ErrorCodes.Forbidden
            });
        }

        const adminServices = new AdminServices(db);

        // Toggle admin status
        const newStatus = await adminServices.toggleAdminStatus(id);
        if (!newStatus) {
            return res.status(404).json({
                error: "Admin not found",
                code: ErrorCodes.BadRequest
            });
        }

        return res.json({
            message: `Admin status changed to ${newStatus}`,
            status: newStatus
        });
    } catch (error) {
        console.error("Error in delete admin endpoint: ", error);
        res.status(500).json({
            error: "Internal server error",
            code: ErrorCodes.InternalServerError
        });
    }
});

export default setupAdminRoutes;
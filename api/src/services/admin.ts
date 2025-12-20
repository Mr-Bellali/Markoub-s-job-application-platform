import { NodePgDatabase } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import { admins } from "../db/schema/admins";
import * as schema from '../db/schema/admins';
import { adminResponse, createAdminInput, adminRole } from "../types/admin.validator"
import { eq, and } from "drizzle-orm";

export default class AdminServices {
    // Class attributes
    private db: NodePgDatabase<typeof schema> & {
        $client: Pool;
    }

    // Object constructor
    constructor(db: NodePgDatabase<typeof schema> & {
        $client: Pool;
    }) {
        this.db = db
    }

    // Method to retrieve admins from database
    async getPaginatedAdmins(page: number = 1, limit: number = 10, status: "active" | "deleted" | "all" = "active"): Promise<any> {
        try {
            const offset = (page - 1) * limit;
            
            let whereClause = undefined;
            if (status !== "all") {
                whereClause = eq(admins.status, status);
            }

            const result = await this.db.select({
                id: admins.id,
                firstName: admins.firstName,
                lastName: admins.lastName,
                email: admins.email,
                role: admins.role,
                status: admins.status,
                createdAt: admins.createdAt,
                updatedAt: admins.updatedAt,
                createdByAdminId: admins.createdByAdminId
            })
            .from(admins)
            .where(whereClause)
            .limit(limit)
            .offset(offset);

            const total = await this.countAdmins(status);

            return {
                data: result,
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit)
            };
        } catch (error) {
            console.error('Error in getPaginatedAdmins: ', error);
            throw error;
        }
    }

    // Count the admins in the database
    async countAdmins(status: "active" | "deleted" | "all" = "all"): Promise<number> {
        try {
            let whereClause = undefined;
            if (status !== "all") {
                whereClause = eq(admins.status, status);
            }
            const count = await this.db.$count(admins, whereClause);
            return count;
        } catch (error) {
            console.error("Error in countAdmins: ", error);
            throw error;
        }
    }

    // Create a new admin
    async createAdmin(data: {
        firstName: string,
        lastName: string,
        email: string,
        hashedPassword: string,
        role: adminRole,
        createdByAdminId?: number | null
    }): Promise<adminResponse> {
        try {
            const result = await this.db.insert(admins).values(data).returning({
                id: admins.id,
                email: admins.email,
                role: admins.role,
                status: admins.status,
                firstName: admins.firstName,
                lastName: admins.lastName,
                createdAt: admins.createdAt,
                updatedAt: admins.updatedAt,
                createdByAdminId: admins.createdByAdminId
            });

            if (!result[0]) {
                throw new Error("Failed to create admin");
            }

            return {
                email: result[0].email!,
                role: result[0].role!,
                status: result[0].status!,
                firstName: result[0].firstName,
                lastName: result[0].lastName,
                createdAt: result[0].createdAt,
                updatedAt: result[0].updatedAt,
                createdByAdminId: result[0].createdByAdminId
            };
        } catch (error) {
            console.error("Error in createAdmin: ", error);
            throw error;
        }
    }

    // Get admin by email
    async getAdminByEmail(email: string): Promise<any> {
        try {
            const result = await this.db.query.admins.findFirst({
                where: eq(admins.email, email)
            });
            return result;
        } catch (error) {
            console.log('Error in getAdminByEmail: ', error);
            throw error;
        }
    }

    // Get admin by ID
    async getAdminById(id: number): Promise<any> {
        try {
            const result = await this.db.query.admins.findFirst({
                where: eq(admins.id, id)
            });
            return result;
        } catch (error) {
            console.log('Error in getAdminById: ', error);
            throw error;
        }
    }

    // Update admin
    async updateAdmin(id: number, data: Partial<{
        firstName: string,
        lastName: string,
        email: string,
        role: adminRole
    }>): Promise<adminResponse | null> {
        try {
            const result = await this.db.update(admins)
                .set(data)
                .where(and(eq(admins.id, id), eq(admins.status, 'active')))
                .returning({
                    id: admins.id,
                    email: admins.email,
                    role: admins.role,
                    status: admins.status,
                    firstName: admins.firstName,
                    lastName: admins.lastName,
                    createdAt: admins.createdAt,
                    updatedAt: admins.updatedAt,
                    createdByAdminId: admins.createdByAdminId
                });

            if (!result[0]) return null;

            return {
                email: result[0].email!,
                role: result[0].role!,
                status: result[0].status!,
                firstName: result[0].firstName,
                lastName: result[0].lastName,
                createdAt: result[0].createdAt,
                updatedAt: result[0].updatedAt,
                createdByAdminId: result[0].createdByAdminId
            };
        } catch (error) {
            console.error("Error in updateAdmin: ", error);
            throw error;
        }
    }

    // Toggle admin status
    async toggleAdminStatus(id: number): Promise<"active" | "deleted" | null> {
        try {
            const admin = await this.getAdminById(id);
            if (!admin) return null;

            const newStatus = admin.status === "active" ? "deleted" : "active";

            await this.db.update(admins)
                .set({ status: newStatus })
                .where(eq(admins.id, id));
            
            return newStatus;
        } catch (error) {
            console.error("Error in toggleAdminStatus: ", error);
            throw error;
        }
    }

}
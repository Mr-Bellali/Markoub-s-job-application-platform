import { NodePgDatabase } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import { admins } from "../db/schema/admins";
import * as schema from '../db/schema/admins';
import { adminResponse, createAdminInput, adminRole } from "../types/admin.validator"
import { eq } from "drizzle-orm";

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
    async getPaginatedAdmins(page: number = 1, limit: number = 10): Promise<any> {
        try {
            const offset = (page - 1) * limit;
            
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
            .limit(limit)
            .offset(offset);

            const total = await this.countAdmins();

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
    async countAdmins(): Promise<number> {
        try {
            const count = await this.db.$count(admins);
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

}
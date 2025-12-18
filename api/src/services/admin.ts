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
    async getPaginatedAdmins(): Promise<any> {
        try {
            const result = await this.db.select().from(admins);
            return result;
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
                firstName: admins.firstName,
                lastName: admins.lastName,
                createdByAdminId: admins.createdByAdminId
            });

            if (!result[0]) {
                throw new Error("Failed to create admin");
            }

            return {
                email: result[0].email!,
                role: result[0].role!,
                firstName: result[0].firstName,
                lastName: result[0].lastName,
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
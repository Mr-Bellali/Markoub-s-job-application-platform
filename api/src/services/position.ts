import { NodePgDatabase } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import { positions } from "../db/schema/positions";
import * as schema from '../db/schema/positions';
import { createPositionInput, updatePositionInput, positionListResponse, positionDetailResponse } from "../types/position.validator";
import { eq, and, desc, SQL } from "drizzle-orm";

export default class PositionServices {
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

    // Method to retrieve paginated positions from database
    async getPaginatedPositions(page: number = 1, limit: number = 10, category?: string): Promise<any> {
        try {
            const offset = (page - 1) * limit;

            let whereClause: SQL | undefined = eq(positions.status, 'active');
            if (category) {
                whereClause = and(whereClause, eq(positions.category, category));
            }

            const result = await this.db.select({
                id: positions.id,
                title: positions.title,
                category: positions.category,
                workType: positions.workType,
                location: positions.location,
                createdAt: positions.createdAt,
                updatedAt: positions.updatedAt
            })
                .from(positions)
                .where(whereClause)
                .limit(limit)
                .offset(offset)
                .orderBy(desc(positions.createdAt));

            const total = await this.countPositions(category);

            return {
                data: result.map(r => ({
                    ...r,
                    workType: r.workType || 'onsite'
                })),
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit)
            };
        } catch (error) {
            console.error('Error in getPaginatedPositions: ', error);
            throw error;
        }
    }

    // Count the positions in the database
    async countPositions(category?: string): Promise<number> {
        try {
            let whereClause: SQL | undefined = eq(positions.status, 'active');
            if (category) {
                whereClause = and(whereClause, eq(positions.category, category));
            }
            const count = await this.db.$count(positions, whereClause);
            return count;
        } catch (error) {
            console.error("Error in countPositions: ", error);
            throw error;
        }
    }

    // Get single position by ID
    async getPositionById(id: number): Promise<positionDetailResponse | undefined> {
        try {
            const result = await this.db.select({
                id: positions.id,
                title: positions.title,
                category: positions.category,
                workType: positions.workType,
                location: positions.location,
                description: positions.description,
                createdAt: positions.createdAt,
                updatedAt: positions.updatedAt
            })
                .from(positions)
                .where(and(eq(positions.id, id), eq(positions.status, 'active')))
                .limit(1);

            if (!result[0]) return undefined;

            return {
                ...result[0],
                workType: result[0].workType || 'onsite'
            };
        } catch (error) {
            console.error('Error in getPositionById: ', error);
            throw error;
        }
    }

    // Create a new position
    async createPosition(data: createPositionInput, createdByAdminId: number): Promise<positionDetailResponse> {
        try {
            const result = await this.db.insert(positions).values({
                ...data,
                createdByAdminId
            }).returning({
                id: positions.id,
                title: positions.title,
                category: positions.category,
                workType: positions.workType,
                location: positions.location,
                description: positions.description,
                createdAt: positions.createdAt,
                updatedAt: positions.updatedAt
            });

            if (!result[0]) {
                throw new Error("Failed to create position");
            }

            return {
                ...result[0],
                workType: result[0].workType || 'onsite'
            };
        } catch (error) {
            console.error("Error in createPosition: ", error);
            throw error;
        }
    }

    // Update position
    async updatePosition(id: number, data: updatePositionInput): Promise<positionDetailResponse | null> {
        try {
            const result = await this.db.update(positions)
                .set(data)
                .where(and(eq(positions.id, id), eq(positions.status, 'active')))
                .returning({
                    id: positions.id,
                    title: positions.title,
                    category: positions.category,
                    workType: positions.workType,
                    location: positions.location,
                    description: positions.description,
                    createdAt: positions.createdAt,
                    updatedAt: positions.updatedAt
                });

            if (!result[0]) return null;

            return {
                ...result[0],
                workType: result[0].workType || 'onsite'
            };
        } catch (error) {
            console.error("Error in updatePosition: ", error);
            throw error;
        }
    }

    // Soft delete position
    async softDeletePosition(id: number): Promise<boolean> {
        try {
            const result = await this.db.update(positions)
                .set({ status: "deleted" })
                .where(and(eq(positions.id, id), eq(positions.status, 'active')))
                .returning({ id: positions.id });

            return result.length > 0;
        } catch (error) {
            console.error("Error in softDeletePosition: ", error);
            throw error;
        }
    }
}

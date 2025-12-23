import { NodePgDatabase } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import * as schema from '../db/schema/applications';
import { positions } from '../db/schema/positions';
import { eq, desc } from "drizzle-orm";

export default class CandidateServices {
    private db: NodePgDatabase<typeof schema> & {
        $client: Pool;
    }

    constructor(db: NodePgDatabase<typeof schema> & {
        $client: Pool;
    }) {
        this.db = db;
    }

    // Get paginated candidates
    async getPaginatedCandidates(page: number = 1, limit: number = 10): Promise<any> {
        try {
            const offset = (page - 1) * limit;

            const result = await this.db.select({
                id: schema.candidates.id,
                fullName: schema.candidates.fullName,
                email: schema.candidates.email,
                aliases: schema.candidates.aliases,
                applicationCount: this.db.$count(schema.applications, eq(schema.applications.candidateId, schema.candidates.id))
            })
            .from(schema.candidates)
            .limit(limit)
            .offset(offset)
            .orderBy(desc(schema.candidates.id));

            const total = await this.countCandidates();

            return {
                data: result,
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit)
            };
        } catch (error) {
            console.error("Error in getPaginatedCandidates: ", error);
            throw error;
        }
    }

    // Count candidates
    async countCandidates(): Promise<number> {
        try {
            const count = await this.db.$count(schema.candidates);
            return count;
        } catch (error) {
            console.error("Error in countCandidates: ", error);
            throw error;
        }
    }

    // Get candidate by ID with details
    async getCandidateById(id: number): Promise<any> {
        try {
            // Get candidate details
            const candidateResult = await this.db.select({
                id: schema.candidates.id,
                fullName: schema.candidates.fullName,
                email: schema.candidates.email,
                aliases: schema.candidates.aliases
            })
            .from(schema.candidates)
            .where(eq(schema.candidates.id, id))
            .limit(1);

            if (!candidateResult[0]) return undefined;

            // Get all applications for this candidate
            const applicationsResult = await this.db.select({
                id: schema.applications.id,
                createdAt: schema.applications.createdAt,
                resumeFileName: schema.applications.resumeFileName,
                resumeFilePath: schema.applications.resumeFilePath,
                position: {
                    id: positions.id,
                    title: positions.title,
                    category: positions.category,
                    workType: positions.workType,
                    location: positions.location,
                    description: positions.description,
                    status: positions.status
                }
            })
            .from(schema.applications)
            .leftJoin(positions, eq(schema.applications.positionId, positions.id))
            .where(eq(schema.applications.candidateId, id))
            .orderBy(desc(schema.applications.createdAt));

            return {
                ...candidateResult[0],
                applications: applicationsResult
            };
        } catch (error) {
            console.error("Error in getCandidateById: ", error);
            throw error;
        }
    }
}
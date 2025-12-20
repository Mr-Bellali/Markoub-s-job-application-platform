import { NodePgDatabase } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import * as schema from '../db/schema/applications';
import { positions } from '../db/schema/positions';
import { eq, and, desc } from "drizzle-orm";

export default class ApplicationServices {
    private db: NodePgDatabase<typeof schema> & {
        $client:Pool;
    }

    constructor(db: NodePgDatabase<typeof schema> & {
        $client: Pool;
    }) {
        this.db = db;
    }

    // Method to create an application and a candidate (if not exist) for a position
    async createApplication(data: {
        positionId: number,
        fullName: string,
        email: string,
        fileName: string,
        filePath: string
    }): Promise<any>{
        try {
            // Capitalize the full name
            const formattedName = data.fullName
                .toLowerCase()
                .split(' ')
                .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                .join(' ');

            // Check if the candidate already exists
            const existingCandidate = await this.db.select().from(schema.candidates).where(eq(schema.candidates.email, data.email));

            let candidateId: number;

            if (existingCandidate.length > 0) {
                const candidate = existingCandidate[0];
                candidateId = candidate.id;

                // Check if the name is different, if so add it to aliases
                if (candidate.fullName !== formattedName) {
                    const currentAliases = candidate.aliases ? candidate.aliases.split(',').map(a => a.trim()) : [];
                    
                    if (!currentAliases.includes(formattedName)) {
                        const newAliases = [...currentAliases, formattedName].join(', ');
                        
                        await this.db.update(schema.candidates)
                            .set({ aliases: newAliases })
                            .where(eq(schema.candidates.id, candidateId));
                    }
                }
            } else {
                // Create a new candidate
                const newCandidate = await this.db.insert(schema.candidates).values({
                    fullName: formattedName,
                    email: data.email
                }).returning({ id: schema.candidates.id });

                candidateId = newCandidate[0].id;
            }

            // Create the application
            const application = await this.db.insert(schema.applications).values({
                candidateId: candidateId,
                positionId: data.positionId,
                resumeFileName: data.fileName,
                resumeFilePath: data.filePath
            }).returning();

            return application[0];

        } catch (error) {
            console.error("Error in createApplication: ", error);
            throw error;
        }
    }

    // Get paginated applications
    async getPaginatedApplications(page: number = 1, limit: number = 10): Promise<any> {
        try {
            const offset = (page - 1) * limit;

            const result = await this.db.select({
                id: schema.applications.id,
                createdAt: schema.applications.createdAt,
                resumeFileName: schema.applications.resumeFileName,
                candidate: {
                    id: schema.candidates.id,
                    fullName: schema.candidates.fullName,
                    email: schema.candidates.email
                },
                position: {
                    id: positions.id,
                    title: positions.title,
                    category: positions.category
                }
            })
            .from(schema.applications)
            .leftJoin(schema.candidates, eq(schema.applications.candidateId, schema.candidates.id))
            .leftJoin(positions, eq(schema.applications.positionId, positions.id))
            .limit(limit)
            .offset(offset)
            .orderBy(desc(schema.applications.createdAt));

            const total = await this.countApplications();

            return {
                data: result,
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit)
            };
        } catch (error) {
            console.error("Error in getPaginatedApplications: ", error);
            throw error;
        }
    }

    // Count applications
    async countApplications(): Promise<number> {
        try {
            const count = await this.db.$count(schema.applications);
            return count;
        } catch (error) {
            console.error("Error in countApplications: ", error);
            throw error;
        }
    }

    // Get application by ID
    async getApplicationById(id: number): Promise<any> {
        try {
            const result = await this.db.select({
                id: schema.applications.id,
                createdAt: schema.applications.createdAt,
                resumeFileName: schema.applications.resumeFileName,
                resumeFilePath: schema.applications.resumeFilePath,
                candidate: {
                    id: schema.candidates.id,
                    fullName: schema.candidates.fullName,
                    email: schema.candidates.email,
                    aliases: schema.candidates.aliases
                },
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
            .leftJoin(schema.candidates, eq(schema.applications.candidateId, schema.candidates.id))
            .leftJoin(positions, eq(schema.applications.positionId, positions.id))
            .where(eq(schema.applications.id, id))
            .limit(1);

            if (!result[0]) return undefined;

            return result[0];
        } catch (error) {
            console.error("Error in getApplicationById: ", error);
            throw error;
        }
    }
}
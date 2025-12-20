/**
 * This file will contain 2 schemas one for candidates and other for applications(submissions)
 * I want to separate them in case same person submitted more than just one time so it will be a waste of storage in a large scale
 * Of course this is just a demo to show my full stack position skills (ironic) but something I know I can optimize I can't pretend
 * to not see it. 
 */

import { 
  pgTable, 
  integer, 
  varchar,
  pgEnum,
  timestamp
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { positions } from "./positions";

// Candidate schema
export const candidates = pgTable('candidates',{
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    fullName: varchar('full_name', {length: 60}).notNull(),
    email: varchar('email', {length: 100}).unique().notNull(),
    aliases: varchar('aliases') // This will store the other names for the candidate if he applied for another position with different name but same email
    // It will store the names separated by , (eg. "Hamid Alauoi, Hicham Lgarouj...") 
});

// Position submission schema (application for short)
export const applications = pgTable('applications', {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    candidateId: integer('candidate_id').references(() => candidates.id).notNull(),
    positionId: integer('position_id').references(() => positions.id).notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    resumeFileName: varchar('resume_file_name'), // This will store the file name of the resume uploaded
    resumeFilePath: varchar("resume_file_path"), // This will be the path to retrieve the resume from the bucket
});

export const candidatesRelations = relations(candidates, ({ many }) => ({
    applications: many(applications),
}));

export const applicationsRelations = relations(applications, ({ one }) => ({
    candidate: one(candidates, {
        fields: [applications.candidateId],
        references: [candidates.id],
    }),
    position: one(positions, {
        fields: [applications.positionId],
        references: [positions.id],
    }),
}));
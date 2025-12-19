import {
  pgTable,
  integer,
  varchar,
  pgEnum,
  timestamp
} from "drizzle-orm/pg-core";
import { statusEnum } from "./admins";

// position status

// work type
export const worktype = pgEnum("worktype", ["remote", "hybrid", "onsite", "freelancer"]);

// Offer schema
export const positions = pgTable('positions', {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull().$onUpdate(() => new Date()),
  title: varchar().notNull(),
  category: varchar().notNull(),
  workType: worktype().default("onsite"),
  location: varchar(),
  description: varchar().notNull(),
  createdByAdminId: integer().notNull(),
  status: statusEnum().default("active"),
})
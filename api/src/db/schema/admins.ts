import { 
  pgTable, 
  integer, 
  varchar,
  pgEnum,
  timestamp
} from "drizzle-orm/pg-core"

// Admin roles
export const roles = pgEnum("roles", ["superadmin", "standard"])
export const statusEnum = pgEnum("status", ["active", "deleted"])

// Admin schema
export const admins = pgTable('admins', {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  firstName: varchar('first_name', { length: 60}).notNull(),
  lastName: varchar('last_name', { length: 60}).notNull(),
  email: varchar('email', {length: 100}).unique().notNull(),
  role: roles().default("standard"),
  status: statusEnum().default("active"),
  createdByAdminId: integer(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull().$onUpdate(() => new Date()),
  hashedPassword: varchar('hashed_password')
});


import { 
  pgTable, 
  integer, 
  varchar,
  pgEnum
} from "drizzle-orm/pg-core"

// Admin roles
export const roles = pgEnum("roles", ["superadmin", "standard"])

// Admin schema
export const admins = pgTable('admins', {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  firstName: varchar('first_name', { length: 60}).notNull(),
  lastName: varchar('last_name', { length: 60}).notNull(),
  email: varchar('email', {length: 100}).unique().notNull(),
  role: roles().default("standard"),
  createdByAdminId: integer(),
  hashedPassword: varchar('hashed_password')
});


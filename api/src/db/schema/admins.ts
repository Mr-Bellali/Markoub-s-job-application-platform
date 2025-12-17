import { pgTable, integer, varchar } from "drizzle-orm/pg-core"

// Admin schema
export const admins = pgTable('admins', {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  firstName: varchar('first_name', { length: 60}),
  lastName: varchar('last_name', { length: 60}),
  email: varchar('email', {length: 100}).unique(),
  hashedPassword: varchar('hashed_password')
});


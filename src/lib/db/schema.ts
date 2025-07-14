// drizzle/schema.ts or prisma/schema.prisma
import { pgTable, uuid, varchar, text,  integer,date, boolean, timestamp } from "drizzle-orm/pg-core";

export const students = pgTable("students", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: varchar("name", { length: 100 }).notNull(),
  email: varchar("email", { length: 100 }).notNull(),
  studentId: varchar("student_id", { length: 255 }).notNull(), // 👈 match SQL
  qrCode: text("qr_code").notNull(),                            // 👈 match SQL
  createdAt: timestamp("created_at").defaultNow(),  
  isApproved: boolean("is_approved").default(false),
  phoneNumber: varchar("phone_number", { length: 20 }),

          
});

// lib/schema/books.ts


export const books = pgTable('books', {
  id: uuid('id').defaultRandom().primaryKey(),
  title: varchar('title', { length: 100 }).notNull(),
  author: varchar('author', { length: 100 }),
  totalCopies: integer('total_copies').notNull(),         // ✅ matches SQL
  availableCopies: integer('available_copies').notNull(), // ✅ matches SQL
  createdAt: timestamp('created_at').defaultNow(),        // ✅ matches SQL
});

export const bookIssues = pgTable('book_issues', {
  id: uuid('id').defaultRandom().primaryKey(),
  studentId: varchar('student_id', { length: 255 }).notNull(), // ✅ MATCH your API key
  bookId: uuid('book_id').notNull(),
  issueDate: date('issue_date').notNull(),
  returnDate: date('return_date').notNull(),
  returned: boolean('returned').default(false),
  createdAt: timestamp('created_at').defaultNow(),
});



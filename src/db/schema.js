import { pgTable, serial, varchar, text, timestamp, pgEnum, integer, boolean } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

// Enums
export const cvStatusEnum = pgEnum('cv_status', ['pending', 'approved', 'rejected']);
export const genderEnum = pgEnum('gender', ['male', 'female', 'other']);
export const applicationStatusEnum = pgEnum('application_status', ['pending', 'accepted', 'rejected']);

// Admins Table
export const admins = pgTable('admins', {
    id: serial('id').primaryKey(),
    name: varchar('name', { length: 255 }).notNull(),
    email: varchar('email', { length: 255 }).notNull().unique(),
    passwordHash: varchar('password_hash', { length: 255 }).notNull(),
    position: varchar('position', { length: 255 }).notNull(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
});

// Students Table
export const students = pgTable('students', {
    id: serial('id').primaryKey(),
    fullName: varchar('full_name', { length: 255 }).notNull(),
    studentId: varchar('student_id', { length: 100 }).notNull().unique(),
    qualification: text('qualification').notNull(),
    gender: genderEnum('gender').notNull(),
    address: text('address').notNull(),
    contactNo: varchar('contact_no', { length: 20 }).notNull(),
    email: varchar('email', { length: 255 }).notNull().unique(),
    passwordHash: varchar('password_hash', { length: 255 }).notNull(),
    profilePictureUrl: text('profile_picture_url'),
    pdcTableUrl: text('pdc_table_url'),
    cvUrl: text('cv_url').notNull(),
    cvStatus: cvStatusEnum('cv_status').default('pending').notNull(),
    cvRejectionReason: text('cv_rejection_reason'),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Companies Table
export const companies = pgTable('companies', {
    id: serial('id').primaryKey(),
    companyName: varchar('company_name', { length: 255 }).notNull(),
    employerPost: varchar('employer_post', { length: 255 }).notNull(),
    address: text('address').notNull(),
    businessType: varchar('business_type', { length: 255 }).notNull(),
    contactDetails: varchar('contact_details', { length: 255 }).notNull(),
    introduction: text('introduction').notNull(),
    logoUrl: text('logo_url'),
    email: varchar('email', { length: 255 }).notNull().unique(),
    passwordHash: varchar('password_hash', { length: 255 }).notNull(),
    isApproved: boolean('is_approved').default(false).notNull(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Job Applications Table
export const jobApplications = pgTable('job_applications', {
    id: serial('id').primaryKey(),
    companyId: integer('company_id').notNull().references(() => companies.id, { onDelete: 'cascade' }),
    category: varchar('category', { length: 255 }).notNull(),
    title: varchar('title', { length: 255 }).notNull(),
    salary: varchar('salary', { length: 100 }),
    timings: varchar('timings', { length: 255 }),
    requiredQualifications: text('required_qualifications').notNull(),
    requiredExperience: text('required_experience'),
    description: text('description').notNull(),
    location: varchar('location', { length: 255 }).notNull(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Student Applications Table (junction table for students applying to jobs)
export const studentApplications = pgTable('student_applications', {
    id: serial('id').primaryKey(),
    studentId: integer('student_id').notNull().references(() => students.id, { onDelete: 'cascade' }),
    jobId: integer('job_id').notNull().references(() => jobApplications.id, { onDelete: 'cascade' }),
    status: applicationStatusEnum('status').default('pending').notNull(),
    appliedAt: timestamp('applied_at').defaultNow().notNull(),
});

// Blog Posts Table
export const blogPosts = pgTable('blog_posts', {
    id: serial('id').primaryKey(),
    adminId: integer('admin_id').notNull().references(() => admins.id, { onDelete: 'cascade' }),
    title: varchar('title', { length: 500 }).notNull(),
    body: text('body').notNull(),
    imageUrls: text('image_urls').array(), // Array of image URLs
    attachmentUrls: text('attachment_urls').array(), // Array of attachment URLs (PDF, DOCX, images)
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Relations
export const companiesRelations = relations(companies, ({ many }) => ({
    jobApplications: many(jobApplications),
}));

export const jobApplicationsRelations = relations(jobApplications, ({ one, many }) => ({
    company: one(companies, {
        fields: [jobApplications.companyId],
        references: [companies.id],
    }),
    studentApplications: many(studentApplications),
}));

export const studentsRelations = relations(students, ({ many }) => ({
    studentApplications: many(studentApplications),
}));

export const studentApplicationsRelations = relations(studentApplications, ({ one }) => ({
    student: one(students, {
        fields: [studentApplications.studentId],
        references: [students.id],
    }),
    jobApplication: one(jobApplications, {
        fields: [studentApplications.jobId],
        references: [jobApplications.id],
    }),
}));

export const adminsRelations = relations(admins, ({ many }) => ({
    blogPosts: many(blogPosts),
}));

export const blogPostsRelations = relations(blogPosts, ({ one }) => ({
    admin: one(admins, {
        fields: [blogPosts.adminId],
        references: [admins.id],
    }),
}));

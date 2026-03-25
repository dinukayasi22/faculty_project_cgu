import bcrypt from 'bcrypt';
import { db } from '../config/database.js';
import { companies, jobApplications, studentApplications, students } from '../db/schema.js';
import { eq, and } from 'drizzle-orm';
import { jobPostingSchema, applicationStatusSchema } from '../utils/validation.js';
import { deleteFromGoogleDrive } from '../services/googleDrive.js';
import { validateId } from '../utils/helpers.js';

/**
 * Get company's own profile
 * GET /companies/profile
 */
export const getProfile = async (req, res) => {
    try {
        if (!req.user) {
            res.status(401).json({ error: 'Unauthorized' });
            return;
        }

        const [company] = await db
            .select({
                id: companies.id,
                companyName: companies.companyName,
                employerPost: companies.employerPost,
                address: companies.address,
                businessType: companies.businessType,
                contactDetails: companies.contactDetails,
                introduction: companies.introduction,
                logoUrl: companies.logoUrl,
                email: companies.email,
                isApproved: companies.isApproved,
                createdAt: companies.createdAt,
            })
            .from(companies)
            .where(eq(companies.id, req.user.id))
            .limit(1);

        if (!company) {
            res.status(404).json({ error: 'Company not found' });
            return;
        }

        res.json({ company });
    } catch (error) {
        console.error('Error in getProfile:', error);
        res.status(500).json({ error: error.message || 'Failed to get profile' });
    }
};

/**
 * Update company profile
 * PUT /companies/profile
 */
export const updateProfile = async (req, res) => {
    try {
        if (!req.user) {
            res.status(401).json({ error: 'Unauthorized' });
            return;
        }

        const { employerPost, address, contactDetails, introduction } = req.body;

        const updateData = {
            updatedAt: new Date(),
        };

        if (employerPost) updateData.employerPost = employerPost;
        if (address) updateData.address = address;
        if (contactDetails) updateData.contactDetails = contactDetails;
        if (introduction) updateData.introduction = introduction;

        const [updatedCompany] = await db
            .update(companies)
            .set(updateData)
            .where(eq(companies.id, req.user.id))
            .returning();

        res.json({
            message: 'Profile updated successfully',
            company: {
                id: updatedCompany.id,
                companyName: updatedCompany.companyName,
                email: updatedCompany.email,
            },
        });
    } catch (error) {
        console.error('Error in updateProfile:', error);
        res.status(500).json({ error: error.message || 'Failed to update profile' });
    }
};

/**
 * Delete own account
 * DELETE /companies/account
 * Body: { password }
 */
export const deleteAccount = async (req, res) => {
    try {
        if (!req.user) {
            res.status(401).json({ error: 'Unauthorized' });
            return;
        }

        const { password } = req.body;

        if (!password) {
            res.status(400).json({ error: 'Password is required' });
            return;
        }

        // Get company
        const [company] = await db
            .select()
            .from(companies)
            .where(eq(companies.id, req.user.id))
            .limit(1);

        if (!company) {
            res.status(404).json({ error: 'Company not found' });
            return;
        }

        // Verify password
        const isValidPassword = await bcrypt.compare(password, company.passwordHash);

        if (!isValidPassword) {
            res.status(401).json({ error: 'Invalid password' });
            return;
        }

        // Delete logo from Google Drive if exists
        if (company.logoUrl) {
            deleteFromGoogleDrive(company.logoUrl).catch((err) => {
                console.error('Error deleting company logo from Google Drive:', err);
            });
        }

        // Delete company (cascade will delete jobs and applications)
        await db.delete(companies).where(eq(companies.id, req.user.id));

        res.json({ message: 'Account deleted successfully' });
    } catch (error) {
        console.error('Error in deleteAccount:', error);
        res.status(500).json({ error: error.message || 'Failed to delete account' });
    }
};

/**
 * Post a new job
 * POST /companies/jobs
 */
export const postJob = async (req, res) => {
    try {
        if (!req.user) {
            res.status(401).json({ error: 'Unauthorized' });
            return;
        }

        // Check if company is approved
        const [company] = await db
            .select()
            .from(companies)
            .where(eq(companies.id, req.user.id))
            .limit(1);

        if (!company) {
            res.status(404).json({ error: 'Company not found' });
            return;
        }

        if (!company.isApproved) {
            res.status(403).json({ error: 'Your company must be approved before posting jobs' });
            return;
        }

        // Validate job data
        const validatedData = jobPostingSchema.parse(req.body);

        // Create job posting
        const [job] = await db
            .insert(jobApplications)
            .values({
                companyId: req.user.id,
                category: validatedData.category,
                title: validatedData.title,
                salary: validatedData.salary,
                timings: validatedData.timings,
                requiredQualifications: validatedData.requiredQualifications,
                requiredExperience: validatedData.requiredExperience,
                description: validatedData.description,
                location: validatedData.location,
            })
            .returning();

        res.status(201).json({
            message: 'Job posted successfully',
            job: {
                id: job.id,
                title: job.title,
                category: job.category,
                location: job.location,
            },
        });
    } catch (error) {
        console.error('Error in postJob:', error);
        res.status(500).json({ error: error.message || 'Failed to post job' });
    }
};

/**
 * Get company's own job postings
 * GET /companies/jobs
 */
export const getMyJobs = async (req, res) => {
    try {
        if (!req.user) {
            res.status(401).json({ error: 'Unauthorized' });
            return;
        }

        const jobs = await db
            .select()
            .from(jobApplications)
            .where(eq(jobApplications.companyId, req.user.id));

        res.json({ jobs });
    } catch (error) {
        console.error('Error in getMyJobs:', error);
        res.status(500).json({ error: error.message || 'Failed to get jobs' });
    }
};

/**
 * Update a job posting
 * PUT /companies/jobs/:jobId
 */
export const updateJob = async (req, res) => {
    try {
        if (!req.user) {
            res.status(401).json({ error: 'Unauthorized' });
            return;
        }

        const jobId = validateId(req.params.jobId, 'Job ID');
        if (!jobId) {
            res.status(400).json({ error: 'Invalid job ID' });
            return;
        }

        // Check if job exists and belongs to company
        const [job] = await db
            .select()
            .from(jobApplications)
            .where(
                and(
                    eq(jobApplications.id, jobId),
                    eq(jobApplications.companyId, req.user.id)
                )
            )
            .limit(1);

        if (!job) {
            res.status(404).json({ error: 'Job not found' });
            return;
        }

        // Validate job data
        const validatedData = jobPostingSchema.parse(req.body);

        // Update job
        const [updatedJob] = await db
            .update(jobApplications)
            .set({
                category: validatedData.category,
                title: validatedData.title,
                salary: validatedData.salary,
                timings: validatedData.timings,
                requiredQualifications: validatedData.requiredQualifications,
                requiredExperience: validatedData.requiredExperience,
                description: validatedData.description,
                location: validatedData.location,
                updatedAt: new Date(),
            })
            .where(eq(jobApplications.id, jobId))
            .returning();

        res.json({
            message: 'Job updated successfully',
            job: updatedJob,
        });
    } catch (error) {
        console.error('Error in updateJob:', error);
        res.status(500).json({ error: error.message || 'Failed to update job' });
    }
};

/**
 * Delete a job posting
 * DELETE /companies/jobs/:jobId
 */
export const deleteJob = async (req, res) => {
    try {
        if (!req.user) {
            res.status(401).json({ error: 'Unauthorized' });
            return;
        }

        const jobId = validateId(req.params.jobId, 'Job ID');
        if (!jobId) {
            res.status(400).json({ error: 'Invalid job ID' });
            return;
        }

        // Check if job exists and belongs to company
        const [job] = await db
            .select()
            .from(jobApplications)
            .where(
                and(
                    eq(jobApplications.id, jobId),
                    eq(jobApplications.companyId, req.user.id)
                )
            )
            .limit(1);

        if (!job) {
            res.status(404).json({ error: 'Job not found' });
            return;
        }

        // Delete job (cascade will delete applications)
        await db.delete(jobApplications).where(eq(jobApplications.id, jobId));

        res.json({ message: 'Job deleted successfully' });
    } catch (error) {
        console.error('Error in deleteJob:', error);
        res.status(500).json({ error: error.message || 'Failed to delete job' });
    }
};

/**
 * Get applicants for a specific job
 * GET /companies/jobs/:jobId/applicants
 */
export const getJobApplicants = async (req, res) => {
    try {
        if (!req.user) {
            res.status(401).json({ error: 'Unauthorized' });
            return;
        }

        const jobId = validateId(req.params.jobId, 'Job ID');
        if (!jobId) {
            res.status(400).json({ error: 'Invalid job ID' });
            return;
        }

        // Check if job exists and belongs to company
        const [job] = await db
            .select()
            .from(jobApplications)
            .where(
                and(
                    eq(jobApplications.id, jobId),
                    eq(jobApplications.companyId, req.user.id)
                )
            )
            .limit(1);

        if (!job) {
            res.status(404).json({ error: 'Job not found' });
            return;
        }

        // Get all applicants for this job
        const applicants = await db
            .select({
                applicationId: studentApplications.id,
                status: studentApplications.status,
                appliedAt: studentApplications.appliedAt,
                student: {
                    id: students.id,
                    fullName: students.fullName,
                    studentId: students.studentId,
                    email: students.email,
                    qualification: students.qualification,
                    contactNo: students.contactNo,
                    cvUrl: students.cvUrl,
                    profilePictureUrl: students.profilePictureUrl,
                },
            })
            .from(studentApplications)
            .innerJoin(students, eq(studentApplications.studentId, students.id))
            .where(eq(studentApplications.jobId, jobId));

        res.json({ applicants });
    } catch (error) {
        console.error('Error in getJobApplicants:', error);
        res.status(500).json({ error: error.message || 'Failed to get applicants' });
    }
};

/**
 * Update application status (accept/reject)
 * PUT /companies/applications/:applicationId
 * Body: { status: 'accepted' | 'rejected' }
 */
export const updateApplicationStatus = async (req, res) => {
    try {
        if (!req.user) {
            res.status(401).json({ error: 'Unauthorized' });
            return;
        }

        const applicationId = validateId(req.params.applicationId, 'Application ID');
        if (!applicationId) {
            res.status(400).json({ error: 'Invalid application ID' });
            return;
        }

        // Validate status
        const validatedData = applicationStatusSchema.parse(req.body);

        // Check if application exists and belongs to company's job
        const [application] = await db
            .select({
                id: studentApplications.id,
                jobId: studentApplications.jobId,
                companyId: jobApplications.companyId,
            })
            .from(studentApplications)
            .innerJoin(jobApplications, eq(studentApplications.jobId, jobApplications.id))
            .where(eq(studentApplications.id, applicationId))
            .limit(1);

        if (!application) {
            res.status(404).json({ error: 'Application not found' });
            return;
        }

        if (application.companyId !== req.user.id) {
            res.status(403).json({ error: 'You can only update applications for your own jobs' });
            return;
        }

        // Update application status
        const [updatedApplication] = await db
            .update(studentApplications)
            .set({
                status: validatedData.status,
            })
            .where(eq(studentApplications.id, applicationId))
            .returning();

        res.json({
            message: `Application ${validatedData.status} successfully`,
            application: {
                id: updatedApplication.id,
                status: updatedApplication.status,
            },
        });
    } catch (error) {
        console.error('Error in updateApplicationStatus:', error);
        res.status(500).json({ error: error.message || 'Failed to update application status' });
    }
};

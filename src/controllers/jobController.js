import { db } from '../config/database.js';
import { jobApplications, companies } from '../db/schema.js';
import { eq } from 'drizzle-orm';
import { validateId } from '../utils/helpers.js';

/**
 * Get all jobs from approved companies
 * GET /jobs
 */
export const getAllJobs = async (req, res) => {
    try {
        const jobs = await db
            .select({
                id: jobApplications.id,
                category: jobApplications.category,
                title: jobApplications.title,
                salary: jobApplications.salary,
                timings: jobApplications.timings,
                requiredQualifications: jobApplications.requiredQualifications,
                requiredExperience: jobApplications.requiredExperience,
                description: jobApplications.description,
                location: jobApplications.location,
                createdAt: jobApplications.createdAt,
                company: {
                    id: companies.id,
                    companyName: companies.companyName,
                    logoUrl: companies.logoUrl,
                    businessType: companies.businessType,
                },
            })
            .from(jobApplications)
            .innerJoin(companies, eq(jobApplications.companyId, companies.id))
            .where(eq(companies.isApproved, true));

        res.json({ jobs });
    } catch (error) {
        console.error('Error in getAllJobs:', error);
        res.status(500).json({ error: error.message || 'Failed to get jobs' });
    }
};

/**
 * Get job details by ID
 * GET /jobs/:jobId
 */
export const getJobDetails = async (req, res) => {
    try {
        const jobId = validateId(req.params.jobId, 'Job ID');
        if (!jobId) {
            res.status(400).json({ error: 'Invalid job ID' });
            return;
        }

        const [job] = await db
            .select({
                id: jobApplications.id,
                category: jobApplications.category,
                title: jobApplications.title,
                salary: jobApplications.salary,
                timings: jobApplications.timings,
                requiredQualifications: jobApplications.requiredQualifications,
                requiredExperience: jobApplications.requiredExperience,
                description: jobApplications.description,
                location: jobApplications.location,
                createdAt: jobApplications.createdAt,
                company: {
                    id: companies.id,
                    companyName: companies.companyName,
                    logoUrl: companies.logoUrl,
                    businessType: companies.businessType,
                    introduction: companies.introduction,
                    contactDetails: companies.contactDetails,
                },
            })
            .from(jobApplications)
            .innerJoin(companies, eq(jobApplications.companyId, companies.id))
            .where(eq(jobApplications.id, jobId))
            .limit(1);

        if (!job) {
            res.status(404).json({ error: 'Job not found' });
            return;
        }

        res.json({ job });
    } catch (error) {
        console.error('Error in getJobDetails:', error);
        res.status(500).json({ error: error.message || 'Failed to get job details' });
    }
};

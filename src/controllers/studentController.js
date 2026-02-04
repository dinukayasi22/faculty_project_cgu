import bcrypt from 'bcrypt';
import { db } from '../config/database.js';
import { students, jobApplications, studentApplications, companies } from '../db/schema.js';
import { eq, and } from 'drizzle-orm';
import { uploadToGoogleDrive } from '../services/googleDrive.js';

/**
 * Get student's own profile
 * GET /students/profile
 */
export const getProfile = async (req, res) => {
    try {
        if (!req.user) {
            res.status(401).json({ error: 'Unauthorized' });
            return;
        }

        const [student] = await db
            .select({
                id: students.id,
                fullName: students.fullName,
                studentId: students.studentId,
                qualification: students.qualification,
                gender: students.gender,
                address: students.address,
                contactNo: students.contactNo,
                email: students.email,
                profilePictureUrl: students.profilePictureUrl,
                pdcTableUrl: students.pdcTableUrl,
                cvUrl: students.cvUrl,
                cvStatus: students.cvStatus,
                cvRejectionReason: students.cvRejectionReason,
                createdAt: students.createdAt,
            })
            .from(students)
            .where(eq(students.id, req.user.id))
            .limit(1);

        if (!student) {
            res.status(404).json({ error: 'Student not found' });
            return;
        }

        res.json({ student });
    } catch (error) {
        console.error('Error in getProfile:', error);
        res.status(500).json({ error: error.message || 'Failed to get profile' });
    }
};

/**
 * Update student profile
 * PUT /students/profile
 */
export const updateProfile = async (req, res) => {
    try {
        if (!req.user) {
            res.status(401).json({ error: 'Unauthorized' });
            return;
        }

        const { fullName, qualification, address, contactNo } = req.body;

        const updateData = {
            updatedAt: new Date(),
        };

        if (fullName) updateData.fullName = fullName;
        if (qualification) updateData.qualification = qualification;
        if (address) updateData.address = address;
        if (contactNo) updateData.contactNo = contactNo;

        const [updatedStudent] = await db
            .update(students)
            .set(updateData)
            .where(eq(students.id, req.user.id))
            .returning();

        res.json({
            message: 'Profile updated successfully',
            student: {
                id: updatedStudent.id,
                fullName: updatedStudent.fullName,
                email: updatedStudent.email,
            },
        });
    } catch (error) {
        console.error('Error in updateProfile:', error);
        res.status(500).json({ error: error.message || 'Failed to update profile' });
    }
};

/**
 * Update CV (if rejected)
 * PUT /students/cv
 * Files: cv (required)
 */
export const updateCV = async (req, res) => {
    try {
        if (!req.user) {
            res.status(401).json({ error: 'Unauthorized' });
            return;
        }

        // Get current student
        const [student] = await db
            .select()
            .from(students)
            .where(eq(students.id, req.user.id))
            .limit(1);

        if (!student) {
            res.status(404).json({ error: 'Student not found' });
            return;
        }

        // Check if CV was rejected
        if (student.cvStatus !== 'rejected') {
            res.status(400).json({ error: 'CV can only be updated if it was rejected' });
            return;
        }

        // Check if CV file is uploaded
        const files = req.files;

        if (!files || !files.cv || files.cv.length === 0) {
            res.status(400).json({ error: 'CV file is required' });
            return;
        }

        // Upload new CV to Google Drive
        const cvFile = files.cv[0];
        const cvUrl = await uploadToGoogleDrive({
            fileName: `${student.studentId}_CV_${Date.now()}.${cvFile.originalname.split('.').pop()}`,
            mimeType: cvFile.mimetype,
            buffer: cvFile.buffer,
            folderType: 'cv',
        });

        // Update CV in database
        const [updatedStudent] = await db
            .update(students)
            .set({
                cvUrl,
                cvStatus: 'pending',
                cvRejectionReason: null,
                updatedAt: new Date(),
            })
            .where(eq(students.id, req.user.id))
            .returning();

        res.json({
            message: 'CV updated successfully. It is now pending admin approval.',
            student: {
                id: updatedStudent.id,
                cvStatus: updatedStudent.cvStatus,
            },
        });
    } catch (error) {
        console.error('Error in updateCV:', error);
        res.status(500).json({ error: error.message || 'Failed to update CV' });
    }
};

/**
 * Delete own account
 * DELETE /students/account
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

        // Get student
        const [student] = await db
            .select()
            .from(students)
            .where(eq(students.id, req.user.id))
            .limit(1);

        if (!student) {
            res.status(404).json({ error: 'Student not found' });
            return;
        }

        // Verify password
        const isValidPassword = await bcrypt.compare(password, student.passwordHash);

        if (!isValidPassword) {
            res.status(401).json({ error: 'Invalid password' });
            return;
        }

        // Delete student (cascade will delete applications)
        await db.delete(students).where(eq(students.id, req.user.id));

        res.json({ message: 'Account deleted successfully' });
    } catch (error) {
        console.error('Error in deleteAccount:', error);
        res.status(500).json({ error: error.message || 'Failed to delete account' });
    }
};

/**
 * Get available jobs (only from approved companies)
 * GET /students/jobs
 */
export const getAvailableJobs = async (req, res) => {
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
        console.error('Error in getAvailableJobs:', error);
        res.status(500).json({ error: error.message || 'Failed to get jobs' });
    }
};

/**
 * Apply for a job
 * POST /students/apply/:jobId
 */
export const applyForJob = async (req, res) => {
    try {
        if (!req.user) {
            res.status(401).json({ error: 'Unauthorized' });
            return;
        }

        const jobId = parseInt(req.params.jobId);

        // Check if student's CV is approved
        const [student] = await db
            .select()
            .from(students)
            .where(eq(students.id, req.user.id))
            .limit(1);

        if (!student) {
            res.status(404).json({ error: 'Student not found' });
            return;
        }

        if (student.cvStatus !== 'approved') {
            res.status(403).json({
                error: 'Your CV must be approved before applying for jobs',
                cvStatus: student.cvStatus,
                cvRejectionReason: student.cvRejectionReason,
            });
            return;
        }

        // Check if job exists
        const [job] = await db
            .select()
            .from(jobApplications)
            .where(eq(jobApplications.id, jobId))
            .limit(1);

        if (!job) {
            res.status(404).json({ error: 'Job not found' });
            return;
        }

        // Check if already applied
        const existingApplication = await db
            .select()
            .from(studentApplications)
            .where(
                and(
                    eq(studentApplications.studentId, req.user.id),
                    eq(studentApplications.jobId, jobId)
                )
            )
            .limit(1);

        if (existingApplication.length > 0) {
            res.status(400).json({ error: 'You have already applied for this job' });
            return;
        }

        // Create application
        const [application] = await db
            .insert(studentApplications)
            .values({
                studentId: req.user.id,
                jobId,
                status: 'pending',
            })
            .returning();

        res.status(201).json({
            message: 'Application submitted successfully',
            application: {
                id: application.id,
                jobId: application.jobId,
                status: application.status,
                appliedAt: application.appliedAt,
            },
        });
    } catch (error) {
        console.error('Error in applyForJob:', error);
        res.status(500).json({ error: error.message || 'Failed to apply for job' });
    }
};

/**
 * Get student's own applications
 * GET /students/applications
 */
export const getMyApplications = async (req, res) => {
    try {
        if (!req.user) {
            res.status(401).json({ error: 'Unauthorized' });
            return;
        }

        const applications = await db
            .select({
                id: studentApplications.id,
                status: studentApplications.status,
                appliedAt: studentApplications.appliedAt,
                job: {
                    id: jobApplications.id,
                    title: jobApplications.title,
                    category: jobApplications.category,
                    location: jobApplications.location,
                    salary: jobApplications.salary,
                },
                company: {
                    id: companies.id,
                    companyName: companies.companyName,
                    logoUrl: companies.logoUrl,
                },
            })
            .from(studentApplications)
            .innerJoin(jobApplications, eq(studentApplications.jobId, jobApplications.id))
            .innerJoin(companies, eq(jobApplications.companyId, companies.id))
            .where(eq(studentApplications.studentId, req.user.id));

        res.json({ applications });
    } catch (error) {
        console.error('Error in getMyApplications:', error);
        res.status(500).json({ error: error.message || 'Failed to get applications' });
    }
};

/**
 * Delete own application
 * DELETE /students/applications/:applicationId
 */
export const deleteApplication = async (req, res) => {
    try {
        if (!req.user) {
            res.status(401).json({ error: 'Unauthorized' });
            return;
        }

        const applicationId = parseInt(req.params.applicationId);

        // Check if application exists and belongs to student
        const [application] = await db
            .select()
            .from(studentApplications)
            .where(
                and(
                    eq(studentApplications.id, applicationId),
                    eq(studentApplications.studentId, req.user.id)
                )
            )
            .limit(1);

        if (!application) {
            res.status(404).json({ error: 'Application not found' });
            return;
        }

        // Delete application
        await db.delete(studentApplications).where(eq(studentApplications.id, applicationId));

        res.json({ message: 'Application deleted successfully' });
    } catch (error) {
        console.error('Error in deleteApplication:', error);
        res.status(500).json({ error: error.message || 'Failed to delete application' });
    }
};

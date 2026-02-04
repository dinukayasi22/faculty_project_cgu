import { db } from '../config/database.js';
import { students, companies } from '../db/schema.js';
import { eq } from 'drizzle-orm';
import { cvReviewSchema } from '../utils/validation.js';

/**
 * Get all students
 * GET /admin/students
 */
export const getAllStudents = async (req, res) => {
    try {
        const allStudents = await db
            .select({
                id: students.id,
                fullName: students.fullName,
                studentId: students.studentId,
                email: students.email,
                qualification: students.qualification,
                gender: students.gender,
                contactNo: students.contactNo,
                cvStatus: students.cvStatus,
                cvRejectionReason: students.cvRejectionReason,
                cvUrl: students.cvUrl,
                profilePictureUrl: students.profilePictureUrl,
                createdAt: students.createdAt,
            })
            .from(students);

        res.json({ students: allStudents });
    } catch (error) {
        console.error('Error in getAllStudents:', error);
        res.status(500).json({ error: error.message || 'Failed to get students' });
    }
};

/**
 * Get all companies
 * GET /admin/companies
 */
export const getAllCompanies = async (req, res) => {
    try {
        const allCompanies = await db
            .select({
                id: companies.id,
                companyName: companies.companyName,
                employerPost: companies.employerPost,
                email: companies.email,
                businessType: companies.businessType,
                contactDetails: companies.contactDetails,
                introduction: companies.introduction,
                logoUrl: companies.logoUrl,
                isApproved: companies.isApproved,
                createdAt: companies.createdAt,
            })
            .from(companies);

        res.json({ companies: allCompanies });
    } catch (error) {
        console.error('Error in getAllCompanies:', error);
        res.status(500).json({ error: error.message || 'Failed to get companies' });
    }
};

/**
 * Review student CV (approve or reject)
 * PUT /admin/students/:studentId/cv
 * Body: { status: 'approved' | 'rejected', rejectionReason?: string }
 */
export const reviewStudentCV = async (req, res) => {
    try {
        const studentId = parseInt(req.params.studentId);

        // Validate request
        const validatedData = cvReviewSchema.parse(req.body);

        // Check if rejection reason is provided when rejecting
        if (validatedData.status === 'rejected' && !validatedData.rejectionReason) {
            res.status(400).json({ error: 'Rejection reason is required when rejecting a CV' });
            return;
        }

        // Check if student exists
        const [student] = await db
            .select()
            .from(students)
            .where(eq(students.id, studentId))
            .limit(1);

        if (!student) {
            res.status(404).json({ error: 'Student not found' });
            return;
        }

        // Update CV status
        const [updatedStudent] = await db
            .update(students)
            .set({
                cvStatus: validatedData.status,
                cvRejectionReason: validatedData.status === 'rejected' ? validatedData.rejectionReason : null,
                updatedAt: new Date(),
            })
            .where(eq(students.id, studentId))
            .returning();

        res.json({
            message: `CV ${validatedData.status} successfully`,
            student: {
                id: updatedStudent.id,
                fullName: updatedStudent.fullName,
                cvStatus: updatedStudent.cvStatus,
                cvRejectionReason: updatedStudent.cvRejectionReason,
            },
        });
    } catch (error) {
        console.error('Error in reviewStudentCV:', error);
        res.status(500).json({ error: error.message || 'Failed to review CV' });
    }
};

/**
 * Approve company registration
 * PUT /admin/companies/:companyId/approve
 */
export const approveCompany = async (req, res) => {
    try {
        const companyId = parseInt(req.params.companyId);

        // Check if company exists
        const [company] = await db
            .select()
            .from(companies)
            .where(eq(companies.id, companyId))
            .limit(1);

        if (!company) {
            res.status(404).json({ error: 'Company not found' });
            return;
        }

        // Approve company
        const [updatedCompany] = await db
            .update(companies)
            .set({
                isApproved: true,
                updatedAt: new Date(),
            })
            .where(eq(companies.id, companyId))
            .returning();

        res.json({
            message: 'Company approved successfully',
            company: {
                id: updatedCompany.id,
                companyName: updatedCompany.companyName,
                isApproved: updatedCompany.isApproved,
            },
        });
    } catch (error) {
        console.error('Error in approveCompany:', error);
        res.status(500).json({ error: error.message || 'Failed to approve company' });
    }
};

/**
 * Reject company registration
 * PUT /admin/companies/:companyId/reject
 */
export const rejectCompany = async (req, res) => {
    try {
        const companyId = parseInt(req.params.companyId);

        // Check if company exists
        const [company] = await db
            .select()
            .from(companies)
            .where(eq(companies.id, companyId))
            .limit(1);

        if (!company) {
            res.status(404).json({ error: 'Company not found' });
            return;
        }

        // Reject company (set to not approved)
        const [updatedCompany] = await db
            .update(companies)
            .set({
                isApproved: false,
                updatedAt: new Date(),
            })
            .where(eq(companies.id, companyId))
            .returning();

        res.json({
            message: 'Company rejected successfully',
            company: {
                id: updatedCompany.id,
                companyName: updatedCompany.companyName,
                isApproved: updatedCompany.isApproved,
            },
        });
    } catch (error) {
        console.error('Error in rejectCompany:', error);
        res.status(500).json({ error: error.message || 'Failed to reject company' });
    }
};

/**
 * Delete a student account
 * DELETE /admin/students/:studentId
 */
export const deleteStudent = async (req, res) => {
    try {
        const studentId = parseInt(req.params.studentId);

        // Check if student exists
        const [student] = await db
            .select()
            .from(students)
            .where(eq(students.id, studentId))
            .limit(1);

        if (!student) {
            res.status(404).json({ error: 'Student not found' });
            return;
        }

        // Delete student
        await db.delete(students).where(eq(students.id, studentId));

        res.json({
            message: 'Student account deleted successfully',
            deletedStudent: {
                id: student.id,
                fullName: student.fullName,
                email: student.email,
            },
        });
    } catch (error) {
        console.error('Error in deleteStudent:', error);
        res.status(500).json({ error: error.message || 'Failed to delete student' });
    }
};

/**
 * Delete a company account
 * DELETE /admin/companies/:companyId
 */
export const deleteCompany = async (req, res) => {
    try {
        const companyId = parseInt(req.params.companyId);

        // Check if company exists
        const [company] = await db
            .select()
            .from(companies)
            .where(eq(companies.id, companyId))
            .limit(1);

        if (!company) {
            res.status(404).json({ error: 'Company not found' });
            return;
        }

        // Delete company
        await db.delete(companies).where(eq(companies.id, companyId));

        res.json({
            message: 'Company account deleted successfully',
            deletedCompany: {
                id: company.id,
                companyName: company.companyName,
                email: company.email,
            },
        });
    } catch (error) {
        console.error('Error in deleteCompany:', error);
        res.status(500).json({ error: error.message || 'Failed to delete company' });
    }
};

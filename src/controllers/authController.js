import bcrypt from 'bcrypt';
import { db } from '../config/database.js';
import { students, companies, admins } from '../db/schema.js';
import { generateToken } from '../utils/jwt.js';
import { env } from '../config/env.js';
import {
    studentRegistrationSchema,
    companyRegistrationSchema,
    adminRegistrationSchema,
    loginSchema,
} from '../utils/validation.js';
import { uploadToGoogleDrive } from '../services/googleDrive.js';
import { eq } from 'drizzle-orm';

/**
 * Register a new student
 * POST /auth/register-student
 * Files: cv (required), pdcTable (optional), profilePicture (optional)
 */
export const registerStudent = async (req, res) => {
    try {
        // Validate request body
        const validatedData = studentRegistrationSchema.parse(req.body);

        // Check if files are uploaded
        const files = req.files;

        if (!files || !files.cv || files.cv.length === 0) {
            res.status(400).json({ error: 'CV file is required' });
            return;
        }

        // Check if email or student ID already exists
        const existingStudent = await db
            .select()
            .from(students)
            .where(eq(students.email, validatedData.email))
            .limit(1);

        if (existingStudent.length > 0) {
            res.status(400).json({ error: 'Email already registered' });
            return;
        }

        const existingStudentId = await db
            .select()
            .from(students)
            .where(eq(students.studentId, validatedData.studentId))
            .limit(1);

        if (existingStudentId.length > 0) {
            res.status(400).json({ error: 'Student ID already registered' });
            return;
        }

        // Hash password
        const passwordHash = await bcrypt.hash(validatedData.password, 10);

        // Upload CV to Google Drive
        const cvFile = files.cv[0];
        const cvUrl = await uploadToGoogleDrive({
            fileName: `${validatedData.studentId}_CV_${Date.now()}.${cvFile.originalname.split('.').pop()}`,
            mimeType: cvFile.mimetype,
            buffer: cvFile.buffer,
            folderType: 'cv',
        });

        // Upload PDC table if provided
        let pdcTableUrl = null;
        if (files.pdcTable && files.pdcTable.length > 0) {
            const pdcFile = files.pdcTable[0];
            pdcTableUrl = await uploadToGoogleDrive({
                fileName: `${validatedData.studentId}_PDC_${Date.now()}.${pdcFile.originalname.split('.').pop()}`,
                mimeType: pdcFile.mimetype,
                buffer: pdcFile.buffer,
                folderType: 'pdc',
            });
        }

        // Upload profile picture if provided
        let profilePictureUrl = null;
        if (files.profilePicture && files.profilePicture.length > 0) {
            const profileFile = files.profilePicture[0];
            profilePictureUrl = await uploadToGoogleDrive({
                fileName: `${validatedData.studentId}_Profile_${Date.now()}.${profileFile.originalname.split('.').pop()}`,
                mimeType: profileFile.mimetype,
                buffer: profileFile.buffer,
                folderType: 'student_profile',
            });
        }

        // Insert student into database
        const [newStudent] = await db
            .insert(students)
            .values({
                fullName: validatedData.fullName,
                studentId: validatedData.studentId,
                qualification: validatedData.qualification,
                gender: validatedData.gender,
                address: validatedData.address,
                contactNo: validatedData.contactNo,
                email: validatedData.email,
                passwordHash,
                cvUrl,
                pdcTableUrl,
                profilePictureUrl,
                cvStatus: 'pending',
            })
            .returning();

        res.status(201).json({
            message: 'Student registered successfully. Your CV is pending admin approval.',
            student: {
                id: newStudent.id,
                fullName: newStudent.fullName,
                email: newStudent.email,
                cvStatus: newStudent.cvStatus,
            },
        });
    } catch (error) {
        console.error('Error in registerStudent:', error.message || error);
        res.status(500).json({ error: error.message || 'Failed to register student' });
    }
};

/**
 * Register a new company
 * POST /auth/register-company
 * Files: logo (optional)
 */
export const registerCompany = async (req, res) => {
    try {
        // Validate request body
        const validatedData = companyRegistrationSchema.parse(req.body);

        // Check if email already exists
        const existingCompany = await db
            .select()
            .from(companies)
            .where(eq(companies.email, validatedData.email))
            .limit(1);

        if (existingCompany.length > 0) {
            res.status(400).json({ error: 'Email already registered' });
            return;
        }

        // Hash password
        const passwordHash = await bcrypt.hash(validatedData.password, 10);

        // Upload logo if provided
        let logoUrl = null;
        const files = req.files;

        if (files && files.logo && files.logo.length > 0) {
            const logoFile = files.logo[0];
            logoUrl = await uploadToGoogleDrive({
                fileName: `${validatedData.companyName.replace(/\s+/g, '_')}_Logo_${Date.now()}.${logoFile.originalname.split('.').pop()}`,
                mimeType: logoFile.mimetype,
                buffer: logoFile.buffer,
                folderType: 'company_logo',
            });
        }

        // Insert company into database
        const [newCompany] = await db
            .insert(companies)
            .values({
                companyName: validatedData.companyName,
                employerPost: validatedData.employerPost,
                address: validatedData.address,
                businessType: validatedData.businessType,
                contactDetails: validatedData.contactDetails,
                introduction: validatedData.introduction,
                logoUrl,
                email: validatedData.email,
                passwordHash,
                isApproved: false,
            })
            .returning();

        res.status(201).json({
            message: 'Company registered successfully. Your account is pending admin approval.',
            company: {
                id: newCompany.id,
                companyName: newCompany.companyName,
                email: newCompany.email,
                isApproved: newCompany.isApproved,
            },
        });
    } catch (error) {
        console.error('Error in registerCompany:', error);
        res.status(500).json({ error: error.message || 'Failed to register company' });
    }
};

/**
 * Register a new admin
 * POST /auth/register-admin
 * Requires admin secret
 */
export const registerAdmin = async (req, res) => {
    try {
        // Validate request body
        const validatedData = adminRegistrationSchema.parse(req.body);

        // Verify admin secret
        if (validatedData.adminSecret !== env.ADMIN_SECRET) {
            res.status(403).json({ error: 'Invalid admin secret' });
            return;
        }

        // Check if email already exists
        const existingAdmin = await db
            .select()
            .from(admins)
            .where(eq(admins.email, validatedData.email))
            .limit(1);

        if (existingAdmin.length > 0) {
            res.status(400).json({ error: 'Email already registered' });
            return;
        }

        // Hash password
        const passwordHash = await bcrypt.hash(validatedData.password, 10);

        // Insert admin into database
        const [newAdmin] = await db
            .insert(admins)
            .values({
                name: validatedData.name,
                email: validatedData.email,
                passwordHash,
                position: validatedData.position,
            })
            .returning();

        res.status(201).json({
            message: 'Admin registered successfully',
            admin: {
                id: newAdmin.id,
                name: newAdmin.name,
                email: newAdmin.email,
                position: newAdmin.position,
            },
        });
    } catch (error) {
        console.error('Error in registerAdmin:', error);
        res.status(500).json({ error: error.message || 'Failed to register admin' });
    }
};

/**
 * Login student
 * POST /auth/login-student
 */
export const loginStudent = async (req, res) => {
    try {
        const validatedData = loginSchema.parse(req.body);

        // Find student
        const [student] = await db
            .select()
            .from(students)
            .where(eq(students.email, validatedData.email))
            .limit(1);

        if (!student) {
            res.status(401).json({ error: 'Invalid email or password' });
            return;
        }

        // Verify password
        const isValidPassword = await bcrypt.compare(validatedData.password, student.passwordHash);

        if (!isValidPassword) {
            res.status(401).json({ error: 'Invalid email or password' });
            return;
        }

        // Generate JWT token
        const token = generateToken({
            id: student.id,
            email: student.email,
            role: 'student',
        });

        res.json({
            message: 'Login successful',
            token,
            user: {
                id: student.id,
                fullName: student.fullName,
                email: student.email,
                cvStatus: student.cvStatus,
            },
        });
    } catch (error) {
        console.error('Error in loginStudent:', error);
        res.status(500).json({ error: error.message || 'Failed to login' });
    }
};

/**
 * Login company
 * POST /auth/login-company
 */
export const loginCompany = async (req, res) => {
    try {
        const validatedData = loginSchema.parse(req.body);

        // Find company
        const [company] = await db
            .select()
            .from(companies)
            .where(eq(companies.email, validatedData.email))
            .limit(1);

        if (!company) {
            res.status(401).json({ error: 'Invalid email or password' });
            return;
        }

        // Verify password
        const isValidPassword = await bcrypt.compare(validatedData.password, company.passwordHash);

        if (!isValidPassword) {
            res.status(401).json({ error: 'Invalid email or password' });
            return;
        }

        // Generate JWT token
        const token = generateToken({
            id: company.id,
            email: company.email,
            role: 'company',
        });

        res.json({
            message: 'Login successful',
            token,
            user: {
                id: company.id,
                companyName: company.companyName,
                email: company.email,
                isApproved: company.isApproved,
            },
        });
    } catch (error) {
        console.error('Error in loginCompany:', error);
        res.status(500).json({ error: error.message || 'Failed to login' });
    }
};

/**
 * Login admin
 * POST /auth/login-admin
 */
export const loginAdmin = async (req, res) => {
    try {
        const validatedData = loginSchema.parse(req.body);

        // Find admin
        const [admin] = await db
            .select()
            .from(admins)
            .where(eq(admins.email, validatedData.email))
            .limit(1);

        if (!admin) {
            res.status(401).json({ error: 'Invalid email or password' });
            return;
        }

        // Verify password
        const isValidPassword = await bcrypt.compare(validatedData.password, admin.passwordHash);

        if (!isValidPassword) {
            res.status(401).json({ error: 'Invalid email or password' });
            return;
        }

        // Generate JWT token
        const token = generateToken({
            id: admin.id,
            email: admin.email,
            role: 'admin',
        });

        res.json({
            message: 'Login successful',
            token,
            user: {
                id: admin.id,
                name: admin.name,
                email: admin.email,
                position: admin.position,
            },
        });
    } catch (error) {
        console.error('Error in loginAdmin:', error);
        res.status(500).json({ error: error.message || 'Failed to login' });
    }
};

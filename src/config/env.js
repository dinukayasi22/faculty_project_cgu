import { z } from 'zod';
import * as dotenv from 'dotenv';

dotenv.config();

const envSchema = z.object({
    DATABASE_URL: z.string().url(),
    JWT_SECRET: z.string().min(32),
    ADMIN_SECRET: z.string().min(8),
    GOOGLE_CLIENT_ID: z.string(),
    GOOGLE_CLIENT_SECRET: z.string(),
    GOOGLE_REFRESH_TOKEN: z.string(),
    GOOGLE_DRIVE_CV_FOLDER_ID: z.string(),
    GOOGLE_DRIVE_PDC_FOLDER_ID: z.string(),
    GOOGLE_DRIVE_STUDENT_PROFILE_FOLDER_ID: z.string(),
    GOOGLE_DRIVE_COMPANY_LOGO_FOLDER_ID: z.string(),
    GOOGLE_DRIVE_BLOG_IMAGES_FOLDER_ID: z.string(),
    GOOGLE_DRIVE_BLOG_ATTACHMENTS_FOLDER_ID: z.string(),
    PORT: z.string().default('3000'),
    NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
    ALLOWED_ORIGINS: z.string().default('http://localhost:3000'),
});

let env;

try {
    env = envSchema.parse(process.env);
} catch (error) {
    if (error instanceof z.ZodError) {
        console.error(' Invalid environment variables:');
        error.errors.forEach((err) => {
            console.error(`  - ${err.path.join('.')}: ${err.message}`);
        });
        process.exit(1);
    }
    throw error;
}

export { env };

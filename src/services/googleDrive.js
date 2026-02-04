import { google } from 'googleapis';
import { env } from '../config/env.js';
import { Readable } from 'stream';

// Initialize OAuth2 client
const oauth2Client = new google.auth.OAuth2(
    env.GOOGLE_CLIENT_ID,
    env.GOOGLE_CLIENT_SECRET,
    'http://localhost:3000' // Redirect URI (not used for refresh token flow)
);

// Set refresh token
oauth2Client.setCredentials({
    refresh_token: env.GOOGLE_REFRESH_TOKEN,
});

const drive = google.drive({ version: 'v3', auth: oauth2Client });

/**
 * Upload a file to Google Drive and return its shareable link
 * @param {Object} options - Upload options
 * @param {string} options.fileName - Name of the file
 * @param {string} options.mimeType - MIME type of the file
 * @param {Buffer} options.buffer - File buffer
 * @param {string} options.folderType - Type of folder (cv, pdc, student_profile, company_logo, blog_image, blog_attachment)
 * @returns {Promise<string>} Shareable link to the uploaded file
 */
export const uploadToGoogleDrive = async (options) => {
    try {
        const { fileName, mimeType, buffer, folderType } = options;

        // Determine folder ID based on file type
        let folderId;
        switch (folderType) {
            case 'cv':
                folderId = env.GOOGLE_DRIVE_CV_FOLDER_ID;
                break;
            case 'pdc':
                folderId = env.GOOGLE_DRIVE_PDC_FOLDER_ID;
                break;
            case 'student_profile':
                folderId = env.GOOGLE_DRIVE_STUDENT_PROFILE_FOLDER_ID;
                break;
            case 'company_logo':
                folderId = env.GOOGLE_DRIVE_COMPANY_LOGO_FOLDER_ID;
                break;
            case 'blog_image':
                folderId = env.GOOGLE_DRIVE_BLOG_IMAGES_FOLDER_ID;
                break;
            case 'blog_attachment':
                folderId = env.GOOGLE_DRIVE_BLOG_ATTACHMENTS_FOLDER_ID;
                break;
            default:
                throw new Error(`Invalid folder type: ${folderType}`);
        }

        // Convert buffer to readable stream
        const bufferStream = new Readable();
        bufferStream.push(buffer);
        bufferStream.push(null);

        // Upload file to Google Drive
        const response = await drive.files.create({
            requestBody: {
                name: fileName,
                parents: [folderId],
            },
            media: {
                mimeType,
                body: bufferStream,
            },
            fields: 'id, webViewLink, webContentLink',
        });

        const fileId = response.data.id;

        if (!fileId) {
            throw new Error('Failed to upload file to Google Drive');
        }

        // Make file publicly accessible
        await drive.permissions.create({
            fileId,
            requestBody: {
                role: 'reader',
                type: 'anyone',
            },
        });

        // Get the shareable link
        const file = await drive.files.get({
            fileId,
            fields: 'webViewLink, webContentLink',
        });

        return file.data.webViewLink || file.data.webContentLink || '';
    } catch (error) {
        console.error('Error uploading to Google Drive:', error);
        throw new Error(`Failed to upload file to Google Drive: ${error.message}`);
    }
};

/**
 * Delete a file from Google Drive
 * @param {string} fileUrl - URL of the file to delete
 * @returns {Promise<void>}
 */
export const deleteFromGoogleDrive = async (fileUrl) => {
    try {
        // Extract file ID from URL
        const fileIdMatch = fileUrl.match(/\/d\/([a-zA-Z0-9_-]+)/);
        if (!fileIdMatch) {
            console.warn('Could not extract file ID from URL:', fileUrl);
            return;
        }

        const fileId = fileIdMatch[1];
        await drive.files.delete({ fileId });
    } catch (error) {
        console.error('Error deleting from Google Drive:', error);
        // Don't throw error - file deletion is not critical
    }
};

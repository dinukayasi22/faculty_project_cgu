const { google } = require('googleapis');
const readline = require('readline');

/**
 * Helper script to generate Google OAuth 2.0 Refresh Token
 * 
 * Prerequisites:
 * 1. Create a project in Google Cloud Console
 * 2. Enable Google Drive API
 * 3. Create OAuth 2.0 credentials (Desktop app type)
 * 4. Add http://localhost:3000 as authorized redirect URI
 * 
 * Usage:
 * 1. Set your CLIENT_ID and CLIENT_SECRET below
 * 2. Run: node scripts/generateRefreshToken.js
 * 3. Follow the authorization URL
 * 4. Copy the refresh token to your .env file
 */

// TODO: Replace these with your actual credentials from Google Cloud Console
const CLIENT_ID = 'YOUR_CLIENT_ID_HERE';
const CLIENT_SECRET = 'YOUR_CLIENT_SECRET_HERE';
const REDIRECT_URI = 'http://localhost:3000';

const SCOPES = ['https://www.googleapis.com/auth/drive.file'];

const oauth2Client = new google.auth.OAuth2(
    CLIENT_ID,
    CLIENT_SECRET,
    REDIRECT_URI
);

// Generate authorization URL
const authUrl = oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: SCOPES,
    prompt: 'consent', // Force to get refresh token
});

console.log('\n🔐 Google Drive OAuth 2.0 Refresh Token Generator\n');
console.log('📋 Steps:');
console.log('1. Open this URL in your browser:');
console.log('\n' + authUrl + '\n');
console.log('2. Authorize the application');
console.log('3. Copy the authorization code from the URL');
console.log('4. Paste it below\n');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
});

rl.question('Enter the authorization code: ', async (code) => {
    try {
        const { tokens } = await oauth2Client.getToken(code);

        console.log('\n✅ Success! Your refresh token:\n');
        console.log(tokens.refresh_token);
        console.log('\n📝 Add this to your .env file:');
        console.log(`GOOGLE_REFRESH_TOKEN=${tokens.refresh_token}\n`);

        if (tokens.access_token) {
            console.log('ℹ️  Access token (expires in 1 hour):');
            console.log(tokens.access_token);
        }
    } catch (error) {
        console.error('\n❌ Error getting tokens:', error.message);
    }

    rl.close();
});

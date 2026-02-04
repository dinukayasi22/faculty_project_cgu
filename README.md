# CGU Portal Backend

A comprehensive backend system for managing a student-company job portal with admin oversight. Built with Node.js, Express, and PostgreSQL.

## Features

### Three User Types
- **Students**: Register with CV, apply for jobs, track applications
- **Companies**: Post jobs, review applicants, manage applications
- **Admins**: Review CVs, approve companies, manage all users

### Key Functionality
- JWT-based authentication with role-based access control
- File uploads to Google Drive (CVs, PDFs, images)
- Admin approval workflows for students and companies
- Job posting and application management
- Account self-deletion with password confirmation

## Tech Stack

- **Runtime**: Node.js (ES Modules)
- **Framework**: Express.js
- **Database**: PostgreSQL (via Supabase)
- **ORM**: Drizzle ORM
- **File Storage**: Google Drive OAuth 2.0
- **Authentication**: JWT with bcrypt

## Setup

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment Variables

Copy `.env.example` to `.env` and fill in your values:

```bash
cp .env.example .env
```

Required variables:
- `DATABASE_URL`: PostgreSQL connection string
- `JWT_SECRET`: Secret key for JWT tokens (min 32 characters)
- `ADMIN_SECRET`: Secret key for admin registration
- Google Drive OAuth credentials (see below)

### 3. Setup Google Drive OAuth

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing
3. Enable Google Drive API
4. Create OAuth 2.0 credentials (Desktop app type)
5. Add `http://localhost:3000` as authorized redirect URI
6. Download credentials and note your `CLIENT_ID` and `CLIENT_SECRET`

Generate refresh token:

```bash
# Edit scripts/generateRefreshToken.js with your credentials
node scripts/generateRefreshToken.js
```

Follow the prompts and add the refresh token to your `.env` file.

### 4. Setup Database

Push schema to database:

```bash
npm run db:push
```

Or generate and run migrations:

```bash
npm run db:generate
npm run db:migrate
```

View database in Drizzle Studio:

```bash
npm run db:studio
```

## Running the Application

### Development Mode (with auto-reload)

```bash
npm run dev
```

### Production Mode

```bash
npm start
```

## API Endpoints

### Authentication (`/auth`)
- `POST /auth/register-student` - Register student with files
- `POST /auth/register-company` - Register company with logo
- `POST /auth/register-admin` - Register admin (requires secret)
- `POST /auth/login-student` - Student login
- `POST /auth/login-company` - Company login
- `POST /auth/login-admin` - Admin login

### Students (`/students`) - Requires student authentication
- `GET /students/profile` - Get own profile
- `PUT /students/profile` - Update profile
- `PUT /students/cv` - Update CV (if rejected)
- `DELETE /students/account` - Delete account
- `GET /students/jobs` - Browse available jobs
- `POST /students/apply/:jobId` - Apply for job
- `GET /students/applications` - View applications
- `DELETE /students/applications/:applicationId` - Delete application

### Companies (`/companies`) - Requires company authentication
- `GET /companies/profile` - Get own profile
- `PUT /companies/profile` - Update profile
- `DELETE /companies/account` - Delete account
- `POST /companies/jobs` - Post new job
- `GET /companies/jobs` - Get own jobs
- `PUT /companies/jobs/:jobId` - Update job
- `DELETE /companies/jobs/:jobId` - Delete job
- `GET /companies/jobs/:jobId/applicants` - View applicants
- `PUT /companies/applications/:applicationId` - Accept/reject application

### Admin (`/admin`) - Requires admin authentication
- `GET /admin/students` - List all students
- `GET /admin/companies` - List all companies
- `PUT /admin/students/:studentId/cv` - Review student CV
- `PUT /admin/companies/:companyId/approve` - Approve company
- `PUT /admin/companies/:companyId/reject` - Reject company
- `DELETE /admin/students/:studentId` - Delete student
- `DELETE /admin/companies/:companyId` - Delete company

### Jobs (`/jobs`) - Public endpoints
- `GET /jobs` - List all jobs
- `GET /jobs/:jobId` - Get job details

### Blog (`/blog`) - Public endpoints
- `GET /blog` - List all blog posts
- `GET /blog/:postId` - Get blog post details

### Admin Blog Management (`/admin/blog-posts`) - Requires admin authentication
- `POST /admin/blog-posts` - Create blog post (with images and attachments)
- `GET /admin/blog-posts` - Get all blog posts
- `GET /admin/blog-posts/:postId` - Get blog post by ID
- `PUT /admin/blog-posts/:postId` - Update blog post (with images and attachments)
- `DELETE /admin/blog-posts/:postId` - Delete blog post

## Project Structure

```
cgu-portal/
├── src/
│   ├── config/          # Configuration files
│   ├── db/              # Database schema and migrations
│   ├── middleware/      # Express middleware
│   ├── services/        # External services (Google Drive)
│   ├── controllers/     # Route controllers
│   ├── routes/          # API routes
│   ├── utils/           # Utilities (JWT, validation)
│   └── index.js         # Main application
├── scripts/             # Helper scripts
└── package.json
```

## License

ISC

# DocVerify - Document Management System

A comprehensive document verification and approval system with role-based access control.

## Project Structure

```
docVerify/
├── frontend/          # Next.js frontend application
└── backend/           # LoopBack 4 backend API
```

## Features

- **Role-Based Access Control**: 4 user roles with different permissions
  - Admin: Full system access
  - Document Creator: Create and manage document types
  - Document Uploader: Upload documents
  - Document Approver: Review and approve/reject documents

- **Document Management**
  - Multiple document type creation
  - Document upload with file attachment
  - Document approval workflow
  - Status tracking (pending, approved, rejected)

- **UI Features**
  - Modern admin panel interface
  - Modal dialogs for create/edit operations
  - Toast notifications for success/error messages
  - Pagination for large datasets
  - Responsive design

## Tech Stack

### Frontend
- Next.js 16 with App Router
- TypeScript
- Tailwind CSS
- React Hot Toast (notifications)
- Lucide React (icons)
- Axios (API calls)

### Backend
- LoopBack 4
- PostgreSQL
- JWT Authentication
- Bcrypt (password hashing)
- Multer (file uploads)

## Getting Started

### Prerequisites
- Node.js (v18 or higher)
- MySQL (v5.7 or higher)
- npm or yarn

### Database Setup

1. Create MySQL database:
```bash
mysql -u root -p
CREATE DATABASE document_verify;
exit
```

2. Run the schema SQL file:
```bash
cd backend
mysql -u root -p document_verify < database/schema.sql
```

### Backend Setup

1. Navigate to backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Update database configuration in `src/datasources/db.datasource.ts` if needed:
```typescript
{
  host: 'localhost',
  port: 3306,
  user: 'root',
  password: 'root',  // Change this to your MySQL password
  database: 'document_verify'
}
```

4. Build and start the backend:
```bash
npm run build
npm start
```

The backend API will run on `http://localhost:3001`

### Frontend Setup

1. Navigate to frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

The frontend will run on `http://localhost:3000`

## Default User Accounts

The database comes with 4 pre-configured demo accounts:

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@example.com | admin123 |
| Document Creator | creator@example.com | creator123 |
| Document Uploader | uploader@example.com | uploader123 |
| Document Approver | approver@example.com | approver123 |

## User Roles & Permissions

### Admin
- Full access to all features
- Create/edit/delete document types
- Upload documents
- Approve/reject documents
- View all documents

### Document Creator
- Create and manage document types
- View document types

### Document Uploader
- Upload documents
- View own uploaded documents
- Select document types for uploads

### Document Approver
- View pending documents
- Approve or reject documents
- Add remarks/feedback

## API Endpoints

### Authentication
- `POST /users/signup` - Register new user
- `POST /users/login` - Login
- `GET /users/me` - Get current user profile

### Document Types
- `GET /document-types` - List all document types
- `POST /document-types` - Create document type (Admin/Creator)
- `PATCH /document-types/{id}` - Update document type (Admin/Creator)
- `DELETE /document-types/{id}` - Delete document type (Admin only)

### Documents
- `GET /documents` - List documents (filtered by role)
- `POST /documents/upload` - Upload document (Admin/Uploader)
- `PATCH /documents/{id}/approve` - Approve/reject document (Admin/Approver)
- `DELETE /documents/{id}` - Delete document (Admin only)

## Development

### Backend
```bash
cd backend
npm run build      # Compile TypeScript
npm start          # Start production server
npm run dev        # Start with auto-reload
```

### Frontend
```bash
cd frontend
npm run dev        # Start development server
npm run build      # Build for production
npm start          # Start production server
```

## File Upload

Documents are uploaded to `backend/uploads/` directory. Make sure this directory exists and has proper write permissions.

## Security Notes

1. Change the JWT secret in `backend/src/application.ts` before production:
```typescript
this.bind('authentication.jwt.secret').to('your-secret-key-change-this-in-production');
```

2. Update CORS settings in `backend/src/sequence.ts` for production

3. Use environment variables for sensitive data

## Troubleshooting

### Backend won't start
- Verify MySQL is running
- Check database credentials in datasource configuration
- Ensure database schema has been applied

### Frontend can't connect to backend
- Verify backend is running on port 3001
- Check `.env.local` file has correct API URL
- Check CORS settings in backend

### File upload fails
- Verify `backend/uploads/` directory exists
- Check file size limits in multer configuration
- Ensure proper permissions on uploads directory

## License

MIT

## Support

For issues and questions, please open an issue in the project repository.

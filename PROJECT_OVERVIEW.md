# DocVerify - Complete Project Overview

## 🎯 Project Summary

DocVerify is a full-stack document verification and approval system with role-based access control. Built with Next.js and LoopBack 4, it provides a modern admin panel interface for managing document workflows.

## 🏗️ Architecture

### Frontend (Next.js 16)
- **Framework**: Next.js with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **State Management**: React Context API
- **HTTP Client**: Axios
- **Notifications**: React Hot Toast
- **Icons**: Lucide React

### Backend (LoopBack 4)
- **Framework**: LoopBack 4
- **Database**: MySQL
- **Authentication**: JWT with Bcrypt
- **File Upload**: Multer
- **API Documentation**: OpenAPI (Swagger)

## 👥 User Roles & Capabilities

### 1. Admin
**Capabilities:**
- Full system access
- Create/edit/delete document types
- Upload documents
- Approve/reject documents
- View all documents
- Manage all users

**Use Case:** System administrator managing the entire platform

### 2. Document Creator
**Capabilities:**
- Create new document types
- Edit document types they created
- View all document types

**Use Case:** Department heads defining what document types are needed

### 3. Document Uploader
**Capabilities:**
- Upload documents
- View their own uploaded documents
- Select from available document types
- Add remarks to uploads

**Use Case:** Employees submitting documents for approval

### 4. Document Approver
**Capabilities:**
- View all pending documents
- Approve or reject documents
- Add remarks/feedback
- View document history

**Use Case:** Managers/reviewers who verify document submissions

## 🔐 Authentication Flow

```
1. User enters email/password
2. Backend validates credentials (bcrypt)
3. JWT token generated and returned
4. Token stored in localStorage
5. Token sent with all API requests
6. Backend validates token and role permissions
```

## 📊 Database Schema

### Users Table
- id, email, username, role, is_active
- Stores user account information
- One-to-many with UserCredentials

### UserCredentials Table
- id, user_id, password (hashed)
- Stores encrypted passwords
- One-to-one with Users

### DocumentTypes Table
- id, name, description, is_active, created_by
- Defines categories of documents
- One-to-many with Documents

### Documents Table
- id, title, file_path, file_name, document_type_id
- uploaded_by, status, approved_by, remarks
- Stores document metadata and status

## 🔄 Document Workflow

```
1. Admin/Creator creates document type (e.g., "Invoice", "Contract")
   ↓
2. Uploader uploads document, selects type, adds title
   ↓
3. Document saved with status: "pending"
   ↓
4. Approver reviews document
   ↓
5. Approver takes action:
   - Approve → status: "approved"
   - Reject → status: "rejected" (with remarks)
   ↓
6. Uploader sees updated status
```

## 📁 File Structure

```
frontend/
├── app/
│   ├── (dashboard)/          # Protected routes
│   │   ├── layout.tsx        # Dashboard layout with sidebar
│   │   ├── dashboard/        # Main dashboard
│   │   ├── document-types/   # Manage document types
│   │   ├── upload/           # Upload documents
│   │   ├── documents/        # View documents
│   │   └── approvals/        # Approve documents
│   ├── login/                # Login page
│   ├── layout.tsx            # Root layout
│   └── page.tsx              # Home (redirects to login)
├── components/
│   ├── Modal.tsx             # Reusable modal component
│   ├── Pagination.tsx        # Pagination component
│   └── Sidebar.tsx           # Navigation sidebar
├── contexts/
│   └── AuthContext.tsx       # Authentication context
├── lib/
│   └── api.ts                # Axios instance with interceptors
└── types/
    └── index.ts              # TypeScript interfaces

backend/
├── src/
│   ├── controllers/
│   │   ├── user.controller.ts           # Auth & user management
│   │   ├── document-type.controller.ts  # Document types CRUD
│   │   └── document.controller.ts       # Documents & uploads
│   ├── models/
│   │   ├── user.model.ts
│   │   ├── user-credentials.model.ts
│   │   ├── document-type.model.ts
│   │   └── document.model.ts
│   ├── repositories/
│   │   ├── user.repository.ts
│   │   ├── user-credentials.repository.ts
│   │   ├── document-type.repository.ts
│   │   └── document.repository.ts
│   ├── services/
│   │   ├── jwt.service.ts       # JWT token generation/validation
│   │   └── user.service.ts      # User authentication
│   ├── datasources/
│   │   └── db.datasource.ts     # PostgreSQL connection
│   ├── application.ts            # App configuration
│   ├── sequence.ts               # Request handling & CORS
│   └── index.ts                  # Server startup
├── database/
│   └── schema.sql                # Database schema & seed data
└── uploads/                      # File storage directory
```

## 🔌 API Endpoints

### Authentication
```
POST   /users/signup    - Register new user
POST   /users/login     - Login (returns JWT token)
GET    /users/me        - Get current user profile
GET    /users           - List all users (Admin)
```

### Document Types
```
GET    /document-types           - List all document types
POST   /document-types           - Create document type
GET    /document-types/{id}      - Get single document type
PATCH  /document-types/{id}      - Update document type
DELETE /document-types/{id}      - Delete document type
GET    /document-types/count     - Count document types
```

### Documents
```
GET    /documents                - List documents (role-filtered)
POST   /documents/upload         - Upload document (multipart/form-data)
GET    /documents/{id}           - Get single document
PATCH  /documents/{id}           - Update document
PATCH  /documents/{id}/approve   - Approve/reject document
DELETE /documents/{id}           - Delete document
GET    /documents/count          - Count documents
```

## 🎨 UI Components

### Modal Component
- Reusable dialog for create/edit forms
- Overlay with backdrop
- Configurable sizes (sm, md, lg)
- Close button and escape key support

### Pagination Component
- Shows current page, total pages
- Previous/Next navigation
- Direct page number selection
- Item count display

### Sidebar Component
- Role-based navigation menu
- Mobile-responsive (hamburger menu)
- Active route highlighting
- User info display
- Logout button

## 🔔 Notification System

Using React Hot Toast for user feedback:
- **Success**: Green toast (e.g., "Document uploaded successfully")
- **Error**: Red toast (e.g., "Upload failed")
- **Info**: Blue toast (e.g., "Processing...")
- Auto-dismiss after 3-5 seconds
- Position: top-right

## 🎯 Key Features Implemented

✅ Role-based access control (4 roles)
✅ JWT authentication
✅ Document type management
✅ File upload with form data
✅ Document approval workflow
✅ Modal dialogs for CRUD operations
✅ Toast notifications
✅ Pagination for large lists
✅ Responsive admin panel
✅ Protected routes
✅ CORS configuration
✅ Database relationships
✅ Status tracking
✅ Remarks/feedback system

## 🚀 Deployment Considerations

### Production Checklist
- [ ] Change JWT secret key
- [ ] Update database credentials
- [ ] Configure environment variables
- [ ] Set up file storage (S3, etc.)
- [ ] Configure CORS for production domain
- [ ] Enable HTTPS
- [ ] Set up database backups
- [ ] Configure logging
- [ ] Add rate limiting
- [ ] Set up monitoring

### Environment Variables

**Backend:**
```bash
PORT=3001
HOST=0.0.0.0
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=your_password
DB_NAME=document_verify
JWT_SECRET=your-secret-key
JWT_EXPIRES_IN=7200
```

**Frontend:**
```bash
NEXT_PUBLIC_API_URL=http://localhost:3001
```

## 📈 Future Enhancements

Potential additions:
1. Document preview functionality
2. File download feature
3. Advanced search and filtering
4. Bulk document upload
5. Email notifications
6. Audit log
7. Document versioning
8. Comments/discussion threads
9. Dashboard analytics/charts
10. Export reports (PDF/Excel)
11. Document categories/tags
12. Advanced permissions (field-level)
13. Document expiration dates
14. OCR for document scanning
15. Integration with cloud storage

## 📝 Testing Workflow

### Manual Testing Steps

1. **Login & Authentication**
   - Test all 4 demo accounts
   - Verify JWT token storage
   - Test logout functionality

2. **Document Types (as Admin/Creator)**
   - Create new document type
   - Edit existing type
   - Delete type (Admin only)
   - Verify pagination

3. **Document Upload (as Uploader)**
   - Upload document with file
   - Select document type
   - Add title and remarks
   - Verify file saved in uploads/

4. **Document Approval (as Approver)**
   - View pending documents
   - Approve document with remarks
   - Reject document with reason
   - Verify status updates

5. **Access Control**
   - Verify role-based navigation
   - Test unauthorized access (should block)
   - Verify data filtering by role

## 🛠️ Troubleshooting Guide

### Issue: Backend won't build
**Solution:** Run `npm install @types/mocha --save-dev`

### Issue: CORS errors
**Solution:** Check `sequence.ts` CORS headers and frontend API URL

### Issue: File upload fails
**Solution:** 
- Verify `backend/uploads/` exists
- Check file size limits in multer config
- Ensure proper Content-Type header

### Issue: Database connection fails
**Solution:**
- Verify MySQL is running: `mysql -u root -p -e "SELECT 1"`
- Check credentials in `db.datasource.ts`
- Ensure database exists: `mysql -u root -p -e "SHOW DATABASES LIKE 'document_verify'"`

### Issue: JWT token expired
**Solution:**
- Clear localStorage
- Re-login
- Adjust JWT expiration time in application.ts

## 📞 Support & Documentation

- **API Documentation**: http://localhost:3001/explorer
- **Main README**: README.md
- **Setup Guide**: SETUP.md
- **Database Schema**: backend/database/schema.sql

## 📄 License

MIT License - Feel free to use and modify for your needs.

---

**Built with ❤️ using Next.js and LoopBack 4**

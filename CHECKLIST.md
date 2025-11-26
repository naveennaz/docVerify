# DocVerify Setup Checklist

Use this checklist to ensure everything is properly configured.

## ✅ Prerequisites

- [ ] Node.js v18 or higher installed
  ```bash
  node --version
  # Should show v18.x.x or higher
  ```

- [ ] MySQL installed
  ```bash
  mysql --version
  # Should show MySQL 5.7 or higher
  ```

- [ ] MySQL is running
  ```bash
  mysql -u root -p -e "SELECT 1"
  # Should connect without error
  ```

- [ ] npm installed
  ```bash
  npm --version
  ```

## 🗄️ Database Setup

- [ ] Database created
  ```bash
  ./setup-database.sh
  # OR manually: createdb document_verify
  ```

- [ ] Schema applied
  ```bash
  mysql -u root -p document_verify < backend/database/schema.sql
  ```

- [ ] Database password configured
  - [ ] Update `backend/src/datasources/db.datasource.ts`
  - [ ] Change `password: 'root'` to your actual password

- [ ] Verify demo users created
  ```bash
  mysql -u root -p -e "USE document_verify; SELECT email, role FROM users;"
  ```

## 🔧 Backend Setup

- [ ] Navigate to backend directory
  ```bash
  cd backend
  ```

- [ ] Install dependencies
  ```bash
  npm install
  ```

- [ ] Install missing types (if needed)
  ```bash
  npm install --save-dev @types/mocha
  ```

- [ ] Build backend
  ```bash
  npm run build
  # Should complete without errors
  ```

- [ ] JWT secret configured
  - [ ] Open `backend/src/application.ts`
  - [ ] Change JWT secret for production

- [ ] Uploads directory exists
  ```bash
  ls -la backend/uploads/
  # Should exist with .gitkeep file
  ```

## 🎨 Frontend Setup

- [ ] Navigate to frontend directory
  ```bash
  cd frontend
  ```

- [ ] Install dependencies
  ```bash
  npm install
  ```

- [ ] Environment file created
  ```bash
  cat frontend/.env.local
  # Should contain: NEXT_PUBLIC_API_URL=http://localhost:3001
  ```

- [ ] No build errors
  ```bash
  npm run build
  # Should complete successfully
  ```

## 🚀 Application Startup

- [ ] Backend starts successfully
  ```bash
  cd backend && npm start
  # Should see: Server is running at http://127.0.0.1:3001
  ```

- [ ] Frontend starts successfully
  ```bash
  cd frontend && npm run dev
  # Should see: Ready on http://localhost:3000
  ```

- [ ] OR use startup script
  ```bash
  ./start.sh
  ```

## 🧪 Functionality Testing

### Authentication
- [ ] Can access http://localhost:3000
- [ ] Login page loads correctly
- [ ] Can login as admin (admin@example.com / admin123)
- [ ] Redirects to dashboard after login
- [ ] JWT token stored in localStorage
- [ ] Can logout successfully

### Admin User (admin@example.com)
- [ ] Dashboard shows statistics
- [ ] Can navigate to all menu items
- [ ] Can create document type
- [ ] Can edit document type
- [ ] Can delete document type
- [ ] Can upload document
- [ ] Can approve document
- [ ] Can view all documents

### Document Creator (creator@example.com)
- [ ] Can login successfully
- [ ] Can see Document Types menu
- [ ] Can create document type
- [ ] Can edit document type
- [ ] Cannot delete document type
- [ ] Cannot see Upload or Approvals menu

### Document Uploader (uploader@example.com)
- [ ] Can login successfully
- [ ] Can see Upload Documents menu
- [ ] Can upload document with file
- [ ] Can select document type
- [ ] Can view own documents only
- [ ] Cannot see Document Types menu
- [ ] Cannot see Approvals menu

### Document Approver (approver@example.com)
- [ ] Can login successfully
- [ ] Can see Approvals menu
- [ ] Can view pending documents
- [ ] Can approve document with remarks
- [ ] Can reject document with reason
- [ ] Cannot upload documents
- [ ] Cannot create document types

## 🎯 UI Components Testing

### Modal
- [ ] Opens when clicking "New Document Type"
- [ ] Close button works
- [ ] Clicking outside closes modal
- [ ] Form validation works
- [ ] Submit creates/updates successfully

### Toast Notifications
- [ ] Success toast shows on successful action (green)
- [ ] Error toast shows on failed action (red)
- [ ] Toasts auto-dismiss after few seconds
- [ ] Multiple toasts stack properly

### Pagination
- [ ] Shows when more than 10 items
- [ ] Page numbers display correctly
- [ ] Previous/Next buttons work
- [ ] Direct page selection works
- [ ] Shows correct item count

### Sidebar
- [ ] Role-appropriate menu items show
- [ ] Active route highlighted
- [ ] Mobile menu works (hamburger icon)
- [ ] Logout button works
- [ ] User info displays correctly

## 🔐 Security Testing

- [ ] Cannot access dashboard without login
- [ ] Redirects to login when token expired
- [ ] Cannot access unauthorized routes
- [ ] Password is hashed in database
- [ ] JWT token expires correctly
- [ ] CORS allows frontend requests

## 📊 Database Integrity

- [ ] Users table has 4 demo users
- [ ] User credentials table has passwords
- [ ] Foreign key constraints work
- [ ] Can create document type
- [ ] Can create document
- [ ] Status updates correctly

## 🔍 API Testing

- [ ] API Explorer accessible at http://localhost:3001/explorer
- [ ] Can test endpoints in API Explorer
- [ ] Authentication required for protected routes
- [ ] File upload works via API
- [ ] CORS headers present

## 📁 File System

- [ ] Uploads directory writable
  ```bash
  touch backend/uploads/test.txt && rm backend/uploads/test.txt
  ```

- [ ] Files save to uploads directory
- [ ] File metadata saves to database

## 🐛 Error Handling

- [ ] Login with wrong password shows error
- [ ] Login with wrong email shows error
- [ ] Upload without file shows error
- [ ] Required fields show validation
- [ ] Network errors show toast

## 🌐 URLs Working

- [ ] http://localhost:3000 - Frontend
- [ ] http://localhost:3001 - Backend API
- [ ] http://localhost:3001/explorer - API Explorer
- [ ] http://localhost:3001/ping - Health check

## 📝 Documentation

- [ ] README.md exists and is complete
- [ ] SETUP.md provides clear instructions
- [ ] PROJECT_OVERVIEW.md describes architecture
- [ ] GET_STARTED.md provides quick start
- [ ] Database schema documented

## 🎉 Final Verification

- [ ] All 4 user roles tested
- [ ] Complete workflow tested (create type → upload → approve)
- [ ] No console errors in browser
- [ ] No errors in backend logs
- [ ] Application ready for use!

## ⚠️ Common Issues Checklist

If something doesn't work, check:

- [ ] MySQL is actually running
- [ ] Database credentials are correct
- [ ] Both backend and frontend are running
- [ ] No port conflicts (3000, 3001)
- [ ] JWT secret is configured
- [ ] Uploads directory has write permissions
- [ ] Browser localStorage is not full
- [ ] .env.local file exists in frontend
- [ ] All npm installs completed successfully

## 🚀 Production Checklist

Before deploying to production:

- [ ] Change JWT secret to secure random string
- [ ] Update database credentials
- [ ] Configure production API URL
- [ ] Set up cloud file storage
- [ ] Configure CORS for production domain
- [ ] Enable HTTPS
- [ ] Set up database backups
- [ ] Configure environment variables
- [ ] Add rate limiting
- [ ] Set up monitoring/logging
- [ ] Test on production environment
- [ ] Create real user accounts
- [ ] Remove demo accounts
- [ ] Update README with production URLs

---

**Status:** [ ] All checks passed - Ready to use!

**Date:** _______________

**Notes:**
_______________________________________________________________________
_______________________________________________________________________
_______________________________________________________________________

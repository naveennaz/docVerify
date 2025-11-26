# Quick Setup Guide

## Prerequisites Check
- [ ] Node.js v18+ installed (`node --version`)
- [ ] MySQL installed and running (`mysql --version`)
- [ ] npm or yarn installed

## Setup Steps

### 1. Database Setup (5 minutes)

```bash
# Create database
mysql -u root -p
CREATE DATABASE document_verify;
exit

# Run schema
cd backend
mysql -u root -p document_verify < database/schema.sql
```

**Important:** Update MySQL password in `backend/src/datasources/db.datasource.ts` if needed.

### 2. Backend Setup (2 minutes)

```bash
cd backend
npm install
npm run build
```

### 3. Frontend Setup (2 minutes)

```bash
cd frontend
npm install
```

### 4. Start Application

**Option A: Use the startup script**
```bash
./start.sh
```

**Option B: Start manually**
```bash
# Terminal 1 - Backend
cd backend
npm start

# Terminal 2 - Frontend
cd frontend
npm run dev
```

## Access the Application

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:3001
- **API Explorer**: http://localhost:3001/explorer

## Demo Accounts

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@example.com | admin123 |
| Creator | creator@example.com | creator123 |
| Uploader | uploader@example.com | uploader123 |
| Approver | approver@example.com | approver123 |

## Testing the Application

1. **Login** as any demo user
2. **Admin/Creator**: Go to "Document Types" → Create a new document type
3. **Admin/Uploader**: Go to "Upload Documents" → Upload a document
4. **Admin/Approver**: Go to "Approvals" → Approve/reject documents
5. **All Users**: View dashboard and documents

## Common Issues

### Backend won't start
- Check MySQL is running: `mysql -u root -p -e "SELECT 1"`
- Verify database exists: `mysql -u root -p -e "SHOW DATABASES LIKE 'document_verify'"`
- Check password in datasource config

### Frontend can't connect
- Ensure backend is running on port 3001
- Check `.env.local` file exists in frontend folder
- Verify no firewall blocking localhost

### File upload fails
- Check `backend/uploads/` directory exists
- Verify write permissions: `ls -la backend/uploads`

## Project Structure

```
docVerify/
├── frontend/              # Next.js application
│   ├── app/              # App router pages
│   ├── components/       # Reusable components
│   ├── contexts/         # React contexts
│   ├── lib/              # Utilities (API client)
│   └── types/            # TypeScript types
│
└── backend/              # LoopBack 4 API
    ├── src/
    │   ├── controllers/  # API endpoints
    │   ├── models/       # Database models
    │   ├── repositories/ # Data access layer
    │   ├── datasources/  # Database connections
    │   └── services/     # Business logic
    ├── database/         # SQL schema
    └── uploads/          # File storage

```

## Next Steps

1. Change JWT secret in `backend/src/application.ts`
2. Update PostgreSQL credentials for your environment
3. Customize the UI theme in `frontend/tailwind.config.ts`
4. Add more document types
5. Test the complete workflow

## Need Help?

Check the main README.md for detailed documentation and troubleshooting.

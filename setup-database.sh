#!/bin/bash

echo "🗄️  DocVerify Database Setup"
echo "================================"
echo ""

# Check if MySQL is installed
if ! command -v mysql &> /dev/null; then
    echo "❌ MySQL is not installed. Please install MySQL first."
    exit 1
fi

echo "✅ MySQL found"
echo ""

# Prompt for MySQL username
read -p "Enter MySQL username (default: root): " DB_USER
DB_USER=${DB_USER:-root}

# Prompt for MySQL password
read -sp "Enter MySQL password: " DB_PASS
echo ""

# Create database
echo ""
echo "📦 Creating database 'document_verify'..."
mysql -u "$DB_USER" -p"$DB_PASS" -e "CREATE DATABASE IF NOT EXISTS document_verify;" 2>/dev/null

if [ $? -eq 0 ]; then
    echo "✅ Database created successfully"
else
    echo "❌ Failed to create database. Please check your credentials."
    exit 1
fi

# Run schema
echo ""
echo "📋 Running database schema..."
cd "$(dirname "$0")/backend"
mysql -u "$DB_USER" -p"$DB_PASS" document_verify < database/schema.sql

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ Database setup completed successfully!"
    echo ""
    echo "📊 Database: document_verify"
    echo "👥 Demo users created:"
    echo "   • admin@example.com / admin123 (Admin)"
    echo "   • creator@example.com / creator123 (Document Creator)"
    echo "   • uploader@example.com / uploader123 (Document Uploader)"
    echo "   • approver@example.com / approver123 (Document Approver)"
    echo ""
    echo "⚠️  Important: Update database password in backend/src/datasources/db.datasource.ts"
    echo ""
    echo "🚀 Next steps:"
    echo "   1. cd backend && npm install && npm run build"
    echo "   2. cd frontend && npm install"
    echo "   3. ./start.sh"
else
    echo "❌ Database setup failed. Please check the error messages above."
    exit 1
fi

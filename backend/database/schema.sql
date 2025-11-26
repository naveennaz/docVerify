-- Create database
-- Run this in MySQL: CREATE DATABASE document_verify;

-- Use document_verify database and run the following:
-- mysql -u root -p document_verify < schema.sql

-- Users table
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    username VARCHAR(100) NOT NULL,
    role VARCHAR(50) NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CHECK (role IN ('admin', 'document_creator', 'document_uploader', 'document_approver'))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- User credentials table
CREATE TABLE IF NOT EXISTS user_credentials (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    password VARCHAR(255) NOT NULL,
    UNIQUE KEY unique_user_id (user_id),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Document types table
CREATE TABLE IF NOT EXISTS document_types (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_by INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (created_by) REFERENCES users(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Documents table
CREATE TABLE IF NOT EXISTS documents (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    file_path VARCHAR(500) NOT NULL,
    file_name VARCHAR(255) NOT NULL,
    mime_type VARCHAR(100),
    file_size BIGINT,
    document_type_id INT NOT NULL,
    uploaded_by INT NOT NULL,
    status VARCHAR(50) DEFAULT 'pending',
    approved_by INT,
    approved_at TIMESTAMP NULL,
    remarks TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (document_type_id) REFERENCES document_types(id),
    FOREIGN KEY (uploaded_by) REFERENCES users(id),
    FOREIGN KEY (approved_by) REFERENCES users(id),
    CHECK (status IN ('pending', 'approved', 'rejected'))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Create indexes for better performance
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_documents_uploaded_by ON documents(uploaded_by);
CREATE INDEX idx_documents_document_type_id ON documents(document_type_id);
CREATE INDEX idx_documents_status ON documents(status);
CREATE INDEX idx_document_types_created_by ON document_types(created_by);

-- Insert sample admin user (password: admin123)
-- Password is bcrypt hashed
INSERT INTO users (email, username, role, is_active) 
VALUES ('admin@example.com', 'Admin User', 'admin', TRUE);

INSERT INTO user_credentials (user_id, password)
VALUES (1, '$2b$10$PLhIywzzHyNLA1WCY2NhV./4Fit3D0BxFGD9jta039SLNfLX9oe/a');

-- Insert sample document creator user (password: creator123)
INSERT INTO users (email, username, role, is_active) 
VALUES ('creator@example.com', 'Document Creator', 'document_creator', TRUE);

INSERT INTO user_credentials (user_id, password)
VALUES (2, '$2b$10$if7v2TYu0nN2PnFv0LrnAe1X.Gfk8rexu3epeitOBClGjSkgHdnDy');

-- Insert sample document uploader user (password: uploader123)
INSERT INTO users (email, username, role, is_active) 
VALUES ('uploader@example.com', 'Document Uploader', 'document_uploader', TRUE);

INSERT INTO user_credentials (user_id, password)
VALUES (3, '$2b$10$RYRZfLHs2yEX5pk5LQaCVeh3kH6YB3HT3DiOQ4mPQ1HqHaNu8Cg5q');

-- Insert sample document approver user (password: approver123)
INSERT INTO users (email, username, role, is_active) 
VALUES ('approver@example.com', 'Document Approver', 'document_approver', TRUE);

INSERT INTO user_credentials (user_id, password)
VALUES (4, '$2b$10$wOm0VY792yTMbw18U4JpduPJVsNLgh0ofukEXrk/I9LPili/6vkPO');

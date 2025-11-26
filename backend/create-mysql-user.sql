-- Create MySQL user for docVerify application
-- Run this as MySQL root user: mysql -u root -p < create-mysql-user.sql

-- Create the database if it doesn't exist
CREATE DATABASE IF NOT EXISTS document_verify;

-- Create the user (change 'your_password_here' to a secure password)
CREATE USER IF NOT EXISTS 'docVerify'@'localhost' IDENTIFIED BY 'docVerify123!';

-- Grant all privileges on the document_verify database to docVerify user
GRANT ALL PRIVILEGES ON document_verify.* TO 'docVerify'@'localhost';

-- Apply the changes
FLUSH PRIVILEGES;

-- Show the user was created
SELECT User, Host FROM mysql.user WHERE User = 'docVerify';

-- Show granted privileges
SHOW GRANTS FOR 'docVerify'@'localhost';

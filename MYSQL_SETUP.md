# MySQL Setup for DocVerify

## Quick MySQL Setup Guide

### 1. Install MySQL (if not installed)

**macOS:**
```bash
brew install mysql
brew services start mysql
```

**Ubuntu/Debian:**
```bash
sudo apt update
sudo apt install mysql-server
sudo systemctl start mysql
```

**Windows:**
Download from: https://dev.mysql.com/downloads/mysql/

### 2. Secure MySQL Installation (Recommended)

```bash
sudo mysql_secure_installation
```

Follow prompts to:
- Set root password
- Remove anonymous users
- Disallow root login remotely
- Remove test database

### 3. Create Database

```bash
# Login to MySQL
mysql -u root -p

# Create database
CREATE DATABASE document_verify;

# Verify database created
SHOW DATABASES LIKE 'document_verify';

# Exit
exit
```

### 4. Run Schema

```bash
cd backend
mysql -u root -p document_verify < database/schema.sql
```

### 5. Verify Setup

```bash
# Check tables created
mysql -u root -p -e "USE document_verify; SHOW TABLES;"

# Check demo users
mysql -u root -p -e "USE document_verify; SELECT email, role FROM users;"
```

Expected output:
```
+--------------------------+---------------------+
| email                    | role                |
+--------------------------+---------------------+
| admin@example.com        | admin               |
| creator@example.com      | document_creator    |
| uploader@example.com     | document_uploader   |
| approver@example.com     | document_approver   |
+--------------------------+---------------------+
```

### 6. Configure Application

Update `backend/src/datasources/db.datasource.ts`:

```typescript
const config = {
  name: 'db',
  connector: 'mysql',
  host: 'localhost',
  port: 3306,
  user: 'root',
  password: 'YOUR_MYSQL_PASSWORD',  // <-- Change this
  database: 'document_verify'
};
```

### Common MySQL Commands

```bash
# Check MySQL status
mysql --version

# Start MySQL
# macOS: brew services start mysql
# Linux: sudo systemctl start mysql

# Stop MySQL
# macOS: brew services stop mysql
# Linux: sudo systemctl stop mysql

# Restart MySQL
# macOS: brew services restart mysql
# Linux: sudo systemctl restart mysql

# Login to MySQL
mysql -u root -p

# Show all databases
mysql -u root -p -e "SHOW DATABASES;"

# Drop database (CAREFUL!)
mysql -u root -p -e "DROP DATABASE document_verify;"

# Backup database
mysqldump -u root -p document_verify > backup.sql

# Restore database
mysql -u root -p document_verify < backup.sql
```

### Troubleshooting

**Can't connect to MySQL:**
```bash
# Check if MySQL is running
ps aux | grep mysql

# Check MySQL error log
# macOS: tail -f /usr/local/var/mysql/*.err
# Linux: tail -f /var/log/mysql/error.log
```

**Access denied for user:**
- Verify password is correct
- Check user has proper permissions
- Reset root password if needed

**Database doesn't exist:**
```bash
# Recreate database
mysql -u root -p -e "CREATE DATABASE document_verify;"
mysql -u root -p document_verify < backend/database/schema.sql
```

**Port 3306 already in use:**
```bash
# Check what's using port 3306
lsof -i :3306

# Kill the process if needed
kill -9 <PID>
```

### MySQL Configuration

Default MySQL configuration file locations:
- **macOS**: `/usr/local/etc/my.cnf` or `/etc/my.cnf`
- **Linux**: `/etc/mysql/my.cnf` or `/etc/my.cnf`
- **Windows**: `C:\ProgramData\MySQL\MySQL Server X.X\my.ini`

Key settings for development:
```ini
[mysqld]
port=3306
max_connections=100
character-set-server=utf8mb4
collation-server=utf8mb4_unicode_ci
```

### Production Considerations

1. **Create dedicated user:**
```sql
CREATE USER 'docverify'@'localhost' IDENTIFIED BY 'strong_password';
GRANT ALL PRIVILEGES ON document_verify.* TO 'docverify'@'localhost';
FLUSH PRIVILEGES;
```

2. **Enable SSL connections**
3. **Set up regular backups**
4. **Configure proper buffer sizes**
5. **Enable slow query log**
6. **Set up monitoring**

### Next Steps

After MySQL setup is complete:
1. Update datasource configuration
2. Run `npm run build` in backend
3. Start application with `./start.sh`
4. Login at http://localhost:3000

---

**Need Help?**
- MySQL Documentation: https://dev.mysql.com/doc/
- LoopBack MySQL Connector: https://loopback.io/doc/en/lb4/MySQL-connector.html

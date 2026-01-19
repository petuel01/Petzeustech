
# PetZeusTech Networks - Deployment Guide

### 1. Database Setup
1. Create a database in your MySQL (e.g., `petzeustech_db`).
2. Run the SQL from `backend/schema.sql`.
3. Update `backend/config.php` with your credentials and database name.

### 2. VPS Deployment
- **Apache/Nginx:** Point your root to the `public/` directory (where your React build or PHP index resides).
- **Directory Permissions:** Create an `uploads` folder one level above the public root and ensure the web server has write access (`chmod 775`).
- **PHP Version:** Recommended PHP 7.4 or 8.x.

### 3. File Cycle Logic
- Files are uploaded with a `cycle_start` (now) and `cycle_end` (now + 4 days).
- The admin dashboard uses `checkCycleStatus()` to compare the current timestamp with the latest entry in the `files` table.
- If more than 4 days have passed, a visual alert appears in the Admin Dashboard.

### 4. Extensions
- **Android App:** You can build a simple WebView app using Flutter or React Native that points to this portal.
- **Automation:** You can set up a Cron Job to run a PHP script that automatically emails users 24 hours before their subscription expires.
- **API:** To serve an Android app natively, convert the PHP logic into a REST API (using JSON responses instead of redirects).

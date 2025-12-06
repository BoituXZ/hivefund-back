-- =====================================================
-- HiveFund Database Initialization Script
-- =====================================================
-- This script creates the PostgreSQL database for HiveFund
-- 
-- Usage:
--   1. Make sure PostgreSQL is running
--   2. Connect as a superuser (usually 'postgres'):
--      psql -U postgres -f database/init.sql
--   3. Or run in psql:
--      \i database/init.sql
--
-- Note: TypeORM will automatically create all tables when
--       the application starts (synchronize: true in development)
-- =====================================================

-- Drop database if it exists (use with caution in production!)
-- DROP DATABASE IF EXISTS hive_fund;

-- Create the database (if it doesn't exist)
CREATE DATABASE hive_fund;

-- Connect to the new database
\c hive_fund

-- Create extensions if needed (for UUID generation, etc.)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Grant all privileges on the database to postgres user
GRANT ALL PRIVILEGES ON DATABASE hive_fund TO postgres;

-- Grant all privileges on all tables in the public schema
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO postgres;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO postgres;
GRANT ALL PRIVILEGES ON ALL FUNCTIONS IN SCHEMA public TO postgres;

-- Set default privileges for future tables
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO postgres;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO postgres;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON FUNCTIONS TO postgres;

-- Display success message
\echo 'Database "hive_fund" created successfully!'
\echo 'Next steps:'
\echo '1. Update your .env file with database credentials'
\echo '2. Run: npm run start:dev'
\echo '3. TypeORM will automatically create all tables'


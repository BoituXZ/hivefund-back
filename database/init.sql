-- HiveFund Database Initialization Script
-- This script creates the database and grants privileges to the postgres user

-- Create the database (if it doesn't exist)
CREATE DATABASE hive_fund;

-- Connect to the new database to grant privileges
\c hive_fund

-- Grant all privileges on the database to postgres user
GRANT ALL PRIVILEGES ON DATABASE hive_fund TO postgres;

-- Grant all privileges on all tables in the public schema (for future tables)
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO postgres;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO postgres;

-- Set default privileges for future tables
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO postgres;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO postgres;


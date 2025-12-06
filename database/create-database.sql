-- =====================================================
-- HiveFund Database Creation Script
-- =====================================================
-- Simple script to create the database
-- Run this as a PostgreSQL superuser
-- =====================================================

-- Create the database (will fail if it already exists)
CREATE DATABASE hive_fund;

-- Connect to the database (this line only works in psql)
\c hive_fund

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Success message
\echo 'Database "hive_fund" created successfully!'
\echo 'You can now start the NestJS application and TypeORM will create all tables automatically.'


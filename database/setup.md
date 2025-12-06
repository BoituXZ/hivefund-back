# Database Setup

This directory contains SQL scripts for initializing the HiveFund database.

## Quick Start

### Option 1: Using psql command line

```bash
# Connect to PostgreSQL as superuser
psql -U postgres

# Run the initialization script
\i database/init.sql

# Or from command line directly:
psql -U postgres -f database/init.sql
```

### Option 2: Using Docker (if using docker-compose)

If you're using Docker for PostgreSQL, the database will be created automatically when you run:

```bash
docker-compose up -d
```

Then connect and run the init script:

```bash
docker exec -i <container_name> psql -U postgres < database/init.sql
```

## What the Script Does

1. Creates the `hive_fund` database
2. Enables UUID extension for generating UUIDs
3. Grants necessary privileges to the postgres user
4. Sets up default privileges for future tables

## Important Notes

- **TypeORM Auto-Sync**: The application uses `synchronize: true` in development mode, which means TypeORM will automatically create all tables when the app starts. You don't need to manually create tables.

- **Production**: In production, you should:
  - Set `synchronize: false` in `app.module.ts`
  - Use TypeORM migrations instead
  - Manually review and run migration scripts

## Environment Variables

Make sure your `.env` file has the correct database credentials:

```env
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_USER=postgres
DATABASE_PASSWORD=your_password
DATABASE_NAME=hive_fund
```

## Troubleshooting

### Database already exists
If you get an error that the database already exists, you can either:
1. Drop it first: `DROP DATABASE hive_fund;` (use with caution!)
2. Or skip the CREATE DATABASE step if you're okay with using the existing database

### Permission denied
Make sure you're running the script as a PostgreSQL superuser (usually `postgres` user).

### Connection refused
Ensure PostgreSQL is running:
- On Windows: Check Services or run `pg_ctl status`
- On Linux/Mac: `sudo systemctl status postgresql` or `brew services list`


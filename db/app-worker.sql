-- Runtime role for the deployed Worker: data access only, no DDL, subject to RLS.
-- Run once per database as the owner (the role that runs migrations):
--   psql "<owner direct url>" -f db/app-worker.sql
--   psql "<owner direct url>" -c '\password app_worker'
-- Create the role here, not in the Neon console: console roles join neon_superuser, which bypasses RLS.
-- Roles, grants and extensions stay out of drizzle/ migrations; they are owner-run.
-- Safe to re-run. Run it after the first `pnpm db:migrate` (or before; default privileges cover later tables).

DO $$
BEGIN
  IF NOT EXISTS (SELECT FROM pg_roles WHERE rolname = 'app_worker') THEN
    CREATE ROLE app_worker LOGIN NOSUPERUSER NOCREATEDB NOCREATEROLE NOBYPASSRLS;
  END IF;
END
$$;

GRANT CONNECT ON DATABASE :"DBNAME" TO app_worker;
GRANT USAGE ON SCHEMA public TO app_worker;
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO app_worker;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO app_worker;

-- Tables created later by this owner's migrations get the same access automatically.
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT SELECT, INSERT, UPDATE, DELETE ON TABLES TO app_worker;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT USAGE, SELECT ON SEQUENCES TO app_worker;

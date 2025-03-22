#!/bin/bash
set -e

# If this is a fresh cluster, let Postgres handle initial setup via environment variables
if [ ! -s "$PGDATA/PG_VERSION" ]; then
    echo "Initializing fresh PostgreSQL cluster..."
    exit 0
fi

# For existing cluster, ensure ib_db exists and optionally clean up others
psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" --dbname "postgres" <<-EOSQL
    -- Terminate active connections to all databases except system ones
    DO \$\$
    BEGIN
        PERFORM pg_terminate_backend(pg_stat_activity.pid)
        FROM pg_stat_activity
        WHERE pg_stat_activity.datname NOT IN ('postgres', 'template0', 'template1')
        AND pid <> pg_backend_pid();
    END
    \$\$;

    -- Drop all databases except system databases and ib_db
    DO \$\$
    DECLARE
        r RECORD;
    BEGIN
        FOR r IN (
            SELECT datname 
            FROM pg_database 
            WHERE datname NOT IN ('postgres', 'template0', 'template1', 'ib_db')
        ) LOOP
            EXECUTE 'DROP DATABASE IF EXISTS "' || r.datname || '"';
        END LOOP;
    END
    \$\$;

    -- Create ib_db if it doesn't exist
    DO \$\$
    BEGIN
        IF NOT EXISTS (SELECT 1 FROM pg_database WHERE datname = 'ib_db') THEN
            CREATE DATABASE "ib_db";
        END IF;
    END
    \$\$;
EOSQL


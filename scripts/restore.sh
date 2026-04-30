#!/bin/bash

# Strict error handling
set -euo pipefail

# --- Configuration ---
DB_CONTAINER_NAME="db"
BACKUP_DIR="./backup"

# --- Color codes ---
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

# --- Helper functions ---
log_info() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1" >&2
}

log_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}



AUTO_YES=false

# Parse arguments
while [[ $# -gt 0 ]]; do
  case "$1" in
    -y|--yes)
      AUTO_YES=true
      shift
      ;;
    *)
      echo "Unknown option: $1" >&2
      exit 1
      ;;
  esac
done

# --- Validate environment variables ---
if [ -z "${DB_USER:-}" ] || [ -z "${DB_NAME:-}" ] || [ -z "${DB_PASSWORD:-}" ]; then
    log_error "Missing required environment variables: DB_USER, DB_NAME, or DB_PASSWORD"
    exit 1
else
    log_info "Environment variables are valid"
fi


# --- Find the latest backup ---
if [ ! -d "$BACKUP_DIR" ]; then
    log_error "Backup directory not found: $BACKUP_DIR"
    exit 1
else
    log_info "Backup directory found: $BACKUP_DIR"
fi

# Look for .dump files (custom format) first, fall back to .sql.gz
# Using ls -t for Alpine/BusyBox compatibility
BACKUP_FILE=$(ls -t "$BACKUP_DIR"/backup_*.dump 2>/dev/null | head -n1)

if [ -z "$BACKUP_FILE" ]; then
    log_error "No backup files found in $BACKUP_DIR"
    log_info "Looking for: backup_*.dump or backup_*.sql.gz"
    exit 1
fi

BACKUP_FILENAME=$(basename "$BACKUP_FILE")
BACKUP_EXT="${BACKUP_FILENAME##*.}"
log_info "ousil1"
# --- Validate backup file ---
if [ "$BACKUP_EXT" = "dump" ]; then
    log_info "Found custom format backup: $BACKUP_FILENAME"
    # Verify custom format backup
    if ! pg_restore --list "$BACKUP_FILE" > /dev/null 2>&1; then
        log_error "Backup file is corrupted: $BACKUP_FILENAME"
        exit 1
    fi
elif [ "$BACKUP_EXT" = "gz" ]; then
    log_info "Found compressed SQL backup: $BACKUP_FILENAME"
    # Verify gzip integrity
    if ! gunzip -t "$BACKUP_FILE" 2>/dev/null; then
        log_error "Backup file is corrupted: $BACKUP_FILENAME"
        exit 1
    fi
else
    log_error "Unknown backup format: $BACKUP_FILENAME"
    exit 1
fi
log_info "ousil2"

# --- Get backup metadata ---
BACKUP_SIZE=$(du -h "$BACKUP_FILE" | cut -f1)
BACKUP_DATE=$(date -r "$BACKUP_FILE" "+%Y-%m-%d %H:%M:%S" 2>/dev/null || stat "$BACKUP_FILE" | grep Modify | cut -d' ' -f2,3)

# --- Confirmation prompt ---
log_warning "⚠️  This will DESTROY all data in database '$DB_NAME'!"
echo ""
echo "  Database: $DB_NAME"
echo "  Backup:   $BACKUP_FILENAME"
echo "  Format:   $([ "$BACKUP_EXT" = "dump" ] && echo "Custom (pg_restore)" || echo "Plain SQL (psql)")"
echo "  Size:     $BACKUP_SIZE"
echo "  Created:  $BACKUP_DATE"
echo ""
# Ask for confirmation only if -y wasn't provided
if [ "$AUTO_YES" = false ]; then
    read -r -p "Type 'yes' to continue: " confirm
  if [ "$confirm" != "yes" ]; then
    log_info "Restore cancelled by user"
    exit 0
  fi
else
  log_info "Auto-confirm mode enabled (-y). Proceeding without prompt."
fi


# --- Export password ---
export PGPASSWORD="$DB_PASSWORD"

# --- Terminate active connections ---
log_info "Terminating active database connections..."
psql -h "$DB_CONTAINER_NAME" -U "$DB_USER" -d postgres -c "
SELECT pg_terminate_backend(pid) 
FROM pg_stat_activity 
WHERE datname = '${DB_NAME}' AND pid <> pg_backend_pid();
" 2>/dev/null || true

# --- Drop and recreate database ---
log_info "Dropping and recreating database..."
psql -h "$DB_CONTAINER_NAME" -U "$DB_USER" -d postgres -v ON_ERROR_STOP=1 <<SQL
DROP DATABASE IF EXISTS ${DB_NAME};
CREATE DATABASE ${DB_NAME};
SQL

# --- Restore based on format ---
log_info "Restoring database from backup..."

if [ "$BACKUP_EXT" = "dump" ]; then
    # Use pg_restore for custom format (RECOMMENDED)
    # --clean: drop objects before recreating
    # --if-exists: don't error on missing objects  
    # --no-owner: skip ownership restoration
    # --no-acl: skip privilege restoration
    # -j 4: use 4 parallel jobs (faster restore)
    
    if pg_restore \
        -h "$DB_CONTAINER_NAME" \
        -U "$DB_USER" \
        -d "$DB_NAME" \
        --verbose \
        --clean \
        --if-exists \
        --no-owner \
        --no-acl \
        -j 4 \
        "$BACKUP_FILE" 2>&1 | grep -v "^pg_restore: warning:" || true; then
        
        log_info "✅ Database restored successfully!"
    else
        log_error "Database restore failed!"
        exit 1
    fi
    
elif [ "$BACKUP_EXT" = "gz" ]; then
    # Use psql for plain SQL format (FALLBACK)
    # Note: This is less reliable and doesn't support parallel restore
    
    log_warning "Using legacy SQL format restore (slower and less reliable)"
    
    if gunzip -c "$BACKUP_FILE" | psql \
        -h "$DB_CONTAINER_NAME" \
        -U "$DB_USER" \
        -d "$DB_NAME" \
        --single-transaction \
        -v ON_ERROR_STOP=0 \
        -q 2>&1 | grep -E "^(ERROR|FATAL|PANIC):" || true; then
        
        log_warning "Restore completed with warnings (check output above)"
        log_info "Recommend switching to custom format backups for better reliability"
    fi
fi

# --- Verify restore ---
log_info "Verifying restored database..."
TABLE_COUNT=$(psql -h "$DB_CONTAINER_NAME" -U "$DB_USER" -d "$DB_NAME" -t -c "
SELECT COUNT(*) FROM information_schema.tables 
WHERE table_schema NOT IN ('pg_catalog', 'information_schema');
" 2>/dev/null | xargs)

log_info "Tables restored: $TABLE_COUNT"

# Cleanup password
unset PGPASSWORD

# --- Success message ---
echo ""
echo -e "${GREEN}🎉 Restore completed!${NC}"
echo ""
echo "Next steps:"
echo "  1. Verify data: psql -h $DB_CONTAINER_NAME -U $DB_USER -d $DB_NAME"
echo "  2. Check table count: Expected vs Actual ($TABLE_COUNT)"
echo "  3. Test your application"
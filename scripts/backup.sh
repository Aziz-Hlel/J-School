#!/bin/bash
set -euo pipefail

# --- Configuration ---
RETENTION_DAYS=7
BACKUP_DIR="./backup"
DB_HOST="${DB_CONTAINER_NAME:-db}"
DB_USER="${DB_USER}"
DB_PASSWORD="${DB_PASSWORD}"
DB_NAME="${DB_NAME}"

# --- Validation ---
: "${DB_HOST:?ERROR: Missing DB_HOST}"
: "${DB_USER:?ERROR: Missing DB_USER}"
: "${DB_NAME:?ERROR: Missing DB_NAME}"
: "${DB_PASSWORD:?ERROR: Missing DB_PASSWORD}"

# --- Setup ---
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
# Use .dump extension for custom format (more reliable than .sql.gz)
BACKUP_FILE="$BACKUP_DIR/backup_${TIMESTAMP}.dump"
mkdir -p "$BACKUP_DIR"

log_with_timestamp() {
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] $1"
}

log_with_timestamp "🚀 Starting database backup for: $DB_NAME"

# --- Export password for pg_dump ---
export PGPASSWORD="$DB_PASSWORD"

# --- Create backup using CUSTOM format (industry standard) ---
# Why custom format?
# - Binary format = smaller, faster
# - Includes metadata for proper restoration
# - Allows parallel restore with pg_restore
# - More resilient to version differences
# - Can selectively restore tables/schemas

if pg_dump \
    -h "$DB_HOST" \
    -U "$DB_USER" \
    -d "$DB_NAME" \
    --format=custom \
    --compress=6 \
    --verbose \
    --no-owner \
    --no-acl \
    --file="$BACKUP_FILE" 2>&1; then

    # Verify the backup file was created and has content
    if [ -s "$BACKUP_FILE" ]; then
        SIZE=$(du -h "$BACKUP_FILE" | cut -f1)
        log_with_timestamp "✅ Backup completed: $BACKUP_FILE"
        log_with_timestamp "📦 Backup size: $SIZE"
        
        # Verify backup integrity using pg_restore
        if pg_restore --list "$BACKUP_FILE" > /dev/null 2>&1; then
            log_with_timestamp "✅ Backup integrity verified"
            
            # Count objects in backup for logging
            OBJECT_COUNT=$(pg_restore --list "$BACKUP_FILE" 2>/dev/null | grep -c "^[0-9]" || echo "unknown")
            log_with_timestamp "📊 Database objects backed up: $OBJECT_COUNT"
        else
            log_with_timestamp "⚠️  WARNING: Backup file may be corrupted!"
            exit 1
        fi
    else
        log_with_timestamp "❌ ERROR: Backup file is empty!"
        exit 1
    fi
else
    log_with_timestamp "❌ ERROR: Backup failed!"
    exit 1
fi

# --- Cleanup old backups ---
log_with_timestamp "🧹 Cleaning up backups older than $RETENTION_DAYS days..."
DELETED_COUNT=$(find "$BACKUP_DIR" -name "backup_*.dump" -type f -mtime +$RETENTION_DAYS -print -delete 2>/dev/null | wc -l)

if [ "$DELETED_COUNT" -gt 0 ]; then
    log_with_timestamp "🗑️  Deleted $DELETED_COUNT old backup(s)"
else
    log_with_timestamp "ℹ️  No old backups to delete"
fi

# --- List current backups ---
BACKUP_COUNT=$(find "$BACKUP_DIR" -name "backup_*.dump" -type f 2>/dev/null | wc -l)
TOTAL_SIZE=$(du -sh "$BACKUP_DIR" 2>/dev/null | cut -f1)
log_with_timestamp "📊 Total backups: $BACKUP_COUNT (Total size: $TOTAL_SIZE)"

log_with_timestamp "✨ Backup process completed successfully!"

# Cleanup password from environment
unset PGPASSWORD
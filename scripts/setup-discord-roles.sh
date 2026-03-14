#!/bin/bash
# setup-discord-roles.sh — Create OpenSchool Discord roles via the Discord API
#
# Usage:
#   DISCORD_BOT_TOKEN=your_token DISCORD_GUILD_ID=your_guild_id ./scripts/setup-discord-roles.sh
#
# Prerequisites:
#   - A Discord bot with "Manage Roles" permission added to the server
#   - Bot token from https://discord.com/developers/applications
#   - Guild ID (right-click server name → Copy Server ID with Developer Mode enabled)

set -euo pipefail

API="https://discord.com/api/v10"

# --- Validate -----------------------------------------------------------------
if [ -z "${DISCORD_BOT_TOKEN:-}" ]; then
    echo "Error: DISCORD_BOT_TOKEN is required" >&2
    echo "Usage: DISCORD_BOT_TOKEN=xxx DISCORD_GUILD_ID=yyy $0" >&2
    exit 1
fi

if [ -z "${DISCORD_GUILD_ID:-}" ]; then
    echo "Error: DISCORD_GUILD_ID is required" >&2
    echo "Usage: DISCORD_BOT_TOKEN=xxx DISCORD_GUILD_ID=yyy $0" >&2
    exit 1
fi

AUTH="Authorization: Bot ${DISCORD_BOT_TOKEN}"

# --- Create role --------------------------------------------------------------
create_role() {
    local name="$1" color="$2" permissions="$3"

    local response
    response=$(curl -s -w "\n%{http_code}" -X POST "${API}/guilds/${DISCORD_GUILD_ID}/roles" \
        -H "$AUTH" \
        -H "Content-Type: application/json" \
        -d "{\"name\": \"${name}\", \"color\": ${color}, \"permissions\": \"${permissions}\"}")

    local http_code
    http_code=$(echo "$response" | tail -1)
    local body
    body=$(echo "$response" | sed '$d')

    if [ "$http_code" -ge 200 ] && [ "$http_code" -lt 300 ]; then
        echo "  ✅ ${name} — created"
    else
        echo "  ❌ ${name} — failed (HTTP ${http_code}): ${body}" >&2
    fi

    # Respect rate limits
    sleep 1
}

# --- Permissions reference ----------------------------------------------------
# Send Messages:       2048
# Add Reactions:       64
# Read Message History: 65536
# Create Public Threads: 34359738368
# Manage Threads:      17179869184
# Manage Messages:     8192
# Mention Everyone:    131072
# Administrator:       8

echo "Creating OpenSchool Discord roles on guild ${DISCORD_GUILD_ID}..."
echo ""

# Tanuló (green #2ecc71) — Send Messages + Read History + Create Threads + Add Reactions
create_role "Tanuló"      3066993  "34359805696"

# Kontribútor (blue #3498db) — above + Manage Threads
create_role "Kontribútor" 3447003  "51539674880"

# Mentor (purple #9b59b6) — above + Manage Messages + Mention Everyone
create_role "Mentor"      10181046 "51539814336"

# Admin (red #e74c3c) — Administrator
create_role "Admin"       15158332 "8"

echo ""
echo "Done! Verify roles in Discord: Server Settings → Roles"

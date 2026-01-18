#!/usr/bin/env bash
# .scripts/install-microservices.sh
#
# Parallel npm install for all microservices with clean, colorful output
# Shows real npm errors when something fails + clearly identifies which service failed

set -euo pipefail

# ──────────────────────────────────────────────────────────────────────────────
# Colors & Symbols
# ──────────────────────────────────────────────────────────────────────────────
CYAN='\033[0;36m'
BLUE='\033[1;34m'
GREEN='\033[1;32m'
RED='\033[1;31m'
GRAY='\033[0;90m'
BOLD='\033[1m'
NC='\033[0m'

CHECK="✓"
CROSS="✗"
ARROW="→"

# ──────────────────────────────────────────────────────────────────────────────
# Configuration
# ──────────────────────────────────────────────────────────────────────────────
MICROSERVICES_DIR="microservices"
MAX_PARALLEL=$(nproc --all 2>/dev/null || sysctl -n hw.ncpu 2>/dev/null || echo 8)

# ──────────────────────────────────────────────────────────────────────────────
# Helpers
# ──────────────────────────────────────────────────────────────────────────────
print_header() {
    printf "\n${CYAN}${BOLD}%s${NC}\n" "══════════════════════════════════════════════════════════════"
    printf " ${BLUE}${BOLD}Installing dependencies in all microservices (parallel × $MAX_PARALLEL)${NC}\n"
    printf "${CYAN}${BOLD}%s${NC}\n\n" "══════════════════════════════════════════════════════════════"
}

print_service_start() {
    local name="$1"
    printf "\n${BLUE}${ARROW} ${BOLD}%s${NC}\n" "$name"
}

print_success() {
    local duration="$1"
    printf "  ${GREEN}${CHECK} Done in %s s${NC}\n" "$duration"
}

print_failed() {
    local name="$1"
    printf "  ${RED}${CROSS} Failed in %s${NC}\n\n" "$name"
}

# ──────────────────────────────────────────────────────────────────────────────
# Main logic
# ──────────────────────────────────────────────────────────────────────────────
if [[ ! -d "$MICROSERVICES_DIR" ]]; then
    printf "${RED}Error:${NC} Directory '%s' not found\n" "$MICROSERVICES_DIR"
    exit 1
fi

print_header

# Collect all microservice directories (portable - no mapfile)
microservices=()
while IFS= read -r -d '' dir; do
    microservices+=("$dir")
done < <(find "$MICROSERVICES_DIR" -mindepth 1 -maxdepth 1 -type d -print0 2>/dev/null)

total=${#microservices[@]}
printf "${GRAY}Found %d microservice(s)${NC}\n" "$total"

if (( total == 0 )); then
    printf "${GRAY}Nothing to do.${NC}\n\n"
    exit 0
fi

# ──────────────────────────────────────────────────────────────────────────────
# Parallel installation with visible output & clear failure identification
# ──────────────────────────────────────────────────────────────────────────────
for dir in "${microservices[@]}"; do
    (
        start_time=$(date +%s 2>/dev/null)
        
        name=$(basename "$dir")
        
        print_service_start "$name"
        
        if ! cd "$dir" 2>/dev/null; then
            printf "  ${RED}Cannot access directory${NC}\n"
            exit 1
        fi
        
        if npm install --no-audit --no-fund --prefer-offline; then
            end_time=$(date +%s 2>/dev/null)
            duration=$((end_time - start_time))
            print_success "$duration"
        else
            print_failed "$name"
            exit 1
        fi
    ) &
done

# Wait for all jobs and track overall success
wait_status=0
for job in $(jobs -p); do
    wait "$job" || wait_status=1
done

echo
if [ $wait_status -eq 0 ]; then
    printf "${GREEN}${BOLD}SUCCESS: All %d microservices installed ✓${NC}\n\n" "$total"
else
    printf "${RED}${BOLD}ERROR: Some microservices failed ✗${NC}\n"
    printf "   Check the output above to see which one(s) and the exact error.\n\n"
    exit 1
fi
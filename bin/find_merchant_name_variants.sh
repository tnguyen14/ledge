#!/usr/bin/env bash

# Finds slugs that have more than one display name variant in merchants_count.
# Suggests update_transaction_merchant_name.sh commands to fix stale names.

declare -A LISTS_URLS=(
  [dev]="http://localhost:13050"
  [prod]="https://lists.cloud.tridnguyen.com"
)

meta=$(curl -H "Authorization: Bearer ${JWT_TOKEN}" \
  "${LISTS_URLS[$env]}/ledge/tri/meta" 2>/dev/null)

variants=$(echo "$meta" | jq '
  .merchants_count
  | to_entries
  | map_values(.value + {slug: .key})
  | map(select((.values | length) > 1))
')

echo "$variants" | jq
echo "To fix, run:"
echo "  ./bin/update_transaction_merchant_name.sh \"<stale-name>\" \"<correct-name>\""

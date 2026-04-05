#!/usr/bin/env bash

# Fixes transactions using a stale merchant display name by patching them to use the new name.
# Run find_merchant_name_variants.sh first to identify the search and new names.
# Only fixes the first matching transaction — run repeatedly to fix one at a time.
#
# Usage:
#   env=dev ./fix_merchant_name_variants.sh "Whole Foods " "Whole Foods"

SEARCH_NAME="$1"
NEW_NAME="$2"

declare -A LISTS_URLS=(
  [dev]="http://localhost:13050"
  [prod]="https://lists.cloud.tridnguyen.com"
)

API_URL="${LISTS_URLS[$env]}"

txns=$(curl -s -G \
  -H "Authorization: Bearer ${JWT_TOKEN}" \
  "${API_URL}/ledge/tri/items" \
  --data-urlencode "where[0][field]=merchant" \
  --data-urlencode "where[0][op]===" \
  --data-urlencode "where[0][value]=$SEARCH_NAME")

count=$(echo "$txns" | jq 'length')
echo "Found $count transaction(s) with merchant=\"$SEARCH_NAME\":"
echo "$txns" | jq '[.[] | {id, date, amount, merchant}]'

first_id=$(echo "$txns" | jq -r '.[0].id')

if [ "$first_id" = "null" ] || [ -z "$first_id" ]; then
  echo "Nothing to fix."
  exit 0
fi

updated_transaction=$(jq -n --arg name "$NEW_NAME" '{"merchant": $name}')

echo "Patching $first_id: \"$updated_transaction\""
curl -s -X PATCH \
  -H "Authorization: Bearer ${JWT_TOKEN}" \
  -H "Content-Type: application/json" \
  -d "$updated_transaction" \
  "${API_URL}/ledge/tri/items/${first_id}"

# If this was the last transaction with the stale name, merchants_count needs updating too
if [ "$count" -eq 1 ]; then
  meta=$(curl -s -H "Authorization: Bearer ${JWT_TOKEN}" "${API_URL}/ledge/tri/meta")
  stale_slug=$(echo "$meta" | jq -r --arg name "$SEARCH_NAME" '
    .merchants_count | to_entries
    | map(select(.value != null and (.value.values | contains([$name]))))
    | .[0].key
  ')
  echo "Last transaction fixed. Update merchants_count by running:"
  echo "./bin/update_merchants_count.sh $stale_slug --remove-value \"$SEARCH_NAME\""
fi

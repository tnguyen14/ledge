#!/usr/bin/env bash

# Updates a merchants_count entry in meta.
#
# Usage:
#   env=dev ./update_merchants_count.sh <slug> [options]
#
# Options:
#   --remove-value "name"   remove a display name from the values array
#   --set-count N           set the count for the slug
#   --remove                delete the slug entry entirely

SLUG="$1"
shift

while [[ $# -gt 0 ]]; do
  case "$1" in
    --remove-value) REMOVE_VALUE="$2"; shift 2 ;;
    --set-count)    SET_COUNT="$2";    shift 2 ;;
    --remove)       DO_REMOVE=true;    shift   ;;
    *) echo "Unknown option: $1"; exit 1 ;;
  esac
done

declare -A LISTS_URLS=(
  [dev]="http://localhost:13050"
  [prod]="https://lists.cloud.tridnguyen.com"
)

API_URL="${LISTS_URLS[$env]}"

meta=$(curl -s -H "Authorization: Bearer ${JWT_TOKEN}" "${API_URL}/ledge/tri/meta")

if [ "$DO_REMOVE" = true ]; then
  patch=$(jq -n --arg slug "$SLUG" '{merchants_count: {($slug): null}}')

elif [ -n "$REMOVE_VALUE" ]; then
  patch=$(echo "$meta" | jq --arg slug "$SLUG" --arg name "$REMOVE_VALUE" '{
    merchants_count: {
      ($slug): {
        values: (.merchants_count[$slug].values | map(select(. != $name)))
      }
    }
  }')

elif [ -n "$SET_COUNT" ]; then
  patch=$(jq -n --arg slug "$SLUG" --argjson count "$SET_COUNT" '{
    merchants_count: {($slug): {count: $count}}
  }')

else
  echo "Specify one of: --remove-value, --set-count, --remove"
  exit 1
fi

echo "Patching merchants_count:"
echo "$patch" | jq '.merchants_count'

curl -s -X PATCH \
  -H "Authorization: Bearer ${JWT_TOKEN}" \
  -H "Content-Type: application/json" \
  -d "$patch" \
  "${API_URL}/ledge/tri/meta"

#!/usr/bin/env bash

# Finds merchant names that appear under more than one slug in merchants_count.
# Suggests update_merchants_count.sh commands to merge the duplicate slugs.

declare -A LISTS_URLS=(
  [dev]="http://localhost:13050"
  [prod]="https://lists.cloud.tridnguyen.com"
)

meta=$(curl -s -H "Authorization: Bearer ${JWT_TOKEN}" \
  "${LISTS_URLS[$env]}/ledge/tri/meta")

duplicates=$(echo "$meta" | jq '
  .merchants_count
  | to_entries
  | map(select(.value != null and (.value.values | length) > 0))
  | map({ slug: .key, name: .value.values[], count: .value.count })
  | group_by(.name)
  | map(select(length > 1))
  | map({ name: .[0].name, total: map(.count) | add, slugs: map({ slug: .slug, count: .count }) })
')

echo "$duplicates" | jq -c '.[]' | while read -r entry; do
  echo "$entry" | jq
  name=$(echo "$entry" | jq -r '.name')
  total=$(echo "$entry" | jq -r '.total')
  correct_slug=$(npx @tridnguyen/slugify "$name")
  stale_slugs=$(echo "$entry" | jq -r --arg correct "$correct_slug" '.slugs[] | select(.slug != $correct) | .slug')
  echo "To fix, run:"
  echo "  ./bin/update_merchants_count.sh $correct_slug --set-count $total"
  echo "$stale_slugs" | while read -r stale; do
    echo "  ./bin/update_merchants_count.sh $stale --remove"
  done
  echo ""
done

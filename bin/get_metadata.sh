#!/usr/bin/env bash

declare -A LISTS_URLS=(
  [dev]="http://localhost:13050"
  [prod]="https://lists.cloud.tridnguyen.com"
)

meta=$(curl -s -H "Authorization: Bearer ${JWT_TOKEN}" \
  "${LISTS_URLS[$env]}/ledge/tri/meta")

if [[ "$1" == "--category" ]]; then
  echo "$meta" | jq '.expenseCategories | map({ slug: .slug, value: .value })'
else
  echo "$meta" | jq '.'
fi

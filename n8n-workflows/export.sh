#!/bin/bash

set -e

WORKFLOW_DIR="./workflows"

echo "🚀 Exporting n8n workflows..."

mkdir -p "$WORKFLOW_DIR"

rm -f "$WORKFLOW_DIR"/*.json

docker compose exec -T n8n n8n export:workflow \
  --all \
  --separate \
  --output=/home/node/workflows

echo ""
echo "🔄 Renaming files based on workflow names..."

for FILE in "$WORKFLOW_DIR"/*.json; do

  [ -e "$FILE" ] || continue

  NAME=$(jq -r '.name // empty' "$FILE")

  if [ -z "$NAME" ]; then
    echo "⚠️ Workflow name not found: $FILE"
    continue
  fi

  SAFE_NAME=$(printf '%s' "$NAME" | sed 's#[/:*?"<>|\\]#-#g')

  SAFE_NAME=$(printf '%s' "$SAFE_NAME" | sed 's/ /_/g')

  NEW_FILE="$WORKFLOW_DIR/$SAFE_NAME.json"

  mv "$FILE" "$NEW_FILE"

  echo "✓ $(basename "$FILE") → $SAFE_NAME.json"

done

echo ""
echo "✅ Export completed!"
echo ""
echo "📁 Workflows:"
ls -lah "$WORKFLOW_DIR"
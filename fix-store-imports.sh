#!/bin/bash

# Find files with the old import and replace it
find src -type f -name "*.tsx" -exec grep -l "import { useStore } from '@/contexts/store-context'" {} \; | xargs sed -i '' 's/import { useStore } from '"'"'@\/contexts\/store-context'"'"'/import { useStore } from '"'"'@\/providers\/store-provider'"'"'/g'

# Find files with selectedStore and replace with currentStore
find src -type f -name "*.tsx" -exec grep -l "selectedStore" {} \; | xargs sed -i '' 's/selectedStore/currentStore/g'

# Show the changes made
echo "Updated the following files:"
find src -type f -name "*.tsx" -exec grep -l "import { useStore } from '@/providers/store-provider'" {} \; | sort

echo "Script completed." 
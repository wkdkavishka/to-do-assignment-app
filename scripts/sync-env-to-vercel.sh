#!/bin/bash

# Script to sync environment variables from .env to Vercel
# Usage: ./scripts/sync-env-to-vercel.sh

set -e

echo "🚀 Syncing environment variables to Vercel..."

# Check if Vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo "❌ Vercel CLI is not installed. Installing..."
    npm install -g vercel
fi

# Load environment variables from .env file
if [ ! -f .env ]; then
    echo "❌ .env file not found!"
    exit 1
fi

echo "📝 Reading .env file..."

# Function to add/update environment variable in Vercel
add_env_var() {
    local key=$1
    local value=$2
    
    if [ -z "$value" ]; then
        echo "⚠️  Skipping empty variable: $key"
        return
    fi
    
    echo "📤 Updating $key..."
    
    # Remove existing variable (ignore errors if it doesn't exist)
    vercel env rm "$key" production -y 2>/dev/null || true
    vercel env rm "$key" preview -y 2>/dev/null || true
    vercel env rm "$key" development -y 2>/dev/null || true
    
    # Add variable to all environments (use -n to prevent adding newline)
    echo -n "$value" | vercel env add "$key" production
    echo -n "$value" | vercel env add "$key" preview
    echo -n "$value" | vercel env add "$key" development
}

# Read .env file and sync variables
while IFS='=' read -r key value; do
    # Skip comments and empty lines
    if [[ $key =~ ^#.*$ ]] || [[ -z $key ]]; then
        continue
    fi
    
    # Remove leading/trailing whitespace
    key=$(echo "$key" | xargs)
    value=$(echo "$value" | xargs)
    
    # Skip if key is empty
    if [ -z "$key" ]; then
        continue
    fi
    
    add_env_var "$key" "$value"
done < .env

echo "✅ Environment variables synced successfully!"
echo "🔄 Triggering a new deployment to apply changes..."
echo "   Run: vercel --prod"

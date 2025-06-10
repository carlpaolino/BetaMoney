#!/bin/bash

# BetaMoney Deployment Script
# This script builds and deploys the app to Firebase Hosting

set -e

echo "🏛️  BetaMoney Deployment Script"
echo "================================"

# Check if Firebase CLI is installed
if ! command -v firebase &> /dev/null; then
    echo "❌ Firebase CLI not found. Installing..."
    npm install -g firebase-tools
fi

# Check if user is logged in to Firebase
if ! firebase projects:list &> /dev/null; then
    echo "🔐 Please log in to Firebase..."
    firebase login
fi

# Build the project
echo "🔨 Building the project..."
npm run build

# Deploy to Firebase Hosting
echo "🚀 Deploying to Firebase Hosting..."
firebase deploy --only hosting

echo "✅ Deployment complete!"
echo "🌐 Your app should be available at your Firebase Hosting URL" 
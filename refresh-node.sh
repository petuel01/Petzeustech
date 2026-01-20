#!/bin/bash
# PETZEUSTECH HARD REFRESH SCRIPT
# Usage: Place this script ONE LEVEL ABOVE your Petzeustech folder.

REPO_URL="[YOUR_GITHUB_URL]" # REPLACE THIS with your actual GitHub URL

echo "DANGER: This will delete and re-clone the entire project."
echo "Cleaning up current directory..."
rm -rf Petzeustech

echo "Cloning fresh repository..."
git clone $REPO_URL Petzeustech

echo "Entering directory..."
cd Petzeustech

echo "Applying permissions and running setup..."
chmod +x setup-lemp.sh
sudo bash setup-lemp.sh

echo "System Refresh Successful!"

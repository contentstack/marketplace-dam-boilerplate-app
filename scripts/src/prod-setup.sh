#!/bin/bash

echo "Creating a new launch project."
npm run deploy-prod-app

echo "Creating a new production marketplace app."
npm run create-prod-app

echo "Please run 'npm run create-content-model' to create the content model and its entry"

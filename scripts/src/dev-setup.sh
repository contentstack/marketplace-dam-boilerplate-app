#!/bin/bash

# 16-byte random hex string
echo "installing UI dependencies."
cd ../ui
npm i
echo "creating ui/.env file."
rm -f "./.env"
cat <<EOF > ".env"
REACT_APP_UI_URL=http://localhost:4000
REACT_APP_REGION_MAPPING = {"NA": {"JSON_RTE_URL": "https://rte-extension.contentstack.com"},"EU": {"JSON_RTE_URL": "https://eu-rte-extension.contentstack.com"},"AZURE_NA": {"JSON_RTE_URL": "https://azure-na-rte-extension.contentstack.com"},"AZURE_EU": {"JSON_RTE_URL": "https://azure-eu-rte-extension.contentstack.com"}, "GCP_NA": {"JSON_RTE_URL": "https://gcp-na-rte-extension.contentstack.com" }}
EOF

echo "created ui/.env file."


echo "Setting up an initial development app."
cd ../scripts
npm run create-dev-app

echo "Please run 'npm run create-content-model' to create the content model and its entry"
echo "Please run 'cd ../ui' and 'npm run start' or 'npm run startWin' to start the UI app."

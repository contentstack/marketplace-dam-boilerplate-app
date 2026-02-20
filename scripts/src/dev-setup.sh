#!/bin/bash

set -e

# Get the directory where this script is located
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
# Get the project root directory (two levels up from scripts/src)
PROJECT_ROOT="$(cd "$SCRIPT_DIR/../.." && pwd)"

open_terminal() {
    local TARGET_PATH=$1
    local COMMAND=$2
    local TITLE=$3

    # Convert relative path to absolute path
    # Using 'cd' then 'pwd' ensures the path actually exists
    ABS_PATH=$(cd "$TARGET_PATH" && pwd)

    if [ $? -ne 0 ]; then
        echo "Error: Directory '$TARGET_PATH' does not exist."
        return 1
    fi

    # Detect Operating System
    OS_TYPE="$(uname -s)"

    case "${OS_TYPE}" in
        # --- WINDOWS (Git Bash / MSYS) ---
        *MINGW*|*MSYS*|*CYGWIN*)
            # Note: We convert the Unix-style path to Windows-style for CMD
            WIN_PATH=$(cygpath -w "$ABS_PATH")
            start cmd /k "title $TITLE && cd /d $WIN_PATH && $COMMAND"
            ;;

        # --- macOS ---
        Darwin*)
            osascript -e "tell application \"Terminal\"
                do script \"cd '$ABS_PATH' && $COMMAND\"
                activate
            end tell"
            ;;

        # --- LINUX ---
        Linux*)
            # Tries the generic emulator first
            if command -v x-terminal-emulator >/dev/null 2>&1; then
                x-terminal-emulator -e bash -c "cd '$ABS_PATH' && $COMMAND; exec bash" &
            elif command -v gnome-terminal >/dev/null 2>&1; then
                gnome-terminal --working-directory="$ABS_PATH" -- bash -c "$COMMAND; exec bash" &
            else
                echo "Error: No supported terminal emulator found."
            fi
            ;;

        *)
            echo "Unsupported OS: ${OS_TYPE}"
            ;;
    esac
}

echo "Installing UI dependencies."
cd "$PROJECT_ROOT/ui"
npm i
echo "Creating ui/.env file."
rm -f "./.env"
cat <<EOF > ".env"
REACT_APP_CUSTOM_FIELD_URL=http://localhost:4000
REACT_APP_REGION_MAPPING = {"NA": {"JSON_RTE_URL": "https://rte-extension.contentstack.com"},"EU": {"JSON_RTE_URL": "https://eu-rte-extension.contentstack.com"},"AZURE_NA": {"JSON_RTE_URL": "https://azure-na-rte-extension.contentstack.com"},"AZURE_EU": {"JSON_RTE_URL": "https://azure-eu-rte-extension.contentstack.com"}, "GCP_NA": {"JSON_RTE_URL": "https://gcp-na-rte-extension.contentstack.com" }}
EOF

echo "Created ui/.env file."

echo "Installing RTE dependencies."
cd "$PROJECT_ROOT/ui/rte"
npm i

echo "Creating ui/rte/.env file."
rm -f "./.env"
cat <<EOF > ".env"
REACT_APP_CUSTOM_FIELD_URL=http://localhost:4000
REACT_APP_REGION_MAPPING = {"NA": {"JSON_RTE_URL": "https://rte-extension.contentstack.com"},"EU": {"JSON_RTE_URL": "https://eu-rte-extension.contentstack.com"},"AZURE_NA": {"JSON_RTE_URL": "https://azure-na-rte-extension.contentstack.com"},"AZURE_EU": {"JSON_RTE_URL": "https://azure-eu-rte-extension.contentstack.com"}, "GCP_NA": {"JSON_RTE_URL": "https://gcp-na-rte-extension.contentstack.com" }}
EOF

echo "Created ui/rte/.env file."

echo "Setting up an initial development app."
cd "$PROJECT_ROOT/scripts"
npm run create-dev-app

echo "Starting the frontend app..."
open_terminal "../ui" "npm run start" "Frontend App(UI)"

echo "Creating content model and its entry for the latest app."
npm run create-dev-content-model
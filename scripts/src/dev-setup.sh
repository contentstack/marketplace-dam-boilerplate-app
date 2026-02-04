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

echo "Starting the UI server..."
open_terminal "$PROJECT_ROOT/ui" "npm run start" "UI Server (Port 4000)"

echo "Waiting for UI server to be ready..."
# Wait for the server to be ready by checking if port 4000 is responding
max_attempts=30
attempt=0

# Check if we have tools to verify server readiness
if command -v curl > /dev/null 2>&1; then
  CHECK_CMD="curl"
elif command -v nc > /dev/null 2>&1; then
  CHECK_CMD="nc"
else
  CHECK_CMD="none"
  echo "Note: curl or nc not found, using fixed wait time (15 seconds)..."
  sleep 15
  echo "Proceeding with app setup..."
fi

if [ "$CHECK_CMD" != "none" ]; then
  while [ $attempt -lt $max_attempts ]; do
    # Try to connect to the server (works on macOS, Linux, and Windows with WSL)
    if [ "$CHECK_CMD" = "curl" ]; then
      if curl -s http://localhost:4000 > /dev/null 2>&1; then
        echo "UI server is ready!"
        break
      fi
    elif [ "$CHECK_CMD" = "nc" ]; then
      if nc -z localhost 4000 2>/dev/null; then
        echo "UI server is ready!"
        break
      fi
    fi
    
    attempt=$((attempt + 1))
    if [ $attempt -lt $max_attempts ]; then
      echo "Waiting for UI server... ($attempt/$max_attempts)"
      sleep 2
    fi
  done

  if [ $attempt -eq $max_attempts ]; then
    echo "Warning: UI server may not be ready yet, but proceeding anyway..."
    echo "The server is starting in a separate terminal. You may need to wait a bit longer."
  fi
fi

echo "Setting up an initial development app."
cd "$PROJECT_ROOT/scripts"
npm run create-dev-app

echo "Creating content model and its entry for the latest app."
npm run create-dev-content-model

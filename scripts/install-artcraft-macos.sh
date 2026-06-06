#!/usr/bin/env bash
set -euo pipefail

APP_NAME="ArtCraft"
DMG_URL="https://sourceforge.net/projects/artcraft.mirror/files/latest/download"
DOWNLOAD_DIR="${HOME}/Downloads"
DMG_PATH="${DOWNLOAD_DIR}/ArtCraft_latest_universal.dmg"
INSTALL_DIR="${HOME}/Applications"

mkdir -p "$DOWNLOAD_DIR" "$INSTALL_DIR"

echo "Downloading ${APP_NAME}..."
curl -L --fail --progress-bar "$DMG_URL" -o "$DMG_PATH"

echo "Mounting disk image..."
MOUNT_OUTPUT="$(hdiutil attach "$DMG_PATH" -nobrowse)"
VOLUME_PATH="$(printf '%s\n' "$MOUNT_OUTPUT" | awk '/\\/Volumes\\// {print substr($0, index($0, "/Volumes/")); exit}')"

if [ -z "$VOLUME_PATH" ] || [ ! -d "$VOLUME_PATH" ]; then
  echo "Could not find mounted ArtCraft volume."
  exit 1
fi

cleanup() {
  hdiutil detach "$VOLUME_PATH" >/dev/null 2>&1 || true
}
trap cleanup EXIT

APP_PATH="$(find "$VOLUME_PATH" -maxdepth 2 -name "${APP_NAME}.app" -type d | head -n 1)"

if [ -z "$APP_PATH" ]; then
  echo "Could not find ${APP_NAME}.app inside the DMG."
  exit 1
fi

echo "Installing to ${INSTALL_DIR}/${APP_NAME}.app..."
rm -rf "${INSTALL_DIR}/${APP_NAME}.app"
ditto "$APP_PATH" "${INSTALL_DIR}/${APP_NAME}.app"

echo "Done. Opening ${APP_NAME}..."
open "${INSTALL_DIR}/${APP_NAME}.app"

#!/usr/bin/env bash
set -euo pipefail

APP_NAME="FreeMoCap"
VENV_DIR="${HOME}/.freemocap-venv"
LAUNCHER_DIR="${HOME}/Applications"
LAUNCHER_PATH="${LAUNCHER_DIR}/FreeMoCap.command"

find_python() {
  for candidate in python3.12 python3.11 python3.10 python3; do
    if command -v "$candidate" >/dev/null 2>&1; then
      version="$("$candidate" - <<'PY'
import sys
print(f"{sys.version_info.major}.{sys.version_info.minor}")
PY
)"
      case "$version" in
        3.10|3.11|3.12)
          printf "%s" "$candidate"
          return 0
          ;;
      esac
    fi
  done
  return 1
}

PYTHON_BIN="$(find_python || true)"

if [ -z "$PYTHON_BIN" ]; then
  echo "FreeMoCap needs Python 3.10, 3.11, or 3.12."
  echo "Install Python first, for example: brew install python@3.12"
  exit 1
fi

echo "Using $("$PYTHON_BIN" --version)"

if [ ! -d "$VENV_DIR" ]; then
  echo "Creating isolated FreeMoCap environment at ${VENV_DIR}..."
  "$PYTHON_BIN" -m venv "$VENV_DIR"
fi

echo "Upgrading installer tools..."
"${VENV_DIR}/bin/python" -m pip install --upgrade pip setuptools wheel

echo "Installing ${APP_NAME}..."
"${VENV_DIR}/bin/python" -m pip install --upgrade freemocap

mkdir -p "$LAUNCHER_DIR"

cat > "$LAUNCHER_PATH" <<EOF
#!/usr/bin/env bash
set -euo pipefail
"${VENV_DIR}/bin/freemocap"
EOF

chmod +x "$LAUNCHER_PATH"

echo "Installed ${APP_NAME}."
echo "Launcher created at: ${LAUNCHER_PATH}"
echo "Opening ${APP_NAME}..."
open "$LAUNCHER_PATH"

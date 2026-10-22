#!/usr/bin/env bash
# Uploads dist/ and dist-admin/ to Hostinger with lftp (used by the deploy job in
# .github/workflows/ci.yml). Run verify:release and verify:admin first.
#
# Required env: DEPLOY_HOST, DEPLOY_USER, DEPLOY_PASSWORD
# Optional env: DEPLOY_PROTOCOL (ftp | sftp, default ftp), DEPLOY_PORT,
#               DEPLOY_SITE_DIR (default public_html) — the studio goes to $DEPLOY_SITE_DIR/admin
#
# Nothing on the server is deleted: public_html/admin is the studio's docroot and must
# survive the site upload, and stale files are listed with `verify-release.mjs --compare`.
set -euo pipefail

: "${DEPLOY_HOST:?DEPLOY_HOST is not set}"
: "${DEPLOY_USER:?DEPLOY_USER is not set}"
: "${DEPLOY_PASSWORD:?DEPLOY_PASSWORD is not set}"
protocol="${DEPLOY_PROTOCOL:-ftp}"
site_dir="${DEPLOY_SITE_DIR:-public_html}"
site_dir="${site_dir%/}"
port="${DEPLOY_PORT:+:$DEPLOY_PORT}"

for dir in dist dist-admin; do
  [ -f "$dir/index.html" ] || { echo "$dir/ is missing or empty; build it first." >&2; exit 1; }
done
[ ! -e dist/NOT-FOR-RELEASE.txt ] || { echo "dist/ is an offline build and must not be deployed." >&2; exit 1; }

# Same order as the manual steps in the README: hashed assets first so no page ever points
# at a file that is not there yet, then everything else, HTML (which references them) last.
export LFTP_PASSWORD="$DEPLOY_PASSWORD"
lftp --env-password -u "$DEPLOY_USER" "$protocol://$DEPLOY_HOST$port" <<EOF
set cmd:fail-exit yes
set net:max-retries 3
set net:timeout 30
set ftp:ssl-allow yes
set sftp:auto-confirm yes
mirror --reverse --verbose --parallel=4 dist/assets "$site_dir/assets"
mirror --reverse --verbose --parallel=4 --exclude-glob assets/ --exclude-glob *.html dist "$site_dir"
mirror --reverse --verbose --parallel=4 --include-glob *.html --exclude-glob assets/ dist "$site_dir"
mirror --reverse --verbose --parallel=4 dist-admin/assets "$site_dir/admin/assets"
mirror --reverse --verbose --parallel=4 --exclude-glob assets/ dist-admin "$site_dir/admin"
bye
EOF
echo "Uploaded dist/ to $site_dir/ and dist-admin/ to $site_dir/admin/."

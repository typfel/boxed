#!/bin/sh

# generate offline manifest
python build/manifest.py > cache.manifest

# deploy
appcfg.py update .

# generate empty offline manifest for development
cat > cache.manifest <<OFFLINE_MANIFEST
CACHE MANIFEST
CACHE:
NETWORK:
*
OFFLINE_MANIFEST

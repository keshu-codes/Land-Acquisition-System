@echo off
title NLAMS - Cloudflare Public Shareable Tunnel
echo ========================================================
echo   Generating Free Cloudflare Public Link for NLAMS
echo ========================================================
echo.
echo Connecting local port 8000 to Cloudflare edge network...
echo Your public link will appear below (look for trycloudflare.com):
echo.
npx.cmd --yes cloudflared tunnel --url http://127.0.0.1:8000
pause

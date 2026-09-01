@echo off
title NLAMS - National Land Acquisition System
echo ========================================================
echo   Starting NLAMS Unified Web & REST API Server (Port 8000)
echo ========================================================
echo.

cd /d "%~dp0backend"
echo [1/2] Initializing SQLite database and syncing demo users...
echo [2/2] Starting Uvicorn FastAPI Server on http://127.0.0.1:8000 ...
echo.
echo Local Website: http://127.0.0.1:8000
echo API Docs:      http://127.0.0.1:8000/docs
echo.
python -m uvicorn app.main:app --host 127.0.0.1 --port 8000
pause

@echo off
title NLAMS Backend Server
echo ========================================================
echo   National Land Acquisition & Management System (NLAMS)
echo   Starting Backend API Server (FastAPI)...
echo ========================================================
cd backend
python -m pip install -r requirements.txt
python -m uvicorn app.main:app --host 127.0.0.1 --port 8000 --reload
pause

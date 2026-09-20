@echo off
title NLAMS Frontend Client
echo ========================================================
echo   National Land Acquisition & Management System (NLAMS)
echo   Starting Frontend Development Server (Vite)...
echo ========================================================
cd frontend
call npm install
call npm run dev
pause

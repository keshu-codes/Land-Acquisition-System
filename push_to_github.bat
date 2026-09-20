@echo off
title NLAMS - Push to GitHub
echo ========================================================
echo   Pushing latest changes to GitHub:
echo   https://github.com/keshu-codes/Land-Acquisition-System
echo ========================================================
git push -u origin main
echo.
if %ERRORLEVEL% equ 0 (
    echo [SUCCESS] Pushed successfully to GitHub!
) else (
    echo [ERROR] Push failed. Please verify your GitHub login or permissions.
)
pause

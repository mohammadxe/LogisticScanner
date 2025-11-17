@echo off
REM Quick start script for Freight Rate Optimizer (Windows)

echo ==================================================
echo Freight Rate Optimizer - Quick Start
echo ==================================================

REM Check if Docker is installed
where docker >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo.
    echo [X] Docker is not installed. Please install Docker Desktop first.
    echo     Visit: https://www.docker.com/products/docker-desktop
    pause
    exit /b 1
)

echo.
echo [OK] Docker is installed
echo.

echo Select startup option:
echo 1) Start full stack (Frontend + Backend + Database)
echo 2) Start backend only
echo 3) Start frontend only
echo 4) View logs
echo 5) Stop all services
echo.

set /p choice="Enter your choice (1-5): "

if "%choice%"=="1" (
    echo.
    echo [*] Starting full stack...
    docker-compose up -d
    echo.
    echo [OK] Services are starting...
    echo.
    echo Frontend:    http://localhost:3000
    echo Backend API: http://localhost:8000
    echo API Docs:    http://localhost:8000/docs
    echo Database:    localhost:5432
    echo.
    echo Wait 10-15 seconds for services to start...
) else if "%choice%"=="2" (
    echo.
    echo [*] Starting backend only...
    docker-compose up -d backend db
    echo [OK] Backend is starting...
) else if "%choice%"=="3" (
    echo.
    echo [*] Starting frontend only...
    docker-compose up -d frontend
    echo [OK] Frontend is starting...
) else if "%choice%"=="4" (
    echo.
    echo [*] Showing logs (press Ctrl+C to exit)...
    docker-compose logs -f
) else if "%choice%"=="5" (
    echo.
    echo [*] Stopping all services...
    docker-compose down
    echo [OK] All services stopped
) else (
    echo [X] Invalid choice
    exit /b 1
)

echo.
echo For more information, see README.md
pause

@echo off
echo ========================================
echo   Starting Hospital Booking System
echo ========================================
echo.

echo Checking for processes on port 8080...
for /f "tokens=5" %%a in ('netstat -ano ^| findstr :8080') do (
    echo Found process %%a on port 8080, killing it...
    taskkill /PID %%a /F >nul 2>&1
)

echo.
echo Starting Backend Server...
start "Backend Server" cmd /k "cd backend && mvn spring-boot:run"

echo Waiting 15 seconds for backend to start...
timeout /t 15 /nobreak >nul

echo.
echo Starting Frontend Server...
start "Frontend Server" cmd /k "cd frontend && npm start"

echo.
echo ========================================
echo   Servers are starting!
echo ========================================
echo.
echo Backend will be available at: http://localhost:8080
echo Frontend will be available at: http://localhost:3000
echo.
echo The servers are running in separate windows.
echo Close those windows to stop the servers.
echo.
pause


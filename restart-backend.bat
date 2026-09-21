@echo off
echo Stopping processes on port 8080...
for /f "tokens=5" %%a in ('netstat -ano ^| findstr :8080') do (
    taskkill /PID %%a /F >nul 2>&1
)

echo Waiting 2 seconds...
timeout /t 2 /nobreak >nul

echo Starting Backend Server...
cd backend
start "Backend Server" cmd /k "mvn spring-boot:run"

echo.
echo Backend server is starting in a new window.
echo Wait for it to show "Tomcat started on port(s): 8080"
echo.
pause


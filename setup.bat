@echo off
echo ========================================
echo   Hospital Booking System Setup
echo ========================================
echo.

echo Checking prerequisites...
echo.

echo Checking Java...
java -version >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: Java is not installed or not in PATH
    echo Please install Java 17 or higher
    pause
    exit /b 1
)
echo ✓ Java is installed

echo.
echo Checking Maven...
mvn -version >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: Maven is not installed or not in PATH
    echo Please install Maven 3.6 or higher
    pause
    exit /b 1
)
echo ✓ Maven is installed

echo.
echo Checking Node.js...
node -version >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: Node.js is not installed or not in PATH
    echo Please install Node.js 16 or higher
    pause
    exit /b 1
)
echo ✓ Node.js is installed

echo.
echo Installing Frontend Dependencies...
cd frontend
call npm install
if %errorlevel% neq 0 (
    echo ERROR: Failed to install frontend dependencies
    pause
    exit /b 1
)
echo ✓ Frontend dependencies installed

echo.
echo Installing Backend Dependencies...
cd ..\backend
call mvn clean install -DskipTests
if %errorlevel% neq 0 (
    echo ERROR: Failed to install backend dependencies
    pause
    exit /b 1
)
echo ✓ Backend dependencies installed

cd ..

echo.
echo ========================================
echo   Setup completed successfully! 🎉
echo ========================================
echo.
echo IMPORTANT: Make sure MongoDB is running before starting the application
echo.
echo To start the application:
echo 1. Ensure MongoDB is running (local or cloud)
echo 2. Double-click 'start-backend.bat' to start the backend server
echo 3. Double-click 'start-frontend.bat' to start the frontend server
echo.
echo The application will be available at:
echo • Frontend: http://localhost:3000
echo • Backend API: http://localhost:8080
echo • Health Check: http://localhost:8080/test/health
echo.
echo Demo Accounts:
echo • Admin: admin@demo.com / password123
echo • Patient: patient@demo.com / password123
echo • Doctor: doctor@demo.com / password123
echo.
echo For detailed instructions, see QUICK_START.md
echo.
pause
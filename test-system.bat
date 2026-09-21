@echo off
echo ========================================
echo   Hospital Booking System - API Tests
echo ========================================
echo.

echo Testing basic connectivity...
echo.

echo 1. Testing root endpoint...
curl -s http://localhost:8080/ > nul 2>&1
if %errorlevel% equ 0 (
    echo ✓ Root endpoint accessible
) else (
    echo ✗ Root endpoint failed - Is the backend running?
)

echo.
echo 2. Testing ping endpoint...
curl -s http://localhost:8080/test/ping > nul 2>&1
if %errorlevel% equ 0 (
    echo ✓ Ping endpoint accessible
) else (
    echo ✗ Ping endpoint failed
)

echo.
echo 3. Testing health endpoint...
curl -s http://localhost:8080/test/health > nul 2>&1
if %errorlevel% equ 0 (
    echo ✓ Health endpoint accessible
) else (
    echo ✗ Health endpoint failed
)

echo.
echo 4. Testing demo accounts endpoint...
curl -s http://localhost:8080/test/demo-accounts > nul 2>&1
if %errorlevel% equ 0 (
    echo ✓ Demo accounts endpoint accessible
) else (
    echo ✗ Demo accounts endpoint failed
)

echo.
echo 5. Testing auth signup endpoint...
curl -s -X POST http://localhost:8080/auth/signup -H "Content-Type: application/json" -d "{\"firstName\":\"Test\",\"lastName\":\"User\",\"email\":\"test@test.com\",\"phone\":\"1234567890\",\"password\":\"password123\",\"role\":\"PATIENT\"}" > nul 2>&1
if %errorlevel% equ 0 (
    echo ✓ Auth signup endpoint accessible
) else (
    echo ✗ Auth signup endpoint failed
)

echo.
echo ========================================
echo   Test Results Summary
echo ========================================
echo.
echo If all tests passed, your backend is working correctly!
echo.
echo Next steps:
echo 1. Test the frontend at http://localhost:3000
echo 2. Login with demo accounts:
echo    • patient@demo.com / password123
echo    • doctor@demo.com / password123
echo    • admin@demo.com / password123
echo.
echo If any tests failed:
echo 1. Make sure the backend is running (start-backend.bat)
echo 2. Check if MongoDB is running
echo 3. Check the backend console for errors
echo.
pause
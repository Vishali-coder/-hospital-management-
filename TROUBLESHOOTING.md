# Hospital Booking System - Troubleshooting Guide

## 🚨 Common Issues and Solutions

### 1. "Full authentication is required to access this resource"

**Symptoms:**
- Getting 401 Unauthorized errors
- Cannot access protected endpoints
- Login seems to work but subsequent requests fail

**Solutions:**

#### A. Check JWT Token Storage
```javascript
// Open browser console and check:
localStorage.getItem('token')
// Should return a JWT token string
```

#### B. Verify Token in Requests
```javascript
// Check if Authorization header is being sent:
// In browser Network tab, look for:
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

#### C. Clear Browser Storage
```javascript
// In browser console:
localStorage.clear();
sessionStorage.clear();
// Then refresh and try logging in again
```

#### D. Check Backend Logs
Look for these errors in backend console:
- `JWT token is expired`
- `Invalid JWT signature`
- `JWT token is unsupported`

### 2. MongoDB Connection Issues

**Symptoms:**
- Backend fails to start
- "Connection refused" errors
- Data not persisting

**Solutions:**

#### A. Local MongoDB
```bash
# Check if MongoDB is running:
netstat -an | findstr :27017

# Start MongoDB service:
net start MongoDB
```

#### B. MongoDB Atlas (Cloud)
- Check connection string in `application.properties`
- Verify network access (IP whitelist)
- Check username/password

#### C. Connection String Format
```properties
# Local MongoDB:
spring.data.mongodb.uri=mongodb://localhost:27017/hospital_booking

# MongoDB Atlas:
spring.data.mongodb.uri=mongodb+srv://username:password@cluster.mongodb.net/hospital_booking
```

### 3. CORS Issues

**Symptoms:**
- "Access to fetch blocked by CORS policy"
- Frontend can't connect to backend
- OPTIONS requests failing

**Solutions:**

#### A. Check CORS Configuration
In `application.properties`:
```properties
cors.allowed-origins=http://localhost:3000
```

#### B. Verify Frontend URL
Make sure frontend is running on the allowed origin (usually http://localhost:3000)

#### C. Check Browser Network Tab
- Look for preflight OPTIONS requests
- Verify CORS headers in response

### 4. Port Already in Use

**Symptoms:**
- "Port 8080 is already in use"
- "Port 3000 is already in use"
- Application won't start

**Solutions:**

#### A. Kill Existing Processes
```bash
# Find process using port:
netstat -ano | findstr :8080
netstat -ano | findstr :3000

# Kill process by PID:
taskkill /PID <PID> /F
```

#### B. Change Ports
Backend (`application.properties`):
```properties
server.port=8081
```

Frontend (`.env` file):
```
PORT=3001
```

### 5. API Endpoints Not Working

**Symptoms:**
- 404 Not Found errors
- Endpoints returning unexpected responses
- Controllers not being called

**Solutions:**

#### A. Test Basic Connectivity
```bash
# Test if backend is running:
curl http://localhost:8080/test/ping

# Or in browser:
http://localhost:8080/test/ping
```

#### B. Check Request URLs
Ensure frontend is calling correct endpoints:
- ✅ `/auth/signin` (correct)
- ❌ `/api/auth/signin` (incorrect after our fixes)

#### C. Verify Controller Mappings
Check that controller `@RequestMapping` matches the URL you're calling.

### 6. Email Notifications Not Working

**Symptoms:**
- No confirmation emails sent
- Email service errors in logs

**Solutions:**

#### A. Gmail Configuration
```properties
spring.mail.host=smtp.gmail.com
spring.mail.port=587
spring.mail.username=your-email@gmail.com
spring.mail.password=your-app-password  # Not your regular password!
```

#### B. Generate Gmail App Password
1. Enable 2-factor authentication
2. Go to Google Account settings
3. Generate App Password
4. Use App Password in configuration

#### C. Test Email Configuration
Check backend logs for email-related errors.

### 7. Frontend Build Issues

**Symptoms:**
- `npm start` fails
- Missing dependencies
- Build errors

**Solutions:**

#### A. Clear Node Modules
```bash
cd frontend
rmdir /s node_modules
del package-lock.json
npm install
```

#### B. Check Node Version
```bash
node --version  # Should be 16+
npm --version   # Should be 8+
```

#### C. Install Missing Dependencies
```bash
npm install axios react-router-dom
```

### 8. Backend Build Issues

**Symptoms:**
- Maven build fails
- Compilation errors
- Missing dependencies

**Solutions:**

#### A. Clean and Rebuild
```bash
cd backend
mvn clean install -DskipTests
```

#### B. Check Java Version
```bash
java -version  # Should be 17+
mvn -version   # Should be 3.6+
```

#### C. Update Dependencies
Check `pom.xml` for version conflicts.

## 🧪 Testing Tools

### 1. API Testing Script
Run `test-system.bat` to test all endpoints.

### 2. Frontend API Test
Click "🧪 Test API Connection" button on login page.

### 3. Manual Testing Endpoints

#### Public Endpoints (No Auth Required):
```bash
GET http://localhost:8080/
GET http://localhost:8080/test/ping
GET http://localhost:8080/test/health
GET http://localhost:8080/test/demo-accounts
POST http://localhost:8080/auth/signin
POST http://localhost:8080/auth/signup
```

#### Protected Endpoints (Auth Required):
```bash
# Patient endpoints:
GET http://localhost:8080/patient/doctors
POST http://localhost:8080/patient/appointments
GET http://localhost:8080/patient/appointments

# Doctor endpoints:
GET http://localhost:8080/doctor/appointments
PUT http://localhost:8080/doctor/appointments/{id}/status

# Admin endpoints:
GET http://localhost:8080/admin/users
GET http://localhost:8080/admin/doctors
```

## 🔍 Debugging Steps

### 1. Check System Status
1. ✅ MongoDB running?
2. ✅ Backend running on port 8080?
3. ✅ Frontend running on port 3000?
4. ✅ No firewall blocking ports?

### 2. Test Authentication Flow
1. Register new user
2. Login with credentials
3. Check if token is stored
4. Try accessing protected endpoint

### 3. Check Browser Console
- Look for JavaScript errors
- Check network requests
- Verify API responses

### 4. Check Backend Logs
- Look for startup errors
- Check for authentication failures
- Verify database connections

## 📞 Getting Help

### 1. Collect Information
Before asking for help, collect:
- Error messages (exact text)
- Browser console logs
- Backend console logs
- Steps to reproduce the issue

### 2. Check Logs Location
- Backend: Console output where you ran `start-backend.bat`
- Frontend: Browser Developer Tools → Console
- Network: Browser Developer Tools → Network tab

### 3. Common Log Patterns

#### Success Patterns:
```
✓ Started HospitalBookingSystemApplication
✓ MongoDB connected successfully
✓ JWT token generated successfully
```

#### Error Patterns:
```
❌ Connection refused: connect
❌ JWT token is expired
❌ Access denied
❌ Port already in use
```

## 🎯 Quick Fixes Checklist

When something isn't working:

1. **Restart Everything**
   - Stop backend and frontend
   - Restart MongoDB
   - Start backend, then frontend

2. **Clear Browser Data**
   - Clear localStorage
   - Clear cookies
   - Hard refresh (Ctrl+F5)

3. **Check Ports**
   - Backend: http://localhost:8080/test/ping
   - Frontend: http://localhost:3000

4. **Verify Demo Accounts**
   - patient@demo.com / password123
   - doctor@demo.com / password123
   - admin@demo.com / password123

5. **Test API Connection**
   - Use the "🧪 Test API Connection" button
   - Check browser console for errors

Remember: Most issues are related to authentication, CORS, or database connectivity. Start with these areas when troubleshooting! 🚀
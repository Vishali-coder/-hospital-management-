# Hospital Booking System - Quick Start Guide

## 🚀 Quick Setup (5 minutes)

### Step 1: Prerequisites Check
Make sure you have:
- ✅ Java 17+ installed (`java -version`)
- ✅ Maven 3.6+ installed (`mvn -version`)
- ✅ Node.js 16+ installed (`node -version`)
- ✅ MongoDB running (local or cloud)

### Step 2: Automated Setup
```bash
# Double-click setup.bat or run:
setup.bat
```

### Step 3: Start the Application
```bash
# Terminal 1 - Start Backend
start-backend.bat

# Terminal 2 - Start Frontend  
start-frontend.bat
```

### Step 4: Access the Application
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8080
- **Health Check**: http://localhost:8080/test/health

## 🔐 Demo Accounts

The system automatically creates demo accounts on first startup:

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@demo.com | password123 |
| Patient | patient@demo.com | password123 |
| Doctor | doctor@demo.com | password123 |
| Doctor | doctor2@demo.com | password123 |
| Doctor | doctor3@demo.com | password123 |

## 🧪 Testing the System

### 1. Login as Patient
1. Go to http://localhost:3000
2. Login with `patient@demo.com / password123`
3. Browse doctors and book an appointment

### 2. Login as Doctor
1. Login with `doctor@demo.com / password123`
2. View your appointments
3. Update appointment status
4. Block/unblock dates

### 3. Login as Admin
1. Login with `admin@demo.com / password123`
2. View all users, doctors, and appointments
3. Add new doctors
4. Manage the system

## 🔧 Troubleshooting

### Common Issues:

1. **"Full authentication is required"**
   - Make sure you're logged in
   - Check if JWT token is valid
   - Try logging out and logging back in

2. **MongoDB Connection Error**
   - Ensure MongoDB is running
   - Check connection string in `application.properties`

3. **Port Already in Use**
   - Backend (8080): Kill process or change port
   - Frontend (3000): Kill process or change port

4. **CORS Issues**
   - Check `cors.allowed-origins` in application.properties
   - Ensure frontend URL is correct

### Quick Fixes:
```bash
# Kill processes on ports
netstat -ano | findstr :8080
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Restart services
start-backend.bat
start-frontend.bat
```

## 📱 Features to Test

### Patient Features:
- ✅ User registration and login
- ✅ Browse doctors by specialty
- ✅ Book appointments
- ✅ View appointment history
- ✅ Cancel appointments

### Doctor Features:
- ✅ View appointments
- ✅ Update appointment status
- ✅ Block/unblock dates
- ✅ Manage availability

### Admin Features:
- ✅ User management
- ✅ Doctor management
- ✅ Appointment oversight
- ✅ System statistics

## 🌐 API Endpoints

### Authentication
- `POST /auth/signin` - Login
- `POST /auth/signup` - Register

### Patient Endpoints
- `GET /patient/doctors` - Get all doctors
- `POST /patient/appointments` - Book appointment
- `GET /patient/appointments` - Get patient appointments

### Doctor Endpoints
- `GET /doctor/appointments` - Get doctor appointments
- `PUT /doctor/appointments/{id}/status` - Update appointment status
- `POST /doctor/availability/block` - Block date

### Admin Endpoints
- `GET /admin/users` - Get all users
- `GET /admin/doctors` - Get all doctors
- `GET /admin/appointments` - Get all appointments

### Test Endpoints
- `GET /test/health` - System health check
- `GET /test/demo-accounts` - Get demo account info

## 📧 Email Configuration

To enable email notifications:

1. Update `application.properties`:
```properties
spring.mail.username=your-email@gmail.com
spring.mail.password=your-app-password
```

2. For Gmail, create an App Password:
   - Go to Google Account settings
   - Enable 2-factor authentication
   - Generate App Password
   - Use the App Password in configuration

## 🎯 Next Steps

1. **Customize the System**:
   - Add more specialties
   - Modify appointment slots
   - Add more user fields

2. **Deploy to Production**:
   - Use production database
   - Configure proper email settings
   - Set up SSL/HTTPS

3. **Add More Features**:
   - Payment integration
   - SMS notifications
   - Video consultations
   - Medical records

## 📞 Support

If you encounter issues:
1. Check the troubleshooting section
2. Verify all prerequisites are installed
3. Check application logs
4. Test with demo accounts first

Happy coding! 🎉
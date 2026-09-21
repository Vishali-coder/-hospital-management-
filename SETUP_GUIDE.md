# Hospital Booking System - Setup Guide

## Prerequisites

Before setting up the application, ensure you have the following installed:

### Required Software
1. **Java 17 or higher**
   - Download from: https://www.oracle.com/java/technologies/downloads/
   - Verify installation: `java -version`

2. **Maven 3.6 or higher**
   - Download from: https://maven.apache.org/download.cgi
   - Verify installation: `mvn -version`

3. **Node.js 16 or higher**
   - Download from: https://nodejs.org/
   - Verify installation: `node -version` and `npm -version`

4. **MongoDB**
   - Download from: https://www.mongodb.com/try/download/community
   - Start MongoDB service
   - Default connection: `mongodb://localhost:27017`

## Quick Setup

### Option 1: Automated Setup (Recommended)
1. Double-click `setup.bat` to automatically install all dependencies
2. Follow the on-screen instructions

### Option 2: Manual Setup

#### Backend Setup
1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   mvn clean install
   ```

3. Configure the application:
   - Open `src/main/resources/application.properties`
   - Update MongoDB connection if needed
   - Configure email settings for notifications

4. Start the backend server:
   ```bash
   mvn spring-boot:run
   ```
   - Backend will be available at: http://localhost:8080/api

#### Frontend Setup
1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the frontend server:
   ```bash
   npm start
   ```
   - Frontend will be available at: http://localhost:3000

## Configuration

### Database Configuration
The application uses MongoDB. Update the connection string in `backend/src/main/resources/application.properties`:

```properties
spring.data.mongodb.uri=mongodb://localhost:27017/hospital_booking
spring.data.mongodb.database=hospital_booking
```

### Email Configuration
Configure email settings for appointment notifications:

```properties
spring.mail.host=smtp.gmail.com
spring.mail.port=587
spring.mail.username=your-email@gmail.com
spring.mail.password=your-app-password
spring.mail.properties.mail.smtp.auth=true
spring.mail.properties.mail.smtp.starttls.enable=true
```

**Note:** For Gmail, you need to use an App Password instead of your regular password.

### JWT Configuration
The JWT secret key can be customized:

```properties
jwt.secret=hospitalBookingSecretKey2024
jwt.expiration=86400000
```

## Default Admin Account

After starting the application, you can create an admin account by registering with the role "ADMIN" or by directly inserting into the database.

### Creating Admin Account via Database
1. Connect to MongoDB
2. Use the hospital_booking database
3. Insert admin user:

```javascript
db.users.insertOne({
  firstName: "Admin",
  lastName: "User",
  email: "admin@hospital.com",
  phone: "1234567890",
  password: "$2a$10$encrypted_password_here", // Use BCrypt to encrypt
  role: "ADMIN",
  createdAt: new Date(),
  updatedAt: new Date()
});
```

## Testing the Application

### Demo Accounts
The application includes demo account information on the login page:
- **Patient:** patient@demo.com / password123
- **Doctor:** doctor@demo.com / password123  
- **Admin:** admin@demo.com / password123

### API Testing
Use Postman or any API testing tool to test the endpoints:
- Base URL: http://localhost:8080/api
- Authentication: Bearer token (JWT)

### Key Endpoints
- `POST /auth/signin` - User login
- `POST /auth/signup` - User registration
- `GET /patient/doctors` - Get all doctors (Patient)
- `POST /patient/appointments` - Book appointment (Patient)
- `GET /doctor/appointments` - Get doctor appointments (Doctor)
- `GET /admin/users` - Get all users (Admin)

## Troubleshooting

### Common Issues

1. **MongoDB Connection Error**
   - Ensure MongoDB is running
   - Check connection string in application.properties
   - Verify MongoDB port (default: 27017)

2. **Port Already in Use**
   - Backend (8080): Change `server.port` in application.properties
   - Frontend (3000): Set `PORT=3001` environment variable

3. **Email Not Sending**
   - Verify email configuration
   - Check if Gmail App Password is used
   - Ensure less secure app access is enabled (if using Gmail)

4. **CORS Issues**
   - Verify `cors.allowed-origins` in application.properties
   - Check if frontend URL is correctly configured

5. **JWT Token Issues**
   - Check JWT secret configuration
   - Verify token expiration settings
   - Clear browser localStorage if needed

### Logs
- Backend logs: Check console output or configure logging in application.properties
- Frontend logs: Check browser developer console

## Development

### Project Structure
```
hospital-management/
├── backend/                 # Spring Boot application
│   ├── src/main/java/      # Java source code
│   ├── src/main/resources/ # Configuration files
│   └── pom.xml            # Maven dependencies
├── frontend/               # React application
│   ├── src/               # React source code
│   ├── public/            # Static files
│   └── package.json       # NPM dependencies
└── README.md              # Project documentation
```

### Adding New Features
1. Backend: Add controllers, services, and models in respective packages
2. Frontend: Add components and pages in src/ directory
3. Update API endpoints and routes as needed

### Database Schema
The application uses three main collections:
- `users`: User accounts (patients, doctors, admins)
- `doctors`: Doctor profiles and availability
- `appointments`: Appointment bookings

## Production Deployment

### Backend Deployment
1. Build the application: `mvn clean package`
2. Run the JAR file: `java -jar target/booking-system-0.0.1-SNAPSHOT.jar`
3. Configure production database and email settings

### Frontend Deployment
1. Build the application: `npm run build`
2. Serve the build folder using a web server (nginx, Apache, etc.)
3. Update API base URL for production

### Environment Variables
Set the following environment variables for production:
- `MONGODB_URI`: Production MongoDB connection string
- `JWT_SECRET`: Strong JWT secret key
- `EMAIL_USERNAME`: Production email username
- `EMAIL_PASSWORD`: Production email password

## Support

For issues and questions:
1. Check the troubleshooting section above
2. Review application logs
3. Verify all prerequisites are installed correctly
4. Ensure all configuration settings are correct

## License

This project is for educational and demonstration purposes.
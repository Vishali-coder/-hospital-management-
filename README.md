# Role-Based Online Hospital Booking System

## 📌 Description
This project is a full-stack web application designed to simplify hospital appointment scheduling by enabling patients to book appointments with doctors based on real-time availability. It supports role-based access for patients, doctors, and admins, ensuring secure and efficient healthcare management.

## 🧑‍💻 Tech Stack
- **Backend**: Spring Boot (Java), MongoDB
- **Frontend**: React.js with Tailwind CSS
- **Authentication**: JWT (JSON Web Token)
- **Email Integration**: JavaMailSender (for appointment confirmations and reminders)
- **API Testing**: Postman

## 🎯 Key Features

### 🧑‍⚕️ Patient Features
- User registration and login
- Browse doctors by specialty
- Book appointments based on date and time slot
- View or cancel upcoming bookings
- Receive email confirmations/reminders

### 👨‍⚕️ Doctor Features
- Login and view appointment dashboard
- Set or block availability dates and time slots
- Mark appointments as Completed or Cancelled

### 👨‍💼 Admin Features
- Add/edit/delete doctor profiles
- Manage appointment bookings
- Block or open doctor availability
- View all users and appointments

## 🗃️ Database: MongoDB Collections
- **users**: stores patient, doctor, and admin credentials and roles
- **doctors**: stores doctor info and available slots
- **appointments**: stores booking details and statuses

## 🔐 Security
- JWT-based role authorization for all endpoints
- Admin-only access for sensitive operations
- Token verification for secure data access

## 📬 Email Functionality
- Confirmation email when appointment is booked
- Reminder email 24 hours before the appointment (via Spring Scheduler)

## 🚀 Getting Started

### Prerequisites
- Java 17 or higher
- Node.js 16 or higher
- MongoDB
- Maven

### Backend Setup
1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   mvn clean install
   ```
3. Configure MongoDB connection in `application.properties`
4. Run the application:
   ```bash
   mvn spring-boot:run
   ```

### Frontend Setup
1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm start
   ```

## 📈 Potential Extensions
- SMS notifications (Twilio)
- Online consultation link integration (Zoom/Meet)
- Export appointment history to PDF

## 🌐 API Endpoints
The backend provides RESTful APIs for:
- User authentication and authorization
- Doctor management
- Appointment booking and management
- Email notifications

## 🎨 Frontend UI
Built with React and Tailwind CSS, featuring:
- Patient Dashboard: Bookings, profile, logout
- Doctor Dashboard: Availability, appointment list
- Admin Panel: Add doctor, view all users/appointments
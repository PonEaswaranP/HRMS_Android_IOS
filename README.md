# HRMS React Native Android App

A fully functional React Native Android application built with TypeScript that connects to a Django REST API backend for Human Resource Management System (HRMS).

## Features

✅ **Authentication**
- JWT-based login and registration
- Automatic token refresh
- Secure token storage using AsyncStorage
- Protected routes with automatic redirection

✅ **Dashboard**
- Today's attendance summary
- Pending leaves count and list
- Latest payslip information
- Quick action buttons

✅ **Attendance Management**
- View today's attendance status
- Check-in and check-out functionality
- Work hours calculation
- Attendance history

✅ **Employee Management**
- List all employees
- View employee profiles
- Employee details with department and designation

✅ **Leave Management**
- Apply for leaves with multiple types (sick, casual, annual, etc.)
- View all leave applications
- Filter leaves by status (pending, approved, rejected)
- View leave approval/rejection reasons

✅ **Payroll**
- View all payslips
- Detailed salary breakdown
- Earnings and deductions display
- Monthly payslip history

## Tech Stack

- **React Native** 0.73.2
- **TypeScript** 5.0.4
- **React Navigation** (Stack Navigator)
- **Axios** for API calls
- **AsyncStorage** for local storage
- **React Native Gesture Handler** for navigation gestures

## Project Structure

```
HRMSApp/
├── src/
│   ├── api/
│   │   └── apiService.ts          # Centralized API service with JWT handling
│   ├── components/
│   │   ├── Button.tsx             # Reusable button component
│   │   ├── TextInput.tsx          # Reusable text input component
│   │   ├── Card.tsx               # Card container component
│   │   ├── LoadingSpinner.tsx     # Loading indicator component
│   │   ├── ErrorMessage.tsx       # Error display component
│   │   └── index.ts               # Component exports
│   ├── navigation/
│   │   ├── AuthNavigator.tsx      # Authentication flow navigator
│   │   ├── MainNavigator.tsx      # Main app navigator
│   │   ├── RootNavigator.tsx      # Root navigation controller
│   │   └── types.ts               # Navigation type definitions
│   ├── screens/
│   │   ├── LoginScreen.tsx        # Login screen
│   │   ├── RegisterScreen.tsx     # Registration screen
│   │   ├── DashboardScreen.tsx    # Dashboard home screen
│   │   ├── AttendanceScreen.tsx   # Attendance management
│   │   ├── EmployeeListScreen.tsx # Employee listing
│   │   ├── EmployeeProfileScreen.tsx # Employee profile view
│   │   ├── LeaveApplicationScreen.tsx # Leave application form
│   │   ├── LeaveListScreen.tsx    # Leave listing and filtering
│   │   └── PayslipListScreen.tsx  # Payslip listing and details
│   ├── types/
│   │   ├── index.ts               # All TypeScript type definitions
│   │   └── env.d.ts               # Environment variable types
│   └── utils/
│       └── tokenStorage.ts        # JWT token storage utilities
├── App.tsx                        # Root app component
├── index.js                       # App entry point
├── package.json                   # Dependencies and scripts
├── tsconfig.json                  # TypeScript configuration
├── babel.config.js                # Babel configuration
├── metro.config.js                # Metro bundler configuration
├── .env                           # Environment variables
├── .env.example                   # Environment variables template
└── README.md                      # This file
```

## Prerequisites

- Node.js (>= 18.x)
- npm or yarn
- Android Studio (for Android development)
- JDK 17 or higher
- Android SDK
- A running Django REST API backend (with HRMS endpoints)

## Installation

### 1. Clone or navigate to the project directory

```powershell
cd "c:\Users\Sriram\Downloads\New folder (2)"
```

### 2. Install dependencies

```powershell
npm install
```

### 3. Configure environment variables

Copy the `.env.example` file to `.env`:

```powershell
Copy-Item .env.example .env
```

Then edit `.env` and set your backend API URL:

```env
# For Android Emulator (use 10.0.2.2 to access localhost on your computer)
API_BASE_URL=http://10.0.2.2:8000

# For Physical Device (use your computer's IP address)
# API_BASE_URL=http://192.168.1.100:8000
```

**Finding your IP address:**
```powershell
# On Windows
ipconfig
# Look for "IPv4 Address" under your active network adapter
```

### 4. Install Android dependencies

```powershell
cd android
.\gradlew clean
cd ..
```

## Running the App

### Start Metro Bundler

In your project directory, start the Metro bundler:

```powershell
npm start
```

### Run on Android Emulator

Make sure you have an Android emulator running, then in a new terminal:

```powershell
npm run android
```

Or use the React Native CLI directly:

```powershell
npx react-native run-android
```

### Run on Physical Android Device

1. Enable Developer Options on your Android device:
   - Go to Settings → About Phone
   - Tap "Build Number" 7 times
   - Go back to Settings → Developer Options
   - Enable "USB Debugging"

2. Connect your device via USB

3. Verify device is connected:
```powershell
adb devices
```

4. Run the app:
```powershell
npm run android
```

## Backend API Requirements

Your Django backend should have the following endpoints:

### Authentication
- `POST /api/auth/login/` - Login with username and password
- `POST /api/auth/register/` - Register new user
- `POST /api/auth/token/refresh/` - Refresh JWT token
- `GET /api/auth/user/` - Get current user info

### Employees
- `GET /api/employees/` - List all employees (with pagination)
- `GET /api/employees/{id}/` - Get employee details
- `POST /api/employees/` - Create new employee
- `PATCH /api/employees/{id}/` - Update employee
- `DELETE /api/employees/{id}/` - Delete employee

### Attendance
- `GET /api/attendance/` - Get attendance history
- `GET /api/attendance/today/` - Get today's attendance
- `POST /api/attendance/check-in/` - Check in
- `POST /api/attendance/{id}/check-out/` - Check out

### Leaves
- `GET /api/leaves/` - List leaves (supports ?status= filter)
- `GET /api/leaves/{id}/` - Get leave details
- `POST /api/leaves/` - Apply for leave
- `POST /api/leaves/{id}/approve/` - Approve leave
- `POST /api/leaves/{id}/reject/` - Reject leave
- `POST /api/leaves/{id}/cancel/` - Cancel leave

### Payroll
- `GET /api/payroll/payslips/` - List payslips (supports ?year= and ?month= filters)
- `GET /api/payroll/payslips/{id}/` - Get payslip details
- `GET /api/payroll/latest/` - Get latest payslip

### Dashboard
- `GET /api/dashboard/` - Get dashboard summary

## API Response Formats

The app expects the following response formats:

### Login Response
```json
{
  "access": "eyJ0eXAiOiJKV1QiLCJhbGc...",
  "refresh": "eyJ0eXAiOiJKV1QiLCJhbGc...",
  "user": {
    "id": 1,
    "username": "john_doe",
    "email": "john@example.com",
    "first_name": "John",
    "last_name": "Doe"
  }
}
```

### Employee Object
```json
{
  "id": 1,
  "employee_id": "EMP001",
  "first_name": "John",
  "last_name": "Doe",
  "email": "john@example.com",
  "phone": "+1234567890",
  "department": "IT",
  "designation": "Software Engineer",
  "date_of_joining": "2023-01-15",
  "status": "active"
}
```

### Attendance Object
```json
{
  "id": 1,
  "employee": 1,
  "date": "2024-10-03",
  "check_in_time": "2024-10-03T09:00:00Z",
  "check_out_time": "2024-10-03T18:00:00Z",
  "status": "present",
  "work_hours": 9.0
}
```

### Leave Object
```json
{
  "id": 1,
  "employee": 1,
  "leave_type": "casual",
  "start_date": "2024-10-10",
  "end_date": "2024-10-12",
  "days_count": 3,
  "reason": "Personal work",
  "status": "pending",
  "applied_on": "2024-10-03T10:30:00Z"
}
```

### Payslip Object
```json
{
  "id": 1,
  "employee": 1,
  "month": 9,
  "year": 2024,
  "basic_salary": 50000,
  "hra": 15000,
  "da": 5000,
  "medical_allowance": 2000,
  "transport_allowance": 3000,
  "other_allowances": 1000,
  "gross_salary": 76000,
  "pf_deduction": 6000,
  "tax_deduction": 5000,
  "other_deductions": 500,
  "total_deductions": 11500,
  "net_salary": 64500,
  "status": "paid",
  "payment_date": "2024-09-30"
}
```

## Troubleshooting

### Common Issues

**1. Metro Bundler Issues**
```powershell
# Clear Metro cache
npx react-native start --reset-cache
```

**2. Build Failures**
```powershell
# Clean Android build
cd android
.\gradlew clean
cd ..

# Rebuild
npm run android
```

**3. Network Connection Issues**

If you can't connect to your backend:
- For emulator: Make sure you're using `10.0.2.2` instead of `localhost`
- For physical device: Make sure both device and computer are on the same network
- Check if your backend allows connections from your IP
- Temporarily disable firewall or add exception for port 8000

**4. TypeScript Errors**

The TypeScript errors shown during development are expected before running `npm install`. They will be resolved once all dependencies are installed.

**5. Can't Connect to Backend**

Make sure your Django backend:
- Is running and accessible
- Has CORS enabled for your frontend
- Accepts requests from your device's IP address

Add to Django settings:
```python
CORS_ALLOWED_ORIGINS = [
    "http://localhost:8081",
    "http://10.0.2.2:8081",
]

CORS_ALLOW_ALL_ORIGINS = True  # For development only
```

## Development Tips

### Testing API Endpoints

Before using the app, test your backend endpoints using tools like:
- Postman
- cURL
- Thunder Client (VS Code extension)

### Hot Reloading

Press `R` twice in the Metro terminal or shake the device to access the developer menu and enable Hot Reloading.

### Debugging

1. Open the developer menu (shake device or press `Ctrl+M` on emulator)
2. Select "Debug"
3. Chrome DevTools will open for debugging

### Building Release APK

```powershell
cd android
.\gradlew assembleRelease
```

The APK will be at: `android/app/build/outputs/apk/release/app-release.apk`

## Features to Add (Future Enhancements)

- [ ] Offline support with local caching
- [ ] Push notifications for leave approvals
- [ ] Biometric authentication
- [ ] Face recognition for attendance
- [ ] Document upload (profile pictures, leave documents)
- [ ] Calendar view for attendance and leaves
- [ ] Charts and analytics for attendance
- [ ] Export payslips as PDF
- [ ] Multi-language support
- [ ] Dark mode theme

## License

This project is created for educational/demonstration purposes.

## Support

For issues or questions:
1. Check the troubleshooting section above
2. Verify your backend API is working correctly
3. Check the Metro bundler logs for errors
4. Use `adb logcat` to see Android system logs

## Contributing

Feel free to fork this project and customize it for your needs!

---

**Built with ❤️ using React Native and TypeScript**

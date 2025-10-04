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

# Role-Based Dashboard System - Implementation Guide

## Overview
This is a complete role-based dashboard system for the HRMS React Native application. The system dynamically renders different dashboards based on user access levels (HR vs Employee).

## 📁 File Structure

```
src/
├── api/
│   └── userAPI.ts              # User API service with AsyncStorage integration
├── screens/
│   ├── Dashboard.tsx           # Main dashboard router component
│   ├── EmployeeDashboard.tsx   # Employee view dashboard
│   └── HRDashboard.tsx         # HR manager view dashboard
└── types/
    └── index.ts                # TypeScript interfaces (updated with UserInfo)
```

## 🔧 Components Description

### 1. **userAPI.ts** - API Service Layer
**Location:** `src/api/userAPI.ts`

**Features:**
- Uses `@react-native-async-storage/async-storage` for token management
- Automatically attaches Bearer token to all requests
- Implements request/response interceptors for error handling
- Handles 401 errors by clearing expired tokens

**Main Methods:**
- `getCurrentUser()` - Fetches user data from `/api/users/me/`
- `updateUserProfile(data)` - Updates user profile information
- `getUserById(userId)` - Fetches specific user data (HR/Admin only)

**Usage Example:**
```typescript
import { userAPI } from '../api/userAPI';

const userData = await userAPI.getCurrentUser();
```

---

### 2. **Dashboard.tsx** - Router Component
**Location:** `src/screens/Dashboard.tsx`

**Features:**
- Displays loading indicator while fetching user data
- Conditionally renders dashboards based on `access_level.value`
- Implements error handling with retry functionality
- Shows user-friendly error messages

**Logic Flow:**
1. Component mounts → Calls `getCurrentUser()`
2. While loading → Shows `ActivityIndicator`
3. On success → Renders appropriate dashboard:
   - If `access_level.value === 'HR'` → `HRDashboard`
   - Otherwise → `EmployeeDashboard`
4. On error → Shows error message with retry option

---

### 3. **EmployeeDashboard.tsx** - Employee View
**Location:** `src/screens/EmployeeDashboard.tsx`

**Features:**
- **Header Section:**
  - Personalized greeting with user's full name
  - Notification bell icon with badge count
  
- **Check-In System:**
  - Interactive check-in/check-out button
  - Visual state changes (color-coded)
  - Work timer display (placeholder)

- **Reports Cards:**
  - Leave Report card showing remaining days
  - Annual Report card showing attendance percentage
  - Both cards are tappable for future navigation

- **Recent Updates:**
  - List of notifications and announcements
  - Shows upcoming meetings and leave approvals

- **Department & Role Info:**
  - Displays user's department from API
  - Shows user's role

**UI Design:**
- Clean, modern card-based layout
- Color-coded elements (blue primary, green for success)
- Smooth shadows and rounded corners
- Responsive to screen sizes

---

### 4. **HRDashboard.tsx** - HR Manager View
**Location:** `src/screens/HRDashboard.tsx`

**Features:**
- **Header Section:**
  - HR Dashboard title
  - HR manager's name
  - Notification icon with pending request count

- **Summary Cards:**
  - Quick stats: Pending, Approved, Rejected counts
  - Real-time updates

- **Tab Navigation:**
  - "Pending Requests" tab with badge count
  - "History" tab for approved/rejected requests
  - Smooth tab switching

- **Leave Request Cards:**
  - Employee avatar with initials
  - Complete leave details (type, duration, reason)
  - Submission date
  - Action buttons (Approve/Reject) for pending requests
  - Status badges for history items

- **Interactive Actions:**
  - Approve button (green) with confirmation dialog
  - Reject button (red outline) with confirmation
  - Success alerts after actions
  - Real-time UI updates

**Mock Data:**
- 5 sample leave requests (3 pending, 2 in history)
- Realistic leave types: Sick Leave, Casual Leave, Vacation
- Sample employee names and IDs

---

## 📋 TypeScript Interfaces

### UserInfo Interface
```typescript
export interface UserInfo {
  user_id: number;
  email: string;
  first_name: string;
  last_name: string;
  full_name: string;
  access_level: {
    value: string;      // 'HR' | 'EMPLOYEE' | 'ADMIN'
    label: string;
  };
  role: {
    id: number;
    name: string;
    description: string;
  };
  organization: {
    id: number;
    name: string;
  };
  department: {
    id: number;
    name: string;
  };
  is_active: boolean;
  date_joined: string;
}
```

---

## 🎨 Design Features

### Color Palette
- **Primary Blue:** `#007AFF` - Main brand color
- **Success Green:** `#34C759` - Positive actions
- **Danger Red:** `#FF3B30` - Negative actions, alerts
- **Background:** `#f5f5f5` - App background
- **Card White:** `#fff` - Card backgrounds

### Typography
- **Headers:** Bold, 24px
- **Body Text:** Regular, 14-16px
- **Labels:** 12-13px, slightly muted

### Spacing & Layout
- Consistent 16px padding
- 12-16px card margins
- 8-12px border radius for cards
- Subtle shadows for depth

---

## 🔄 Integration Steps

### Step 1: Update Navigation (if needed)
If using navigation, update your `DashboardScreen` to use the new `Dashboard` component:

```typescript
// In DashboardScreen.tsx
import Dashboard from './Dashboard';

const DashboardScreen: React.FC = () => {
  return <Dashboard />;
};

export default DashboardScreen;
```

### Step 2: Ensure API Endpoint Exists
Make sure your backend has the `/api/users/me/` endpoint that returns data matching the `UserInfo` interface.

### Step 3: Test with Different User Roles
Test the system with:
- A user with `access_level.value = 'HR'` → Should show HRDashboard
- A user with `access_level.value = 'EMPLOYEE'` → Should show EmployeeDashboard

---

## 🧪 Testing Checklist

### Employee Dashboard
- [ ] Header displays correct user name
- [ ] Notification badge shows count
- [ ] Check-in button toggles state
- [ ] Timer displays placeholder
- [ ] Leave Report card is visible
- [ ] Annual Report card is visible
- [ ] Updates section shows items
- [ ] Department and role display correctly

### HR Dashboard
- [ ] Header shows HR title and name
- [ ] Summary cards show correct counts
- [ ] Tab switching works smoothly
- [ ] Pending tab shows only pending requests
- [ ] History tab shows approved/rejected requests
- [ ] Approve button shows confirmation
- [ ] Reject button shows confirmation
- [ ] Status updates after approval/rejection
- [ ] Empty state shows when no items

### Dashboard Router
- [ ] Loading indicator appears on mount
- [ ] Correct dashboard renders based on role
- [ ] Error handling works
- [ ] Retry functionality works

---

## 🚀 Future Enhancements

### Employee Dashboard
1. Implement real check-in/check-out API integration
2. Add working timer with start/stop functionality
3. Make report cards navigable to detailed views
4. Implement real-time notifications
5. Add pull-to-refresh functionality

### HR Dashboard
1. Connect to real leave management API
2. Add filtering and search functionality
3. Implement pagination for large datasets
4. Add detailed leave request view
5. Enable bulk approval/rejection
6. Add comments/notes for leave requests
7. Export functionality for reports

### General
1. Add loading states for actions
2. Implement offline support
3. Add analytics tracking
4. Implement push notifications
5. Add biometric authentication for check-in

---

## 🐛 Troubleshooting

### Issue: "Cannot find module" errors
**Solution:** Restart TypeScript server in VS Code:
1. Press `Ctrl+Shift+P`
2. Type "TypeScript: Restart TS Server"
3. Press Enter

### Issue: Token not being attached to requests
**Solution:** Ensure token is stored correctly:
```typescript
import AsyncStorage from '@react-native-async-storage/async-storage';
await AsyncStorage.setItem('@hrms_access_token', 'your-token-here');
```

### Issue: API endpoint returns 404
**Solution:** Verify the API_BASE_URL in your `.env` file points to the correct backend URL.

---

## 📝 Notes

- All components are fully typed with TypeScript
- Components use React hooks for state management
- AsyncStorage is used for token persistence
- Axios is used for HTTP requests with interceptors
- All styling is done with React Native StyleSheet
- Components are optimized for both iOS and Android

---

## 👥 Component Props

### Dashboard
No props required - fetches data internally

### EmployeeDashboard
```typescript
interface EmployeeDashboardProps {
  userInfo: UserInfo;
}
```

### HRDashboard
```typescript
interface HRDashboardProps {
  userInfo: UserInfo;
}
```

---

## 📞 Support

For issues or questions:
1. Check the troubleshooting section above
2. Verify all dependencies are installed
3. Ensure API endpoints match the expected format
4. Check AsyncStorage token storage

---

**Created:** October 4, 2025  
**Version:** 1.0.0  
**React Native Version:** 0.81.4  
**TypeScript Version:** 5.8.3

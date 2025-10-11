# 🔐 e-MASA Smart Database

A modern, secure authentication system built with Firebase and vanilla JavaScript, featuring role-based access control, email verification, and Google Sign-In integration.

## ✨ Features

### 🔑 Authentication Methods
- **Email/Password Authentication** with Firebase Auth
- **Google Sign-In** integration
- **Demo Login** for quick testing (admin/user accounts)
- **Email Verification** for new accounts
- **Loading Animations** for better UX

### 👥 Role-Based Access Control
- **Admin Dashboard**: User management, system reports, activity tracking
- **User Dashboard**: Personal profile, activity view, settings
- **Moderator Role**: Content management capabilities
- **Role Validation**: Prevents cross-role login attempts

### 🛡️ Security Features
- **Email Verification** required for new accounts
- **Firestore Security Rules** for data protection
- **Role-based Data Access** control
- **Session Management** with automatic cleanup
- **Input Validation** and sanitization

### 🎨 User Experience
- **Responsive Design** for all devices
- **Loading States** with spinners and feedback
- **Error Handling** with clear messages
- **Tab-based Interface** for different user roles
- **Modern UI** with clean styling

## 🚀 Quick Start

### Prerequisites
- Node.js (v16 or higher)
- Firebase account
- Modern web browser

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd login-app
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up Firebase** (see [Firebase Setup Guide](#firebase-setup))

4. **Configure environment variables**
   ```bash
   cp .env.example .env
   # Edit .env with your Firebase configuration
   ```

5. **Start development server**
   ```bash
   npm run dev
   ```

6. **Open in browser**
   ```
   http://localhost:5173/
   ```

## 🔧 Firebase Setup

### 1. Create Firebase Project
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project: `emasa-smart-database`
3. Enable Google Analytics (optional)

### 2. Enable Authentication
1. Navigate to **Authentication** > **Sign-in method**
2. Enable **Email/Password** authentication
3. Enable **Google** authentication (optional)
4. Configure authorized domains

### 3. Set up Firestore Database
1. Go to **Firestore Database**
2. Create database in **test mode**
3. Choose your preferred location

### 4. Configure Environment Variables
Create a `.env` file in the project root:

```env
VITE_FIREBASE_API_KEY=your-api-key
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
VITE_FIREBASE_APP_ID=your-app-id
```

### 5. Set up Firestore Security Rules
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can read/write their own profile
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
      // Admins can read all users
      allow read: if request.auth != null && 
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }
    
    // Activities collection
    match /activities/{activityId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && 
        (get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin' ||
         get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'moderator');
    }
  }
}
```

### 6. Create Initial Admin User
1. Register through the app or Firebase Console
2. Manually set role to 'admin' in Firestore
3. Update status to 'active'

For detailed setup instructions, see [FIREBASE_SETUP_GUIDE.md](./FIREBASE_SETUP_GUIDE.md)

## 📁 Project Structure

```
src/
├── components/
│   ├── auth/
│   │   └── LoginForm.js          # Authentication forms and UI
│   ├── admin/
│   │   └── AdminDashboard.js     # Admin-specific dashboard
│   └── user/
│       └── UserDashboard.js      # User-specific dashboard
├── services/
│   ├── firebase.js               # Firebase configuration
│   ├── FirebaseAuthService.js    # Firebase authentication logic
│   └── AuthService.js            # Demo authentication service
├── utils/
│   ├── SessionUtils.js           # Session management
│   └── NavigationUtils.js        # Navigation utilities
├── App.js                        # Main application controller
├── main.js                       # Application entry point
└── style.css                     # Application styles
```

## 🎯 Usage

### Demo Accounts
For quick testing, use the demo login buttons:

- **Admin Demo**: `admin@example.com` / `admin123`
- **User Demo**: `user@example.com` / `user123`

### Creating New Accounts
1. Click "Register" tab
2. Fill in user details
3. Select appropriate role
4. Check email for verification link
5. Verify email before logging in

### Role-Based Features

**Admin Users Can:**
- Manage all users
- View system reports
- Create/edit activities
- Access admin dashboard

**Regular Users Can:**
- View personal dashboard
- Update profile
- View assigned activities
- Access user-specific features

**Moderators Can:**
- Manage content
- Create/edit activities
- Limited admin features

## 🛠️ Development

### Available Scripts

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

### Tech Stack

- **Frontend**: Vanilla JavaScript, HTML5, CSS3
- **Build Tool**: Vite
- **Authentication**: Firebase Auth
- **Database**: Cloud Firestore
- **Hosting**: Firebase Hosting (optional)

### Key Dependencies

```json
{
  "firebase": "^12.1.0",
  "vite": "^7.1.0"
}
```

## 🔒 Security

### Authentication Security
- Email verification required for new accounts
- Role-based access control
- Secure session management
- Firebase Auth integration

### Data Security
- Firestore security rules
- User data isolation
- Admin-only operations
- Input validation

### Best Practices
- Environment variables for sensitive data
- HTTPS enforcement
- Regular security updates
- Minimal data exposure

## 🚀 Deployment

### Firebase Hosting

1. **Install Firebase CLI**
   ```bash
   npm install -g firebase-tools
   ```

2. **Login to Firebase**
   ```bash
   firebase login
   ```

3. **Initialize hosting**
   ```bash
   firebase init hosting
   ```

4. **Build and deploy**
   ```bash
   npm run build
   firebase deploy
   ```

### Other Hosting Options
- Vercel
- Netlify
- GitHub Pages
- Traditional web hosting

## 🐛 Troubleshooting

### Common Issues

**"Firebase configuration is incomplete"**
- Check `.env` file exists and has all required variables
- Restart development server after changing `.env`

**"Permission denied" errors**
- Verify Firestore security rules
- Check user role in Firestore

**Email verification not working**
- Check spam/junk folders
- Verify Firebase Auth settings
- Check email verification configuration

**Google Sign-In issues**
- Verify Google Auth is enabled in Firebase
- Check authorized domains
- Ensure proper OAuth configuration

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📞 Support

For support and questions:
- Create an issue in the repository
- Check the [Firebase Setup Guide](./FIREBASE_SETUP_GUIDE.md)
- Review the troubleshooting section

## 🔄 Changelog

### v1.0.0
- Initial release with Firebase integration
- Role-based authentication
- Email verification
- Google Sign-In
- Admin and user dashboards
- Loading animations and UX improvements

# BetaMoney Web App

BetaMoney is a simple reimbursement tracking web application designed for Beta Theta Pi fraternity chapters. Members can submit reimbursement requests with receipt photos, and treasurers can approve or mark them as pending with a single click.

## Features

### For Members (Guests)
- Quick sign-in with email and name
- Submit reimbursement requests with receipt photos
- View personal request history
- Real-time status updates (Pending/Approved)

### For Treasurers (Owners)
- Secure login with credentials
- View all chapter requests
- Filter requests by status (All/Pending/Approved)
- One-click status updates
- Full-screen receipt viewing

## Demo Credentials

**Treasurer Login:**
- Email: `treasurer@betathetapi.com`
- Password: `BetaMoney2024!`

**Member Login:**
- Any email and name (creates anonymous account)

## Tech Stack

- **Frontend**: React 18 with TypeScript
- **Styling**: Pure CSS with CSS Variables
- **Backend**: Firebase (Auth, Firestore, Storage)
- **Build Tool**: Create React App
- **Deployment**: Can be deployed to any static hosting service

## Setup Instructions

### Prerequisites
- Node.js 16+ and npm
- Firebase account

### 1. Install Dependencies
```bash
cd betamoney-web
npm install
```

### 2. Firebase Setup

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project (or use existing)
3. Add a web app to your project
4. Copy your Firebase configuration
5. Update `src/services/firebase.ts` with your config:

```typescript
const firebaseConfig = {
  apiKey: "your-api-key",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "123456789",
  appId: "your-app-id"
};
```

### 3. Firebase Configuration

Enable the following services in your Firebase project:

#### Authentication
- Go to Authentication → Sign-in method
- Enable "Email/Password"
- Enable "Anonymous"

#### Firestore Database
- Go to Firestore Database
- Create database in test mode
- Set up these security rules:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can read/write their own user document
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Requests can be read by the user who created them or owners
    match /requests/{requestId} {
      allow read: if request.auth != null && 
        (resource.data.userId == request.auth.uid || 
         get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'owner');
      
      // Only the user who created the request can write to it initially
      allow create: if request.auth != null && request.auth.uid == resource.data.userId;
      
      // Only owners can update status
      allow update: if request.auth != null && 
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'owner';
    }
  }
}
```

#### Storage
- Go to Storage
- Set up these security rules:

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /receipts/{requestId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null;
    }
  }
}
```

### 4. Treasurer Account Setup

In Firebase Authentication:
1. Go to Authentication → Users
2. Add user with email: `treasurer@betathetapi.com` and password: `BetaMoney2024!`
3. Note the UID
4. In Firestore, create a document in the `users` collection:
   - Document ID: `[the UID from step 3]`
   - Fields:
     ```
     email: "treasurer@betathetapi.com"
     name: "Treasurer"
     role: "owner"
     createdAt: [current timestamp]
     ```

### 5. Run the Application

```bash
npm start
```

The app will open at `http://localhost:3000`

### 6. Build for Production

```bash
npm run build
```

This creates a `build` folder with optimized production files.

## Deployment

### Firebase Hosting (Recommended)
```bash
npm install -g firebase-tools
firebase login
firebase init hosting
npm run build
firebase deploy
```

### Other Hosting Services
The app can be deployed to any static hosting service:
- Netlify
- Vercel
- GitHub Pages
- AWS S3 + CloudFront

Simply upload the contents of the `build` folder.

## Project Structure

```
src/
├── components/
│   ├── Login.tsx              # Authentication UI
│   ├── RequestsList.tsx       # Main list view
│   ├── NewRequest.tsx         # Request submission form
│   └── RequestDetail.tsx      # Detailed view with approval
├── hooks/
│   └── useAuth.ts             # Authentication hook
├── services/
│   ├── firebase.ts            # Firebase configuration
│   ├── authService.ts         # Authentication logic
│   └── firestoreService.ts    # Database operations
├── types/
│   └── index.ts               # TypeScript types
├── styles/
│   └── App.css                # All styles
└── App.tsx                    # Main app component
```

## Key Features

- **Real-time Updates**: Uses Firestore listeners for live data
- **Responsive Design**: Works on desktop, tablet, and mobile
- **Image Upload**: Direct upload to Firebase Storage
- **Role-based Access**: Different UI for members vs treasurers
- **Modern UI**: Clean design with Beta Theta Pi branding
- **TypeScript**: Full type safety throughout the app

## Customization

### Branding
Update CSS variables in `src/styles/App.css`:
```css
:root {
  --beta-navy: #003366;
  --beta-crimson: #B31B1B;
}
```

### Treasurer Credentials
Update in `src/services/authService.ts`:
```typescript
const TREASURER_EMAIL = 'your-treasurer@email.com';
const TREASURER_PASSWORD = 'YourSecurePassword';
```

## Troubleshooting

### Common Issues

1. **Firebase not configured**: Ensure firebase config is correct
2. **Authentication fails**: Check Firebase Auth is enabled
3. **Permission denied**: Verify Firestore security rules
4. **Images not uploading**: Check Storage rules and file size limits

### Development
- Check browser console for errors
- Use Firebase Console to monitor data
- Test with different user roles

## Future Enhancements

- Push notifications for status changes
- Bulk approval functionality
- Export/reporting features
- Mobile app (React Native)
- Receipt text recognition (OCR)
- Integration with accounting software

## Support

For technical support, check the Firebase documentation or create an issue in the repository.

## License

This project is designed specifically for Beta Theta Pi fraternity chapters.

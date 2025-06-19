# BetaMoney iOS App

BetaMoney is a simple reimbursement tracking app designed for Beta Theta Pi fraternity chapters. Members can submit reimbursement requests with receipt photos, and treasurers can approve or mark them as pending with a single tap.

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
- One-tap status updates
- Full-screen receipt viewing

## Demo Credentials

**Treasurer Login:**
- Email: `treasurer@betathetapi.com`
- Password: `BetaMoney2024!`

**Member Login:**
- Any email and name (creates anonymous account)

## Screenshots

*Coming soon...*

## Setup Instructions

### Prerequisites
- Xcode 15.0 or later
- iOS 16.0 or later
- Firebase account

### 1. Clone the Repository
```bash
git clone <repository-url>
cd BetaMoney
```

### 2. Firebase Setup

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project (or use existing)
3. Add an iOS app with bundle ID: `com.betathetapi.betamoney`
4. Download `GoogleService-Info.plist`
5. Replace the placeholder file in the project with your downloaded file

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

### 5. Build and Run

1. Open `BetaMoney.xcodeproj` in Xcode
2. Select your development team in project settings
3. Build and run on simulator or device

## Architecture

### Technology Stack
- **Frontend**: SwiftUI (iOS 16+)
- **Backend**: Firebase (Auth, Firestore, Storage)
- **Architecture**: MVVM with ObservableObject managers

### Project Structure
```
BetaMoney/
├── BetaMoneyApp.swift          # App entry point
├── ContentView.swift           # Main navigation controller
├── Views/
│   ├── LoginView.swift         # Authentication UI
│   ├── RequestsListView.swift  # Main list view
│   ├── NewRequestView.swift    # Request submission form
│   ├── RequestDetailView.swift # Detailed view with approval
│   └── ImagePickerView.swift   # Camera/library picker
├── Models/
│   ├── User.swift              # User data model
│   └── ReimbursementRequest.swift # Request data model
├── Managers/
│   ├── AuthenticationManager.swift # Auth logic
│   └── FirestoreManager.swift      # Database operations
└── Assets.xcassets/            # App resources
```

### Key Components

- **AuthenticationManager**: Handles user login, role management, and session state
- **FirestoreManager**: Manages all database operations (CRUD for users and requests)
- **LoginView**: Beta Theta Pi branded login with guest/treasurer modes
- **RequestsListView**: Dynamic list showing different UI based on user role
- **NewRequestView**: Comprehensive form with image upload capability
- **RequestDetailView**: Full request details with treasurer approval controls

## Customization

### Branding
- Colors are defined using Beta Theta Pi official colors:
  - Navy: `#003366`
  - Crimson: `#B31B1B`
- Logo placeholder uses SF Symbols (replace with actual fraternity crest)

### Treasurer Credentials
Update the hard-coded credentials in `AuthenticationManager.swift`:
```swift
private let treasurerEmail = "your-treasurer@email.com"
private let treasurerPassword = "YourSecurePassword"
```

## Troubleshooting

### Common Issues

1. **Firebase not configured**: Ensure `GoogleService-Info.plist` is properly added
2. **Authentication fails**: Check Firebase Auth is enabled with correct methods
3. **Firestore permission denied**: Verify security rules are correctly set
4. **Images not uploading**: Ensure Storage rules allow read/write access

### Debug Mode
The app includes console logging for debugging. Check Xcode console for error messages.

## Future Enhancements

- Push notifications for status changes
- Export functionality for approved requests
- Multi-chapter support
- Payment integration (Venmo/ACH)
- Analytics dashboard
- Receipt text recognition (OCR)

## Support

For technical support or questions about this implementation, please refer to the Firebase documentation or create an issue in this repository.

## License

This project is designed specifically for Beta Theta Pi fraternity chapters. Please respect the fraternity's brand guidelines when using or modifying this code.
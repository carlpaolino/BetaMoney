# BetaMoney - Beta Theta Pi Reimbursement Tracker

A simple, lightweight web app for Beta Theta Pi fraternity chapters to track reimbursement requests. Built with React and TypeScript, using local storage for data persistence.

## ✨ Features

### For Members
- Quick sign-in with email and name
- Submit reimbursement requests with receipt photos
- View personal request history
- Real-time status updates

### For Treasurers
- Secure login with credentials
- View all chapter requests
- Filter requests by status (Pending/Approved)
- One-click status updates
- Full-screen receipt viewing

## 🚀 Demo Credentials

**Treasurer Login:**
- Email: `treasurer@betathetapi.com`
- Password: `BetaMoney2024!`

**Member Login:**
- Any email and name (creates a guest account)

## 🛠️ Tech Stack

- **Frontend**: React 18 with TypeScript
- **Styling**: Pure CSS with CSS Variables
- **Storage**: Browser Local Storage (no backend required!)
- **Build**: Create React App
- **Deployment**: Vercel (or any static hosting)

## ⚡ Quick Start

### 1. Clone and Install
```bash
git clone https://github.com/your-username/BetaMoney.git
cd BetaMoney
npm install
```

### 2. Run Locally
```bash
npm start
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 3. Build for Production
```bash
npm run build
```

## 🌐 Deploy to Vercel (Recommended)

### Option 1: Deploy with Vercel CLI
```bash
# Install Vercel CLI
npm install -g vercel

# Deploy (first time)
vercel

# Follow the prompts:
# - Set up and deploy? Y
# - Which scope? (your account)
# - Link to existing project? N
# - Project name? betamoney (or your choice)
# - Directory? ./ 
# - Want to override settings? N

# Deploy updates
vercel --prod
```

### Option 2: Deploy with GitHub Integration
1. Push your code to GitHub
2. Go to [vercel.com](https://vercel.com)
3. Click "New Project"
4. Import your GitHub repository
5. Deploy with default settings
6. Your app will be live at `https://your-project.vercel.app`

## 🔧 Other Deployment Options

### Netlify
1. Run `npm run build`
2. Drag the `build` folder to [netlify.com/drop](https://app.netlify.com/drop)

### GitHub Pages
```bash
npm install --save-dev gh-pages

# Add to package.json scripts:
"homepage": "https://yourusername.github.io/BetaMoney",
"predeploy": "npm run build",
"deploy": "gh-pages -d build"

# Deploy
npm run deploy
```

## 📁 Project Structure

```
src/
├── components/           # React components
│   ├── Login.tsx        # Authentication UI
│   ├── RequestsList.tsx # Main dashboard
│   ├── NewRequest.tsx   # Request form
│   └── RequestDetail.tsx# Detailed view
├── services/
│   ├── authService.ts   # Authentication logic
│   └── localStorageService.ts # Data persistence
├── hooks/
│   └── useAuth.ts       # Auth state management
├── utils/               # Helper functions
│   ├── formatters.ts    # Date/currency formatting
│   └── validators.ts    # Form validation
├── types/
│   └── index.ts         # TypeScript definitions
├── constants/
│   └── index.ts         # App constants
└── styles/
    └── App.css          # All styling
```

## 🎨 Customization

### Update Branding
Edit `src/constants/index.ts`:
```typescript
export const BETA_COLORS = {
  NAVY: '#003366',      // Your primary color
  CRIMSON: '#B31B1B',   // Your accent color
  // ...
};
```

### Change Treasurer Credentials
Edit `src/constants/index.ts`:
```typescript
export const TREASURER_CREDENTIALS = {
  EMAIL: 'your-treasurer@email.com',
  PASSWORD: 'YourSecurePassword'
};
```

## 📱 How It Works

### Data Storage
- **Local Storage**: All data is stored in the browser's local storage
- **No Backend**: No server or database required
- **Per-Device**: Data is specific to each browser/device
- **Demo Data**: Includes sample requests for demonstration

### User Roles
- **Guests**: Can create and view their own requests
- **Treasurers**: Can view all requests and change statuses

### Image Handling
- Receipt images are converted to base64 and stored locally
- Full-screen viewing with modal overlay
- File size validation (max 5MB)

## 🔒 Security Notes

- This is a **demo/prototype application**
- Data is stored locally in the browser (not shared between devices)
- For production use, consider implementing proper authentication and a backend database
- Treasurer credentials are hard-coded for demonstration purposes

## 🎯 Perfect For

- ✅ Chapter demonstrations and prototyping
- ✅ Small chapters with simple needs
- ✅ Quick deployment without backend setup
- ✅ Local/offline usage scenarios

## 🚫 Limitations

- Data is not synchronized between devices
- No real user authentication (demo only)
- Limited to browser storage capacity
- No data backup/restore features

## 🔮 Future Enhancements

For production use, consider:
- Real user authentication system
- Cloud database (Firebase, Supabase, etc.)
- Multi-device synchronization
- Data export/backup features
- Push notifications
- Receipt OCR text recognition

## 📄 License

This project is designed specifically for Beta Theta Pi fraternity chapters.

---

**🏛️ Built with pride for Beta Theta Pi** 

*Men of Principle*

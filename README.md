
# Committee Donation Form

> **A secure, real-time donation management portal for temple committee members**

[![Firebase](https://img.shields.io/badge/Firebase-12.1.0-orange.svg)](https://firebase.google.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

## 📋 Table of Contents
- [Description](#description)
- [Features](#features)
- [Architecture](#architecture)
- [Technologies](#technologies)
- [Setup](#setup)
- [Security](#security)
- [Usage](#usage)
- [Deployment](#deployment)
- [Project Structure](#project-structure)
- [Contributing](#contributing)
- [License](#license)

## 🌟 Description

A full-stack web application built for managing committee member donations for храм श्री मत् पर्वत वर्धनि समेत श्री रामलिंगेश्वर स्वामि देवस्थानं, Nag#### Features

### 🔐 **User Authentication**
- Sign up with email verification
- Secure login with Firebase Authentication
- Password update for new users
- Email verification resend functionality
- Protected routes and data access

### 💰 **Donation Management**
- **Dual donation types**: Cash donations and In-kind contributions
- Form validation for all fields (name, city, gothra, amount, phone)
- Confirmation step before saving
- Real-time data sync with Firestore
- Edit and delete capabilities for submitted records

### 📊 **Data Visualization**
- Sortable submissions table (by amount or date)
- Search and filter functionality
- Date range filtering
- Export to Excel (XLSX format)
- Total amount calculation

### 🎨 **UI/UX Enhancements**
- Background slideshow with Ken Burns effect
- Progress bar for form steps
- Floating notifications for user feedback
- Responsive design (mobile-first approach)
- Shake animation on errors
- Glass-morphism design patterns

### 🔗 **Integration**
- **WhatsApp API**: Share donation confirmations via WhatsApp
- **Firebase Services**: Authentication + Firestore + Hosting
- **Progressive Web App**: Service worker for offline capability

---

## 🏗️ Architecture

```mermaid
graph TB
    subgraph "Client Side"
        A[User Browser]
        B[index.html]
        C[styles/main.css]
        D[utils/validators.js]
        E[utils/sanitizers.js]
        F[Service Worker]
    end
    
    subgraph "Firebase Platform"
        G[Firebase Hosting]
        H[Firebase Auth]
        I[Firestore DB]
        J[Analytics]
    end
    
    subgraph "External Services"
        K[WhatsApp API]
        L[Email Service]
    end
    
    A -->|HTTPS| B
    B --> C
    B --> D
    B --> E
    B --> F
    
    B -->|Auth Requests| H
    B -->|Data CRUD| I
    B -->|Track Events| J
    H -->|Verification| L
    B -->|Share| K
    
    G -->|Serves| B
    
    subgraph "Firestore Collections"
        M[CommitteeMembers/{email}]
        N[Submissions/{id}]
        O[InKindDonations/{id}]
    end
    
    I --> M
    M --> N
    M --> O
    
    style A fill:#e1f5ff
    style G fill:#ffa726
    style H fill:#ffa726
    style I fill:#ffa726
    style K fill:#25d366
```

### Data Flow

1. **Authentication**: User signs up → Email verification → Login → Access granted
2. **Donation Submission**: Fill form → Validate → Confirm → Save to Firestore → WhatsApp share
3. **Data Retrieval**: Load from Firestore → Apply filters/sort → Display in table → Export option

---

## 🛠️ Technologies

| Category | Technology | Version | Purpose |
|----------|-----------|---------|---------|
| **Frontend** | HTML5, CSS3, JavaScript (ES6+) | - | Core web technologies |
| **Fonts** | Google Fonts (Poppins, Laila) | - | Typography |
| **Icons** | Font Awesome | 6.0.0-beta3 | UI icons |
| **Backend (BaaS)** | Firebase SDK (Modular) | 12.1.0 | Authentication & Database |
| **Database** | Cloud Firestore | - | NoSQL document database |
| **Data Export** | XLSX.js | 0.18.5 | Excel file generation |
| **Hosting** | Firebase Hosting | - | Static site hosting |
| **CI/CD** | GitHub Actions | - | Automated deployment |

---

## ⚙️ Setup

### Prerequisites
- Node.js (v20+ recommended for Firebase CLI)
- Firebase CLI: `npm install -g firebase-tools`
- Git (for version control)
- A Firebase project ([Create one here](https://console.firebase.google.com/))

### Installation Steps

1. **Clone the Repository**
   ```bash
   git clone https://github.com/mvsabhishek96/parvathavardhini2025.git
   cd parvathavardhini2025
   ```

2. **Firebase Configuration**
   
   - Copy `.env.example` to `.env`:
     ```bash
     cp .env.example .env
     ```
   
   - Fill in your Firebase credentials in `.env` (get these from Firebase Console → Project Settings → Your Apps):
     ```env
     VITE_FIREBASE_API_KEY=your_actual_api_key
     VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
     VITE_FIREBASE_PROJECT_ID=your_project_id
     # ... etc
     ```
   
   - **Note**: Never commit `.env` to version control! It's already in `.gitignore`.

3. **Set Up Firestore Security Rules**
   
   The `firestore.rules` file contains security rules. Deploy them:
   ```bash
   firebase login
   firebase use --add  # Select your project
   firebase deploy --only firestore:rules
   ```

4. **Local Development**
   
   Open `public/index.html` in a browser or use a local server:
   ```bash
   # Option 1: Python
   python3 -m http.server 8080
   
   # Option 2: Node.js (install globally first: npm i -g http-server)
   http-server public -p 8080
   ```
   
   Visit: `http://localhost:8080`

---

## 🔒 Security

### Implemented Security Measures

✅ **Firestore Security Rules**: Row-level security ensuring users can only access their own data  
✅ **Email Verification**: Required before accessing the application  
✅ **Input Sanitization**: All user inputs are sanitized to prevent XSS attacks  
✅ **Authentication Required**: All database operations require authentication  
✅ **Environment Variables**: Sensitive credentials separated from code  

### Security Best Practices

1. **API Key Protection**: 
   - API keys should be restricted in Firebase Console → Settings → API restrictions
   - Add your domain to authorized domains only

2. **Rules Testing**: 
   - Test Firestore rules using Firebase Emulator Suite
   ```bash
   firebase emulators:start
   ```

3. **Regular Updates**: 
   - Keep Firebase SDK updated: Check [Firebase Release Notes](https://firebase.google.com/support/release-notes/js)

---

## 🚀 Usage

### For Committee Members

1. **First Time Setup**
   - Navigate to the application URL
   - Click "Sign up"
   - Enter your details (name, mobile, email, password)
   - Verify your email via the link sent
   - Log in with verified credentials

2. **Submit a Donation**
   - Choose donation type (Cash / In-Kind)
   - Fill in donor details
   - Confirm the information
   - Click "Save & WhatsApp" to record and share

3. **View & Manage Submissions**
   - Click "View Submissions"
   - Use filters to search by name, city, phone, or date range
   - Sort by amount or date
   - Edit or delete entries as needed
   - Export data to Excel

4. **Logout**
   - Click "Logout" button to securely end your session

---

## 📦 Deployment to Firebase Hosting

### Manual Deployment

```bash
# 1. Initialize Firebase (one-time setup)
firebase init hosting
# - Select your project
# - Set public directory to 'public'
# - Configure as single-page app: No
# - Don't overwrite index.html

# 2. Deploy
firebase deploy --only hosting

# 3. Access your site
# URL will be: https://your-project-id.web.app
```

### Automated Deployment (GitHub Actions)

The repository includes `.github/workflows/deploy.yml` for CI/CD:

1. **Setup**:
   - Generate Firebase token: `firebase login:ci`
   - Add token to GitHub: Settings → Secrets → Actions → New secret
   - Name: `FIREBASE_TOKEN`
   - Value: (paste token)

2. **Trigger**:
   - Push to `main` branch automatically deploys
   - Monitor: Actions tab in GitHub

---

## 📁 Project Structure

```
parvathavardhini2025/
├── .github/
│   └── workflows/
│       └── deploy.yml         # CI/CD GitHub Actions workflow
├── public/
│   ├── icons/                 # PWA icons
│   ├── images/                # Background slideshow images
│   ├── styles/
│   │   └── main.css          # ✨ Main stylesheet
│   ├── utils/
│   │   ├── validators.js     # ✨ Input validation utilities
│   │   └── sanitizers.js     # ✨ Data sanitization utilities
│   ├── index.html             # Main application (SPA)
│   ├── manifest.json          # PWA manifest
│   └── sw.js                  # Service worker
├── .env.example               # ✨ Environment variables template
├── .firebaserc                # Firebase project configuration
├── .gitignore                 # ✨ Enhanced to protect .env files
├── firebase.json              # Firebase hosting config
├── firestore.rules            # ✨ Updated security rules
├── README.md                  # This file
└── LICENSE                    # MIT License

✨ = Recently improved/added
```

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/YourFeature`
3. Commit your changes: `git commit -m 'Add YourFeature'`
4. Push to the branch: `git push origin feature/YourFeature`
5. Open a Pull Request

### Code Standards
- Follow existing code style
- Comment complex logic
- Test authentication and form flows before submitting

---

## 📄 License

MIT License. See [LICENSE](LICENSE) file for details.

---

## 👤 Developer

**Developed by**: mvsabhishek96@gmail.com

For temple-related queries, contact:  
**Koonapuli Shyamala Durga Prasad** - 9949844807

---

## 📝 Recent Improvements (v2.0)

- ✅ **Security**: Fixed Firestore rules to properly protect user data
- ✅ **Organization**: Extracted CSS to separate file (reduced HTML from 1681 to ~1100 lines)
- ✅ **Utilities**: Created reusable validation and sanitization modules
- ✅ **Documentation**: Added comprehensive JSDoc comments
- ✅ **Best Practices**: Added .env.example for credential management
- ✅ **Architecture**: Improved code structure with clear separation of concerns

---

## 🔮 Future Enhancements
- [ ] Unit tests for validation/sanitization utilities
- [ ] Admin dashboard for aggregated reporting
- [ ] SMS notifications via Twilio
- [ ] Multi-language support (Telugu/English)
- [ ] Receipt generation (PDF)

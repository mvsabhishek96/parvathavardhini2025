
# Committee Donation Form

This is a single-page web application built for managing committee member donations. It allows users to register, log in, submit donations, view and edit their submissions, export data to XLSX, and redirect to WhatsApp for confirmation messages. The app uses Firebase for authentication and data storage, with a modern UI featuring animations, notifications, and a background slideshow.

## Description

The app is designed for committee members to record donations securely. Key workflows include:
- User authentication (sign up, login, email verification, password setting).
- Donation submission with validation and confirmation.
- Viewing submissions sorted by amount, with editing capabilities.
- Exporting submissions to Excel.
- WhatsApp integration for sharing donation details.

The codebase is contained in a single `index.html` file with inline CSS and JavaScript for simplicity, making it easy to deploy as a static site on Firebase Hosting.

## Features

- **User Authentication**:
  - Sign up with email verification.
  - Login with password.
  - Password update for new users.
  - Resend verification email.
  - Secure logout.

- **Donation Submission**:
  - Form with validation for name, city, gothra, amount, and phone number.
  - Confirmation step before saving.
  - Data saved to Firestore.

- **Submission Management**:
  - View submissions in a table sorted by amount (descending).
  - Edit individual submissions.
  - Cancel edit and return to view.

- **Data Export**:
  - Download submissions as XLSX file.

- **UI/UX Enhancements**:
  - Background slideshow on login page.
  - Progress bar for form steps.
  - Floating notifications for success/error.
  - Responsive design for mobile/desktop.
  - Shake animation on errors.

- **Integration**:
  - Firebase Authentication and Firestore for backend.
  - WhatsApp API for sharing donation details.

## Technologies

- **Frontend**: HTML5, CSS3, JavaScript (ES6+).
- **Fonts**: Google Fonts (Poppins).
- **Icons**: Font Awesome.
- **Libraries**:
  - Firebase SDK v9.6.1 (Modular): Authentication, Firestore.
  - XLSX.js: For Excel export.
- **Deployment**: Firebase Hosting.
- **Security**: Firestore Security Rules (requires configuration in `firestore.rules`).

## Setup

1. **Prerequisites**:
   - Node.js (v20+ for Firebase CLI compatibility).
   - Firebase CLI: Install with `npm install -g firebase-tools`.
   - Git (for version control).

2. **Clone the Repository**:
   ```bash
   git clone https://github.com/mvsabhishek96/parvathavardhini2025.git
   cd parvathavardhini2025
   ```

3. **Install Dependencies**:
   - No npm dependencies are needed, as libraries are loaded via CDN. However, for local development, ensure you have a web server (e.g., `live-server` via `npm install -g live-server`).

4. **Firebase Configuration**:
   - Open `index.html` and replace the `firebaseConfig` object (line 661) with your Firebase project's credentials.
   - Set up Firestore Security Rules (in `firestore.rules`):
     ```plaintext
     rules_version = '2';
     service cloud.firestore {
       match /databases/{database}/documents {
         match /Submissions/{document} {
           allow read: if request.auth != null && request.auth.token.email == resource.data.committeeMember;
           allow write: if request.auth != null && request.resource.data.committeeMember == request.auth.token.email;
         }
       }
     }
     ```
   - Deploy rules: `firebase deploy --only firestore:rules`.

5. **Local Development**:
   - Run a local server: `live-server` (opens at `http://127.0.0.1:8080`).
   - Test login, submission, view, and export features.

## Usage

1. **Login/Sign Up**:
   - Sign up with an email and password; verify via the sent email.
   - Log in with verified credentials.

2. **Submit Donation**:
   - Fill in the form and submit.
   - Confirm details and save/send via WhatsApp.

3. **View Submissions**:
   - Click "View Submissions" to see a table sorted by amount (highest first).
   - Edit entries from the table.

4. **Export Data**:
   - Click "Export" to download an XLSX file.

## Deployment to Firebase Hosting

1. **Initialize Firebase**:
   - Run `firebase init hosting` and select your project.
   - Set `public` directory to `.` (or your folder with `index.html`).

2. **Manual Deployment**:
   - Run `firebase deploy --only hosting`.
   - Access at the provided URL (e.g., `https://your-project-id.web.app`).

3. **Automated Deployment (GitHub Actions)**:
   - The repository includes `.github/workflows/deploy.yml` for CI/CD.
   - Set `FIREBASE_TOKEN` secret in GitHub Settings > Secrets > Actions.
   - Pushes to `main` trigger deployment.

## Architecture Diagram

Below is a simple ASCII diagram illustrating the app's architecture. For a more detailed visual, you can use tools like Lucidchart or draw.io.

```
+---------------+    +----------------+
|  User Browser |    | Firebase Hosting |
|  (index.html) | <-->|  (Static Files)  |
+---------------+    +----------------+
          ^                    ^
          |                    |
          v                    v
+---------------+    +----------------+
| Firebase Auth |    | Firestore DB   |
| (Login/Signup)|    | (Submissions)  |
+---------------+    +----------------+

Flow:
1. User interacts with HTML/CSS/JS in browser.
2. Auth with Firebase for login.
3. Submit data to Firestore.
4. View/Edit data from Firestore.
5. Export to XLSX locally in browser.
6. WhatsApp redirect for sharing.
```

## Contributing

1. Fork the repository.
2. Create a branch: `git checkout -b feature/YourFeature`.
3. Commit changes: `git commit -m 'Add feature'`.
4. Push: `git push origin feature/YourFeature`.
5. Open a Pull Request.

## License

MIT License. See LICENSE file for details.

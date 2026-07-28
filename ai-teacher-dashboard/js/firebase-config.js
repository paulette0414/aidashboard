// ============================================================
// FIREBASE CONFIGURATION
// ------------------------------------------------------------
// This file uses the Firebase "compat" SDK (loaded via <script>
// tags in index.html / dashboard.html / etc.), so it must NOT
// contain any `import ...` statements or `initializeApp(...)`
// calls from the modular SDK snippet Firebase's console shows
// by default. Only the firebaseConfig object below should be
// pasted in from your Firebase project.
// ============================================================

// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCk02KegaPtYWd6KoH_hI9hx-pCr0zYjck",
  authDomain: "ai-teacher-tools-1c6f3.firebaseapp.com",
  databaseURL: "https://ai-teacher-tools-1c6f3-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "ai-teacher-tools-1c6f3",
  storageBucket: "ai-teacher-tools-1c6f3.firebasestorage.app",
  messagingSenderId: "966466300018",
  appId: "1:966466300018:web:d4d6277ec5d16eb903baeb"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// ------------------------------------------------------------
// ADMIN EMAILS
// Any email address listed here automatically becomes an Admin
// the moment they sign up: their account is auto-approved and
// they can open the Admin panel to approve/reject other
// teachers. Add every admin's email here (must match the email
// they sign up with).
// ------------------------------------------------------------
const ADMIN_EMAILS = [
  "leopoldo.mago@deped.gov.ph"
];

// ------------------------------------------------------------
// Do not edit below this line
// ------------------------------------------------------------
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();

function isAdminEmail(email) {
  if (!email) return false;
  return ADMIN_EMAILS.map(e => e.toLowerCase()).includes(email.toLowerCase());
}

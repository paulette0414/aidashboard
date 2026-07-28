// ============================================================
// FIREBASE CONFIGURATION  —  EDIT THIS FILE FIRST
// ------------------------------------------------------------
// 1. Go to https://console.firebase.google.com and create a
//    free project (the Spark/free plan is enough, no credit
//    card required).
// 2. Project settings (gear icon) > General > "Your apps" >
//    Add app > Web (</> icon). Register the app.
// 3. Firebase will show you a firebaseConfig object. Copy each
//    value into the object below, replacing the placeholders.
// 4. In the left menu, open:
//      Build > Authentication > Get started > Sign-in method
//      > Email/Password > Enable > Save
//    Build > Firestore Database > Create database
//      (choose "Start in production mode", any region)
// 5. Full walkthrough with screensh<->step numbers is in
//    SETUP_GUIDE.md at the root of this project.
// ============================================================

const firebaseConfig = {
  apiKey: "PASTE_YOUR_API_KEY_HERE",
  authDomain: "PASTE_YOUR_PROJECT_ID.firebaseapp.com",
  projectId: "PASTE_YOUR_PROJECT_ID",
  storageBucket: "PASTE_YOUR_PROJECT_ID.appspot.com",
  messagingSenderId: "PASTE_YOUR_SENDER_ID",
  appId: "PASTE_YOUR_APP_ID"
};

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

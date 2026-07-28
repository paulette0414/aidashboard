// ============================================================
// Logic for index.html (Sign in / Sign up)
// ============================================================

const loginForm = document.getElementById("loginForm");
const signupForm = document.getElementById("signupForm");
const showSignup = document.getElementById("showSignup");
const showLogin = document.getElementById("showLogin");
const loginPane = document.getElementById("loginPane");
const signupPane = document.getElementById("signupPane");

function setAlert(el, type, message) {
  if (!el) return;
  el.className = "alert " + type + " show";
  el.textContent = message;
}
function clearAlert(el) {
  if (!el) return;
  el.className = "alert";
  el.textContent = "";
}

if (showSignup) {
  showSignup.addEventListener("click", (e) => {
    e.preventDefault();
    loginPane.classList.add("hidden");
    signupPane.classList.remove("hidden");
  });
}
if (showLogin) {
  showLogin.addEventListener("click", (e) => {
    e.preventDefault();
    signupPane.classList.add("hidden");
    loginPane.classList.remove("hidden");
  });
}

// Show a message if we were bounced back here after rejection
(function checkQueryFlags() {
  const params = new URLSearchParams(window.location.search);
  const alertEl = document.getElementById("loginAlert");
  if (params.get("rejected") === "1") {
    setAlert(alertEl, "error", "Ang iyong request ay hindi in-approve ng admin. Makipag-ugnayan sa iyong admin kung mali ito.");
  }
})();

// ---------------- LOGIN ----------------
if (loginForm) {
  loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const alertEl = document.getElementById("loginAlert");
    clearAlert(alertEl);

    const email = document.getElementById("loginEmail").value.trim();
    const password = document.getElementById("loginPassword").value;
    const submitBtn = loginForm.querySelector("button[type=submit]");
    submitBtn.disabled = true;
    submitBtn.textContent = "Signing in...";

    try {
      const cred = await auth.signInWithEmailAndPassword(email, password);
      const uid = cred.user.uid;
      const snap = await db.collection("users").doc(uid).get();

      if (!snap.exists) {
        // Safety net: create a pending profile if one is somehow missing
        await db.collection("users").doc(uid).set({
          name: cred.user.displayName || email.split("@")[0],
          email: email,
          status: isAdminEmail(email) ? "approved" : "pending",
          role: isAdminEmail(email) ? "admin" : "teacher",
          createdAt: firebase.firestore.FieldValue.serverTimestamp()
        });
      }

      const profile = (await db.collection("users").doc(uid).get()).data();

      if (profile.status === "rejected") {
        await auth.signOut();
        setAlert(alertEl, "error", "Ang account na ito ay hindi in-approve. Makipag-ugnayan sa admin.");
        return;
      }
      if (profile.status === "pending") {
        window.location.href = "pending.html";
        return;
      }
      window.location.href = "dashboard.html";
    } catch (err) {
      console.error(err);
      setAlert(alertEl, "error", friendlyAuthError(err));
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = "Sign In";
    }
  });
}

// ---------------- SIGN UP ----------------
if (signupForm) {
  signupForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const alertEl = document.getElementById("signupAlert");
    clearAlert(alertEl);

    const name = document.getElementById("signupName").value.trim();
    const email = document.getElementById("signupEmail").value.trim();
    const password = document.getElementById("signupPassword").value;
    const confirm = document.getElementById("signupConfirm").value;
    const submitBtn = signupForm.querySelector("button[type=submit]");

    if (password !== confirm) {
      setAlert(alertEl, "error", "Hindi magkatugma ang password at confirm password.");
      return;
    }
    if (password.length < 6) {
      setAlert(alertEl, "error", "Dapat hindi bababa sa 6 characters ang password.");
      return;
    }

    submitBtn.disabled = true;
    submitBtn.textContent = "Creating account...";

    try {
      const cred = await auth.createUserWithEmailAndPassword(email, password);
      await cred.user.updateProfile({ displayName: name });

      const admin = isAdminEmail(email);
      await db.collection("users").doc(cred.user.uid).set({
        name: name,
        email: email,
        status: admin ? "approved" : "pending",
        role: admin ? "admin" : "teacher",
        createdAt: firebase.firestore.FieldValue.serverTimestamp()
      });

      if (admin) {
        window.location.href = "dashboard.html";
      } else {
        window.location.href = "pending.html";
      }
    } catch (err) {
      console.error(err);
      setAlert(alertEl, "error", friendlyAuthError(err));
      submitBtn.disabled = false;
      submitBtn.textContent = "Create Account";
    }
  });
}

function friendlyAuthError(err) {
  const code = err && err.code;
  switch (code) {
    case "auth/invalid-email": return "Hindi valid ang email address.";
    case "auth/user-not-found": return "Walang account na nakarehistro sa email na iyan.";
    case "auth/wrong-password": return "Maling password.";
    case "auth/invalid-credential": return "Maling email o password.";
    case "auth/email-already-in-use": return "May account na gamit ang email na iyan. Mag-sign in na lang.";
    case "auth/weak-password": return "Masyadong mahina ang password (min. 6 characters).";
    case "auth/network-request-failed": return "May problema sa koneksyon. Subukan ulit.";
    case "auth/api-key-not-valid.-please-pass-a-valid-api-key.":
    case "auth/invalid-api-key":
      return "Hindi pa na-set up ang Firebase config (js/firebase-config.js). Tingnan ang SETUP_GUIDE.md.";
    default: return (err && err.message) ? err.message : "May naganap na error. Subukan ulit.";
  }
}

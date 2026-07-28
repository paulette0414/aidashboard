// ============================================================
// Shared helpers used by dashboard.html and admin.html
// Handles: route-guarding (must be logged in + approved),
// filling in the sidebar user chip, and logout.
// ============================================================

/**
 * Guards a protected page.
 * @param {Object} opts
 * @param {boolean} opts.requireAdmin - if true, non-admins get bounced to dashboard.html
 * @param {function(Object)} opts.onReady - called with {user, profile} once checks pass
 */
function guardPage(opts) {
  const { requireAdmin = false, onReady } = opts || {};

  auth.onAuthStateChanged(async (user) => {
    if (!user) {
      window.location.href = "index.html";
      return;
    }

    let profileSnap;
    try {
      profileSnap = await db.collection("users").doc(user.uid).get();
    } catch (err) {
      console.error("Failed to load profile:", err);
      window.location.href = "index.html";
      return;
    }

    if (!profileSnap.exists) {
      // No profile yet (shouldn't normally happen) -> send back to sign in
      window.location.href = "index.html";
      return;
    }

    const profile = profileSnap.data();

    if (profile.status === "rejected") {
      await auth.signOut();
      window.location.href = "index.html?rejected=1";
      return;
    }

    if (profile.status === "pending") {
      window.location.href = "pending.html";
      return;
    }

    if (requireAdmin && profile.role !== "admin") {
      window.location.href = "dashboard.html";
      return;
    }

    fillUserChip(user, profile);
    if (typeof onReady === "function") onReady({ user, profile });
  });
}

function fillUserChip(user, profile) {
  const nameEl = document.getElementById("chipName");
  const emailEl = document.getElementById("chipEmail");
  const avatarEl = document.getElementById("chipAvatar");
  const displayName = profile.name || user.email.split("@")[0];

  if (nameEl) nameEl.textContent = displayName;
  if (emailEl) emailEl.textContent = user.email;
  if (avatarEl) avatarEl.textContent = displayName.trim().charAt(0) || "T";

  const adminLink = document.getElementById("navAdminLink");
  if (adminLink) {
    if (profile.role === "admin") {
      adminLink.classList.remove("hidden");
    } else {
      adminLink.remove();
    }
  }
}

function wireLogout() {
  const btn = document.getElementById("logoutBtn");
  if (!btn) return;
  btn.addEventListener("click", async () => {
    await auth.signOut();
    window.location.href = "index.html";
  });
}

document.addEventListener("DOMContentLoaded", wireLogout);

function todayLabel() {
  const d = new Date();
  return d.toLocaleDateString("en-PH", { weekday: "long", year: "numeric", month: "long", day: "numeric" });
}

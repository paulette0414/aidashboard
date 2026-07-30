// ============================================================
// Logic for admin.html — user approval panel
// ============================================================

function renderRows(tbodyId, docs, kind) {
  const tbody = document.getElementById(tbodyId);
  tbody.innerHTML = "";

  if (docs.length === 0) {
    const emptyRow = document.createElement("tr");
    emptyRow.innerHTML = `<td colspan="6" class="empty-note">Walang laman sa listahan na ito.</td>`;
    tbody.appendChild(emptyRow);
    return;
  }

  docs.forEach((doc) => {
    const data = doc.data();
    const tr = document.createElement("tr");

    const createdAt = data.createdAt && data.createdAt.toDate
      ? data.createdAt.toDate().toLocaleDateString("en-PH", { year: "numeric", month: "short", day: "numeric" })
      : "—";

    let actionsHtml = "";
    if (kind === "pending") {
      actionsHtml = `
        <button class="btn-approve" data-uid="${doc.id}" data-action="approve">Approve</button>
        <button class="btn-reject" data-uid="${doc.id}" data-action="reject">Reject</button>`;
    } else if (kind === "approved") {
      actionsHtml = `<button class="btn-reject" data-uid="${doc.id}" data-action="reject">Revoke</button>`;
    } else if (kind === "rejected") {
      actionsHtml = `<button class="btn-approve" data-uid="${doc.id}" data-action="approve">Approve</button>`;
    }

    const receiptHtml = data.receiptImageBase64
      ? `<button class="receipt-badge has-receipt" data-receipt-uid="${doc.id}">🧾 Tingnan</button>`
      : `<button class="receipt-badge no-receipt" disabled>Wala pa</button>`;

    const daysHtml = kind === "approved" ? daysSinceApprovedHtml(data.approvedAt) : "—";

    tr.innerHTML = `
      <td><strong>${escapeHtml(data.name || "—")}</strong></td>
      <td>${escapeHtml(data.email || "—")}</td>
      <td>${createdAt}</td>
      <td>${daysHtml}</td>
      <td>${receiptHtml}</td>
      <td class="row-actions">${actionsHtml}</td>
    `;
    tbody.appendChild(tr);
  });

  tbody.querySelectorAll("button[data-action]").forEach((btn) => {
    btn.addEventListener("click", () => handleAction(btn.dataset.uid, btn.dataset.action));
  });

  tbody.querySelectorAll("button[data-receipt-uid]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const doc = docs.find((d) => d.id === btn.dataset.receiptUid);
      const data = doc && doc.data();
      if (data && data.receiptImageBase64) openReceiptModal(data.receiptImageBase64);
    });
  });
}

function daysSinceApprovedHtml(approvedAt) {
  if (!approvedAt || !approvedAt.toDate) {
    return `<span style="color:var(--text-muted);">—</span>`;
  }
  const approvedDate = approvedAt.toDate();
  const msPerDay = 1000 * 60 * 60 * 24;
  const days = Math.floor((Date.now() - approvedDate.getTime()) / msPerDay);

  if (days <= 0) {
    return `<span class="status-pill approved">Bagong-approve</span>`;
  }
  const label = days === 1 ? "1 araw" : `${days} araw`;
  return `<span class="status-pill ${days > 30 ? "rejected" : "approved"}">${label}</span>`;
}

function openReceiptModal(dataUrl) {
  const modal = document.getElementById("receiptModal");
  const img = document.getElementById("receiptModalImg");
  if (!modal || !img) return;
  img.src = dataUrl;
  modal.classList.remove("hidden");
}

function closeReceiptModal() {
  const modal = document.getElementById("receiptModal");
  if (modal) modal.classList.add("hidden");
}

document.addEventListener("DOMContentLoaded", () => {
  const closeBtn = document.getElementById("receiptModalClose");
  const overlay = document.getElementById("receiptModal");
  if (closeBtn) closeBtn.addEventListener("click", closeReceiptModal);
  if (overlay) overlay.addEventListener("click", (e) => { if (e.target === overlay) closeReceiptModal(); });
});

async function handleAction(uid, action) {
  const status = action === "approve" ? "approved" : "rejected";
  const update = { status };
  if (action === "approve") {
    // Stamp/refresh the approval date every time a user is (re-)approved,
    // so "days since approved" always counts from the most recent approval.
    update.approvedAt = firebase.firestore.FieldValue.serverTimestamp();
  }
  try {
    await db.collection("users").doc(uid).update(update);
    await loadUsers();
  } catch (err) {
    console.error(err);
    alert("Hindi na-update: " + (err.message || err));
  }
}

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

async function loadUsers() {
  const snap = await db.collection("users").get();
  const pending = [];
  const approved = [];
  const rejected = [];

  snap.forEach((doc) => {
    const data = doc.data();
    if (data.status === "pending") pending.push(doc);
    else if (data.status === "approved") approved.push(doc);
    else if (data.status === "rejected") rejected.push(doc);
  });

  document.getElementById("pendingCount").textContent = pending.length;
  document.getElementById("approvedCount").textContent = approved.length;
  document.getElementById("rejectedCount").textContent = rejected.length;

  renderRows("pendingBody", pending, "pending");
  renderRows("approvedBody", approved, "approved");
  renderRows("rejectedBody", rejected, "rejected");
}

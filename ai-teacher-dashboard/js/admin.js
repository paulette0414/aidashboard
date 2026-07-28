// ============================================================
// Logic for admin.html — user approval panel
// ============================================================

function renderRows(tbodyId, docs, kind) {
  const tbody = document.getElementById(tbodyId);
  tbody.innerHTML = "";

  if (docs.length === 0) {
    const emptyRow = document.createElement("tr");
    emptyRow.innerHTML = `<td colspan="4" class="empty-note">Walang laman sa listahan na ito.</td>`;
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

    tr.innerHTML = `
      <td><strong>${escapeHtml(data.name || "—")}</strong></td>
      <td>${escapeHtml(data.email || "—")}</td>
      <td>${createdAt}</td>
      <td class="row-actions">${actionsHtml}</td>
    `;
    tbody.appendChild(tr);
  });

  tbody.querySelectorAll("button[data-action]").forEach((btn) => {
    btn.addEventListener("click", () => handleAction(btn.dataset.uid, btn.dataset.action));
  });
}

async function handleAction(uid, action) {
  const status = action === "approve" ? "approved" : "rejected";
  try {
    await db.collection("users").doc(uid).update({ status });
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

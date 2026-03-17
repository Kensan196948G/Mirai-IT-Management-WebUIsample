const assets = [
  { name: "HQ-DB-01", category: "Hardware", status: "Active", owner: "Infra", renew: "2026-04-10" },
  { name: "Adobe CC Enterprise", category: "Software", status: "At Risk", owner: "Design", renew: "2026-03-31" },
  { name: "Core Switch A", category: "Network", status: "Maintenance", owner: "Network", renew: "2026-05-12" }
];
const software = [
  { name: "Microsoft 365 E3", license: "450 / 430", status: "Compliant" },
  { name: "Adobe CC", license: "120 / 118", status: "Near Limit" },
  { name: "Autodesk", license: "40 / 45", status: "Over" }
];
let alerts = [
  "ライセンス更新期限 7 日以内が 2 件",
  "重大アラート 1 件を監査対象に設定",
  "PowerShell エージェントのハートビート遅延"
];
const approvals = [
  "新規資産購入申請 2 件",
  "権限ロール変更申請 1 件",
  "調達契約更新レビュー 1 件"
];
const governance = [
  "JWT + RBAC",
  "MFA / TOTP",
  "監査ログのハッシュチェーン検証",
  "セキュリティイベント検知",
  "通知・招待フロー"
];
const state = { view: "overview", filter: "all" };
const qs = (s) => document.querySelector(s);
const qsa = (s) => Array.from(document.querySelectorAll(s));
const esc = (v) => String(v).replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;");

function filteredAssets() { return assets.filter((item) => state.filter === "all" || item.category === state.filter); }
function renderHero() {
  const items = [["資産", assets.length], ["ソフトウェア", software.length], ["統制項目", governance.length]];
  qs("#heroBadges").innerHTML = items.map(([label, value]) => `<div class="hero-badge"><strong>${esc(value)}</strong><span>${esc(label)}</span></div>`).join("");
}
function renderStats() {
  const stats = [
    ["アクティブ資産", assets.filter((a) => a.status === "Active").length, "運用中"],
    ["要対応", assets.filter((a) => a.status !== "Active").length, "保守/期限"],
    ["承認待ち", approvals.length, "workflow"],
    ["通知", alerts.length, "alert center"]
  ];
  qs("#statsGrid").innerHTML = stats.map(([label, value, note]) => `<article class="stat-card"><span class="meta">${esc(label)}</span><strong>${esc(value)}</strong><span class="meta">${esc(note)}</span></article>`).join("");
}
function renderOverview() {
  qs("#alertList").innerHTML = alerts.map((item) => `<div class="list-card"><span class="pill">Alert</span><p>${esc(item)}</p></div>`).join("");
  qs("#approvalList").innerHTML = approvals.map((item) => `<div class="list-card"><span class="pill">Approval</span><p>${esc(item)}</p></div>`).join("");
}
function renderLists() {
  qs("#assetList").innerHTML = filteredAssets().map((item) => `<div class="list-card"><strong>${esc(item.name)}</strong><p>${esc(item.owner)}</p><span class="pill">${esc(item.category)} / ${esc(item.status)} / ${esc(item.renew)}</span></div>`).join("");
  qs("#softwareList").innerHTML = software.map((item) => `<div class="list-card"><strong>${esc(item.name)}</strong><p>${esc(item.license)}</p><span class="pill">${esc(item.status)}</span></div>`).join("");
  qs("#governanceList").innerHTML = governance.map((item) => `<div class="list-card"><strong>${esc(item)}</strong><p>README 記載の統制機能</p><span class="pill">Security</span></div>`).join("");
}
function syncView() {
  const titles = { overview: "概要", assets: "資産", software: "ソフトウェア", governance: "統制" };
  qs("#pageTitle").textContent = titles[state.view];
  qsa(".nav-item").forEach((n) => n.classList.toggle("is-active", n.dataset.view === state.view));
  qsa(".view").forEach((v) => v.classList.toggle("is-active", v.id === `view-${state.view}`));
}
function render() { renderHero(); renderStats(); renderOverview(); renderLists(); syncView(); }
document.addEventListener("click", (e) => { const nav = e.target.closest("[data-view]"); if (nav) { state.view = nav.dataset.view; render(); } });
qs("#assetFilter").addEventListener("change", (e) => { state.filter = e.target.value; renderLists(); });
qs("#notifyBtn").addEventListener("click", () => { alerts = [`${new Date().toLocaleTimeString("ja-JP", { hour: "2-digit", minute: "2-digit" })} 通知サマリ更新`, ...alerts].slice(0, 4); render(); });
render();

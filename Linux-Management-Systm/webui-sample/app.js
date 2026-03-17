const modules = [
  { name: "System Servers", role: "Operator", status: "実装済み" },
  { name: "System Actions Log", role: "Viewer", status: "実装済み" },
  { name: "Users and Groups", role: "Admin", status: "実装済み" },
  { name: "Linux Firewall", role: "Approver", status: "実装済み" },
  { name: "Cluster SSH", role: "Admin", status: "計画中" },
  { name: "Command Shell", role: "なし", status: "禁止" }
];
let forbidden = [
  "任意コマンドの実行",
  "bash / sh の起動",
  "/etc 配下の直接編集",
  "sudo権限の直接追加",
  "危険文字を含む入力"
];
const fixes = [
  "全55ページのサイドバー修正",
  "API 500 エラー修正",
  "テスト高速化",
  "WebSocket 自動再接続",
  "vendor 化対応"
];
const roles = [
  "Viewer: 参照のみ",
  "Operator: 限定操作",
  "Approver: 危険操作承認",
  "Admin: 設定管理"
];
const approvals = [
  "申請内容の起案",
  "allowlist と影響範囲の確認",
  "Approver / Admin の承認",
  "wrapper 経由で実行し監査ログ記録"
];
const audits = [
  "shell=True を使用しない",
  "sudo は wrapper 経由のみ",
  "deny by default を維持",
  "操作証跡を JSON ログ化",
  "危険変更は人間レビュー必須"
];
const state = { view: "overview", role: "all" };
const qs = (s) => document.querySelector(s);
const qsa = (s) => Array.from(document.querySelectorAll(s));
const esc = (v) => String(v).replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;");

function filteredModules() { return modules.filter((m) => state.role === "all" || m.role === state.role); }
function renderHero() {
  const items = [["モジュール", modules.length], ["禁止操作", forbidden.length], ["監査観点", audits.length]];
  qs("#heroBadges").innerHTML = items.map(([label, value]) => `<div class="hero-badge"><strong>${esc(value)}</strong><span>${esc(label)}</span></div>`).join("");
}
function renderStats() {
  const stats = [
    ["実装済み", modules.filter((m) => m.status === "実装済み").length, "公開機能"],
    ["計画中", modules.filter((m) => m.status === "計画中").length, "今後拡張"],
    ["禁止", modules.filter((m) => m.status === "禁止").length, "設計上除外"],
    ["ロール", roles.length, "RBAC"]
  ];
  qs("#statsGrid").innerHTML = stats.map(([label, value, note]) => `<article class="stat-card"><span class="meta">${esc(label)}</span><strong>${esc(value)}</strong><span class="meta">${esc(note)}</span></article>`).join("");
}
function renderOverview() {
  qs("#forbiddenList").innerHTML = forbidden.map((item) => `<div class="list-card"><span class="pill">Deny</span><p>${esc(item)}</p></div>`).join("");
  qs("#fixList").innerHTML = fixes.map((item) => `<div class="list-card"><span class="pill">Fix</span><p>${esc(item)}</p></div>`).join("");
}
function renderLists() {
  qs("#moduleList").innerHTML = filteredModules().map((item) => `<div class="list-card"><strong>${esc(item.name)}</strong><p>${esc(item.role)}</p><span class="pill">${esc(item.status)}</span></div>`).join("");
  qs("#roleList").innerHTML = roles.map((item) => `<div class="list-card"><strong>${esc(item)}</strong><p>README のユーザーロール</p><span class="pill">role</span></div>`).join("");
  qs("#approvalList").innerHTML = approvals.map((item) => `<div class="list-card"><strong>${esc(item)}</strong><p>承認フロー</p><span class="pill">approval</span></div>`).join("");
  qs("#auditList").innerHTML = audits.map((item) => `<div class="list-card"><strong>${esc(item)}</strong><p>統制チェック</p><span class="pill">audit</span></div>`).join("");
}
function syncView() {
  const titles = { overview: "概要", modules: "モジュール", approvals: "承認", audit: "監査" };
  qs("#pageTitle").textContent = titles[state.view];
  qsa(".nav-item").forEach((n) => n.classList.toggle("is-active", n.dataset.view === state.view));
  qsa(".view").forEach((v) => v.classList.toggle("is-active", v.id === `view-${state.view}`));
}
function render() { renderHero(); renderStats(); renderOverview(); renderLists(); syncView(); }
document.addEventListener("click", (e) => { const nav = e.target.closest("[data-view]"); if (nav) { state.view = nav.dataset.view; render(); } });
qs("#roleFilter").addEventListener("change", (e) => { state.role = e.target.value; renderLists(); });
qs("#refreshBtn").addEventListener("click", () => { forbidden = [`${new Date().toLocaleTimeString("ja-JP", { hour: "2-digit", minute: "2-digit" })} deny ルール再確認`, ...forbidden].slice(0, 5); render(); });
render();

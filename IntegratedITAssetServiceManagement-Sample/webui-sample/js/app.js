const assets = [{ name: "HQ-DB-01", category: "Hardware", status: "Active", owner: "Infra", renew: "2026-04-10" }, { name: "Adobe CC Enterprise", category: "Software", status: "At Risk", owner: "Design", renew: "2026-03-31" }, { name: "Core Switch A", category: "Network", status: "Maintenance", owner: "Network", renew: "2026-05-12" }];
const software = [{ name: "Microsoft 365 E3", license: "450 / 430", status: "Compliant" }, { name: "Adobe CC", license: "120 / 118", status: "Near Limit" }, { name: "Autodesk", license: "40 / 45", status: "Over" }];
let alerts = ["ライセンス更新期限 7 日以内が 2 件", "重大アラート 1 件を監査対象に設定", "PowerShell エージェントのハートビート遅延"];
const approvals = ["新規資産購入申請 2 件", "権限ロール変更申請 1 件", "調達契約更新レビュー 1 件"];
const procurement = ["ノートPC 30 台の更新契約", "Adobe 年次更新", "保守延長の見積取得"];
const cmdb = ["DB サーバー -> Storage -> Backup Job", "Core Switch A -> Access SW群", "認証基盤 -> MFA -> Portal"];
const security = ["JWT + RBAC", "MFA / TOTP", "監査ログのハッシュチェーン検証", "セキュリティイベント検知", "通知・招待フロー"];
const reports = ["監査レポート", "アクティビティログ", "資産エクスポート", "調達サマリー"];
const assetChart = [
  { name: "Hardware", value: 42 },
  { name: "Software", value: 34 },
  { name: "Network", value: 24 }
];
const settings = [
  { name: "認証方式", value: "JWT + MFA", note: "admin/operator/viewer/auditor を想定" },
  { name: "監視", value: "Prometheus互換", note: "/health とメトリクスを提供" },
  { name: "TLS", value: "自己署名(開発)", note: "本番は正式証明書に切替" },
  { name: "通知基盤", value: "Alert + Invite", note: "通知と招待フローを統合" }
];
const state = { view: "overview", filter: "all", selectedSetting: settings[0].name };
const qs = (s) => document.querySelector(s);
const qsa = (s) => Array.from(document.querySelectorAll(s));
const esc = (v) => String(v).replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;");
const filteredAssets = () => assets.filter((item) => state.filter === "all" || item.category === state.filter);
function renderHero() { const items = [["資産", assets.length], ["ソフトウェア", software.length], ["統制項目", security.length]]; qs("#heroBadges").innerHTML = items.map(([label, value]) => `<div class="hero-badge"><strong>${esc(value)}</strong><span>${esc(label)}</span></div>`).join(""); }
function renderStats() { const stats = [["アクティブ資産", assets.filter((a) => a.status === "Active").length, "運用中"], ["要対応", assets.filter((a) => a.status !== "Active").length, "保守/期限"], ["承認待ち", approvals.length, "workflow"], ["通知", alerts.length, "alert center"]]; qs("#statsGrid").innerHTML = stats.map(([label, value, note]) => `<article class="stat-card"><span class="meta">${esc(label)}</span><strong>${esc(value)}</strong><span class="meta">${esc(note)}</span></article>`).join(""); }
function renderOverview() { qs("#alertList").innerHTML = alerts.map((item) => `<div class="list-card"><span class="pill">Alert</span><p>${esc(item)}</p></div>`).join(""); qs("#approvalList").innerHTML = approvals.map((item) => `<div class="list-card"><span class="pill">Approval</span><p>${esc(item)}</p></div>`).join(""); qs("#assetChart").innerHTML = assetChart.map((item) => `<div class="bar-row"><span>${esc(item.name)}</span><div class="bar-track"><span style="width:${item.value}%"></span></div><strong>${esc(item.value)}%</strong></div>`).join(""); qs("#renewalTable").innerHTML = `<table class="data-table"><thead><tr><th>資産</th><th>状態</th><th>更新日</th></tr></thead><tbody>${assets.map((row) => `<tr><td>${esc(row.name)}</td><td>${esc(row.status)}</td><td>${esc(row.renew)}</td></tr>`).join("")}</tbody></table>`; }
function renderLists() {
  qs("#assetList").innerHTML = filteredAssets().map((item) => `<div class="list-card"><strong>${esc(item.name)}</strong><p>${esc(item.owner)}</p><span class="pill">${esc(item.category)} / ${esc(item.status)} / ${esc(item.renew)}</span></div>`).join("");
  qs("#softwareList").innerHTML = software.map((item) => `<div class="list-card"><strong>${esc(item.name)}</strong><p>${esc(item.license)}</p><span class="pill">${esc(item.status)}</span></div>`).join("");
  qs("#procurementList").innerHTML = procurement.map((item) => `<div class="list-card"><strong>${esc(item)}</strong><p>Procurement / Contract</p><span class="pill">procurement</span></div>`).join("");
  qs("#cmdbList").innerHTML = cmdb.map((item) => `<div class="list-card"><strong>${esc(item)}</strong><p>構成関連マップ</p><span class="pill">cmdb</span></div>`).join("");
  qs("#securityList").innerHTML = security.map((item) => `<div class="list-card"><strong>${esc(item)}</strong><p>README 記載の統制機能</p><span class="pill">security</span></div>`).join("");
  qs("#reportList").innerHTML = reports.map((item) => `<div class="list-card"><strong>${esc(item)}</strong><p>出力・監査用</p><span class="pill">report</span></div>`).join("");
  qs("#settingsList").innerHTML = settings.map((item) => `<button class="list-card ${item.name === state.selectedSetting ? "is-selected" : ""}" data-setting="${esc(item.name)}"><strong>${esc(item.name)}</strong><p>${esc(item.value)}</p><span class="pill">setting</span></button>`).join("");
  const setting = settings.find((item) => item.name === state.selectedSetting) || settings[0];
  qs("#settingsDetail").innerHTML = `<div class="list-card"><strong>${esc(setting.name)}</strong><p>現在値: ${esc(setting.value)}</p><span class="pill">detail</span><p>${esc(setting.note)}</p></div>`;
}
function syncView() { const titles = { overview: "ダッシュボード", assets: "資産", software: "ソフトウェア", procurement: "調達", cmdb: "CMDB", security: "セキュリティ", reports: "レポート", settings: "システム設定" }; qs("#pageTitle").textContent = titles[state.view]; qsa(".nav-item").forEach((n) => n.classList.toggle("is-active", n.dataset.view === state.view)); qsa(".view").forEach((v) => v.classList.toggle("is-active", v.id === `view-${state.view}`)); }
function render() { renderHero(); renderStats(); renderOverview(); renderLists(); syncView(); }
document.addEventListener("click", (e) => { const nav = e.target.closest("[data-view]"); if (nav) { state.view = nav.dataset.view; render(); } const setting = e.target.closest("[data-setting]"); if (setting) { state.selectedSetting = setting.dataset.setting; renderLists(); } });
qs("#notifyBtn").addEventListener("click", () => { alerts = [`${new Date().toLocaleTimeString("ja-JP", { hour: "2-digit", minute: "2-digit" })} 通知サマリ更新`, ...alerts].slice(0, 4); render(); });
render();

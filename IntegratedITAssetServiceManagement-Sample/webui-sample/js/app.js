const assets = [
  { name: "HQ-DB-01", category: "Hardware", status: "Active", owner: "Infra", renew: "2026-04-10", serial: "SRV-2024-0871", location: "DC-East Rack 12" },
  { name: "Adobe CC Enterprise", category: "Software", status: "At Risk", owner: "Design", renew: "2026-03-31", serial: "LIC-ADBE-0042", location: "クラウド" },
  { name: "Core Switch A", category: "Network", status: "Maintenance", owner: "Network", renew: "2026-05-12", serial: "NET-CSW-1001", location: "DC-East MDF" },
  { name: "Windows Server 2022 DC", category: "Software", status: "Active", owner: "Infra", renew: "2026-04-05", serial: "LIC-MSWS-0189", location: "DC-East Rack 14" },
  { name: "Firewall-GW-01", category: "Network", status: "Active", owner: "Security", renew: "2026-06-20", serial: "NET-FW-2201", location: "DC-East DMZ" },
  { name: "App-Server-01", category: "Server", status: "Active", owner: "DevOps", renew: "2026-04-01", serial: "SRV-2025-0033", location: "DC-West Rack 03" }
];
const software = [{ name: "Microsoft 365 E3", license: "450 / 430", status: "Compliant" }, { name: "Adobe CC", license: "120 / 118", status: "Near Limit" }, { name: "Autodesk", license: "40 / 45", status: "Over" }];
let alerts = ["ライセンス更新期限 7 日以内が 2 件", "重大アラート 1 件を監査対象に設定", "PowerShell エージェントのハートビート遅延"];
const approvals = ["新規資産購入申請 2 件", "権限ロール変更申請 1 件", "調達契約更新レビュー 1 件"];
const procurement = ["ノートPC 30 台の更新契約", "Adobe 年次更新", "保守延長の見積取得", "ネットワーク機器リプレース見積", "クラウドサービス年次契約更新"];
const cmdb = [
  { label: "DB サーバー -> Storage -> Backup Job", deps: ["HQ-DB-01", "Storage-Array-01", "Backup-Job-Nightly"] },
  { label: "Core Switch A -> Access SW群", deps: ["Core Switch A", "Access-SW-F1", "Access-SW-F2"] },
  { label: "認証基盤 -> MFA -> Portal", deps: ["Auth-Server-01", "MFA-Gateway", "Portal-LB-01"] },
  { label: "App Server -> Web LB", deps: ["HQ-DB-01", "App-Server-01", "Web-LB-01"] },
  { label: "Firewall -> DMZ -> Public Web", deps: ["Firewall-GW-01", "DMZ-Proxy-01", "Public-Web-01"] }
];
const security = ["JWT + RBAC", "MFA / TOTP", "監査ログのハッシュチェーン検証", "セキュリティイベント検知", "通知・招待フロー"];
const reports = ["監査レポート", "アクティビティログ", "資産エクスポート", "調達サマリー"];
const assetChart = [
  { name: "Hardware", value: 30 },
  { name: "Software", value: 28 },
  { name: "Network", value: 22 },
  { name: "Server", value: 20 }
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
function isExpiringSoon(renewDate) {
  const now = new Date();
  const renew = new Date(renewDate);
  const diffDays = (renew - now) / (1000 * 60 * 60 * 24);
  return diffDays >= 0 && diffDays <= 30;
}
const filteredAssets = () => assets.filter((item) => {
  if (state.filter === "all") return true;
  if (state.filter === "expiring") return isExpiringSoon(item.renew);
  return item.category === state.filter;
});
function renderHero() { const items = [["資産", assets.length], ["ソフトウェア", software.length], ["統制項目", security.length]]; qs("#heroBadges").innerHTML = items.map(([label, value]) => `<div class="hero-badge"><strong>${esc(value)}</strong><span>${esc(label)}</span></div>`).join(""); }
function renderStats() { const stats = [["アクティブ資産", assets.filter((a) => a.status === "Active").length, "運用中"], ["要対応", assets.filter((a) => a.status !== "Active").length, "保守/期限"], ["承認待ち", approvals.length, "workflow"], ["通知", alerts.length, "alert center"]]; qs("#statsGrid").innerHTML = stats.map(([label, value, note]) => `<article class="stat-card"><span class="meta">${esc(label)}</span><strong>${esc(value)}</strong><span class="meta">${esc(note)}</span></article>`).join(""); }
function renderOverview() { qs("#alertList").innerHTML = alerts.map((item) => `<div class="list-card"><span class="pill">Alert</span><p>${esc(item)}</p></div>`).join(""); qs("#approvalList").innerHTML = approvals.map((item) => `<div class="list-card"><span class="pill">Approval</span><p>${esc(item)}</p></div>`).join(""); qs("#assetChart").innerHTML = assetChart.map((item) => `<div class="bar-row"><span>${esc(item.name)}</span><div class="bar-track"><span style="width:${item.value}%"></span></div><strong>${esc(item.value)}%</strong></div>`).join(""); qs("#renewalTable").innerHTML = `<table class="data-table"><thead><tr><th>資産</th><th>状態</th><th>更新日</th><th></th></tr></thead><tbody>${assets.map((row) => { const exp = isExpiringSoon(row.renew); return `<tr><td>${esc(row.name)}</td><td>${esc(row.status)}</td><td>${esc(row.renew)}</td><td>${exp ? '<span class="pill" style="background:#e74c3c;color:#fff;font-size:0.75em;">期限切れ間近</span>' : ''}</td></tr>`; }).join("")}</tbody></table>`; }
function renderLists() {
  qs("#assetList").innerHTML = filteredAssets().map((item, idx) => {
    const expiring = isExpiringSoon(item.renew);
    const expiryPill = expiring ? `<span class="pill" style="background:#e74c3c;color:#fff;">期限切れ間近</span>` : "";
    const assetIdx = assets.indexOf(item);
    return `<div class="list-card" data-asset-idx="${assetIdx}" style="cursor:pointer;"><strong>${esc(item.name)}</strong><p>${esc(item.owner)}</p><span class="pill">${esc(item.category)} / ${esc(item.status)} / ${esc(item.renew)}</span>${expiryPill}</div>`;
  }).join("");
  qs("#softwareList").innerHTML = software.map((item) => `<div class="list-card"><strong>${esc(item.name)}</strong><p>${esc(item.license)}</p><span class="pill">${esc(item.status)}</span></div>`).join("");
  qs("#procurementList").innerHTML = procurement.map((item) => `<div class="list-card"><strong>${esc(item)}</strong><p>Procurement / Contract</p><span class="pill">procurement</span></div>`).join("");
  qs("#cmdbList").innerHTML = cmdb.map((item) => {
    const depChain = item.deps.map((d) => esc(d)).join(` <span style="color:#3498db;font-weight:bold;">\u2192</span> `);
    return `<div class="list-card"><strong>${esc(item.label)}</strong><p style="margin-top:6px;font-family:monospace;font-size:0.92em;">${depChain}</p><span class="pill">cmdb</span></div>`;
  }).join("");
  qs("#securityList").innerHTML = security.map((item) => `<div class="list-card"><strong>${esc(item)}</strong><p>README 記載の統制機能</p><span class="pill">security</span></div>`).join("");
  qs("#reportList").innerHTML = reports.map((item) => `<div class="list-card"><strong>${esc(item)}</strong><p>出力・監査用</p><span class="pill">report</span></div>`).join("");
  qs("#settingsList").innerHTML = settings.map((item) => `<button class="list-card ${item.name === state.selectedSetting ? "is-selected" : ""}" data-setting="${esc(item.name)}"><strong>${esc(item.name)}</strong><p>${esc(item.value)}</p><span class="pill">setting</span></button>`).join("");
  const setting = settings.find((item) => item.name === state.selectedSetting) || settings[0];
  qs("#settingsDetail").innerHTML = `<div class="list-card"><strong>${esc(setting.name)}</strong><p>現在値: ${esc(setting.value)}</p><span class="pill">detail</span><p>${esc(setting.note)}</p></div>`;
}
function syncView() { const titles = { overview: "ダッシュボード", assets: "資産", software: "ソフトウェア", procurement: "調達", cmdb: "CMDB", security: "セキュリティ", reports: "レポート", settings: "システム設定" }; qs("#pageTitle").textContent = titles[state.view]; qsa(".nav-item").forEach((n) => { const a = n.dataset.view === state.view; n.classList.toggle("is-active", a); a ? n.setAttribute("aria-current", "page") : n.removeAttribute("aria-current"); }); qsa(".view").forEach((v) => v.classList.toggle("is-active", v.id === `view-${state.view}`)); }
function render() { renderHero(); renderStats(); renderOverview(); renderLists(); syncView(); }
document.addEventListener("click", (e) => {
  const nav = e.target.closest("[data-view]");
  if (nav) { state.view = nav.dataset.view; render(); }
  const setting = e.target.closest("[data-setting]");
  if (setting) { state.selectedSetting = setting.dataset.setting; showToast(setting.dataset.setting + " を選択", "success"); renderLists(); }
  const assetCard = e.target.closest("[data-asset-idx]");
  if (assetCard) {
    const idx = parseInt(assetCard.dataset.assetIdx, 10);
    const a = assets[idx];
    if (!a) return;
    const expiring = isExpiringSoon(a.renew);
    const expiryNote = expiring ? `<p style="color:#e74c3c;font-weight:bold;margin-top:8px;">&#9888; 更新期限が30日以内です。早急に更新手続きを行ってください。</p>` : "";
    showModal(a.name + " - 資産詳細", `
      <table class="data-table" style="width:100%;">
        <tbody>
          <tr><th style="text-align:left;padding:6px 12px;">資産名</th><td style="padding:6px 12px;">${esc(a.name)}</td></tr>
          <tr><th style="text-align:left;padding:6px 12px;">カテゴリ</th><td style="padding:6px 12px;">${esc(a.category)}</td></tr>
          <tr><th style="text-align:left;padding:6px 12px;">ステータス</th><td style="padding:6px 12px;">${esc(a.status)}</td></tr>
          <tr><th style="text-align:left;padding:6px 12px;">管理部門</th><td style="padding:6px 12px;">${esc(a.owner)}</td></tr>
          <tr><th style="text-align:left;padding:6px 12px;">更新日</th><td style="padding:6px 12px;">${esc(a.renew)}</td></tr>
          <tr><th style="text-align:left;padding:6px 12px;">シリアル番号</th><td style="padding:6px 12px;">${esc(a.serial)}</td></tr>
          <tr><th style="text-align:left;padding:6px 12px;">設置場所</th><td style="padding:6px 12px;">${esc(a.location)}</td></tr>
        </tbody>
      </table>
      ${expiryNote}
    `, [{ label: "閉じる", className: "btn" }]);
  }
  const filterBtn = e.target.closest("[data-filter]");
  if (filterBtn) {
    state.filter = filterBtn.dataset.filter;
    qsa("[data-filter]").forEach((b) => b.classList.toggle("is-active", b.dataset.filter === state.filter));
    renderLists();
  }
});
qs("#notifyBtn").addEventListener("click", () => { alerts = [`${new Date().toLocaleTimeString("ja-JP", { hour: "2-digit", minute: "2-digit" })} 通知サマリ更新`, ...alerts].slice(0, 4); showToast("通知サマリを更新しました", "success"); render(); });
render();

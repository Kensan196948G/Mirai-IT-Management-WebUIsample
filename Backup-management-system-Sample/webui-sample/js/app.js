const jobs = [
  { name: "基幹DB日次", tool: "Veeam", status: "正常", copies: 3, verify: "OK" },
  { name: "ファイルサーバ週次", tool: "WSB", status: "警告", copies: 2, verify: "再試行" },
  { name: "BIMデータ退避", tool: "AOMEI", status: "正常", copies: 4, verify: "OK" }
];
const media = [
  { name: "LTO-07-A", place: "オフライン保管庫", type: "Tape", state: "利用中" },
  { name: "NAS-Offsite-02", place: "大阪DC", type: "Disk", state: "同期中" },
  { name: "CloudVault-Archive", place: "クラウド", type: "Cloud", state: "正常" }
];
const reports = ["日次バックアップレポート", "ISO 27001 監査レポート", "ISO 19650 BIM レポート", "月次準拠サマリー"];
const rules = ["コピー数 3 以上", "媒体種別 2 種類以上", "オフサイト 1 以上", "オフライン 1 以上", "検証エラー 0"];
let alerts = ["ファイルサーバ週次ジョブでコピー不足を検知", "1件の検証再試行が必要", "月次レポート生成待ち"];
const verification = ["整合性チェック", "リストア演習", "ハッシュ検証", "隔離媒体確認"];
const channels = ["メール通知", "Teams 通知", "日次レポート配信", "監査アラート"];
const integrations = ["Veeam PowerShell 連携", "Windows Server Backup タスク連携", "AOMEI ログ解析連携"];
const successTrend = [
  { day: "Mon", value: 100 },
  { day: "Tue", value: 100 },
  { day: "Wed", value: 92 },
  { day: "Thu", value: 95 },
  { day: "Fri", value: 100 }
];
const settings = [
  { name: "保持期間", value: "30日", note: "ジョブ種別ごとに延長可能" },
  { name: "通知先", value: "Mail + Teams", note: "重大アラート時は即時通知" },
  { name: "検証ポリシー", value: "週次リストア演習", note: "0エラー維持に必須" },
  { name: "オフサイト同期", value: "毎日 03:00", note: "大阪DCへ転送" }
];
const state = { view: "dashboard", tool: "all", selectedSetting: settings[0].name };
const qs = (s) => document.querySelector(s);
const qsa = (s) => Array.from(document.querySelectorAll(s));
const esc = (v) => String(v).replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;");
const filteredJobs = () => jobs.filter((job) => state.tool === "all" || job.tool === state.tool);

function renderHero() {
  const items = [["準拠ルール", rules.length], ["監視ジョブ", jobs.length], ["媒体数", media.length]];
  qs("#heroBadges").innerHTML = items.map(([label, value]) => `<div class="hero-badge"><strong>${esc(value)}</strong><span>${esc(label)}</span></div>`).join("");
}
function renderStats() {
  const stats = [["正常ジョブ", jobs.filter((j) => j.status === "正常").length, "定期実行中"], ["警告ジョブ", jobs.filter((j) => j.status !== "正常").length, "要確認"], ["検証OK", jobs.filter((j) => j.verify === "OK").length, "完全性確認済み"], ["アラート", alerts.length, "通知対象"]];
  qs("#statsGrid").innerHTML = stats.map(([label, value, note]) => `<article class="stat-card"><span class="meta">${esc(label)}</span><strong>${esc(value)}</strong><span class="meta">${esc(note)}</span></article>`).join("");
}
function renderOverview() {
  qs("#ruleList").innerHTML = rules.map((item) => `<div class="list-card"><span class="pill">Rule</span><p>${esc(item)}</p></div>`).join("");
  qs("#alertList").innerHTML = alerts.map((item) => `<div class="list-card"><span class="pill">Alert</span><p>${esc(item)}</p></div>`).join("");
  qs("#successChart").innerHTML = successTrend.map((item) => `<div class="bar-row"><span>${esc(item.day)}</span><div class="bar-track"><span style="width:${item.value}%"></span></div><strong>${esc(item.value)}%</strong></div>`).join("");
  qs("#jobTable").innerHTML = `<table class="data-table"><thead><tr><th>ジョブ</th><th>ツール</th><th>状態</th><th>検証</th></tr></thead><tbody>${jobs.map((job) => `<tr><td>${esc(job.name)}</td><td>${esc(job.tool)}</td><td>${esc(job.status)}</td><td>${esc(job.verify)}</td></tr>`).join("")}</tbody></table>`;
}
function renderLists() {
  qs("#jobList").innerHTML = filteredJobs().map((job, index) => `<button class="list-card" data-job="${index}"><strong>${esc(job.name)}</strong><p>${esc(job.tool)}</p><span class="pill">${esc(job.status)} / copy:${esc(job.copies)} / verify:${esc(job.verify)}</span></button>`).join("");
  qs("#mediaList").innerHTML = media.map((item) => `<div class="list-card"><strong>${esc(item.name)}</strong><p>${esc(item.place)}</p><span class="pill">${esc(item.type)} / ${esc(item.state)}</span></div>`).join("");
  qs("#verificationList").innerHTML = verification.map((item) => `<div class="list-card"><strong>${esc(item)}</strong><p>0エラー維持のための確認項目</p><span class="pill">verify</span></div>`).join("");
  qs("#reportList").innerHTML = reports.map((item) => `<div class="list-card"><strong>${esc(item)}</strong><p>テンプレート生成に対応</p><span class="pill">Compliance</span></div>`).join("");
  qs("#channelList").innerHTML = channels.map((item) => `<div class="list-card"><strong>${esc(item)}</strong><p>アラート/定期通知</p><span class="pill">channel</span></div>`).join("");
  qs("#integrationList").innerHTML = integrations.map((item) => `<div class="list-card"><strong>${esc(item)}</strong><p>README 記載の連携方式</p><span class="pill">integration</span></div>`).join("");
  qs("#settingsList").innerHTML = settings.map((item) => `<button class="list-card ${item.name === state.selectedSetting ? "is-selected" : ""}" data-setting="${esc(item.name)}"><strong>${esc(item.name)}</strong><p>${esc(item.value)}</p><span class="pill">setting</span></button>`).join("");
  const setting = settings.find((item) => item.name === state.selectedSetting) || settings[0];
  qs("#settingsDetail").innerHTML = `<div class="list-card"><strong>${esc(setting.name)}</strong><p>現在値: ${esc(setting.value)}</p><span class="pill">detail</span><p>${esc(setting.note)}</p></div>`;
}
function syncView() {
  const titles = { dashboard: "ダッシュボード", jobs: "ジョブ", media: "メディア", verification: "検証", reports: "レポート", alerts: "通知", integrations: "連携", settings: "システム設定" };
  qs("#pageTitle").textContent = titles[state.view];
  qsa(".nav-item").forEach((item) => { const a = item.dataset.view === state.view; item.classList.toggle("is-active", a); a ? item.setAttribute("aria-current", "page") : item.removeAttribute("aria-current"); });
  qsa(".view").forEach((view) => view.classList.toggle("is-active", view.id === `view-${state.view}`));
}
function render() { renderHero(); renderStats(); renderOverview(); renderLists(); syncView(); }
document.addEventListener("click", (event) => {
  const nav = event.target.closest("[data-view]");
  if (nav) { state.view = nav.dataset.view; render(); }
  const job = event.target.closest("[data-job]");
  if (job) {
    const row = filteredJobs()[Number(job.dataset.job)];
    row.status = row.status === "警告" ? "正常" : "警告";
    alerts = [`${row.name} を ${row.status} に更新`, ...alerts].slice(0, 4);
    showToast(row.name + " → " + row.status, row.status === "正常" ? "success" : "warning");
    render();
  }
  const setting = event.target.closest("[data-setting]");
  if (setting) {
    state.selectedSetting = setting.dataset.setting;
    renderLists();
  }
});
qs("#simulateBtn").addEventListener("click", () => { alerts = [`${new Date().toLocaleTimeString("ja-JP", { hour: "2-digit", minute: "2-digit" })} 準拠チェックを再評価`, ...alerts].slice(0, 4); showToast("準拠チェックを再評価しました", "success"); render(); });
render();

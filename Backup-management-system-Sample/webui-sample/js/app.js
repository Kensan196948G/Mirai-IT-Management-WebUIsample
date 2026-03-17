const jobs = [
  { name: "基幹DB日次", tool: "Veeam", status: "正常", copies: 3, verify: "OK", lastRun: "2026-03-17 03:00" },
  { name: "ファイルサーバ週次", tool: "WSB", status: "警告", copies: 2, verify: "再試行", lastRun: "2026-03-16 22:00" },
  { name: "BIMデータ退避", tool: "AOMEI", status: "正常", copies: 4, verify: "OK", lastRun: "2026-03-17 01:15" },
  { name: "メールサーバ差分", tool: "Veeam", status: "正常", copies: 3, verify: "OK", lastRun: "2026-03-17 02:30" },
  { name: "Active Directory", tool: "WSB", status: "エラー", copies: 1, verify: "失敗", lastRun: "2026-03-16 23:00" }
];
const media = [
  { name: "LTO-07-A", place: "オフライン保管庫", type: "Tape", state: "利用中" },
  { name: "NAS-Offsite-02", place: "大阪DC", type: "Disk", state: "同期中" },
  { name: "CloudVault-Archive", place: "クラウド", type: "Cloud", state: "正常" },
  { name: "USB-Offline-01", place: "耐火金庫", type: "USB", state: "オフライン" },
  { name: "Azure-Blob-DR", place: "東日本リージョン", type: "Cloud", state: "同期中" }
];
const reports = ["日次バックアップレポート", "ISO 27001 監査レポート", "ISO 19650 BIM レポート", "月次準拠サマリー"];
const rules = ["コピー数 3 以上", "媒体種別 2 種類以上", "オフサイト 1 以上", "オフライン 1 以上", "検証エラー 0"];
let alerts = ["Active Directory バックアップ検証失敗 - コピー数不足", "ファイルサーバ週次ジョブでコピー不足を検知", "1件の検証再試行が必要", "月次レポート生成待ち"];
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
/* --- 3-2-1-1-0 Compliance Engine --- */
function check321_10() {
  const totalCopies = Math.max(...jobs.map((j) => j.copies));
  const mediaTypes = new Set(media.map((m) => m.type));
  const hasOffsite = media.some((m) => m.place !== "オフライン保管庫" && m.place !== "耐火金庫" && m.type !== "USB");
  const hasOffline = media.some((m) => m.state === "オフライン" || m.type === "Tape" || m.type === "USB");
  const zeroErrors = jobs.every((j) => j.verify === "OK");
  const checks = [
    { rule: "3 コピー以上", pass: totalCopies >= 3, detail: `最大コピー数: ${totalCopies}` },
    { rule: "2 種類のメディア", pass: mediaTypes.size >= 2, detail: `メディア種別: ${[...mediaTypes].join(", ")}` },
    { rule: "1 オフサイト保管", pass: hasOffsite, detail: hasOffsite ? "オフサイト拠点あり" : "オフサイトなし" },
    { rule: "1 オフライン保管", pass: hasOffline, detail: hasOffline ? "オフライン媒体あり" : "オフライン媒体なし" },
    { rule: "0 検証エラー", pass: zeroErrors, detail: zeroErrors ? "全ジョブ検証OK" : "検証エラーあり" }
  ];
  const passed = checks.filter((c) => c.pass).length;
  return { checks, passed, total: checks.length, pct: Math.round((passed / checks.length) * 100) };
}

const state = { view: "dashboard", tool: "all", selectedSetting: settings[0].name };
const qs = (s) => document.querySelector(s);
const qsa = (s) => Array.from(document.querySelectorAll(s));
const esc = (v) => String(v).replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;");
const filteredJobs = () => jobs.filter((job) => state.tool === "all" || job.tool === state.tool);

function renderHero() {
  const comp = check321_10();
  const items = [["準拠スコア", comp.pct + "%"], ["監視ジョブ", jobs.length], ["媒体数", media.length], ["準拠ルール", `${comp.passed}/${comp.total}`]];
  qs("#heroBadges").innerHTML = items.map(([label, value]) => `<div class="hero-badge"><strong>${esc(value)}</strong><span>${esc(label)}</span></div>`).join("");
}
function renderStats() {
  const comp = check321_10();
  const stats = [
    ["準拠スコア", `${comp.passed}/${comp.total} (${comp.pct}%)`, comp.pct === 100 ? "完全準拠" : "要改善"],
    ["正常ジョブ", jobs.filter((j) => j.status === "正常").length, "定期実行中"],
    ["警告/エラー", jobs.filter((j) => j.status !== "正常").length, "要確認"],
    ["検証OK", jobs.filter((j) => j.verify === "OK").length, "完全性確認済み"],
    ["アラート", alerts.length, "通知対象"]
  ];
  qs("#statsGrid").innerHTML = stats.map(([label, value, note]) => `<article class="stat-card"><span class="meta">${esc(label)}</span><strong>${esc(value)}</strong><span class="meta">${esc(note)}</span></article>`).join("");
}
function renderOverview() {
  const comp = check321_10();
  qs("#ruleList").innerHTML = comp.checks.map((c) => `<div class="list-card"><span class="pill" style="background:${c.pass ? "var(--clr-ok,#16a34a)" : "var(--clr-err,#dc2626)"};color:#fff">${c.pass ? "\u2713 Pass" : "\u2717 Fail"}</span><p><strong>${esc(c.rule)}</strong><br><span class="meta">${esc(c.detail)}</span></p></div>`).join("") + `<div class="list-card"><span class="pill" style="background:${comp.pct === 100 ? "var(--clr-ok,#16a34a)" : "var(--clr-warn,#d97706)"};color:#fff">Score ${comp.pct}%</span><p><strong>${comp.passed}/${comp.total} ルール準拠</strong></p></div>`;
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
    const statusColor = row.status === "正常" ? "#16a34a" : row.status === "警告" ? "#d97706" : "#dc2626";
    const verifyColor = row.verify === "OK" ? "#16a34a" : row.verify === "再試行" ? "#d97706" : "#dc2626";
    showModal(row.name + " - ジョブ詳細", `
      <table style="width:100%;border-collapse:collapse">
        <tr><td style="padding:8px;font-weight:600">ツール</td><td style="padding:8px">${esc(row.tool)}</td></tr>
        <tr><td style="padding:8px;font-weight:600">状態</td><td style="padding:8px"><span style="background:${statusColor};color:#fff;padding:2px 10px;border-radius:12px">${esc(row.status)}</span></td></tr>
        <tr><td style="padding:8px;font-weight:600">コピー数</td><td style="padding:8px">${esc(row.copies)}</td></tr>
        <tr><td style="padding:8px;font-weight:600">検証状態</td><td style="padding:8px"><span style="background:${verifyColor};color:#fff;padding:2px 10px;border-radius:12px">${esc(row.verify)}</span></td></tr>
        <tr><td style="padding:8px;font-weight:600">最終実行</td><td style="padding:8px">${esc(row.lastRun || "---")}</td></tr>
      </table>
    `, [
      { label: "状態トグル", cls: "primary", action() { row.status = row.status === "正常" ? "警告" : "正常"; alerts = [`${row.name} を ${row.status} に更新`, ...alerts].slice(0, 5); showToast(row.name + " → " + row.status, row.status === "正常" ? "success" : "warning"); render(); } },
      { label: "閉じる", cls: "ghost" }
    ]);
  }
  const setting = event.target.closest("[data-setting]");
  if (setting) {
    state.selectedSetting = setting.dataset.setting;
    renderLists();
  }
});
qs("#simulateBtn").addEventListener("click", () => { alerts = [`${new Date().toLocaleTimeString("ja-JP", { hour: "2-digit", minute: "2-digit" })} 準拠チェックを再評価`, ...alerts].slice(0, 4); showToast("準拠チェックを再評価しました", "success"); render(); });
render();

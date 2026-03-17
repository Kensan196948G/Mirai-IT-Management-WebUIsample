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
const rules = [
  "コピー数 3 以上",
  "媒体種別 2 種類以上",
  "オフサイト 1 以上",
  "オフライン 1 以上",
  "検証エラー 0"
];
let alerts = [
  "ファイルサーバ週次ジョブでコピー不足を検知",
  "1件の検証再試行が必要",
  "月次レポート生成待ち"
];

const state = { view: "dashboard", tool: "all" };
const qs = (s) => document.querySelector(s);
const qsa = (s) => Array.from(document.querySelectorAll(s));
const esc = (v) => String(v).replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;");

function filteredJobs() {
  return jobs.filter((job) => state.tool === "all" || job.tool === state.tool);
}

function renderHero() {
  const items = [
    ["準拠ルール", rules.length],
    ["監視ジョブ", jobs.length],
    ["媒体数", media.length]
  ];
  qs("#heroBadges").innerHTML = items.map(([label, value]) => `<div class="hero-badge"><strong>${esc(value)}</strong><span>${esc(label)}</span></div>`).join("");
}

function renderStats() {
  const stats = [
    ["正常ジョブ", jobs.filter((j) => j.status === "正常").length, "定期実行中"],
    ["警告ジョブ", jobs.filter((j) => j.status !== "正常").length, "要確認"],
    ["検証OK", jobs.filter((j) => j.verify === "OK").length, "完全性確認済み"],
    ["アラート", alerts.length, "通知対象"]
  ];
  qs("#statsGrid").innerHTML = stats.map(([label, value, note]) => `<article class="stat-card"><span class="meta">${esc(label)}</span><strong>${esc(value)}</strong><span class="meta">${esc(note)}</span></article>`).join("");
}

function renderDashboard() {
  qs("#ruleList").innerHTML = rules.map((item) => `<div class="list-card"><span class="pill">Rule</span><p>${esc(item)}</p></div>`).join("");
  qs("#alertList").innerHTML = alerts.map((item) => `<div class="list-card"><span class="pill">Alert</span><p>${esc(item)}</p></div>`).join("");
}

function renderLists() {
  qs("#jobList").innerHTML = filteredJobs().map((job) => `<div class="list-card"><strong>${esc(job.name)}</strong><p>${esc(job.tool)}</p><span class="pill">${esc(job.status)} / copy:${esc(job.copies)} / verify:${esc(job.verify)}</span></div>`).join("");
  qs("#mediaList").innerHTML = media.map((item) => `<div class="list-card"><strong>${esc(item.name)}</strong><p>${esc(item.place)}</p><span class="pill">${esc(item.type)} / ${esc(item.state)}</span></div>`).join("");
  qs("#reportList").innerHTML = reports.map((item) => `<div class="list-card"><strong>${esc(item)}</strong><p>テンプレート生成に対応</p><span class="pill">Compliance</span></div>`).join("");
}

function syncView() {
  const titles = { dashboard: "概要", jobs: "ジョブ", media: "メディア", reports: "レポート" };
  qs("#pageTitle").textContent = titles[state.view];
  qsa(".nav-item").forEach((item) => item.classList.toggle("is-active", item.dataset.view === state.view));
  qsa(".view").forEach((view) => view.classList.toggle("is-active", view.id === `view-${state.view}`));
}

function render() {
  renderHero();
  renderStats();
  renderDashboard();
  renderLists();
  syncView();
}

document.addEventListener("click", (event) => {
  const nav = event.target.closest("[data-view]");
  if (nav) { state.view = nav.dataset.view; render(); }
});
qs("#toolFilter").addEventListener("change", (e) => { state.tool = e.target.value; renderLists(); });
qs("#simulateBtn").addEventListener("click", () => {
  alerts = [`${new Date().toLocaleTimeString("ja-JP", { hour: "2-digit", minute: "2-digit" })} 準拠チェックを再評価`, ...alerts].slice(0, 4);
  jobs[1].status = jobs[1].status === "警告" ? "正常" : "警告";
  render();
});

render();

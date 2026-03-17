const knowledge = [
  { title: "高所作業 SOP", kind: "SOP", area: "安全", status: "承認済み" },
  { title: "コンクリート打設温度管理", kind: "品質", area: "品質", status: "配信中" },
  { title: "土砂運搬規制改正", kind: "法令", area: "法令", status: "見直し中" },
  { title: "切梁撤去時の挟圧事例", kind: "事故", area: "事故", status: "重要" }
];
let notices = [
  "重要ヒヤリ事例を3件検知",
  "法令改正ナレッジの再確認が必要",
  "承認待ち配信が2件あります"
];
const kpis = ["統合ナレッジ 842 件", "承認フロー稼働 128 件", "週次配信 96 件"];
const approvals = [
  "現場担当が起案",
  "部門承認者がレビュー",
  "管理者が配信先を確定",
  "既読状況と閲覧ログを保存"
];
const incidents = [
  "挟圧ヒヤリ: 再発防止策の横展開",
  "足場点検漏れ: SOP改訂候補",
  "重機動線交錯: 現場注意喚起"
];
const consults = [
  "専門家に施工手順の是正相談",
  "Q&A をナレッジ化して再利用",
  "回答配信後に改訂履歴へ反映"
];
const state = { view: "overview", kind: "all" };
const qs = (s) => document.querySelector(s);
const qsa = (s) => Array.from(document.querySelectorAll(s));
const esc = (v) => String(v).replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;");

function filteredKnowledge() { return knowledge.filter((item) => state.kind === "all" || item.kind === state.kind); }
function renderHero() {
  const items = [["ナレッジ", knowledge.length], ["通知", notices.length], ["承認段階", approvals.length]];
  qs("#heroBadges").innerHTML = items.map(([label, value]) => `<div class="hero-badge"><strong>${esc(value)}</strong><span>${esc(label)}</span></div>`).join("");
}
function renderStats() {
  const stats = [
    ["承認済み", knowledge.filter((k) => k.status === "承認済み").length, "活用可能"],
    ["重要", knowledge.filter((k) => k.status === "重要").length, "事故・ヒヤリ"],
    ["相談", consults.length, "専門家相談"],
    ["KPI", kpis.length, "ダッシュボード"]
  ];
  qs("#statsGrid").innerHTML = stats.map(([label, value, note]) => `<article class="stat-card"><span class="meta">${esc(label)}</span><strong>${esc(value)}</strong><span class="meta">${esc(note)}</span></article>`).join("");
}
function renderOverview() {
  qs("#noticeList").innerHTML = notices.map((item) => `<div class="list-card"><span class="pill">Notice</span><p>${esc(item)}</p></div>`).join("");
  qs("#kpiList").innerHTML = kpis.map((item) => `<div class="list-card"><span class="pill">KPI</span><p>${esc(item)}</p></div>`).join("");
}
function renderLists() {
  qs("#knowledgeList").innerHTML = filteredKnowledge().map((item) => `<div class="list-card"><strong>${esc(item.title)}</strong><p>${esc(item.area)}</p><span class="pill">${esc(item.kind)} / ${esc(item.status)}</span></div>`).join("");
  qs("#approvalList").innerHTML = approvals.map((item) => `<div class="list-card"><strong>${esc(item)}</strong><p>多段承認フロー</p><span class="pill">workflow</span></div>`).join("");
  qs("#incidentList").innerHTML = incidents.map((item) => `<div class="list-card"><strong>${esc(item)}</strong><p>事故・ヒヤリ共有</p><span class="pill">incident</span></div>`).join("");
  qs("#consultList").innerHTML = consults.map((item) => `<div class="list-card"><strong>${esc(item)}</strong><p>専門家相談</p><span class="pill">consult</span></div>`).join("");
}
function syncView() {
  const titles = { overview: "概要", knowledge: "ナレッジ", approvals: "承認・配信", incidents: "事故・相談" };
  qs("#pageTitle").textContent = titles[state.view];
  qsa(".nav-item").forEach((n) => n.classList.toggle("is-active", n.dataset.view === state.view));
  qsa(".view").forEach((v) => v.classList.toggle("is-active", v.id === `view-${state.view}`));
}
function render() { renderHero(); renderStats(); renderOverview(); renderLists(); syncView(); }
document.addEventListener("click", (e) => { const nav = e.target.closest("[data-view]"); if (nav) { state.view = nav.dataset.view; render(); } });
qs("#kindFilter").addEventListener("change", (e) => { state.kind = e.target.value; renderLists(); });
qs("#notifyBtn").addEventListener("click", () => { notices = [`${new Date().toLocaleTimeString("ja-JP", { hour: "2-digit", minute: "2-digit" })} 配信通知を更新`, ...notices].slice(0, 4); render(); });
render();

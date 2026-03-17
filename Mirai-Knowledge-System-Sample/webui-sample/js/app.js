const knowledge = [{ title: "高所作業 SOP", kind: "SOP", area: "安全", status: "承認済み" }, { title: "コンクリート打設温度管理", kind: "品質", area: "品質", status: "配信中" }, { title: "土砂運搬規制改正", kind: "法令", area: "法令", status: "見直し中" }, { title: "切梁撤去時の挟圧事例", kind: "事故", area: "事故", status: "重要" }];
let notices = ["重要ヒヤリ事例を3件検知", "法令改正ナレッジの再確認が必要", "承認待ち配信が2件あります"];
const kpis = ["統合ナレッジ 842 件", "承認フロー稼働 128 件", "週次配信 96 件"];
const approvals = ["現場担当が起案", "部門承認者がレビュー", "管理者が配信先を確定", "既読状況と閲覧ログを保存"];
const incidents = ["挟圧ヒヤリ: 再発防止策の横展開", "足場点検漏れ: SOP改訂候補", "重機動線交錯: 現場注意喚起"];
const consults = ["専門家に施工手順の是正相談", "Q&A をナレッジ化して再利用", "回答配信後に改訂履歴へ反映"];
const audits = ["参照ログ", "変更ログ", "配信履歴", "部門別閲覧率", "重要通知既読率"];
const knowledgeChart = [
  { name: "SOP", value: 30 },
  { name: "品質", value: 24 },
  { name: "法令", value: 18 },
  { name: "事故", value: 28 }
];
const settings = [
  { name: "認証", value: "JWT + RBAC", note: "admin / yamada / partner のデモ想定" },
  { name: "配信ポリシー", value: "多段承認", note: "部門承認後に配信先を確定" },
  { name: "検索", value: "工種 / 工区 / 発注者", note: "条件検索と関連提示に対応" },
  { name: "監査", value: "閲覧/変更ログ保存", note: "KPI と合わせて可視化" }
];
const state = { view: "overview", kind: "all", query: "", selectedSetting: settings[0].name };
const qs = (s) => document.querySelector(s);
const qsa = (s) => Array.from(document.querySelectorAll(s));
const esc = (v) => String(v).replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;");
const filteredKnowledge = () => knowledge.filter((item) => (state.kind === "all" || item.kind === state.kind) && (!state.query || [item.title, item.kind, item.area].join(" ").includes(state.query)));
function renderHero() { const items = [["ナレッジ", knowledge.length], ["通知", notices.length], ["承認段階", approvals.length]]; qs("#heroBadges").innerHTML = items.map(([label, value]) => `<div class="hero-badge"><strong>${esc(value)}</strong><span>${esc(label)}</span></div>`).join(""); }
function renderStats() { const stats = [["承認済み", knowledge.filter((k) => k.status === "承認済み").length, "活用可能"], ["重要", knowledge.filter((k) => k.status === "重要").length, "事故・ヒヤリ"], ["相談", consults.length, "専門家相談"], ["KPI", kpis.length, "ダッシュボード"]]; qs("#statsGrid").innerHTML = stats.map(([label, value, note]) => `<article class="stat-card"><span class="meta">${esc(label)}</span><strong>${esc(value)}</strong><span class="meta">${esc(note)}</span></article>`).join(""); }
function renderOverview() { qs("#noticeList").innerHTML = notices.map((item) => `<div class="list-card"><span class="pill">Notice</span><p>${esc(item)}</p></div>`).join(""); qs("#kpiList").innerHTML = kpis.map((item) => `<div class="list-card"><span class="pill">KPI</span><p>${esc(item)}</p></div>`).join(""); qs("#knowledgeChart").innerHTML = knowledgeChart.map((item) => `<div class="bar-row"><span>${esc(item.name)}</span><div class="bar-track"><span style="width:${item.value}%"></span></div><strong>${esc(item.value)}%</strong></div>`).join(""); qs("#knowledgeTable").innerHTML = `<table class="data-table"><thead><tr><th>タイトル</th><th>種別</th><th>状態</th></tr></thead><tbody>${knowledge.map((row) => `<tr><td>${esc(row.title)}</td><td>${esc(row.kind)}</td><td>${esc(row.status)}</td></tr>`).join("")}</tbody></table>`; }
function renderLists() {
  qs("#knowledgeList").innerHTML = filteredKnowledge().map((item) => `<div class="list-card"><strong>${esc(item.title)}</strong><p>${esc(item.area)}</p><span class="pill">${esc(item.kind)} / ${esc(item.status)}</span></div>`).join("");
  qs("#searchResultList").innerHTML = filteredKnowledge().map((item) => `<div class="list-card"><strong>${esc(item.title)}</strong><p>関連: ${esc(item.kind)} / ${esc(item.area)}</p><span class="pill">recommend</span></div>`).join("");
  qs("#approvalList").innerHTML = approvals.map((item) => `<div class="list-card"><strong>${esc(item)}</strong><p>多段承認フロー</p><span class="pill">workflow</span></div>`).join("");
  qs("#incidentList").innerHTML = incidents.map((item) => `<div class="list-card"><strong>${esc(item)}</strong><p>事故・ヒヤリ共有</p><span class="pill">incident</span></div>`).join("");
  qs("#consultList").innerHTML = consults.map((item) => `<div class="list-card"><strong>${esc(item)}</strong><p>専門家相談</p><span class="pill">consult</span></div>`).join("");
  qs("#auditList").innerHTML = audits.map((item) => `<div class="list-card"><strong>${esc(item)}</strong><p>監査/KPI観点</p><span class="pill">audit</span></div>`).join("");
  qs("#settingsList").innerHTML = settings.map((item) => `<button class="list-card ${item.name === state.selectedSetting ? "is-selected" : ""}" data-setting="${esc(item.name)}"><strong>${esc(item.name)}</strong><p>${esc(item.value)}</p><span class="pill">setting</span></button>`).join("");
  const setting = settings.find((item) => item.name === state.selectedSetting) || settings[0];
  qs("#settingsDetail").innerHTML = `<div class="list-card"><strong>${esc(setting.name)}</strong><p>現在値: ${esc(setting.value)}</p><span class="pill">detail</span><p>${esc(setting.note)}</p></div>`;
}
function syncView() { const titles = { overview: "ダッシュボード", knowledge: "ナレッジ", search: "検索・推薦", approvals: "承認・配信", incidents: "事故・ヒヤリ", consultation: "専門家相談", audit: "監査・KPI", settings: "システム設定" }; qs("#pageTitle").textContent = titles[state.view]; qsa(".nav-item").forEach((n) => n.classList.toggle("is-active", n.dataset.view === state.view)); qsa(".view").forEach((v) => v.classList.toggle("is-active", v.id === `view-${state.view}`)); }
function render() { renderHero(); renderStats(); renderOverview(); renderLists(); syncView(); }
document.addEventListener("click", (e) => { const nav = e.target.closest("[data-view]"); if (nav) { state.view = nav.dataset.view; render(); } const setting = e.target.closest("[data-setting]"); if (setting) { state.selectedSetting = setting.dataset.setting; renderLists(); } });
qs("#runSearchBtn").addEventListener("click", () => { state.query = qs("#searchTerm").value.trim(); state.view = "search"; render(); });
qs("#notifyBtn").addEventListener("click", () => { notices = [`${new Date().toLocaleTimeString("ja-JP", { hour: "2-digit", minute: "2-digit" })} 配信通知を更新`, ...notices].slice(0, 4); render(); });
render();

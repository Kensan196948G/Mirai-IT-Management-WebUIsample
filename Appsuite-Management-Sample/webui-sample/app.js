const users = [
  { id: "U-001", name: "佐藤 真理", role: "管理者", status: "有効", team: "情報システム", mail: "sato@appsuite.local" },
  { id: "U-002", name: "田中 亮", role: "運用担当", status: "有効", team: "基盤運用", mail: "tanaka@appsuite.local" },
  { id: "U-003", name: "営業一課", role: "利用部門", status: "制限中", team: "営業部", mail: "sales@appsuite.local" }
];
const apps = [
  { name: "ワークフロー申請", category: "申請", status: "稼働中", owner: "情報システム" },
  { name: "資産棚卸", category: "台帳", status: "検証中", owner: "総務" },
  { name: "問い合わせ管理", category: "ITSM", status: "稼働中", owner: "ヘルプデスク" }
];
const incidents = [
  { title: "API接続遅延", priority: "高", status: "対応中", owner: "田中 亮" },
  { title: "通知メール未達", priority: "中", status: "調査中", owner: "佐藤 真理" },
  { title: "権限設定の誤配布", priority: "高", status: "承認待ち", owner: "監査担当" }
];
const changes = [
  { title: "AppSuite API接続先切替", type: "構成変更", status: "承認待ち" },
  { title: "バックアップ設定更新", type: "運用変更", status: "実施予定" },
  { title: "通知テンプレート改訂", type: "軽微変更", status: "完了" }
];
const logs = [
  "管理者がユーザー権限を更新",
  "運用担当がAPI接続テストを実行",
  "監査ログをCSV出力"
];
const checks = [
  "API接続状態の確認",
  "重要権限変更の二重確認",
  "当日インシデントのSLA確認"
];

const state = { view: "dashboard", role: "all", query: "", selectedUser: users[0].id };
const qs = (s) => document.querySelector(s);
const qsa = (s) => Array.from(document.querySelectorAll(s));
const esc = (v) => String(v).replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;");

function filteredUsers() {
  return users.filter((u) => {
    const roleOk = state.role === "all" || u.role === state.role;
    const q = [u.name, u.team, u.mail].join(" ").toLowerCase();
    return roleOk && (!state.query || q.includes(state.query.toLowerCase()));
  });
}

function renderHero() {
  const items = [
    { icon: "👤", label: "ユーザー", value: users.length },
    { icon: "📱", label: "管理アプリ", value: apps.length },
    { icon: "⚠", label: "重要障害", value: incidents.filter((i) => i.priority === "高").length }
  ];
  qs("#heroBadges").innerHTML = items.map((item) => `<div class="hero-badge" data-icon="${item.icon}"><strong>${esc(item.value)}</strong><span>${esc(item.label)}</span></div>`).join("");
}

function renderStats() {
  const stats = [
    ["監査ログ", logs.length, "直近操作"],
    ["稼働アプリ", apps.filter((a) => a.status === "稼働中").length, "本番利用中"],
    ["承認待ち変更", changes.filter((c) => c.status === "承認待ち").length, "変更管理"],
    ["高優先障害", incidents.filter((i) => i.priority === "高").length, "即応対象"]
  ];
  qs("#statsGrid").innerHTML = stats.map(([label, value, note]) => `<article class="stat-card"><span class="meta">${esc(label)}</span><strong>${esc(value)}</strong><span class="meta">${esc(note)}</span></article>`).join("");
}

function renderStacks() {
  qs("#logList").innerHTML = logs.map((item) => `<div class="list-card"><span class="pill">監査</span><p>${esc(item)}</p></div>`).join("");
  qs("#checkList").innerHTML = checks.map((item) => `<div class="list-card"><span class="pill">確認</span><p>${esc(item)}</p></div>`).join("");
}

function renderUsers() {
  const list = filteredUsers();
  if (!list.some((user) => user.id === state.selectedUser)) state.selectedUser = (list[0] || users[0]).id;
  qs("#userList").innerHTML = list.map((user) => `<button class="list-card ${user.id === state.selectedUser ? "is-selected" : ""}" data-user="${esc(user.id)}"><strong>${esc(user.name)}</strong><p>${esc(user.team)}</p><span class="pill">${esc(user.role)}</span></button>`).join("");
  const user = users.find((item) => item.id === state.selectedUser) || users[0];
  qs("#detailPanel").innerHTML = `<h3>${esc(user.name)}</h3><div class="pill">${esc(user.role)}</div><p>ID: ${esc(user.id)}</p><p>部署: ${esc(user.team)}</p><p>メール: ${esc(user.mail)}</p><p>状態: ${esc(user.status)}</p>`;
}

function renderCards() {
  qs("#appList").innerHTML = apps.map((app) => `<div class="list-card"><strong>${esc(app.name)}</strong><p>${esc(app.owner)}</p><span class="pill">${esc(app.category)} / ${esc(app.status)}</span></div>`).join("");
  qs("#incidentList").innerHTML = incidents.map((item) => `<div class="list-card"><strong>${esc(item.title)}</strong><p>担当: ${esc(item.owner)}</p><span class="pill">${esc(item.priority)} / ${esc(item.status)}</span></div>`).join("");
  qs("#changeList").innerHTML = changes.map((item) => `<div class="list-card"><strong>${esc(item.title)}</strong><p>${esc(item.type)}</p><span class="pill">${esc(item.status)}</span></div>`).join("");
}

function syncView() {
  const titles = { dashboard: "ダッシュボード", users: "ユーザー管理", apps: "アプリ管理", incidents: "インシデント", changes: "変更管理" };
  qs("#pageTitle").textContent = titles[state.view];
  qsa(".nav-item").forEach((item) => item.classList.toggle("is-active", item.dataset.view === state.view));
  qsa(".view").forEach((view) => view.classList.toggle("is-active", view.id === `view-${state.view}`));
}

function render() {
  renderHero();
  renderStats();
  renderStacks();
  renderUsers();
  renderCards();
  syncView();
}

document.addEventListener("click", (event) => {
  const nav = event.target.closest("[data-view]");
  if (nav) { state.view = nav.dataset.view; render(); }
  const user = event.target.closest("[data-user]");
  if (user) { state.selectedUser = user.dataset.user; renderUsers(); }
});
qs("#roleFilter").addEventListener("change", (e) => { state.role = e.target.value; renderUsers(); });
qs("#searchInput").addEventListener("input", (e) => { state.query = e.target.value.trim(); renderUsers(); });
qs("#resetBtn").addEventListener("click", () => { state.role = "all"; state.query = ""; qs("#roleFilter").value = "all"; qs("#searchInput").value = ""; render(); });
qs("#focusIncidentBtn").addEventListener("click", () => { state.view = "incidents"; render(); });

render();

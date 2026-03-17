const users = [
  { id: "U-001", name: "佐藤 真理", role: "管理者", status: "有効", team: "情報システム", mail: "sato@appsuite.local" },
  { id: "U-002", name: "田中 亮", role: "運用担当", status: "有効", team: "基盤運用", mail: "tanaka@appsuite.local" },
  { id: "U-003", name: "営業一課", role: "利用部門", status: "制限中", team: "営業部", mail: "sales@appsuite.local" },
  { id: "U-004", name: "鈴木 花子", role: "運用担当", status: "有効", team: "ヘルプデスク", mail: "suzuki@appsuite.local" },
  { id: "U-005", name: "山田 太郎", role: "管理者", status: "有効", team: "セキュリティ", mail: "yamada@appsuite.local" }
];
const apps = [
  { name: "ワークフロー申請", category: "申請", status: "稼働中", owner: "情報システム" },
  { name: "資産棚卸", category: "台帳", status: "検証中", owner: "総務" },
  { name: "問い合わせ管理", category: "ITSM", status: "稼働中", owner: "ヘルプデスク" },
  { name: "設備予約システム", category: "施設", status: "稼働中", owner: "総務" },
  { name: "セキュリティ監査", category: "セキュリティ", status: "検証中", owner: "セキュリティ" }
];
let incidents = [
  { title: "API接続遅延", priority: "高", status: "対応中", owner: "田中 亮" },
  { title: "通知メール未達", priority: "中", status: "調査中", owner: "佐藤 真理" },
  { title: "権限設定の誤配布", priority: "高", status: "承認待ち", owner: "監査担当" },
  { title: "バックアップジョブ失敗", priority: "中", status: "調査中", owner: "鈴木 花子" },
  { title: "SSL証明書期限切れ警告", priority: "高", status: "対応中", owner: "山田 太郎" }
];
const changes = [
  { title: "AppSuite API接続先切替", type: "構成変更", status: "承認待ち" },
  { title: "バックアップ設定更新", type: "運用変更", status: "実施予定" },
  { title: "通知テンプレート改訂", type: "軽微変更", status: "完了" }
];
let logs = [
  "管理者がユーザー権限を更新",
  "運用担当がAPI接続テストを実行",
  "監査ログをCSV出力"
];
const checks = ["API接続状態の確認", "重要権限変更の二重確認", "当日インシデントのSLA確認"];
const auditEvents = [
  { time: "09:10", event: "ログイン", target: "admin" },
  { time: "09:24", event: "権限更新", target: "U-003" },
  { time: "10:05", event: "CSV出力", target: "Audit Log" }
];
const appHealth = [
  { name: "申請", value: 96 },
  { name: "台帳", value: 88 },
  { name: "ITSM", value: 93 }
];
const slaRows = [
  { type: "高", target: "4h", actual: "2.1h" },
  { type: "中", target: "8h", actual: "5.4h" },
  { type: "低", target: "24h", actual: "10.0h" }
];
const settings = [
  { key: "api", label: "DeskNet's Neo API", enabled: true },
  { key: "notify", label: "通知メール", enabled: true },
  { key: "backup", label: "設定バックアップ", enabled: false }
];

const state = { view: "dashboard", role: "all", query: "", selectedUser: users[0].id };
const qs = (s) => document.querySelector(s);
const qsa = (s) => Array.from(document.querySelectorAll(s));
const esc = (v) => String(v).replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;");
const filteredUsers = () => users.filter((u) => (state.role === "all" || u.role === state.role) && (!state.query || [u.name, u.team, u.mail].join(" ").toLowerCase().includes(state.query.toLowerCase())));

function renderHero() {
  const items = [{ icon: "👤", label: "ユーザー", value: users.length }, { icon: "📱", label: "管理アプリ", value: apps.length }, { icon: "⚠", label: "高優先障害", value: incidents.filter((i) => i.priority === "高").length }];
  qs("#heroBadges").innerHTML = items.map((item) => `<div class="hero-badge" data-icon="${item.icon}"><strong>${esc(item.value)}</strong><span>${esc(item.label)}</span></div>`).join("");
}

function renderStats() {
  const stats = [["監査ログ", logs.length, "直近操作"], ["稼働アプリ", apps.filter((a) => a.status === "稼働中").length, "本番利用中"], ["承認待ち変更", changes.filter((c) => c.status === "承認待ち").length, "変更管理"], ["高優先障害", incidents.filter((i) => i.priority === "高").length, "即応対象"]];
  qs("#statsGrid").innerHTML = stats.map(([label, value, note]) => `<article class="stat-card"><span class="meta">${esc(label)}</span><strong>${esc(value)}</strong><span class="meta">${esc(note)}</span></article>`).join("");
}

function renderDashboard() {
  qs("#logList").innerHTML = logs.map((item) => `<div class="list-card"><span class="pill">監査</span><p>${esc(item)}</p></div>`).join("");
  qs("#checkList").innerHTML = checks.map((item) => `<div class="list-card"><span class="pill">確認</span><p>${esc(item)}</p></div>`).join("");
  qs("#appHealthChart").innerHTML = appHealth.map((item) => `<div class="bar-row"><span>${esc(item.name)}</span><div class="bar-track"><span style="width:${item.value}%"></span></div><strong>${esc(item.value)}%</strong></div>`).join("");
  qs("#slaTable").innerHTML = `<table class="data-table"><thead><tr><th>優先度</th><th>目標</th><th>実績</th></tr></thead><tbody>${slaRows.map((row) => `<tr><td>${esc(row.type)}</td><td>${esc(row.target)}</td><td>${esc(row.actual)}</td></tr>`).join("")}</tbody></table>`;
}

function renderUsers() {
  const list = filteredUsers();
  if (!list.some((u) => u.id === state.selectedUser)) state.selectedUser = (list[0] || users[0]).id;
  qs("#userList").innerHTML = list.map((user) => `<button class="list-card ${user.id === state.selectedUser ? "is-selected" : ""}" data-user="${esc(user.id)}"><strong>${esc(user.name)}</strong><p>${esc(user.team)}</p><span class="pill">${esc(user.role)}</span></button>`).join("");
  const user = users.find((u) => u.id === state.selectedUser) || users[0];
  qs("#detailPanel").innerHTML = `<h3>${esc(user.name)}</h3><div class="pill">${esc(user.role)}</div><p>ID: ${esc(user.id)}</p><p>部署: ${esc(user.team)}</p><p>メール: ${esc(user.mail)}</p><p>状態: ${esc(user.status)}</p>`;
}

function renderLists() {
  qs("#appList").innerHTML = apps.map((app) => `<div class="list-card"><strong>${esc(app.name)}</strong><p>${esc(app.owner)}</p><span class="pill">${esc(app.category)} / ${esc(app.status)}</span></div>`).join("");
  qs("#incidentList").innerHTML = incidents.map((item, index) => `<button class="list-card" data-escalate="${index}"><strong>${esc(item.title)}</strong><p>担当: ${esc(item.owner)}</p><span class="pill">${esc(item.priority)} / ${esc(item.status)}</span></button>`).join("");
  qs("#changeList").innerHTML = changes.map((item) => `<div class="list-card"><strong>${esc(item.title)}</strong><p>${esc(item.type)}</p><span class="pill">${esc(item.status)}</span></div>`).join("");
  qs("#auditEventList").innerHTML = auditEvents.map((item) => `<div class="list-card"><strong>${esc(item.time)} ${esc(item.event)}</strong><p>${esc(item.target)}</p><span class="pill">event</span></div>`).join("");
  const csvEl = qs("#csvPreview");
  csvEl.textContent = ["time,event,target", ...auditEvents.map((item) => `${item.time},${item.event},${item.target}`)].join("\n");
  csvEl.style.cursor = "pointer";
  csvEl.title = "クリックでCSVエクスポート";
  qs("#settingsList").innerHTML = settings.map((item) => `<button class="list-card" data-setting="${esc(item.key)}"><strong>${esc(item.label)}</strong><p>${item.enabled ? "有効" : "無効"}</p><span class="pill">${item.enabled ? "ON" : "OFF"}</span></button>`).join("");
  qs("#settingsState").innerHTML = settings.map((item) => `<p>${esc(item.label)}: <strong>${item.enabled ? "有効" : "無効"}</strong></p>`).join("");
}

function syncView() {
  const titles = { dashboard: "ダッシュボード", users: "ユーザー管理", apps: "アプリ管理", incidents: "インシデント", changes: "変更管理", logs: "監査ログ", settings: "システム設定" };
  qs("#pageTitle").textContent = titles[state.view];
  qsa(".nav-item").forEach((item) => { const a = item.dataset.view === state.view; item.classList.toggle("is-active", a); a ? item.setAttribute("aria-current", "page") : item.removeAttribute("aria-current"); });
  qsa(".view").forEach((view) => view.classList.toggle("is-active", view.id === `view-${state.view}`));
}

function render() {
  renderHero();
  renderStats();
  renderDashboard();
  renderUsers();
  renderLists();
  syncView();
}

document.addEventListener("click", (event) => {
  const nav = event.target.closest("[data-view]");
  if (nav) { state.view = nav.dataset.view; render(); }
  const user = event.target.closest("[data-user]");
  if (user) {
    state.selectedUser = user.dataset.user;
    renderUsers();
    const u = users.find((item) => item.id === user.dataset.user);
    if (u) {
      const statusClass = u.status === "有効" ? "success" : "warning";
      showModal(
        "ユーザー詳細 — " + u.name,
        `<table class="data-table" style="width:100%">
          <tbody>
            <tr><th style="text-align:left;padding:6px 12px">ID</th><td style="padding:6px 12px">${esc(u.id)}</td></tr>
            <tr><th style="text-align:left;padding:6px 12px">氏名</th><td style="padding:6px 12px">${esc(u.name)}</td></tr>
            <tr><th style="text-align:left;padding:6px 12px">役割</th><td style="padding:6px 12px">${esc(u.role)}</td></tr>
            <tr><th style="text-align:left;padding:6px 12px">部署</th><td style="padding:6px 12px">${esc(u.team)}</td></tr>
            <tr><th style="text-align:left;padding:6px 12px">メール</th><td style="padding:6px 12px">${esc(u.mail)}</td></tr>
            <tr><th style="text-align:left;padding:6px 12px">状態</th><td style="padding:6px 12px"><span class="pill ${statusClass}">${esc(u.status)}</span></td></tr>
          </tbody>
        </table>`,
        [
          { label: "権限編集", className: "btn primary", onClick() { showToast(u.name + " の権限編集画面を開きます", "info"); } },
          { label: "無効化", className: "btn danger", onClick() { u.status = u.status === "有効" ? "無効" : "有効"; logs = [`${u.name} を ${u.status} に変更`, ...logs].slice(0, 5); showToast(u.name + " → " + u.status, "warning"); render(); } }
        ]
      );
    }
  }
  const incident = event.target.closest("[data-escalate]");
  if (incident) {
    const idx = Number(incident.dataset.escalate);
    const row = incidents[idx];
    const nextStatus = row.status === "対応中" ? "エスカレーション" : "対応中";
    showModal(
      "インシデント ステータス変更確認",
      `<p style="margin-bottom:8px"><strong>${esc(row.title)}</strong></p>
       <p>担当: ${esc(row.owner)}　優先度: <span class="pill">${esc(row.priority)}</span></p>
       <hr style="margin:12px 0">
       <p>ステータスを <strong>${esc(row.status)}</strong> → <strong>${esc(nextStatus)}</strong> に変更しますか？</p>`,
      [
        { label: "変更する", className: "btn primary", onClick() {
          row.status = nextStatus;
          logs = [`${row.title} を ${row.status} に更新`, ...logs].slice(0, 5);
          showToast(row.title + " → " + row.status, "warning");
          render();
        }},
        { label: "キャンセル", className: "btn", onClick() {} }
      ]
    );
  }
  const setting = event.target.closest("[data-setting]");
  if (setting) {
    const row = settings.find((item) => item.key === setting.dataset.setting);
    row.enabled = !row.enabled;
    showToast(row.label + ": " + (row.enabled ? "有効" : "無効"), "success");
    renderLists();
  }
});

qs("#csvPreview").addEventListener("click", () => {
  const csvContent = ["time,event,target", ...auditEvents.map((item) => `${item.time},${item.event},${item.target}`)].join("\n");
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "audit_log_" + new Date().toISOString().slice(0, 10) + ".csv";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
  logs = ["監査ログCSVをエクスポート", ...logs].slice(0, 5);
  showToast("CSV出力完了", "success");
  render();
});

qs("#resetBtn").addEventListener("click", () => { state.role = "all"; state.query = ""; render(); });
qs("#focusIncidentBtn").addEventListener("click", () => { state.view = "incidents"; render(); });

render();

const services = [
  { name: "nginx.service", role: "Operator", status: "running", desc: "HTTP/リバースプロキシサーバー", port: 80, pid: 1234, uptime: "3d 12h", memory: "48MB" },
  { name: "sshd.service", role: "Approver", status: "running", desc: "OpenSSH サーバーデーモン", port: 22, pid: 892, uptime: "14d 6h", memory: "12MB" },
  { name: "backup-agent.service", role: "Operator", status: "stopped", desc: "バックアップエージェント", port: null, pid: null, uptime: "-", memory: "-" },
  { name: "postgresql.service", role: "Approver", status: "running", desc: "PostgreSQL データベースサーバー", port: 5432, pid: 2051, uptime: "14d 6h", memory: "256MB" },
  { name: "docker.service", role: "Approver", status: "running", desc: "Docker コンテナランタイム", port: null, pid: 1678, uptime: "7d 2h", memory: "384MB" }
];
const processes = ["postgres", "python api.main", "journalctl tail", "backup wrapper", "dockerd", "nginx: master"];
const network = [
  { name: "eth0", type: "interface", ip: "192.168.1.10/24", status: "UP", mac: "00:1A:2B:3C:4D:5E" },
  { name: "lo", type: "interface", ip: "127.0.0.1/8", status: "UP", mac: "00:00:00:00:00:00" },
  { name: "docker0", type: "interface", ip: "172.17.0.1/16", status: "UP", mac: "02:42:AC:11:00:01" },
  { name: "DNS Primary", type: "dns", ip: "8.8.8.8", status: "active", mac: "-" },
  { name: "DNS Secondary", type: "dns", ip: "1.1.1.1", status: "active", mac: "-" },
  { name: "default via 192.168.1.1", type: "route", ip: "eth0", status: "active", mac: "-" }
];
const firewall = [
  { name: "22/tcp (SSH)", action: "ALLOW", from: "192.168.1.0/24", status: "active" },
  { name: "80/tcp (HTTP)", action: "ALLOW", from: "Anywhere", status: "active" },
  { name: "443/tcp (HTTPS)", action: "ALLOW", from: "Anywhere", status: "active" },
  { name: "5432/tcp (PostgreSQL)", action: "ALLOW", from: "192.168.1.0/24", status: "active" },
  { name: "3306/tcp (MySQL)", action: "DENY", from: "Anywhere", status: "active" },
  { name: "8080/tcp", action: "DENY", from: "Anywhere", status: "active" }
];
let forbidden = ["任意コマンドの実行", "bash / sh の起動", "/etc 配下の直接編集", "sudo権限の直接追加", "危険文字を含む入力"];
const fixes = ["全55ページのサイドバー修正", "API 500 エラー修正", "テスト高速化", "WebSocket 自動再接続", "vendor 化対応"];
const roles = ["Viewer: 参照のみ", "Operator: 限定操作", "Approver: 危険操作承認", "Admin: 設定管理"];
const approvalRequests = [
  { id: "APR-001", title: "nginx.service 再起動", requester: "operator01", role: "Operator", target: "nginx.service", action: "restart", reason: "設定変更反映のため", timestamp: "2026-03-17T09:15:00+09:00", status: "pending" },
  { id: "APR-002", title: "UFW ルール追加 (8443/tcp)", requester: "operator02", role: "Operator", target: "UFW Firewall", action: "add-rule", reason: "新規APIエンドポイント開放", timestamp: "2026-03-17T08:42:00+09:00", status: "pending" },
  { id: "APR-003", title: "postgresql.service 停止", requester: "admin01", role: "Admin", target: "postgresql.service", action: "stop", reason: "メンテナンスウィンドウ: DB移行作業", timestamp: "2026-03-16T22:00:00+09:00", status: "pending" },
  { id: "APR-004", title: "docker.service 再起動", requester: "operator01", role: "Operator", target: "docker.service", action: "restart", reason: "コンテナネットワーク不安定のため", timestamp: "2026-03-16T14:30:00+09:00", status: "approved" },
  { id: "APR-005", title: "backup-agent 権限変更", requester: "operator03", role: "Operator", target: "backup-agent.service", action: "chmod", reason: "ログディレクトリへの書き込み権限追加", timestamp: "2026-03-15T11:20:00+09:00", status: "rejected" }
];
const audits = [
  { text: "nginx.service を再起動しました", user: "operator01", action: "restart", target: "nginx.service", result: "success", timestamp: "2026-03-17T10:32:15+09:00" },
  { text: "UFW ルール 443/tcp を追加しました", user: "admin01", action: "add-rule", target: "UFW Firewall", result: "success", timestamp: "2026-03-17T09:18:42+09:00" },
  { text: "sshd.service 停止要求が拒否されました", user: "operator02", action: "stop", target: "sshd.service", result: "denied", timestamp: "2026-03-17T08:55:03+09:00" },
  { text: "postgresql.service の状態を確認しました", user: "viewer01", action: "status", target: "postgresql.service", result: "success", timestamp: "2026-03-16T23:45:10+09:00" },
  { text: "deny by default ポリシーを検証しました", user: "admin01", action: "audit-check", target: "security-policy", result: "success", timestamp: "2026-03-16T22:10:00+09:00" },
  { text: "shell=True 使用の検出スキャンを実行しました", user: "admin01", action: "security-scan", target: "backend-code", result: "success", timestamp: "2026-03-16T20:00:00+09:00" },
  { text: "wrapper スクリプト整合性チェック完了", user: "admin01", action: "integrity-check", target: "sudo-wrappers", result: "success", timestamp: "2026-03-16T18:30:45+09:00" }
];
const serviceChart = [
  { name: "Servers", value: 82 },
  { name: "Network", value: 76 },
  { name: "Firewall", value: 88 },
  { name: "Audit", value: 91 }
];
const settings = [
  { name: "allowlist", value: "有効", note: "未定義操作は全拒否" },
  { name: "sudo wrapper", value: "必須", note: "直接 sudo 実行は禁止" },
  { name: "監査ログ", value: "JSON 保存", note: "誰が・いつ・何を保存" },
  { name: "承認フロー", value: "危険操作のみ", note: "Approver/Admin が最終承認" }
];
const state = { view: "overview", role: "all", selectedSetting: settings[0].name };
const qs = (s) => document.querySelector(s);
const qsa = (s) => Array.from(document.querySelectorAll(s));
const esc = (v) => String(v).replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;");
const filteredServices = () => services.filter((m) => state.role === "all" || m.role === state.role);
function renderHero() { const items = [["サービス", services.length], ["禁止操作", forbidden.length], ["監査観点", audits.length]]; qs("#heroBadges").innerHTML = items.map(([label, value]) => `<div class="hero-badge"><strong>${esc(value)}</strong><span>${esc(label)}</span></div>`).join(""); }
function renderStats() { const stats = [["実装済み", 4, "公開機能"], ["計画中", 1, "今後拡張"], ["禁止", 1, "設計上除外"], ["ロール", roles.length, "RBAC"]]; qs("#statsGrid").innerHTML = stats.map(([label, value, note]) => `<article class="stat-card"><span class="meta">${esc(label)}</span><strong>${esc(value)}</strong><span class="meta">${esc(note)}</span></article>`).join(""); }
function renderOverview() { qs("#forbiddenList").innerHTML = forbidden.map((item) => `<div class="list-card"><span class="pill">Deny</span><p>${esc(item)}</p></div>`).join(""); qs("#fixList").innerHTML = fixes.map((item) => `<div class="list-card"><span class="pill">Fix</span><p>${esc(item)}</p></div>`).join(""); qs("#serviceChart").innerHTML = serviceChart.map((item) => `<div class="bar-row"><span>${esc(item.name)}</span><div class="bar-track"><span style="width:${item.value}%"></span></div><strong>${esc(item.value)}%</strong></div>`).join(""); qs("#auditTable").innerHTML = `<table class="data-table"><thead><tr><th>監査項目</th><th>ユーザー</th><th>結果</th><th>日時</th></tr></thead><tbody>${audits.map((row, i) => `<tr class="audit-row" data-audit="${i}" style="cursor:pointer"><td>${esc(row.text)}</td><td>${esc(row.user)}</td><td><span class="pill">${esc(row.result)}</span></td><td>${new Date(row.timestamp).toLocaleString("ja-JP")}</td></tr>`).join("")}</tbody></table>`; }
function renderLists() {
  qs("#serviceList").innerHTML = filteredServices().map((item, index) => `<button class="list-card" data-service="${index}"><strong>${esc(item.name)}</strong><p>${esc(item.role)}</p><span class="pill">${esc(item.status)}</span></button>`).join("");
  qs("#processList").innerHTML = processes.map((item) => `<div class="list-card"><strong>${esc(item)}</strong><p>Running Processes</p><span class="pill">process</span></div>`).join("");
  qs("#networkList").innerHTML = network.map((item) => `<div class="list-card"><strong>${esc(item.name)}</strong><p>${esc(item.ip)} | ${esc(item.mac)}</p><span class="pill">${esc(item.type)}</span><span class="pill">${esc(item.status)}</span></div>`).join("");
  qs("#firewallList").innerHTML = firewall.map((item) => `<div class="list-card"><strong>${esc(item.name)}</strong><p>From: ${esc(item.from)}</p><span class="pill ${item.action === "DENY" ? "pill-deny" : ""}">${esc(item.action)}</span><span class="pill">${esc(item.status)}</span></div>`).join("");
  qs("#roleList").innerHTML = roles.map((item) => `<div class="list-card"><strong>${esc(item)}</strong><p>README のユーザーロール</p><span class="pill">role</span></div>`).join("");
  qs("#approvalList").innerHTML = approvalRequests.map((req, i) => {
    const statusLabel = req.status === "pending" ? "保留中" : req.status === "approved" ? "承認済" : "却下済";
    const statusClass = req.status === "pending" ? "pill-pending" : req.status === "approved" ? "pill-approved" : "pill-rejected";
    const buttons = req.status === "pending" ? `<div class="approval-actions"><button class="btn-approve" data-approval="${i}">承認</button><button class="btn-reject" data-rejection="${i}">却下</button></div>` : "";
    return `<div class="list-card approval-card"><div class="approval-header"><strong>${esc(req.id)}: ${esc(req.title)}</strong><span class="pill ${statusClass}">${statusLabel}</span></div><p>申請者: ${esc(req.requester)} (${esc(req.role)}) | 対象: ${esc(req.target)}</p><p>理由: ${esc(req.reason)}</p><p class="approval-time">${new Date(req.timestamp).toLocaleString("ja-JP")}</p>${buttons}</div>`;
  }).join("");
  qs("#auditList").innerHTML = audits.map((item, i) => `<button class="list-card audit-entry" data-audit-detail="${i}"><strong>${esc(item.text)}</strong><p>${esc(item.user)} | ${esc(item.action)} | <span class="pill">${esc(item.result)}</span></p><p class="audit-time">${new Date(item.timestamp).toLocaleString("ja-JP")} (${esc(item.timestamp)})</p></button>`).join("");
  qs("#settingsList").innerHTML = settings.map((item) => `<button class="list-card ${item.name === state.selectedSetting ? "is-selected" : ""}" data-setting="${esc(item.name)}"><strong>${esc(item.name)}</strong><p>${esc(item.value)}</p><span class="pill">setting</span></button>`).join("");
  const setting = settings.find((item) => item.name === state.selectedSetting) || settings[0];
  qs("#settingsDetail").innerHTML = `<div class="list-card"><strong>${esc(setting.name)}</strong><p>現在値: ${esc(setting.value)}</p><span class="pill">detail</span><p>${esc(setting.note)}</p></div>`;
}
function syncView() { const titles = { overview: "ダッシュボード", services: "System Servers", processes: "Processes", network: "Network", firewall: "Firewall", approvals: "承認", audit: "監査", settings: "システム設定" }; qs("#pageTitle").textContent = titles[state.view]; qsa(".nav-item").forEach((n) => { const a = n.dataset.view === state.view; n.classList.toggle("is-active", a); a ? n.setAttribute("aria-current", "page") : n.removeAttribute("aria-current"); }); qsa(".view").forEach((v) => v.classList.toggle("is-active", v.id === `view-${state.view}`)); }
function render() { renderHero(); renderStats(); renderOverview(); renderLists(); syncView(); }
document.addEventListener("click", (e) => {
  const nav = e.target.closest("[data-view]"); if (nav) { state.view = nav.dataset.view; render(); }

  /* --- Service control modal --- */
  const service = e.target.closest("[data-service]");
  if (service) {
    const row = filteredServices()[Number(service.dataset.service)];
    const isRunning = row.status === "running";
    const dangerWarning = row.role === "Approver" ? `<p style="color:#e74c3c;font-weight:bold;margin-top:8px">⚠ 承認が必要な操作です (${esc(row.role)} ロール)</p>` : "";
    const bodyHTML = `
      <table class="data-table" style="margin-bottom:12px">
        <tr><th>サービス名</th><td>${esc(row.name)}</td></tr>
        <tr><th>説明</th><td>${esc(row.desc)}</td></tr>
        <tr><th>状態</th><td><span class="pill ${isRunning ? "" : "pill-deny"}">${esc(row.status)}</span></td></tr>
        <tr><th>必要ロール</th><td>${esc(row.role)}</td></tr>
        <tr><th>ポート</th><td>${row.port || "-"}</td></tr>
        <tr><th>PID</th><td>${row.pid || "-"}</td></tr>
        <tr><th>稼働時間</th><td>${esc(row.uptime)}</td></tr>
        <tr><th>メモリ使用量</th><td>${esc(row.memory)}</td></tr>
      </table>
      ${dangerWarning}`;
    const actions = [];
    if (isRunning) {
      actions.push({ label: "再起動", class: "btn-warning", onclick: () => { showServiceConfirm(row, "restart"); } });
      actions.push({ label: "停止", class: "btn-danger", onclick: () => { showServiceConfirm(row, "stop"); } });
    } else {
      actions.push({ label: "起動", class: "btn-primary", onclick: () => { row.status = "running"; showToast(row.name + " を起動しました", "success"); audits.unshift({ text: row.name + " を起動しました", user: "operator01", action: "start", target: row.name, result: "success", timestamp: new Date().toISOString() }); render(); } });
    }
    showModal(row.name + " - サービス制御", bodyHTML, actions);
  }

  /* --- Approval workflow --- */
  const approveBtn = e.target.closest("[data-approval]");
  if (approveBtn) {
    const idx = Number(approveBtn.dataset.approval);
    const req = approvalRequests[idx];
    showModal("承認確認", `<p><strong>${esc(req.id)}: ${esc(req.title)}</strong> を承認しますか？</p><p>申請者: ${esc(req.requester)} | 理由: ${esc(req.reason)}</p>`, [
      { label: "承認する", class: "btn-primary", onclick: () => { req.status = "approved"; audits.unshift({ text: req.title + " を承認しました", user: "approver01", action: "approve", target: req.target, result: "success", timestamp: new Date().toISOString() }); showToast(req.id + " を承認しました", "success"); render(); } }
    ]);
    return;
  }
  const rejectBtn = e.target.closest("[data-rejection]");
  if (rejectBtn) {
    const idx = Number(rejectBtn.dataset.rejection);
    const req = approvalRequests[idx];
    showModal("却下確認", `<p><strong>${esc(req.id)}: ${esc(req.title)}</strong> を却下しますか？</p><p>申請者: ${esc(req.requester)} | 理由: ${esc(req.reason)}</p>`, [
      { label: "却下する", class: "btn-danger", onclick: () => { req.status = "rejected"; audits.unshift({ text: req.title + " を却下しました", user: "approver01", action: "reject", target: req.target, result: "denied", timestamp: new Date().toISOString() }); showToast(req.id + " を却下しました", "warning"); render(); } }
    ]);
    return;
  }

  /* --- Audit log detail modal --- */
  const auditRow = e.target.closest("[data-audit-detail]") || e.target.closest("[data-audit]");
  if (auditRow) {
    const idx = Number(auditRow.dataset.auditDetail ?? auditRow.dataset.audit);
    const entry = audits[idx];
    if (entry) {
      const bodyHTML = `
        <table class="data-table">
          <tr><th>操作内容</th><td>${esc(entry.text)}</td></tr>
          <tr><th>実行ユーザー</th><td>${esc(entry.user)}</td></tr>
          <tr><th>アクション</th><td>${esc(entry.action)}</td></tr>
          <tr><th>対象</th><td>${esc(entry.target)}</td></tr>
          <tr><th>結果</th><td><span class="pill">${esc(entry.result)}</span></td></tr>
          <tr><th>ISO タイムスタンプ</th><td><code>${esc(entry.timestamp)}</code></td></tr>
          <tr><th>ローカル日時</th><td>${new Date(entry.timestamp).toLocaleString("ja-JP")}</td></tr>
        </table>`;
      showModal("監査ログ詳細", bodyHTML, []);
    }
  }

  const setting = e.target.closest("[data-setting]"); if (setting) { state.selectedSetting = setting.dataset.setting; renderLists(); }
});
function showServiceConfirm(row, action) {
  const actionLabel = action === "restart" ? "再起動" : "停止";
  const warning = row.role === "Approver" ? `<p style="color:#e74c3c;font-weight:bold">⚠ 承認が必要な操作です — この操作は Approver ロールの承認を必要とします。</p><p>Allowlist に登録された wrapper スクリプト経由でのみ実行されます。</p>` : `<p>この操作は allowlist に登録された wrapper 経由で実行されます。</p>`;
  showModal(`${esc(row.name)} — ${actionLabel}確認`, `<p><strong>${esc(row.name)}</strong> を${actionLabel}しますか？</p>${warning}`, [
    { label: `${actionLabel}を実行`, class: action === "stop" ? "btn-danger" : "btn-warning", onclick: () => {
      if (action === "restart") { row.status = "running"; }
      if (action === "stop") { row.status = "stopped"; }
      audits.unshift({ text: `${row.name} を${actionLabel}しました`, user: "operator01", action: action, target: row.name, result: "success", timestamp: new Date().toISOString() });
      showToast(`${row.name} を${actionLabel}しました`, action === "stop" ? "warning" : "success");
      render();
    }}
  ]);
}
qs("#refreshBtn").addEventListener("click", () => { forbidden = [`${new Date().toLocaleTimeString("ja-JP", { hour: "2-digit", minute: "2-digit" })} deny ルール再確認`, ...forbidden].slice(0, 5); showToast("deny ルールを再確認しました", "success"); render(); });
render();

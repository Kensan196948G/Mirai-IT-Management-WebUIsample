const services = [{ name: "nginx.service", role: "Operator", status: "running" }, { name: "sshd.service", role: "Approver", status: "running" }, { name: "backup-agent.service", role: "Operator", status: "stopped" }];
const processes = ["postgres", "python api.main", "journalctl tail", "backup wrapper"];
const network = ["interfaces-detail", "dns-config", "active-connections", "routing and gateways"];
const firewall = ["UFW ルール管理", "Security updates", "Package upgradeable", "SSH 設定"];
let forbidden = ["任意コマンドの実行", "bash / sh の起動", "/etc 配下の直接編集", "sudo権限の直接追加", "危険文字を含む入力"];
const fixes = ["全55ページのサイドバー修正", "API 500 エラー修正", "テスト高速化", "WebSocket 自動再接続", "vendor 化対応"];
const roles = ["Viewer: 参照のみ", "Operator: 限定操作", "Approver: 危険操作承認", "Admin: 設定管理"];
const approvals = ["申請内容の起案", "allowlist と影響範囲の確認", "Approver / Admin の承認", "wrapper 経由で実行し監査ログ記録"];
const audits = ["shell=True を使用しない", "sudo は wrapper 経由のみ", "deny by default を維持", "操作証跡を JSON ログ化", "危険変更は人間レビュー必須"];
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
function renderOverview() { qs("#forbiddenList").innerHTML = forbidden.map((item) => `<div class="list-card"><span class="pill">Deny</span><p>${esc(item)}</p></div>`).join(""); qs("#fixList").innerHTML = fixes.map((item) => `<div class="list-card"><span class="pill">Fix</span><p>${esc(item)}</p></div>`).join(""); qs("#serviceChart").innerHTML = serviceChart.map((item) => `<div class="bar-row"><span>${esc(item.name)}</span><div class="bar-track"><span style="width:${item.value}%"></span></div><strong>${esc(item.value)}%</strong></div>`).join(""); qs("#auditTable").innerHTML = `<table class="data-table"><thead><tr><th>監査項目</th><th>状態</th></tr></thead><tbody>${audits.map((row) => `<tr><td>${esc(row)}</td><td>OK</td></tr>`).join("")}</tbody></table>`; }
function renderLists() {
  qs("#serviceList").innerHTML = filteredServices().map((item, index) => `<button class="list-card" data-service="${index}"><strong>${esc(item.name)}</strong><p>${esc(item.role)}</p><span class="pill">${esc(item.status)}</span></button>`).join("");
  qs("#processList").innerHTML = processes.map((item) => `<div class="list-card"><strong>${esc(item)}</strong><p>Running Processes</p><span class="pill">process</span></div>`).join("");
  qs("#networkList").innerHTML = network.map((item) => `<div class="list-card"><strong>${esc(item)}</strong><p>Network Configuration</p><span class="pill">network</span></div>`).join("");
  qs("#firewallList").innerHTML = firewall.map((item) => `<div class="list-card"><strong>${esc(item)}</strong><p>Security / Updates</p><span class="pill">firewall</span></div>`).join("");
  qs("#roleList").innerHTML = roles.map((item) => `<div class="list-card"><strong>${esc(item)}</strong><p>README のユーザーロール</p><span class="pill">role</span></div>`).join("");
  qs("#approvalList").innerHTML = approvals.map((item) => `<div class="list-card"><strong>${esc(item)}</strong><p>承認フロー</p><span class="pill">approval</span></div>`).join("");
  qs("#auditList").innerHTML = audits.map((item) => `<div class="list-card"><strong>${esc(item)}</strong><p>統制チェック</p><span class="pill">audit</span></div>`).join("");
  qs("#settingsList").innerHTML = settings.map((item) => `<button class="list-card ${item.name === state.selectedSetting ? "is-selected" : ""}" data-setting="${esc(item.name)}"><strong>${esc(item.name)}</strong><p>${esc(item.value)}</p><span class="pill">setting</span></button>`).join("");
  const setting = settings.find((item) => item.name === state.selectedSetting) || settings[0];
  qs("#settingsDetail").innerHTML = `<div class="list-card"><strong>${esc(setting.name)}</strong><p>現在値: ${esc(setting.value)}</p><span class="pill">detail</span><p>${esc(setting.note)}</p></div>`;
}
function syncView() { const titles = { overview: "ダッシュボード", services: "System Servers", processes: "Processes", network: "Network", firewall: "Firewall", approvals: "承認", audit: "監査", settings: "システム設定" }; qs("#pageTitle").textContent = titles[state.view]; qsa(".nav-item").forEach((n) => { const a = n.dataset.view === state.view; n.classList.toggle("is-active", a); a ? n.setAttribute("aria-current", "page") : n.removeAttribute("aria-current"); }); qsa(".view").forEach((v) => v.classList.toggle("is-active", v.id === `view-${state.view}`)); }
function render() { renderHero(); renderStats(); renderOverview(); renderLists(); syncView(); }
document.addEventListener("click", (e) => { const nav = e.target.closest("[data-view]"); if (nav) { state.view = nav.dataset.view; render(); } const service = e.target.closest("[data-service]"); if (service) { const row = filteredServices()[Number(service.dataset.service)]; row.status = row.status === "running" ? "stopped" : "running"; showToast(row.name + " → " + row.status, row.status === "running" ? "success" : "warning"); render(); } const setting = e.target.closest("[data-setting]"); if (setting) { state.selectedSetting = setting.dataset.setting; renderLists(); } });
qs("#refreshBtn").addEventListener("click", () => { forbidden = [`${new Date().toLocaleTimeString("ja-JP", { hour: "2-digit", minute: "2-digit" })} deny ルール再確認`, ...forbidden].slice(0, 5); showToast("deny ルールを再確認しました", "success"); render(); });
render();

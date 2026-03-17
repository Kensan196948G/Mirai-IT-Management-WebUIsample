const pipeline = [
  { stage: "Claude", role: "初期回答生成", model: "claude-3-5-sonnet-20241022" },
  { stage: "Gemini", role: "検証・補完", model: "gemini-1.5-flash" },
  { stage: "Perplexity", role: "最新情報補完・引用", model: "llama-3.1-sonar-small-128k-online" }
];
let tickets = [
  { id: "HD-101", title: "VPN接続が不安定", status: "Open", owner: "IT Support" },
  { id: "HD-102", title: "Teams通知が届かない", status: "In Progress", owner: "Infra Team" },
  { id: "HD-103", title: "PC更改手順を知りたい", status: "Resolved", owner: "AI Bot" }
];
const faqs = ["パスワード再設定の手順", "VPNクライアントの初期設定", "Windows更新後の確認項目", "PC申請フローの問い合わせ先"];
const ops = ["開発/本番 WebUI をポート分離して配信", "共有フォルダ不安定時は一時領域へミラー", "Playwright で UI / セキュリティ / 性能を確認"];
const tests = ["Pester: scripts/Run-Tests.ps1 -Type all", "Playwright: npx playwright test", "ヘルスチェック: /api/health", "共有フォルダ配信確認"];
const categoryBreakdown = [
  { name: "VPN", value: 36 },
  { name: "端末", value: 28 },
  { name: "認証", value: 21 },
  { name: "申請", value: 15 }
];
const settings = [
  { name: "PipelineMode", value: "Full", note: "Claude + Gemini + Perplexity を使用" },
  { name: "Cache", value: "有効", note: "同一問い合わせの再利用を許可" },
  { name: "Fallback", value: "有効", note: "全ステージ失敗時に標準応答" },
  { name: "配信ポート", value: "8282 / 8283", note: "本番 / 開発を分離" }
];
let chats = ["ユーザー: VPNが切れます", "AI: 接続ログとエラーメッセージを確認してください", "Gemini: 証明書期限切れの可能性", "Perplexity: 参考URL候補を提示"];
const state = { view: "overview", mode: "Full", selectedSetting: settings[0].name };
const qs = (s) => document.querySelector(s);
const qsa = (s) => Array.from(document.querySelectorAll(s));
const esc = (v) => String(v).replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;");
function renderHero() { const items = [["AIステージ", pipeline.length], ["チケット", tickets.length], ["FAQ", faqs.length]]; qs("#heroBadges").innerHTML = items.map(([label, value]) => `<div class="hero-badge"><strong>${esc(value)}</strong><span>${esc(label)}</span></div>`).join(""); }
function renderStats() { const stats = [["モード", state.mode, "PipelineMode"], ["Open", tickets.filter((t) => t.status === "Open").length, "未着手"], ["Resolved", tickets.filter((t) => t.status === "Resolved").length, "解決済み"], ["会話ログ", chats.length, "最新4件"]]; qs("#statsGrid").innerHTML = stats.map(([label, value, note]) => `<article class="stat-card"><span class="meta">${esc(label)}</span><strong>${esc(value)}</strong><span class="meta">${esc(note)}</span></article>`).join(""); }
function renderOverview() { qs("#chatLog").innerHTML = chats.map((item) => `<div class="list-card"><span class="pill">Chat</span><p>${esc(item)}</p></div>`).join(""); qs("#opsList").innerHTML = ops.map((item) => `<div class="list-card"><span class="pill">Ops</span><p>${esc(item)}</p></div>`).join(""); qs("#categoryChart").innerHTML = categoryBreakdown.map((item) => `<div class="bar-row"><span>${esc(item.name)}</span><div class="bar-track"><span style="width:${item.value}%"></span></div><strong>${esc(item.value)}%</strong></div>`).join(""); qs("#ticketTable").innerHTML = `<table class="data-table"><thead><tr><th>ID</th><th>件名</th><th>状態</th></tr></thead><tbody>${tickets.map((row) => `<tr><td>${esc(row.id)}</td><td>${esc(row.title)}</td><td>${esc(row.status)}</td></tr>`).join("")}</tbody></table>`; }
function renderLists() {
  qs("#conversationList").innerHTML = chats.map((item) => `<div class="list-card"><strong>${esc(item.split(":")[0])}</strong><p>${esc(item)}</p><span class="pill">${esc(state.mode)}</span></div>`).join("");
  qs("#pipelineList").innerHTML = pipeline.map((item) => `<div class="list-card"><strong>${esc(item.stage)}</strong><p>${esc(item.role)}</p><span class="pill">${esc(item.model)}</span></div>`).join("");
  qs("#ticketList").innerHTML = tickets.map((item, index) => `<button class="list-card" data-ticket="${index}"><strong>${esc(item.id)} ${esc(item.title)}</strong><p>${esc(item.owner)}</p><span class="pill">${esc(item.status)}</span></button>`).join("");
  qs("#faqList").innerHTML = faqs.map((item) => `<div class="list-card"><strong>${esc(item)}</strong><p>AIとFAQ検索で回答可能</p><span class="pill">${esc(state.mode)}</span></div>`).join("");
  qs("#operationList").innerHTML = ops.map((item) => `<div class="list-card"><strong>${esc(item)}</strong><p>README の運用メモ</p><span class="pill">ops</span></div>`).join("");
  qs("#testList").innerHTML = tests.map((item) => `<div class="list-card"><strong>${esc(item)}</strong><p>検証手順</p><span class="pill">test</span></div>`).join("");
  qs("#settingsList").innerHTML = settings.map((item) => `<button class="list-card ${item.name === state.selectedSetting ? "is-selected" : ""}" data-setting="${esc(item.name)}"><strong>${esc(item.name)}</strong><p>${esc(item.value)}</p><span class="pill">setting</span></button>`).join("");
  const setting = settings.find((item) => item.name === state.selectedSetting) || settings[0];
  qs("#settingsDetail").innerHTML = `<div class="list-card"><strong>${esc(setting.name)}</strong><p>現在値: ${esc(setting.value)}</p><span class="pill">detail</span><p>${esc(setting.note)}</p></div>`;
}
function syncView() { const titles = { overview: "ダッシュボード", conversation: "AI会話", pipeline: "AIパイプライン", tickets: "チケット", faq: "FAQ", operations: "運用", tests: "テスト", settings: "システム設定" }; qs("#pageTitle").textContent = titles[state.view]; qsa(".nav-item").forEach((n) => n.classList.toggle("is-active", n.dataset.view === state.view)); qsa(".view").forEach((v) => v.classList.toggle("is-active", v.id === `view-${state.view}`)); }
function render() { renderHero(); renderStats(); renderOverview(); renderLists(); syncView(); }
document.addEventListener("click", (e) => { const nav = e.target.closest("[data-view]"); if (nav) { state.view = nav.dataset.view; render(); } const ticket = e.target.closest("[data-ticket]"); if (ticket) { const row = tickets[Number(ticket.dataset.ticket)]; row.status = row.status === "Resolved" ? "Open" : "Resolved"; render(); } const setting = e.target.closest("[data-setting]"); if (setting) { state.selectedSetting = setting.dataset.setting; renderLists(); } });
qs("#askDemoBtn").addEventListener("click", () => { chats = [`AI(${state.mode}): 問い合わせを受け付けました`, ...chats].slice(0, 6); render(); });
qs("#sendQuestionBtn").addEventListener("click", () => { const value = qs("#questionInput").value.trim(); if (!value) return; chats = [`ユーザー: ${value}`, `AI(${state.mode}): 質問を解析しました`, ...chats].slice(0, 8); qs("#questionInput").value = ""; render(); state.view = "conversation"; syncView(); });
render();

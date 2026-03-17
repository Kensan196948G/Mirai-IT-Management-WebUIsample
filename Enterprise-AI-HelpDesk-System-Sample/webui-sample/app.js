const pipeline = [
  { stage: "Claude", role: "初期回答生成", model: "claude-3-5-sonnet-20241022" },
  { stage: "Gemini", role: "検証・補完", model: "gemini-1.5-flash" },
  { stage: "Perplexity", role: "最新情報補完・引用", model: "llama-3.1-sonar-small-128k-online" }
];
const tickets = [
  { id: "HD-101", title: "VPN接続が不安定", status: "Open", owner: "IT Support" },
  { id: "HD-102", title: "Teams通知が届かない", status: "In Progress", owner: "Infra Team" },
  { id: "HD-103", title: "PC更改手順を知りたい", status: "Resolved", owner: "AI Bot" }
];
const faqs = [
  "パスワード再設定の手順",
  "VPNクライアントの初期設定",
  "Windows更新後の確認項目",
  "PC申請フローの問い合わせ先"
];
const ops = [
  "開発/本番 WebUI をポート分離して配信",
  "共有フォルダ不安定時は一時領域へミラー",
  "Playwright で UI / セキュリティ / 性能を確認"
];
let chats = [
  "ユーザー: VPNが切れます",
  "AI: 接続ログとエラーメッセージを確認してください",
  "Gemini: 原因候補は証明書期限切れの可能性",
  "Perplexity: 参考URL候補を提示"
];
const state = { view: "overview", mode: "Full" };
const qs = (s) => document.querySelector(s);
const qsa = (s) => Array.from(document.querySelectorAll(s));
const esc = (v) => String(v).replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;");

function renderHero() {
  const items = [["AIステージ", pipeline.length], ["チケット", tickets.length], ["FAQ", faqs.length]];
  qs("#heroBadges").innerHTML = items.map(([label, value]) => `<div class="hero-badge"><strong>${esc(value)}</strong><span>${esc(label)}</span></div>`).join("");
}
function renderStats() {
  const stats = [
    ["モード", state.mode, "PipelineMode"],
    ["Open", tickets.filter((t) => t.status === "Open").length, "未着手"],
    ["Resolved", tickets.filter((t) => t.status === "Resolved").length, "解決済み"],
    ["会話ログ", chats.length, "最新4件"]
  ];
  qs("#statsGrid").innerHTML = stats.map(([label, value, note]) => `<article class="stat-card"><span class="meta">${esc(label)}</span><strong>${esc(value)}</strong><span class="meta">${esc(note)}</span></article>`).join("");
}
function renderOverview() {
  qs("#chatLog").innerHTML = chats.map((item) => `<div class="list-card"><span class="pill">Chat</span><p>${esc(item)}</p></div>`).join("");
  qs("#opsList").innerHTML = ops.map((item) => `<div class="list-card"><span class="pill">Ops</span><p>${esc(item)}</p></div>`).join("");
}
function renderLists() {
  qs("#pipelineList").innerHTML = pipeline.map((item) => `<div class="list-card"><strong>${esc(item.stage)}</strong><p>${esc(item.role)}</p><span class="pill">${esc(item.model)}</span></div>`).join("");
  qs("#ticketList").innerHTML = tickets.map((item) => `<div class="list-card"><strong>${esc(item.id)} ${esc(item.title)}</strong><p>${esc(item.owner)}</p><span class="pill">${esc(item.status)}</span></div>`).join("");
  qs("#faqList").innerHTML = faqs.map((item) => `<div class="list-card"><strong>${esc(item)}</strong><p>AIとFAQ検索で回答可能</p><span class="pill">${esc(state.mode)}</span></div>`).join("");
}
function syncView() {
  const titles = { overview: "概要", pipeline: "AIパイプライン", tickets: "チケット", faq: "FAQ" };
  qs("#pageTitle").textContent = titles[state.view];
  qsa(".nav-item").forEach((n) => n.classList.toggle("is-active", n.dataset.view === state.view));
  qsa(".view").forEach((v) => v.classList.toggle("is-active", v.id === `view-${state.view}`));
}
function render() { renderHero(); renderStats(); renderOverview(); renderLists(); syncView(); }
document.addEventListener("click", (e) => { const nav = e.target.closest("[data-view]"); if (nav) { state.view = nav.dataset.view; render(); } });
qs("#modeSelect").addEventListener("change", (e) => { state.mode = e.target.value; render(); });
qs("#askDemoBtn").addEventListener("click", () => { chats = [`AI(${state.mode}): 問い合わせを受け付けました`, ...chats].slice(0, 5); render(); });
render();

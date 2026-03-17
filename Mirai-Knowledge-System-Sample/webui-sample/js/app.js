const knowledge = [
  { id: 1, title: "高所作業 SOP", kind: "SOP", area: "安全", status: "承認済み", author: "山田太郎", created: "2025-11-10", summary: "高所作業における安全帯の使用基準、足場点検チェックリスト、作業前KY活動の標準手順を定めたSOP。労働安全衛生法に基づく墜落防止措置を網羅する。" },
  { id: 2, title: "コンクリート打設温度管理", kind: "品質", area: "品質", status: "配信中", author: "佐藤花子", created: "2025-12-01", summary: "暑中・寒中コンクリート打設時の温度管理基準。練混ぜから打設完了までの温度記録方法、養生期間の判定基準、強度試験との関連を記載。" },
  { id: 3, title: "土砂運搬規制改正", kind: "法令", area: "法令", status: "見直し中", author: "鈴木一郎", created: "2026-01-15", summary: "2026年施行の土砂運搬に関する改正道路交通法の要点。過積載基準の厳格化、運搬経路届出の義務拡大、違反時の罰則強化について整理。" },
  { id: 4, title: "切梁撤去時の挟圧事例", kind: "事故", area: "事故", status: "重要", author: "田中誠", created: "2026-02-20", summary: "切梁撤去作業中に発生した挟圧ヒヤリ事例。仮設構造物の自重による不意の変位が原因。撤去手順の見直しと立入禁止区域の再設定を提言。" },
  { id: 5, title: "鉄筋組立精度の出来形管理", kind: "品質", area: "出来形", status: "下書き", author: "高橋次郎", created: "2026-03-01", summary: "鉄筋の組立精度（かぶり厚、配筋間隔、定着長）を出来形管理基準に基づいて検査・記録する手順。写真管理要領と合わせた品質証跡の作成方法を解説。" },
  { id: 6, title: "仮設足場コスト最適化手法", kind: "SOP", area: "原価", status: "下書き", author: "中村裕子", created: "2026-03-05", summary: "仮設足場の設計段階でのコスト最適化手法。リース単価比較、転用計画の立案、工期短縮によるコスト削減効果の算定方法を体系化。" },
  { id: 7, title: "安全帯フルハーネス移行ガイド", kind: "法令", area: "安全", status: "承認済み", author: "山田太郎", created: "2026-02-10", summary: "フルハーネス型墜落制止用器具への移行に伴う現場対応ガイド。対象作業の判定フロー、器具選定基準、特別教育の実施要領を網羅。" }
];
let notices = ["重要ヒヤリ事例を3件検知", "法令改正ナレッジの再確認が必要", "承認待ち配信が2件あります"];
const kpis = ["統合ナレッジ 842 件", "承認フロー稼働 128 件", "週次配信 96 件"];
const approvals = [
  { id: 1, title: "鉄筋組立精度の出来形管理", applicant: "高橋次郎", date: "2026-03-01", stage: "申請中", stages: ["申請中", "一次承認", "二次承認", "配信"], currentIndex: 0, knowledgeId: 5 },
  { id: 2, title: "仮設足場コスト最適化手法", applicant: "中村裕子", date: "2026-03-05", stage: "一次承認", stages: ["申請中", "一次承認", "二次承認", "配信"], currentIndex: 1, knowledgeId: 6 },
  { id: 3, title: "安全帯フルハーネス移行ガイド", applicant: "山田太郎", date: "2026-02-10", stage: "配信", stages: ["申請中", "一次承認", "二次承認", "配信"], currentIndex: 3, knowledgeId: 7 },
  { id: 4, title: "高所作業 SOP 改訂版", applicant: "山田太郎", date: "2026-03-15", stage: "二次承認", stages: ["申請中", "一次承認", "二次承認", "配信"], currentIndex: 2, knowledgeId: 1 }
];
const incidents = [
  { id: 1, title: "挟圧ヒヤリ: 再発防止策の横展開", severity: "重大", date: "2026-02-18", location: "A工区 切梁撤去現場", situation: "切梁撤去作業中、作業員が撤去対象の切梁直下で資材整理を行っていたところ、隣接する切梁が自重により約5cm変位し、作業員の腕に接触した。", cause: "撤去手順書に切梁間の相互影響に関する記載がなく、隣接切梁の仮固定措置が不十分であった。また、作業区域の立入制限範囲が狭く設定されていた。", prevention: "1. 切梁撤去手順書に隣接部材の仮固定確認項目を追加\n2. 立入禁止区域を撤去対象から水平方向3m以上に拡大\n3. 撤去前に構造計算による変位予測を実施\n4. 全現場へ横展開通知を配信" },
  { id: 2, title: "足場点検漏れ: SOP改訂候補", severity: "中", date: "2026-03-02", location: "B工区 外壁施工エリア", situation: "週次点検で足場の壁つなぎ1箇所が未設置であることが判明。当該箇所は前週の工程変更で足場を延長した部分であり、延長時の点検記録が未作成であった。", cause: "足場延長作業後の完了検査チェックリストに壁つなぎの確認項目が含まれていなかった。工程変更時のSOP適用手順が不明確であった。", prevention: "1. 足場変更・延長時の完了検査チェックリストを改訂し壁つなぎ項目を追加\n2. 工程変更時のSOP適用フローを明文化\n3. 足場変更後24時間以内の再点検を義務化" },
  { id: 3, title: "重機動線交錯: 現場注意喚起", severity: "軽微", date: "2026-03-10", location: "C工区 土工エリア", situation: "バックホウ旋回範囲内にダンプトラックが進入し、旋回中のバケットとダンプの荷台が約1mまで接近した。誘導員の合図で停止し接触には至らなかった。", cause: "重機動線とダンプ搬入路の交差点における一時停止ルールが徹底されていなかった。誘導員の配置場所が交差点から離れていた。", prevention: "1. 交差点にカラーコーンとバリケードで一時停止ゾーンを設置\n2. 誘導員の配置場所を交差点の見通しの良い位置に変更\n3. 朝礼時に重機動線図を再周知" },
  { id: 4, title: "型枠支保工倒壊リスク検知", severity: "重大", date: "2026-03-12", location: "D工区 橋梁下部工", situation: "型枠支保工の鋼管支柱に傾斜が確認され、水平度測定で許容値を超える2度の傾きを検知。直ちに作業中止し退避を実施。", cause: "支保工基礎の地盤が前日の降雨で軟弱化し、不同沈下が発生。基礎部の地耐力確認が設置時の1回のみで、降雨後の再確認を行っていなかった。", prevention: "1. 降雨後の支保工基礎の地耐力再確認を義務化\n2. 鋼管支柱に傾斜センサーを設置し常時モニタリング\n3. 支保工設置基準に地盤条件に応じた基礎補強要件を追加" },
  { id: 5, title: "クレーンワイヤロープ損傷発見", severity: "中", date: "2026-03-14", location: "A工区 鉄骨建方エリア", situation: "始業前点検でクレーンの主巻ワイヤロープに素線切れ5本を発見。前日の作業終了時点検では異常なしと記録されていた。", cause: "ワイヤロープが鉄骨のエッジ部と繰り返し接触していたことによる摩耗。玉掛け時の当て物の使用が不十分であった。", prevention: "1. 玉掛け作業時の当て物使用を必須とし、チェックリストに追加\n2. ワイヤロープの点検頻度を始業前・昼休み後・終業時の3回に増加\n3. ワイヤロープ交換基準の再教育を実施" }
];
const consults = ["専門家に施工手順の是正相談", "Q&A をナレッジ化して再利用", "回答配信後に改訂履歴へ反映"];
const audits = ["参照ログ", "変更ログ", "配信履歴", "部門別閲覧率", "重要通知既読率"];
const knowledgeChart = [
  { name: "SOP", value: 29 },
  { name: "品質", value: 28 },
  { name: "法令", value: 22 },
  { name: "事故", value: 14 },
  { name: "原価", value: 7 }
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
function renderOverview() { qs("#noticeList").innerHTML = notices.map((item) => `<div class="list-card"><span class="pill">Notice</span><p>${esc(item)}</p></div>`).join(""); qs("#kpiList").innerHTML = kpis.map((item) => `<div class="list-card"><span class="pill">KPI</span><p>${esc(item)}</p></div>`).join(""); qs("#knowledgeChart").innerHTML = knowledgeChart.map((item) => `<div class="bar-row"><span>${esc(item.name)}</span><div class="bar-track"><span style="width:${item.value}%"></span></div><strong>${esc(item.value)}%</strong></div>`).join(""); qs("#knowledgeTable").innerHTML = `<table class="data-table"><thead><tr><th>タイトル</th><th>種別</th><th>分野</th><th>状態</th><th>作成者</th></tr></thead><tbody>${knowledge.map((row) => `<tr style="cursor:pointer" data-knowledge-id="${row.id}"><td>${esc(row.title)}</td><td>${esc(row.kind)}</td><td>${esc(row.area)}</td><td>${esc(row.status)}</td><td>${esc(row.author)}</td></tr>`).join("")}</tbody></table>`; }
function renderLists() {
  qs("#knowledgeList").innerHTML = filteredKnowledge().map((item) => `<div class="list-card" style="cursor:pointer" data-knowledge-id="${item.id}"><strong>${esc(item.title)}</strong><p>${esc(item.area)} — ${esc(item.author)}</p><span class="pill">${esc(item.kind)} / ${esc(item.status)}</span></div>`).join("");
  qs("#searchResultList").innerHTML = filteredKnowledge().map((item) => `<div class="list-card"><strong>${esc(item.title)}</strong><p>関連: ${esc(item.kind)} / ${esc(item.area)}</p><span class="pill">recommend</span></div>`).join("");
  qs("#approvalList").innerHTML = approvals.map((item) => { const stageColors = { "申請中": "#e67e22", "一次承認": "#2980b9", "二次承認": "#8e44ad", "配信": "#27ae60" }; const col = stageColors[item.stage] || "#7f8c8d"; return `<div class="list-card" style="cursor:pointer;border-left:4px solid ${col}" data-approval-id="${item.id}"><strong>${esc(item.title)}</strong><p>${esc(item.applicant)} — ${esc(item.date)}</p><div style="display:flex;gap:4px;margin-top:4px">${item.stages.map((s, i) => `<span class="pill" style="font-size:0.7rem;${i === item.currentIndex ? "background:" + col + ";color:#fff" : ""}">${esc(s)}</span>`).join("")}</div></div>`; }).join("");
  qs("#incidentList").innerHTML = incidents.map((item) => { const sevColor = item.severity === "重大" ? "#c0392b" : item.severity === "中" ? "#e67e22" : "#27ae60"; return `<div class="list-card" style="cursor:pointer" data-incident-id="${item.id}"><strong>${esc(item.title)}</strong><p>${esc(item.location)} — ${esc(item.date)}</p><span class="pill" style="background:${sevColor};color:#fff">${esc(item.severity)}</span></div>`; }).join("");
  qs("#consultList").innerHTML = consults.map((item) => `<div class="list-card"><strong>${esc(item)}</strong><p>専門家相談</p><span class="pill">consult</span></div>`).join("");
  qs("#auditList").innerHTML = audits.map((item) => `<div class="list-card"><strong>${esc(item)}</strong><p>監査/KPI観点</p><span class="pill">audit</span></div>`).join("");
  qs("#settingsList").innerHTML = settings.map((item) => `<button class="list-card ${item.name === state.selectedSetting ? "is-selected" : ""}" data-setting="${esc(item.name)}"><strong>${esc(item.name)}</strong><p>${esc(item.value)}</p><span class="pill">setting</span></button>`).join("");
  const setting = settings.find((item) => item.name === state.selectedSetting) || settings[0];
  qs("#settingsDetail").innerHTML = `<div class="list-card"><strong>${esc(setting.name)}</strong><p>現在値: ${esc(setting.value)}</p><span class="pill">detail</span><p>${esc(setting.note)}</p></div>`;
}
function syncView() { const titles = { overview: "ダッシュボード", knowledge: "ナレッジ", search: "検索・推薦", approvals: "承認・配信", incidents: "事故・ヒヤリ", consultation: "専門家相談", audit: "監査・KPI", settings: "システム設定" }; qs("#pageTitle").textContent = titles[state.view]; qsa(".nav-item").forEach((n) => { const a = n.dataset.view === state.view; n.classList.toggle("is-active", a); a ? n.setAttribute("aria-current", "page") : n.removeAttribute("aria-current"); }); qsa(".view").forEach((v) => v.classList.toggle("is-active", v.id === `view-${state.view}`)); }
function showKnowledgeDetail(id) {
  const item = knowledge.find((k) => k.id === id);
  if (!item) return;
  const statusClass = item.status === "重要" ? "color:#c0392b;font-weight:bold" : item.status === "下書き" ? "color:#7f8c8d" : "color:#27ae60";
  const body = `
    <div style="display:grid;gap:12px">
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px">
        <div><span class="meta">種別</span><p><strong>${esc(item.kind)}</strong></p></div>
        <div><span class="meta">分野</span><p><strong>${esc(item.area)}</strong></p></div>
        <div><span class="meta">ステータス</span><p style="${statusClass}"><strong>${esc(item.status)}</strong></p></div>
        <div><span class="meta">作成者</span><p><strong>${esc(item.author)}</strong></p></div>
      </div>
      <div><span class="meta">作成日</span><p>${esc(item.created)}</p></div>
      <hr style="border:none;border-top:1px solid var(--border)">
      <div><span class="meta">概要</span><p style="line-height:1.7">${esc(item.summary)}</p></div>
    </div>`;
  const actions = [];
  if (item.status === "下書き") {
    actions.push({ label: "承認申請", class: "primary", onclick: () => { const ap = approvals.find((a) => a.knowledgeId === id); if (!ap) { approvals.push({ id: approvals.length + 1, title: item.title, applicant: item.author, date: new Date().toISOString().slice(0, 10), stage: "申請中", stages: ["申請中", "一次承認", "二次承認", "配信"], currentIndex: 0, knowledgeId: id }); item.status = "申請中"; showToast(item.title + " の承認申請を提出しました", "success"); render(); } else { showToast("既に承認申請済みです", "info"); } document.querySelector(".modal-overlay").click(); } });
  }
  actions.push({ label: "閉じる", onclick: () => document.querySelector(".modal-overlay").click() });
  showModal(item.title, body, actions);
}
function showIncidentDetail(id) {
  const item = incidents.find((inc) => inc.id === id);
  if (!item) return;
  const sevColor = item.severity === "重大" ? "#c0392b" : item.severity === "中" ? "#e67e22" : "#27ae60";
  const body = `
    <div style="display:grid;gap:14px">
      <div style="display:flex;gap:16px;align-items:center">
        <span class="pill" style="background:${sevColor};color:#fff">${esc(item.severity)}</span>
        <span class="meta">${esc(item.date)}</span>
        <span class="meta">${esc(item.location)}</span>
      </div>
      <hr style="border:none;border-top:1px solid var(--border)">
      <div>
        <h4 style="margin:0 0 6px">発生状況</h4>
        <p style="line-height:1.7;background:var(--surface);padding:10px;border-radius:6px">${esc(item.situation)}</p>
      </div>
      <div>
        <h4 style="margin:0 0 6px">原因分析</h4>
        <p style="line-height:1.7;background:var(--surface);padding:10px;border-radius:6px">${esc(item.cause)}</p>
      </div>
      <div>
        <h4 style="margin:0 0 6px">再発防止策</h4>
        <p style="line-height:1.7;background:var(--surface);padding:10px;border-radius:6px;white-space:pre-line">${esc(item.prevention)}</p>
      </div>
    </div>`;
  showModal(item.title, body, [{ label: "閉じる", onclick: () => document.querySelector(".modal-overlay").click() }]);
}
function showApprovalDetail(id) {
  const item = approvals.find((a) => a.id === id);
  if (!item) return;
  const stageHTML = item.stages.map((s, i) => {
    const done = i < item.currentIndex;
    const current = i === item.currentIndex;
    const style = done ? "background:#27ae60;color:#fff" : current ? "background:#2980b9;color:#fff" : "background:var(--surface);color:var(--fg)";
    return `<div style="text-align:center;flex:1"><div style="padding:8px 4px;border-radius:6px;font-size:0.85rem;font-weight:${current ? "bold" : "normal"};${style}">${esc(s)}</div></div>`;
  }).join('<div style="display:flex;align-items:center;color:var(--muted)">→</div>');
  const body = `
    <div style="display:grid;gap:14px">
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px">
        <div><span class="meta">申請者</span><p><strong>${esc(item.applicant)}</strong></p></div>
        <div><span class="meta">申請日</span><p>${esc(item.date)}</p></div>
      </div>
      <div><span class="meta">承認ステージ</span></div>
      <div style="display:flex;gap:6px;align-items:center">${stageHTML}</div>
      <hr style="border:none;border-top:1px solid var(--border)">
      <div><span class="meta">現在のステータス: <strong>${esc(item.stage)}</strong></span></div>
    </div>`;
  const actions = [];
  if (item.currentIndex < item.stages.length - 1) {
    const nextStage = item.stages[item.currentIndex + 1];
    actions.push({ label: "承認 → " + nextStage, class: "primary", onclick: () => { item.currentIndex++; item.stage = item.stages[item.currentIndex]; if (item.currentIndex === item.stages.length - 1) { const kn = knowledge.find((k) => k.id === item.knowledgeId); if (kn) kn.status = "配信中"; } showToast(item.title + " を「" + item.stage + "」に進めました", "success"); render(); document.querySelector(".modal-overlay").click(); } });
  }
  actions.push({ label: "閉じる", onclick: () => document.querySelector(".modal-overlay").click() });
  showModal("承認: " + item.title, body, actions);
}
function render() { renderHero(); renderStats(); renderOverview(); renderLists(); syncView(); }
document.addEventListener("click", (e) => { const nav = e.target.closest("[data-view]"); if (nav) { state.view = nav.dataset.view; render(); } const setting = e.target.closest("[data-setting]"); if (setting) { state.selectedSetting = setting.dataset.setting; showToast(setting.dataset.setting + " を選択", "success"); renderLists(); } const knCard = e.target.closest("[data-knowledge-id]"); if (knCard) { showKnowledgeDetail(Number(knCard.dataset.knowledgeId)); } const incCard = e.target.closest("[data-incident-id]"); if (incCard) { showIncidentDetail(Number(incCard.dataset.incidentId)); } const apCard = e.target.closest("[data-approval-id]"); if (apCard) { showApprovalDetail(Number(apCard.dataset.approvalId)); } });
qs("#runSearchBtn").addEventListener("click", () => { state.query = qs("#searchTerm").value.trim(); showToast("検索を実行しました", "success"); state.view = "search"; render(); });
qs("#notifyBtn").addEventListener("click", () => { notices = [`${new Date().toLocaleTimeString("ja-JP", { hour: "2-digit", minute: "2-digit" })} 配信通知を更新`, ...notices].slice(0, 4); showToast("配信通知を更新しました", "success"); render(); });
render();

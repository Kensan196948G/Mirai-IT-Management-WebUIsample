# 🤖 Enterprise AI HelpDesk System

🏢 社内ヘルプデスク向けの AI 問い合わせシステムです。  
⚙️ PowerShell ベースの API と、🖥️ WebUI（開発/本番）で構成されています。

## ✨ 概要

- 💬 問い合わせ受付（AIサポート）
- 🧠 会話型 AI サポート（Conversation MVP）
- 🎫 チケット管理（一覧・状態フィルタ）
- ❓ FAQ 表示・検索
- 🧪 Playwright による E2E / UI / セキュリティ / 性能テスト

## 🧩 AIモデル構成（種類と役割）

本システムは、🔁 3段階の AI パイプラインで回答品質を高めます。

1. 🧠 `Claude`（初期回答生成）
- 🎯 役割: 問い合わせに対するベース回答の生成
- 📄 実装: `src/AI/ClaudeClient.ps1`
- 🏷️ 既定モデル: `claude-3-5-sonnet-20241022`

2. 🔮 `Gemini`（検証・補完）
- 🎯 役割: Claude 回答の妥当性チェックと補完
- 📄 実装: `src/AI/GeminiClient.ps1`
- 🏷️ 既定モデル: `gemini-1.5-flash`

3. 🌐 `Perplexity`（最新情報補完・引用）
- 🎯 役割: 最新情報の補足と参考URL（引用）の付与
- 📄 実装: `src/AI/PerplexityClient.ps1`
- 🏷️ 既定モデル: `llama-3.1-sonar-small-128k-online`

🔐 APIキー（SecretManager 経由）:
- `CLAUDE_API_KEY`
- `GEMINI_API_KEY`
- `PERPLEXITY_API_KEY`

## 🛠️ AI利用ロジック（処理フロー）

中核は `src/AI/AIPipeline.ps1` です。

1. 📥 入力受領
- 問い合わせ本文とカテゴリを受け取り、リクエストIDを採番

2. 🗂️ キャッシュ確認（有効時）
- 同一条件の回答があればキャッシュ結果を返却

3. ⚙️ ステージ実行
- ① 🧠 Claude: 初期回答生成
- ② 🔮 Gemini: 検証（モードにより省略可）
- ③ 🌐 Perplexity: 最新情報補完 + 引用取得（モードにより省略可）

4. 🧬 回答統合
- Claude回答をベース化
- Gemini の検証警告（誤り/古い/不正確など）を追記
- Perplexity の補足情報と参考文献URLを追記

5. 🛟 フォールバック
- 全ステージ失敗時はカテゴリ別フォールバック応答を生成

6. 💾 結果保存
- 成功時はキャッシュ保存（TTL有効）

### 🎚️ 実行モード（PipelineMode）

- `Full` : 🧠 Claude + 🔮 Gemini + 🌐 Perplexity
- `ClaudeOnly` : 🧠 Claude のみ
- `ClaudeGemini` : 🧠 Claude + 🔮 Gemini
- `SkipVerification` : 🧠 Claude + 🌐 Perplexity（Gemini検証スキップ）

### 🔧 主な設定（PipelineConfig）

- `EnableCaching` : 🗂️ キャッシュ有効化
- `EnableFallback` : 🛟 フォールバック有効化
- `EnableClaude / EnableGemini / EnablePerplexity` : 🧩 ステージ個別ON/OFF
- `ConfidenceThreshold` : 📏 信頼度閾値（設定項目）

## 📁 主なディレクトリ

- `src/` : ⚙️ PowerShell API 本体
- `scripts/` : 🚀 起動・🧪 テスト・🔧 運用スクリプト
- `WebUI/development/` : 🧪 開発版 UI
- `WebUI/production/` : 🏭 本番版 UI
- `tests/` : ✅ Pester テスト
- `tests/playwright/` : 🎭 Playwright テスト
- `docs/` : 📚 設計・開発フェーズ資料

## 🧰 前提環境

### 🐧 Linux（推奨）

- `bash`
- `python3`（🖥️ WebUI配信）
- `pwsh`（⚙️ API起動時）
- `node` / `npm`（🎭 Playwright実行時）

### 🍎 macOS

- `zsh` / `bash`
- `python3`
- （任意）`pwsh`

## 🚀 クイックスタート（WebUI）

Linux 共有フォルダ配下を前提に、WebUI 専用スクリプトを利用します。

```bash
cd /mnt/LinuxHDD/Enterprise-AI-HelpDesk-System
bash scripts/start-webui.sh
```

起動後URL:

- 🧪 開発版: `http://<IP>:8283/it-helpdesk.html`
- 💬 開発会話: `http://<IP>:8283/conversation.html`
- 🏭 本番版: `http://<IP>:8282/it-helpdesk.html`
- 💬 本番会話: `http://<IP>:8282/conversation.html`

停止:

```bash
bash scripts/stop-webui.sh
```

### ⚙️ オプション

- `DEV_PORT` : 🧪 開発ポート（既定 `8283`）
- `PROD_PORT` : 🏭 本番ポート（既定 `8282`）
- `BIND_HOST` : 🌐 バインドIP（既定 `0.0.0.0`）
- `MIRROR_TO_TMP` : 📦 一時領域へミラー配信（既定 `1`）

```bash
DEV_PORT=8383 PROD_PORT=8382 MIRROR_TO_TMP=1 bash scripts/start-webui.sh
```

## ⚙️ APIサーバー起動

```bash
cd /mnt/LinuxHDD/Enterprise-AI-HelpDesk-System
pwsh -NoProfile -File scripts/Start-Server.ps1 -Port 8180 -Environment development
```

- ❤️ ヘルスチェック: `http://<IP>:8180/api/health`

## 🧪 テスト実行

### ✅ Pester（PowerShell）

```bash
pwsh -NoProfile -File scripts/Run-Tests.ps1 -Type all
```

### 🎭 Playwright

```bash
cd tests/playwright
npm install
npx playwright test
```

タグ実行（例）:

```bash
npx playwright test --grep @smoke --project=chromium
```

## 📌 Linux共有フォルダ運用メモ

- ⚠️ 共有フォルダではファイルI/Oや `._*` の影響で不安定になることがあります。
- 🧰 `scripts/start-webui.sh` は必要に応じて WebUI を一時ディレクトリへミラーして配信します。
- 🔄 反映されない場合はクエリバージョン（例 `?v=20260207c`）+ ハードリロードを併用してください。

## 🩺 トラブルシューティング

### ❌ `接続が拒否されました`

1. 📡 ポート待受確認

```bash
ss -lntp | grep -E ':8282|:8283|:8180'
```

2. 🧪 Linuxローカル確認

```bash
curl -I http://127.0.0.1:8283/it-helpdesk.html
```

3. 🌐 クライアント側確認

```bash
curl -I http://<Linux-IP>:8283/it-helpdesk.html
```

### 🧭 Linux側IP確認

```bash
ip -4 route get 1.1.1.1 | awk '{for(i=1;i<=NF;i++) if($i=="src"){print $(i+1); exit}}'
```

## 🖼️ 現在の UI 実装メモ（会話画面）

- 🧭 `it-helpdesk.html` の「AI会話」クリックで同ページ内表示
- 🔄 上部リロードボタンは AI会話表示中も有効（iframe 再読込）
- 🎨 会話画面は薄い青基調
- ⚡ AI処理中 UI は 3段階（Claude / Gemini / Perplexity）
- 📋 回答詳細パネル付き

## 📊 開発ステータス

**現在のフェーズ**: Phase 13準備中（Phase 12完了）

- ✅ **Phase 1-11**: 設計・実装・テスト完了
- ✅ **Phase 12**: E2Eテスト・最終検証完了（2026-02-14）
  - 機能テスト: 100%合格（545/545）
  - セキュリティ: Critical 0件
  - パフォーマンス: 主要API < 7秒（目標達成）
  - 判定: **CONDITIONAL-GO**（Phase 13移行承認）
- ⏳ **Phase 13**: 本番デプロイ・運用開始（準備中）

### 次のステップ

詳細は `docs/NEXT_STEPS.md` を参照してください。

**Phase 13.1（本番前必須対応、3-5日）**:
1. SPOF基礎対策（DbConnectionPool）
2. 空catchブロックTOP20修正
3. SecretManager改善（Azure Key Vault準備）
4. E2E実サーバーテスト
5. E2Eログインフロー実装
6. CSRF対策実装

### 主要ドキュメント

| ドキュメント | 内容 |
|------------|------|
| `docs/NEXT_STEPS.md` | 次回開発ステップ（フェーズ別一覧表） |
| `docs/DEVELOPMENT_PHASES.md` | 全体フェーズ進捗 |
| `reviews/comprehensive_review_report.md` | 統合レビューレポート（522行） |
| `reviews/phase12_quality_gate_report.md` | Phase 12品質ゲートレポート |
| `CLAUDE.md` | プロジェクト指示（SubAgent、Hooks） |

### アーカイブ

Phase 12の詳細ログは `archive/phase12_logs/` に保存されています。

## 📄 ライセンス

`LICENSE` を参照してください。

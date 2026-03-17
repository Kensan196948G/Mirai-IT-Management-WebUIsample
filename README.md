# Mirai-IT-Management-WebUISamples

🧩 複数の IT 運用・管理系サンプルシステムと、各 `webui-sample` をまとめたリポジトリです。  
🖥️ 各サンプルは `HTML + CSS + JavaScript` ベースで、`index.html` を直接開いて確認できます。

## 📁 収録モジュール

| アイコン | フォルダ | 概要 | WebUI |
|---|---|---|---|
| 🗂️ | `Appsuite-Management-Sample` | AppSuite 連携 ITSM 管理 | `webui-sample` 実装済み |
| 💾 | `Backup-management-system-Sample` | 3-2-1-1-0 バックアップ管理 | `webui-sample` 実装済み |
| 🤖 | `Enterprise-AI-HelpDesk-System-Sample` | AI ヘルプデスク / 問い合わせ支援 | `webui-sample` 実装済み |
| 🏷️ | `IntegratedITAssetServiceManagement-Sample` | IT資産・SAM・CMDB・調達管理 | `webui-sample` 実装済み |
| 📚 | `Mirai-Knowledge-System-Sample` | 建設土木向けナレッジ管理 | `webui-sample` 実装済み |
| 🐧 | `Linux-Management-Systm` | Linux 運用統制 / 監査 / 承認 | `webui-sample` 実装済み |

## 🌐 WebUI の見方

| 項目 | 内容 |
|---|---|
| 形式 | 静的フロントエンド (`index.html`, `styles.css`, `app.js`) |
| 配置 | 各サブフォルダ配下の `webui-sample/` |
| デザイン方針 | 白背景 + 薄い青のアイコン / アクセント |
| 操作方法 | ブラウザで `index.html` を開いてそのまま操作 |

## 🚀 ローカル確認

### 1. 直接開く

📂 各 `webui-sample/index.html` をブラウザで開いてください。

### 2. ローカルサーバーで確認

```bash
cd Linux-Management-Systm/webui-sample
python3 -m http.server 8080
```

その後、`http://localhost:8080` にアクセスします。

## ✅ このリポジトリで行っていること

| アイコン | 内容 |
|---|---|
| 📖 | 各サブフォルダの `README.md` をもとに画面内容を設計 |
| 🎨 | 白背景・薄い青アクセントで UI を統一 |
| ⚙️ | JavaScript でカード切替・フィルタ・デモ操作を実装 |
| 🧪 | `node --check app.js` で JavaScript 構文を確認 |

## 📝 補足

- 各モジュールの機能定義は、そのフォルダの `README.md` を参照してください。
- コントリビューター向けの運用ルールは `AGENTS.md` に記載しています。

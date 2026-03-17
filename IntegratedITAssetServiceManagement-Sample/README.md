# 統合ITアセット・サービス管理システム (IAMS)

![Phase](https://img.shields.io/badge/Phase-22-blueviolet)
![Tests](https://img.shields.io/badge/Tests-1157-brightgreen)
![Swagger](https://img.shields.io/badge/Swagger-149%20endpoints-blue)
![Node.js](https://img.shields.io/badge/Node.js-%3E%3D20-brightgreen)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

**ITSM / ISO 20000 準拠の統合IT資産・サービス管理プラットフォーム**

企業のIT資産ライフサイクル、サービスカタログ、インシデント管理、変更管理、構成管理（CMDB）を一元化し、
ITIL/ISO 20000 に沿った運用プロセスを実現するWebベースの管理システムです。

---

## 主な機能（45+）

### IT資産管理
- ハードウェア・ソフトウェア資産の登録・追跡・廃棄管理
- ソフトウェアライセンス管理・期限アラート
- 調達管理（Procurement）
- 資産エクスポート（CSV/Excel/JSON）

### CMDB・構成管理
- 構成アイテム（CI）の登録・関連付け
- 依存関係マップ
- 変更履歴追跡

### サービス管理
- サービスカタログ管理
- インシデント・問題管理
- ワークフローエンジン（承認フロー）
- SLA管理

### 監視・運用
- リアルタイム監視ダッシュボード（CPU/メモリ/ディスク）
- ヘルスチェック（`/health`, `/health/detailed`）
- Prometheusメトリクス連携
- アラート管理・自動通知
- バックアップ・リストア（暗号化対応）

### セキュリティ・認証
- JWT認証 + RBAC（admin/operator/viewer/auditor）
- 多要素認証（MFA / TOTP）
- パスワードポリシー管理
- セッション管理・強制ログアウト
- 監査ログ（ハッシュチェーン検証）
- セキュリティイベント検知
- 招待フロー・ユーザーグループ管理
- カスタムロール定義

### レポート・分析
- 監査レポート生成
- アクティビティログ
- 通知管理

### エージェント連携
- PowerShellエージェントによるリモート情報収集
- エージェントハートビート監視

---

## クイックスタート

### 前提条件

- **Node.js** 20 以上
- **npm** 9 以上

### インストール

```bash
git clone <repository-url>
cd IntegratedITAssetServiceManagement

# バックエンド依存関係
npm install

# フロントエンド依存関係
cd src/frontend && npm install && cd ../..
```

### 開発環境の起動

```bash
# バックエンド（ポート 8442）
npm run dev

# フロントエンド（別ターミナル、ポート 8443）
cd src/frontend && npm run dev
```

### 本番環境デプロイ

```bash
# systemdサービスとしてインストール
sudo bash scripts/systemd/install-services.sh
```

### Docker

```bash
docker compose up
```

---

## API ドキュメント

バックエンド起動後、Swagger UIで全149エンドポイントを確認できます。

```
https://localhost:8442/api/docs
```

---

## 環境構成

| 環境 | バックエンド | フロントエンド | 用途 |
|------|-------------|--------------|------|
| 開発 | `https://localhost:8442` | `https://localhost:8443` | ローカル開発・デバッグ |
| 本番 | `https://localhost:9442` | `https://localhost:9444` | プロダクション運用 |

---

## テスト

```bash
# ユニットテスト（1157テスト）
npm run test:unit

# セキュリティテスト
npm run test:security

# 統合テスト
npm run test:integration

# E2Eテスト（Playwright）
npm run test:e2e

# パフォーマンステスト
npm run test:performance

# カバレッジ付き実行
npm run test:coverage
```

---

## 技術スタック

| レイヤー | 技術 |
|---------|------|
| バックエンド | Node.js, Express.js, Sequelize ORM |
| フロントエンド | Nuxt 3, Vue 3, Tailwind CSS |
| データベース | SQLite（開発）/ PostgreSQL（本番対応） |
| 認証 | JWT, bcrypt, TOTP（MFA） |
| API仕様 | Swagger / OpenAPI 3.0 |
| テスト | Node.js Test Runner, Playwright, c8 |
| CI/CD | GitHub Actions |
| インフラ | systemd, Docker Compose |
| 監視 | Prometheus互換メトリクス |
| TLS | 自己署名証明書（開発）/ Let's Encrypt等（本番） |

---

## 開発フェーズ履歴

| Phase | 内容 | 状態 |
|-------|------|------|
| Phase 1-2 | 基盤構築・JWT認証・RBAC | 完了 |
| Phase 3 | 資産管理CRUD | 完了 |
| Phase 4 | 監査ログ・レポート機能 | 完了 |
| Phase 5 | PowerShellエージェント連携 | 完了 |
| Phase 6 | Nuxt 3フロントエンド実装 | 完了 |
| Phase 7 | アラート管理API・セキュリティ強化 | 完了 |
| Phase 8 | 環境分離・本番準備・systemd | 完了 |
| Phase 9 | バックアップ・監視ダッシュボード・MFA | 完了 |
| Phase 10 | DB最適化・キャッシュ戦略 | 完了 |
| Phase 11 | ワークフローエンジン | 完了 |
| Phase 12 | 通知・招待フロー | 完了 |
| Phase 13 | カスタムロール・パスワードポリシー | 完了 |
| Phase 14 | セキュリティイベント・セッション管理 | 完了 |
| Phase 15 | エクスポート・調達管理 | 完了 |
| Phase 16 | 運用ドキュメント整備 | 完了 |
| Phase 17 | テストカバレッジ拡充 | 完了 |
| Phase 18 | CI/CD・GitHub Actions統合 | 完了 |
| Phase 19 | Docker対応・デプロイ自動化 | 完了 |
| Phase 20 | Prometheus監視連携 | 完了 |
| Phase 21 | セキュリティハードニング | 完了 |
| Phase 22 | 包括的ドキュメント整備 | 完了 |

---

## ドキュメント

詳細ドキュメントは `docs/` ディレクトリを参照してください。

| ドキュメント | 内容 |
|------------|------|
| [API仕様書](docs/API_COMPLETE_DOCUMENTATION.md) | 全エンドポイント・認証・エラーコード |
| [デプロイメントガイド](docs/DEPLOYMENT_GUIDE.md) | 本番環境構築手順 |
| [運用マニュアル](docs/OPERATIONS_MANUAL.md) | 日常運用・監視・バックアップ |
| [セキュリティ監査レポート](docs/SECURITY_AUDIT_REPORT_2026-03-06.md) | 脆弱性対応状況 |
| [ドキュメント索引](docs/DOCUMENT_INDEX.md) | 全ドキュメント一覧 |
| [FAQ](docs/FAQ.md) | よくある質問 |

---

## ライセンス

MIT License

---

最終更新: 2026-03-14

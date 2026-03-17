/**
 * 全モジュールの JavaScript 構文チェック
 * Usage: node scripts/check-syntax.js
 */
const { execSync } = require("child_process");
const path = require("path");
const fs = require("fs");

const modules = [
  "Appsuite-Management-Sample",
  "Backup-management-system-Sample",
  "Enterprise-AI-HelpDesk-System-Sample",
  "IntegratedITAssetServiceManagement-Sample",
  "Linux-Management-Systm",
  "Mirai-Knowledge-System-Sample",
];

let passed = 0;
let failed = 0;

for (const mod of modules) {
  const jsFile = path.join(mod, "webui-sample", "js", "app.js");
  if (!fs.existsSync(jsFile)) {
    console.log(`  ⏭  ${mod}: js/app.js not found`);
    continue;
  }
  try {
    execSync(`node --check "${jsFile}"`, { stdio: "pipe" });
    console.log(`  ✅ ${mod}: syntax OK`);
    passed++;
  } catch (e) {
    console.error(`  ❌ ${mod}: syntax ERROR`);
    console.error(`     ${e.stderr.toString().trim()}`);
    failed++;
  }
}

console.log(`\n  Result: ${passed} passed, ${failed} failed`);
process.exit(failed > 0 ? 1 : 0);

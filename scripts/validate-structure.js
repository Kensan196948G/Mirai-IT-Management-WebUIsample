/**
 * 全モジュールのファイル構造検証
 * Usage: node scripts/validate-structure.js
 */
const fs = require("fs");
const path = require("path");

const modules = [
  "Appsuite-Management-Sample",
  "Backup-management-system-Sample",
  "Enterprise-AI-HelpDesk-System-Sample",
  "IntegratedITAssetServiceManagement-Sample",
  "Linux-Management-Systm",
  "Mirai-Knowledge-System-Sample",
];

const requiredFiles = [
  "README.md",
  "webui-sample/index.html",
  "webui-sample/css/styles.css",
  "webui-sample/js/app.js",
];

let issues = 0;

for (const mod of modules) {
  console.log(`\n  📂 ${mod}`);
  for (const file of requiredFiles) {
    const fullPath = path.join(mod, file);
    if (fs.existsSync(fullPath)) {
      const stat = fs.statSync(fullPath);
      const sizeKB = (stat.size / 1024).toFixed(1);
      console.log(`     ✅ ${file} (${sizeKB}KB)`);
    } else {
      console.log(`     ❌ ${file} — MISSING`);
      issues++;
    }
  }
}

console.log(`\n  Result: ${issues === 0 ? "All OK ✅" : `${issues} issue(s) found ❌`}`);
process.exit(issues > 0 ? 1 : 0);

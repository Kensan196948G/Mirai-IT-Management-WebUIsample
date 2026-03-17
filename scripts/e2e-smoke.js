/**
 * E2E スモークテスト — 全モジュールの基本動作を検証
 * Usage: node scripts/e2e-smoke.js
 *
 * Python http.server を起動してから実行してください:
 *   python3 -m http.server 8090 --directory . &
 *   node scripts/e2e-smoke.js
 *   kill %1
 *
 * 外部依存なし: Node.js 標準の http モジュールのみ使用
 */
const http = require("http");

const BASE = process.env.BASE_URL || "http://localhost:8090";
const modules = [
  { name: "Showcase", path: "/" },
  { name: "Appsuite", path: "/Appsuite-Management-Sample/webui-sample/index.html" },
  { name: "Backup", path: "/Backup-management-system-Sample/webui-sample/index.html" },
  { name: "HelpDesk", path: "/Enterprise-AI-HelpDesk-System-Sample/webui-sample/index.html" },
  { name: "Asset", path: "/IntegratedITAssetServiceManagement-Sample/webui-sample/index.html" },
  { name: "Linux", path: "/Linux-Management-Systm/webui-sample/index.html" },
  { name: "Knowledge", path: "/Mirai-Knowledge-System-Sample/webui-sample/index.html" },
  { name: "DesignTokens", path: "/shared/design-tokens.css" },
  { name: "UIUtils", path: "/shared/ui-utils.js" },
];

function fetch(url) {
  return new Promise((resolve, reject) => {
    http.get(url, (res) => {
      let body = "";
      res.on("data", (chunk) => (body += chunk));
      res.on("end", () => resolve({ status: res.statusCode, body }));
      res.on("error", reject);
    }).on("error", reject);
  });
}

const checks = [
  {
    name: "HTML pages return 200",
    async run() {
      let pass = 0;
      let fail = 0;
      for (const mod of modules) {
        const res = await fetch(BASE + mod.path);
        if (res.status === 200) {
          pass++;
        } else {
          console.log(`     FAIL: ${mod.name} returned ${res.status}`);
          fail++;
        }
      }
      return { pass, fail, total: modules.length };
    },
  },
  {
    name: "HTML pages contain expected elements",
    async run() {
      let pass = 0;
      let fail = 0;
      const htmlModules = modules.filter((m) => m.path.endsWith(".html"));
      for (const mod of htmlModules) {
        const res = await fetch(BASE + mod.path);
        const checks = [
          [/<html/i, "html tag"],
          [/lang="ja"/i, "lang=ja"],
          [/Murecho/i, "Murecho font"],
        ];
        for (const [re, label] of checks) {
          if (re.test(res.body)) {
            pass++;
          } else {
            console.log(`     FAIL: ${mod.name} missing ${label}`);
            fail++;
          }
        }
      }
      return { pass, fail, total: pass + fail };
    },
  },
  {
    name: "Module pages reference design-tokens.css",
    async run() {
      let pass = 0;
      let fail = 0;
      const cssModules = modules.filter(
        (m) => m.path.endsWith(".html") && m.name !== "Showcase"
      );
      for (const mod of cssModules) {
        const cssPath = mod.path.replace("index.html", "css/styles.css");
        const res = await fetch(BASE + cssPath);
        if (res.body.includes("design-tokens.css")) {
          pass++;
        } else {
          console.log(`     FAIL: ${mod.name} CSS missing @import design-tokens`);
          fail++;
        }
      }
      return { pass, fail, total: pass + fail };
    },
  },
  {
    name: "Module pages reference ui-utils.js",
    async run() {
      let pass = 0;
      let fail = 0;
      const htmlModules = modules.filter(
        (m) => m.path.endsWith(".html") && m.name !== "Showcase"
      );
      for (const mod of htmlModules) {
        const res = await fetch(BASE + mod.path);
        if (res.body.includes("ui-utils.js")) {
          pass++;
        } else {
          console.log(`     FAIL: ${mod.name} missing ui-utils.js reference`);
          fail++;
        }
      }
      return { pass, fail, total: pass + fail };
    },
  },
  {
    name: "ARIA accessibility attributes present",
    async run() {
      let pass = 0;
      let fail = 0;
      const htmlModules = modules.filter(
        (m) => m.path.endsWith(".html") && m.name !== "Showcase"
      );
      for (const mod of htmlModules) {
        const res = await fetch(BASE + mod.path);
        const ariaChecks = [
          [/role="navigation"/, "role=navigation"],
          [/role="main"/, "role=main"],
          [/aria-label/, "aria-label"],
          [/aria-current/, "aria-current"],
        ];
        for (const [re, label] of ariaChecks) {
          if (re.test(res.body)) {
            pass++;
          } else {
            console.log(`     FAIL: ${mod.name} missing ${label}`);
            fail++;
          }
        }
      }
      return { pass, fail, total: pass + fail };
    },
  },
  {
    name: "Showcase page has all 6 module links",
    async run() {
      const res = await fetch(BASE + "/");
      const expected = [
        "Appsuite-Management-Sample",
        "Backup-management-system-Sample",
        "Enterprise-AI-HelpDesk-System-Sample",
        "IntegratedITAssetServiceManagement-Sample",
        "Linux-Management-Systm",
        "Mirai-Knowledge-System-Sample",
      ];
      let pass = 0;
      let fail = 0;
      for (const link of expected) {
        if (res.body.includes(link)) {
          pass++;
        } else {
          console.log(`     FAIL: Showcase missing link to ${link}`);
          fail++;
        }
      }
      return { pass, fail, total: expected.length };
    },
  },
];

async function main() {
  console.log("\n  E2E Smoke Test — Mirai IT Management WebUI\n");

  let totalPass = 0;
  let totalFail = 0;

  for (const check of checks) {
    try {
      const result = await check.run();
      const icon = result.fail === 0 ? "✅" : "❌";
      console.log(`  ${icon} ${check.name} (${result.pass}/${result.total})`);
      totalPass += result.pass;
      totalFail += result.fail;
    } catch (err) {
      console.log(`  ❌ ${check.name} — ERROR: ${err.message}`);
      totalFail++;
    }
  }

  console.log(`\n  Result: ${totalPass} passed, ${totalFail} failed\n`);
  process.exit(totalFail > 0 ? 1 : 0);
}

main();

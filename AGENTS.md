# Repository Guidelines

## 📦 Project Structure & Module Organization

`Mirai-IT-Management-WebUISamples` contains six independent sample systems. Each module has its own `README.md` and a `webui-sample/` folder for static UI work.

| Icon | Path | Purpose |
|---|---|---|
| 🗂️ | `Appsuite-Management-Sample/` | AppSuite-based ITSM sample |
| 💾 | `Backup-management-system-Sample/` | Backup and compliance sample |
| 🤖 | `Enterprise-AI-HelpDesk-System-Sample/` | AI helpdesk sample |
| 🏷️ | `IntegratedITAssetServiceManagement-Sample/` | Asset / SAM / CMDB sample |
| 📚 | `Mirai-Knowledge-System-Sample/` | Knowledge management sample |
| 🐧 | `Linux-Management-Systm/` | Linux operations control sample |

UI files should stay inside each module’s `webui-sample/`: `index.html`, `styles.css`, `app.js`.

## 🛠️ Build, Test, and Development Commands

| Command | Purpose |
|---|---|
| `python3 -m http.server 8080` | Serve the current `webui-sample/` locally |
| `node --check app.js` | Validate JavaScript syntax |
| `find . -maxdepth 2 -type d -name 'webui-sample'` | List target UI directories |

Example:

```bash
cd Appsuite-Management-Sample/webui-sample
python3 -m http.server 8080
```

## 🎨 Coding Style & Naming Conventions

- Use plain HTML, CSS, and vanilla JavaScript.
- Keep indentation consistent within each file; 2 spaces is preferred for HTML/CSS.
- Use `camelCase` for JS variables/functions and `kebab-case` for CSS classes.
- Keep user-facing labels in Japanese when the module README is Japanese.
- Default UI style for this repo: white background with light blue icons and accents.

## 🧪 Testing Guidelines

| Check | Requirement |
|---|---|
| Browser review | Open `webui-sample/index.html` and verify behavior |
| Syntax check | Run `node --check app.js` |
| Responsive check | Confirm layout on narrow and wide screens |

If a module README references Playwright or other tests, follow that module-specific flow.

## 🔀 Commit & Pull Request Guidelines

Git history is not available in this workspace, so use a simple convention:

- Commit format: `module: short imperative summary`
- Example: `linux: add audit dashboard interactions`

PRs should include affected modules, a short summary, validation steps, and screenshots for UI changes.

## 📘 Module-Specific Rule

Read the target module’s `README.md` before editing. Match its terminology, scope, and operational intent instead of creating a generic dashboard.

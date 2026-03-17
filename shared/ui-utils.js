/**
 * Mirai IT Management — 共通 UI ユーティリティ
 * トースト通知・ハンバーガーメニュー・ビュー切替ヘルパー
 */

/* --- Toast Notification --- */
(function () {
  let container = document.querySelector(".toast-container");
  if (!container) {
    container = document.createElement("div");
    container.className = "toast-container";
    document.body.appendChild(container);
  }

  window.showToast = function (message, type, duration) {
    type = type || "default";
    duration = duration || 3000;
    const toast = document.createElement("div");
    toast.className = "toast" + (type !== "default" ? " toast-" + type : "");
    toast.textContent = message;
    container.appendChild(toast);

    setTimeout(function () {
      toast.classList.add("toast-out");
      toast.addEventListener("animationend", function () {
        toast.remove();
      });
    }, duration);
  };
})();

/* --- Modal --- */
(function () {
  window.showModal = function (title, bodyHTML, actions) {
    var existing = document.querySelector(".modal-overlay");
    if (existing) existing.remove();

    var overlay = document.createElement("div");
    overlay.className = "modal-overlay";

    var modal = document.createElement("div");
    modal.className = "modal";
    modal.setAttribute("role", "dialog");
    modal.setAttribute("aria-modal", "true");

    var closeBtn = '<button class="modal-close" aria-label="閉じる">&times;</button>';
    var heading = title ? '<h2>' + title.replace(/</g, '&lt;') + '</h2>' : '';
    var actionsHTML = '';
    if (actions && actions.length) {
      actionsHTML = '<div class="modal-actions">' +
        actions.map(function (a) {
          return '<button class="btn ' + (a.primary ? 'primary' : 'ghost') + '" data-action="' + (a.key || '') + '">' +
            a.label.replace(/</g, '&lt;') + '</button>';
        }).join('') + '</div>';
    }

    modal.innerHTML = closeBtn + heading + '<div class="modal-body">' + bodyHTML + '</div>' + actionsHTML;
    overlay.appendChild(modal);
    document.body.appendChild(overlay);

    requestAnimationFrame(function () { overlay.classList.add("is-open"); });

    function close() { overlay.remove(); }
    overlay.querySelector(".modal-close").addEventListener("click", close);
    overlay.addEventListener("click", function (e) { if (e.target === overlay) close(); });

    if (actions && actions.length) {
      modal.querySelectorAll("[data-action]").forEach(function (btn) {
        btn.addEventListener("click", function () {
          var action = actions.find(function (a) { return a.key === btn.dataset.action; });
          if (action && action.onClick) action.onClick();
          close();
        });
      });
    }

    return { close: close };
  };
})();

/* --- Dark Mode Toggle --- */
(function () {
  var stored = localStorage.getItem("theme");
  var prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  var isDark = stored ? stored === "dark" : prefersDark;

  if (isDark) document.documentElement.setAttribute("data-theme", "dark");

  var toggle = document.createElement("button");
  toggle.className = "theme-toggle";
  toggle.setAttribute("aria-label", "テーマ切替");
  toggle.textContent = isDark ? "\u2600" : "\u263E";
  document.body.appendChild(toggle);

  toggle.addEventListener("click", function () {
    isDark = !isDark;
    if (isDark) {
      document.documentElement.setAttribute("data-theme", "dark");
    } else {
      document.documentElement.removeAttribute("data-theme");
    }
    toggle.textContent = isDark ? "\u2600" : "\u263E";
    localStorage.setItem("theme", isDark ? "dark" : "light");
  });
})();

/* --- Mobile Sidebar Toggle --- */
(function () {
  var sidebar = document.querySelector(".sidebar");
  if (!sidebar) return;

  // Create hamburger button
  var hamburger = document.createElement("button");
  hamburger.className = "hamburger-btn";
  hamburger.setAttribute("aria-label", "メニューを開く");
  hamburger.innerHTML = "<span></span><span></span><span></span>";
  document.body.appendChild(hamburger);

  // Create overlay
  var overlay = document.createElement("div");
  overlay.className = "sidebar-overlay";
  document.body.appendChild(overlay);

  function toggleSidebar() {
    var isOpen = sidebar.classList.toggle("is-open");
    overlay.classList.toggle("is-visible", isOpen);
    hamburger.classList.toggle("is-active", isOpen);
    hamburger.setAttribute("aria-label", isOpen ? "メニューを閉じる" : "メニューを開く");
  }

  hamburger.addEventListener("click", toggleSidebar);
  overlay.addEventListener("click", toggleSidebar);

  // Close sidebar when nav item is clicked on mobile
  sidebar.addEventListener("click", function (e) {
    if (e.target.closest(".nav-item") && window.innerWidth <= 960) {
      toggleSidebar();
    }
  });
})();

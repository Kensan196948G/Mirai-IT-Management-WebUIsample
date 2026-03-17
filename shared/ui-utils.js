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

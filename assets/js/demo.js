/* Helper demo bersama untuk mockup: format rupiah, toast, dan dropdown outlet.
   Hanya perilaku tampilan di sisi klien; tidak ada panggilan API. */
(function () {
  var Demo = (window.Demo = window.Demo || {});

  Demo.rp = function (n) {
    return "Rp " + Math.round(n).toLocaleString("id-ID");
  };

  var TONES = {
    success: { icon: "ori-check-circle", color: "text-success-600" },
    info: { icon: "ori-info", color: "text-info-600" },
    danger: { icon: "ori-warning-circle", color: "text-danger-600" },
  };

  /* Toast menumpuk dari atas ke bawah: yang terbaru di paling atas. */
  Demo.toast = function (message, tone) {
    var t = TONES[tone || "success"];
    var box = document.getElementById("toast-stack");
    if (!box) {
      box = document.createElement("div");
      box.id = "toast-stack";
      box.setAttribute("aria-live", "polite");
      box.className =
        "pointer-events-none fixed end-4 top-4 z-[70] flex w-80 max-w-[calc(100vw-2rem)] flex-col gap-2";
      document.body.appendChild(box);
    }
    var el = document.createElement("div");
    el.setAttribute("role", "status");
    el.className =
      "pointer-events-auto flex animate-fade-in items-start gap-3 rounded-card border border-border bg-surface p-4 text-sm";
    el.innerHTML =
      '<i class="ori ' + t.icon + " mt-0.5 text-lg " + t.color + '"></i>' +
      '<p class="min-w-0 flex-1 font-medium"></p>' +
      '<button type="button" class="cursor-pointer text-fg-subtle hover:text-fg" aria-label="Tutup"><i class="ori ori-x"></i></button>';
    el.querySelector("p").textContent = message;
    var close = function () {
      if (el.parentNode) el.parentNode.removeChild(el);
    };
    el.querySelector("button").addEventListener("click", close);
    box.insertBefore(el, box.firstChild);
    while (box.children.length > 3) box.removeChild(box.lastChild);
    setTimeout(close, 3500);
  };

  /* Outlet aktif di sidebar tersinkron dengan filter outlet di halaman (bila ada). */
  var label = document.querySelector("[data-outlet-label]");
  var pageSelect = document.querySelector('main select[aria-label="Outlet"]');

  document.querySelectorAll("[data-outlet-option]").forEach(function (opt) {
    opt.addEventListener("click", function () {
      var value = opt.getAttribute("data-outlet-option");
      if (label) label.textContent = value;
      if (pageSelect && pageSelect.value !== value) {
        pageSelect.value = value;
        pageSelect.dispatchEvent(new Event("change"));
      }
      var toggle = document.getElementById("outlet-toggle");
      if (toggle) toggle.click();
    });
  });

  if (pageSelect && label) {
    pageSelect.addEventListener("change", function () {
      label.textContent = pageSelect.value;
    });
  }
})();

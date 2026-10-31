/* Tim & Peran (demo): hapus peran dengan konfirmasi, dan peran baru dari formulir. */
(function () {
  var modal = document.getElementById("hapus-modal");
  var nameEl = modal.querySelector("[data-role-name]");
  var usersEl = modal.querySelector("[data-role-users]");
  var tbody = document.querySelector("tbody");
  var target = null;

  var BADGE = "inline-flex items-center rounded-full px-3 py-1.5 text-xs font-medium leading-none ";
  var ACTION = "inline-flex cursor-pointer items-center justify-center gap-2 rounded-control font-semibold whitespace-nowrap focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 h-9 w-9 text-fg-muted ";

  function bindDelete(btn) {
    btn.addEventListener("click", function () {
      target = btn.closest("tr");
      var users = parseInt(btn.getAttribute("data-users"), 10) || 0;
      nameEl.textContent = btn.getAttribute("data-name");
      usersEl.textContent = users
        ? users + " pengguna akan kehilangan akses dan perlu diberi peran lain."
        : "Tidak ada pengguna yang memakai peran ini.";
    });
  }
  document.querySelectorAll("[data-role-delete]").forEach(bindDelete);

  modal.querySelector("[data-confirm-delete]").addEventListener("click", function () {
    if (!target) return;
    var name = nameEl.textContent;
    target.parentNode.removeChild(target);
    target = null;
    Demo.toast("Peran " + name + " dihapus");
  });

  /* Peran baru dari formulir: ?baru=<nama>&level=<n> */
  var params = new URLSearchParams(location.search);
  var baru = params.get("baru");
  if (baru) {
    var level = params.get("level") || "3";
    var tr = document.createElement("tr");
    tr.setAttribute("data-role-row", "");
    tr.className = "border-t border-border";
    tr.innerHTML =
      '<td class="whitespace-nowrap px-5 py-3.5 font-medium"></td>' +
      '<td class="px-5 py-3.5"><span class="' + BADGE + 'bg-primary-50 text-primary-700">L' + level + "</span></td>" +
      '<td class="hidden px-5 py-3.5 sm:table-cell"><span class="' + BADGE + 'bg-info-50 text-info-700">Kustom</span></td>' +
      '<td class="px-5 py-3.5 tabular-nums">0</td>' +
      '<td class="hidden whitespace-nowrap px-5 py-3.5 md:table-cell">Per outlet</td>' +
      '<td class="px-3 py-2"><div class="flex justify-end">' +
      '<a href="peran-baru.html" class="' + ACTION + 'hover:bg-neutral-100 hover:text-neutral-800 focus-visible:ring-neutral-300" aria-label="Ubah"><i class="ori ori-pencil-simple text-lg"></i></a>' +
      '<button type="button" data-modal-target="hapus-modal" data-modal-toggle="hapus-modal" data-role-delete data-users="0" class="' + ACTION + 'hover:bg-danger-50 hover:text-danger-700 focus-visible:ring-danger-300"><i class="ori ori-trash text-lg"></i></button>' +
      "</div></td>";
    tr.firstChild.textContent = baru;
    var del = tr.querySelector("[data-role-delete]");
    del.setAttribute("data-name", baru);
    del.setAttribute("aria-label", "Hapus " + baru);
    tbody.appendChild(tr);
    if (window.initFlowbite) window.initFlowbite();
    bindDelete(del);
    Demo.toast("Peran " + baru + " dibuat");
    history.replaceState(null, "", location.pathname);
  }
})();

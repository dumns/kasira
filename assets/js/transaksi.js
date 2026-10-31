/* Transaksi (demo): pencarian dan filter bekerja pada baris tabel yang ada. */
(function () {
  var rows = Array.prototype.slice.call(document.querySelectorAll("[data-row]"));
  var empty = document.querySelector("[data-empty]");
  var search = document.querySelector('input[aria-label="Cari transaksi"]');
  var outlet = document.querySelector('select[aria-label="Outlet"]');
  var status = document.querySelector('select[aria-label="Status"]');
  var method = document.querySelector('select[aria-label="Pembayaran"]');

  var pick = function (sel, all) { return sel.value.indexOf("Semua") === 0 ? "" : sel.value; };

  function filter() {
    var q = search.value.trim().toLowerCase();
    var o = pick(outlet);
    var s = pick(status);
    var m = pick(method);
    var shown = 0;
    rows.forEach(function (r) {
      var ok =
        (!q || r.getAttribute("data-text").indexOf(q) >= 0) &&
        (!o || r.getAttribute("data-outlet") === o) &&
        (!s || r.getAttribute("data-status") === s) &&
        (!m || r.getAttribute("data-method") === m);
      r.style.display = ok ? "" : "none";
      if (ok) shown++;
    });
    empty.style.display = shown ? "none" : "table-row";
  }

  search.addEventListener("input", filter);
  [outlet, status, method].forEach(function (el) { el.addEventListener("change", filter); });

  empty.style.display = "none";
  document.querySelector("[data-export]").addEventListener("click", function () {
    Demo.toast("Ekspor transaksi dimulai");
  });
})();

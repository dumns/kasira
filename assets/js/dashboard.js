/* Dashboard (demo): pilihan outlet dan periode mengubah angka ringkasan. */
(function () {
  var rp = Demo.rp;
  var OUTLET = { "Semua outlet": 1, Dago: 0.55, Braga: 0.45, Setiabudi: 0 };
  var PERIOD = {
    "Hari ini": { f: 1, text: "Ringkasan penjualan hari ini." },
    "7 hari": { f: 6.4, text: "Ringkasan penjualan 7 hari terakhir." },
    "30 hari": { f: 26, text: "Ringkasan penjualan 30 hari terakhir." },
  };
  var DELTA = { "Hari ini": "dari kemarin", "7 hari": "dari 7 hari sebelumnya", "30 hari": "dari 30 hari sebelumnya" };
  var BASE ={ sales: 5800000, tx: 142, newCust: 17 };

  var outlet = document.querySelector('select[aria-label="Outlet"]');
  var period = document.querySelector('select[aria-label="Periode"]');
  var sub = document.querySelector("main h1 + p");
  var kpi = function (label) { return document.querySelector('[data-kpi="' + label + '"]'); };

  function update() {
    var f = OUTLET[outlet.value] * PERIOD[period.value].f;
    var sales = BASE.sales * f;
    var tx = Math.round(BASE.tx * f);
    kpi("Penjualan").textContent = sales >= 1000000 ? "Rp " + (sales / 1000000).toFixed(1).replace(".", ",") + " jt" : rp(sales);
    kpi("Transaksi").textContent = tx.toLocaleString("id-ID");
    kpi("Rata-rata transaksi").textContent = tx ? rp(Math.round(sales / tx / 100) * 100) : "Rp 0";
    kpi("Pelanggan baru").textContent = Math.round(BASE.newCust * f).toLocaleString("id-ID");
    document.querySelectorAll("[data-delta-label]").forEach(function (el) { el.textContent = DELTA[period.value]; });
    sub.textContent = period.value === "Hari ini" && outlet.value !== "Semua outlet"
      ? "Ringkasan penjualan hari ini, outlet " + outlet.value + "."
      : PERIOD[period.value].text;
  }

  outlet.addEventListener("change", update);
  period.addEventListener("change", update);
})();

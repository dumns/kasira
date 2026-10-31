/* Layar kasir (demo): pilih menu, ubah jumlah, filter, dan alur pembayaran.
   Semua data hidup di memori halaman; tidak ada panggilan API. */
(function () {
  var rp = Demo.rp;
  var TAX = 0.1;

  var CARD_ON = "border-primary-600 bg-primary-50".split(" ");
  var CARD_OFF = "border-border/70 bg-surface hover:border-primary-300".split(" ");
  var PILL_ON = "bg-primary-600 text-white focus-visible:ring-primary-500".split(" ");
  var PILL_OFF = "border border-border bg-surface text-neutral-700 hover:bg-neutral-50 focus-visible:ring-neutral-300".split(" ");

  var $ = function (sel, root) { return (root || document).querySelector(sel); };
  var $$ = function (sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); };
  var swap = function (el, off, on) {
    off.forEach(function (c) { el.classList.remove(c); });
    on.forEach(function (c) { el.classList.add(c); });
  };

  var cards = $$("[data-item]");
  var linesEl = $("#cart-lines");
  var emptyEl = $("#cart-empty");
  var tpl = $("#cart-line");
  var btnPay = $("#btn-pay");
  var btnSave = $("[data-save]");
  var modal = $("#pay-modal");

  var items = {}; // nama -> { card, price, qty }
  var order = []; // urutan item di keranjang
  var orderNo = 2042;
  var cat = "Semua";

  cards.forEach(function (card) {
    var name = card.getAttribute("data-name");
    var qty = parseInt(card.getAttribute("data-qty"), 10) || 0;
    items[name] = { card: card, price: parseInt(card.getAttribute("data-price"), 10), qty: qty };
    if (qty > 0) order.push(name);
  });

  function totals() {
    var sub = 0, count = 0;
    order.forEach(function (n) { sub += items[n].price * items[n].qty; count += items[n].qty; });
    var tax = Math.round(sub * TAX);
    return { sub: sub, tax: tax, total: sub + tax, count: count };
  }

  function syncCard(name) {
    var it = items[name];
    var badge = $("[data-badge]", it.card);
    badge.textContent = it.qty;
    badge.style.display = it.qty > 0 ? "" : "none";
    if (it.qty > 0) swap(it.card, CARD_OFF, CARD_ON);
    else swap(it.card, CARD_ON, CARD_OFF);
  }

  function render() {
    linesEl.innerHTML = "";
    order.forEach(function (name) {
      var it = items[name];
      var li = tpl.content.firstElementChild.cloneNode(true);
      li.setAttribute("data-name", name);
      $("[data-line-name]", li).textContent = name;
      $("[data-line-price]", li).textContent = rp(it.price);
      $("[data-line-qty]", li).textContent = it.qty;
      $("[data-line-total]", li).textContent = rp(it.price * it.qty);
      $("[data-dec]", li).setAttribute("aria-label", "Kurangi " + name);
      $("[data-inc]", li).setAttribute("aria-label", "Tambah " + name);
      linesEl.appendChild(li);
    });
    var t = totals();
    var has = t.count > 0;
    linesEl.style.display = has ? "" : "none";
    emptyEl.style.display = has ? "none" : "flex";
    $$("[data-cart-count]").forEach(function (el) { el.textContent = t.count; });
    $("[data-subtotal]").textContent = rp(t.sub);
    $("[data-tax]").textContent = rp(t.tax);
    $("[data-total]").textContent = rp(t.total);
    btnPay.disabled = !has;
    btnSave.disabled = !has;
  }

  function setQty(name, qty) {
    var it = items[name];
    var idx = order.indexOf(name);
    it.qty = Math.max(0, qty);
    if (it.qty > 0 && idx < 0) order.push(name);
    if (it.qty === 0 && idx >= 0) order.splice(idx, 1);
    syncCard(name);
    render();
  }

  /* Menu: tambah item */
  cards.forEach(function (card) {
    card.addEventListener("click", function () {
      var name = card.getAttribute("data-name");
      setQty(name, items[name].qty + 1);
    });
  });

  /* Keranjang: tambah/kurangi */
  linesEl.addEventListener("click", function (e) {
    var btn = e.target.closest("[data-inc],[data-dec]");
    if (!btn) return;
    var name = btn.closest("li").getAttribute("data-name");
    setQty(name, items[name].qty + (btn.hasAttribute("data-inc") ? 1 : -1));
  });

  /* Filter kategori dan pencarian */
  var search = $("#menu-search");
  var pills = $$("#cat-pills [data-cat]");
  function filter() {
    var q = search.value.trim().toLowerCase();
    var shown = 0;
    cards.forEach(function (card) {
      var ok =
        (cat === "Semua" || card.getAttribute("data-cat") === cat) &&
        card.getAttribute("data-name").toLowerCase().indexOf(q) >= 0;
      card.style.display = ok ? "" : "none";
      if (ok) shown++;
    });
    $("#menu-empty").style.display = shown ? "none" : "";
  }
  pills.forEach(function (pill) {
    pill.addEventListener("click", function () {
      cat = pill.getAttribute("data-cat");
      pills.forEach(function (p) { swap(p, PILL_ON, PILL_OFF); });
      swap(pill, PILL_OFF, PILL_ON);
      filter();
    });
  });
  search.addEventListener("input", filter);

  /* Tipe pesanan: take away tidak memakai meja */
  $$("input[name=tipe]").forEach(function (r) {
    r.addEventListener("change", function () {
      $("#meja").disabled = r.value === "take-away" && r.checked;
    });
  });

  btnSave.addEventListener("click", function () {
    Demo.toast("Pesanan #INV-" + orderNo + " disimpan sebagai draft");
  });

  /* Pembayaran */
  var uang = $("#uang");
  var confirmBtn = $("#pay-confirm");
  var changeEl = $("[data-change]");
  var stepForm = $("[data-pay-step=form]");
  var stepDone = $("[data-pay-step=done]");
  var payTotal = 0;
  var done = false;

  function method() {
    return $("input[name=metode]:checked").value;
  }
  function received() {
    return parseInt(uang.value.replace(/\D/g, ""), 10) || 0;
  }
  function refreshPay() {
    var m = method();
    $$("[data-pay-panel]").forEach(function (p) {
      p.style.display = p.getAttribute("data-pay-panel") === m ? "" : "none";
    });
    if (m === "Tunai") {
      var r = received();
      var short = r > 0 && r < payTotal;
      changeEl.textContent = short ? "Kurang " + rp(payTotal - r) : rp(Math.max(0, r - payTotal));
      changeEl.classList.toggle("text-danger-700", short);
      confirmBtn.disabled = r < payTotal;
    } else {
      confirmBtn.disabled = false;
    }
  }

  btnPay.addEventListener("click", function () {
    payTotal = totals().total;
    done = false;
    stepForm.style.display = "";
    stepDone.style.display = "none";
    $("input[name=metode][value=Tunai]").checked = true;
    uang.value = "";
    $("[data-pay-total]").textContent = rp(payTotal);
    refreshPay();
  });

  $$("input[name=metode]").forEach(function (r) { r.addEventListener("change", refreshPay); });

  uang.addEventListener("input", function () {
    var r = received();
    uang.value = r ? r.toLocaleString("id-ID") : "";
    refreshPay();
  });

  $$("[data-amount]").forEach(function (b) {
    b.addEventListener("click", function () {
      var v = b.getAttribute("data-amount");
      uang.value = (v === "exact" ? payTotal : parseInt(v, 10)).toLocaleString("id-ID");
      refreshPay();
    });
  });

  confirmBtn.addEventListener("click", function () {
    var m = method();
    var r = received();
    done = true;
    stepForm.style.display = "none";
    stepDone.style.display = "flex";
    $("[data-done-no]").textContent = "#INV-" + orderNo;
    $("[data-done-method]").textContent = m;
    $("[data-done-total]").textContent = rp(payTotal);
    $("[data-done-change]").textContent = rp(Math.max(0, r - payTotal));
    $("[data-done-change-row]").style.display = m === "Tunai" ? "" : "none";
  });

  $("[data-print]").addEventListener("click", function () {
    Demo.toast("Struk dikirim ke printer");
  });

  /* Setelah pembayaran selesai, modal ditutup (tombol atau Esc/klik latar): pesanan baru */
  function newOrder() {
    order.slice().forEach(function (n) { items[n].qty = 0; syncCard(n); });
    order = [];
    orderNo++;
    $$("[data-order-no]").forEach(function (el) { el.textContent = "#INV-" + orderNo; });
    render();
    Demo.toast("Pembayaran berhasil dicatat");
  }
  new MutationObserver(function () {
    if (done && modal.getAttribute("aria-hidden") === "true") {
      done = false;
      newOrder();
    }
  }).observe(modal, { attributes: true, attributeFilter: ["aria-hidden"] });

  render();
})();

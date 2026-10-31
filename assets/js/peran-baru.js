/* Buat peran (demo): validasi nama, petunjuk level, pilih semua, lalu kembali ke daftar. */
(function () {
  var form = document.getElementById("peran-form");
  var nama = document.getElementById("nama");
  var err = document.getElementById("nama-error");
  var level = document.getElementById("level");
  var hint = document.getElementById("level-hint");

  var HINT = {
    "2": "Dapat mengelola peran L3 dan L4 di outletnya.",
    "3": "Dapat mengelola peran L4. Tidak bisa mengakses peran L3 lain.",
    "4": "Tidak dapat mengelola peran lain. Tidak bisa mengakses peran L4 lain.",
  };
  function showHint() { hint.textContent = HINT[level.value]; }
  level.addEventListener("change", showHint);
  showHint();

  function invalid(on) {
    err.classList.toggle("hidden", !on);
    nama.setAttribute("aria-invalid", on ? "true" : "false");
    nama.classList.toggle("border-danger-500", on);
  }
  nama.addEventListener("input", function () { invalid(nama.value.trim() === ""); });

  /* Pilih semua / kosongkan per grup */
  document.querySelectorAll("[data-select-all]").forEach(function (btn) {
    var boxes = function () { return btn.closest("fieldset").querySelectorAll("input[type=checkbox]"); };
    var sync = function () {
      var all = Array.prototype.every.call(boxes(), function (b) { return b.checked; });
      btn.textContent = all ? "Kosongkan" : "Pilih semua";
    };
    btn.addEventListener("click", function () {
      var all = Array.prototype.every.call(boxes(), function (b) { return b.checked; });
      boxes().forEach(function (b) { b.checked = !all; });
      sync();
    });
    boxes().forEach(function (b) { b.addEventListener("change", sync); });
    sync();
  });

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    var value = nama.value.trim();
    if (!value) {
      invalid(true);
      nama.focus();
      return;
    }
    Demo.toast("Peran disimpan");
    setTimeout(function () {
      location.href = "peran.html?baru=" + encodeURIComponent(value) + "&level=" + level.value;
    }, 700);
  });
})();

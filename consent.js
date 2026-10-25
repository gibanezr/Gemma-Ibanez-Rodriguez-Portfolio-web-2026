/* Banner de cookies + carga de Google Tag Manager SOLO si el visitante acepta */
(function () {
  var GTM_ID = "GTM-MDQ6HH8P";
  var KEY = "cookie-consent";
  var MAX_AGE = 1000 * 60 * 60 * 24 * 365; // la elección se recuerda 12 meses

  function read() {
    try {
      var d = JSON.parse(localStorage.getItem(KEY));
      if (d && Date.now() - d.t < MAX_AGE) return d.v;
    } catch (e) {}
    return null;
  }

  function save(v) {
    try { localStorage.setItem(KEY, JSON.stringify({ v: v, t: Date.now() })); } catch (e) {}
  }

  function loadGTM() {
    if (window.__gtmLoaded) return;
    window.__gtmLoaded = true;
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({ "gtm.start": new Date().getTime(), event: "gtm.js" });
    var s = document.createElement("script");
    s.async = true;
    s.src = "https://www.googletagmanager.com/gtm.js?id=" + GTM_ID;
    document.head.appendChild(s);
  }

  function deleteAnalyticsCookies() {
    var host = location.hostname;
    var past = "expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/";
    document.cookie.split(";").forEach(function (c) {
      var name = c.split("=")[0].trim();
      if (name === "_ga" || name === "_gid" || name.indexOf("_ga_") === 0 || name.indexOf("_gat") === 0) {
        document.cookie = name + "=; " + past;
        document.cookie = name + "=; " + past + "; domain=" + host;
        document.cookie = name + "=; " + past + "; domain=." + host;
      }
    });
  }

  function closeBanner() {
    var b = document.getElementById("cc");
    if (b) b.remove();
  }

  function decide(v) {
    var wasLoaded = window.__gtmLoaded;
    save(v);
    if (v === "granted") {
      loadGTM();
    } else {
      deleteAnalyticsCookies();
      if (wasLoaded) { location.reload(); return; }
    }
    closeBanner();
  }

  function showBanner() {
    if (document.getElementById("cc")) return;
    var b = document.createElement("div");
    b.id = "cc";
    b.setAttribute("role", "dialog");
    b.setAttribute("aria-modal", "false");
    b.setAttribute("aria-labelledby", "cc-title");
    b.innerHTML =
      '<h2 id="cc-title">Cookies</h2>' +
      "<p>Uso cookies de analítica (Google Analytics) para saber cuánta gente visita el portfolio y qué proyectos se ven más. " +
      'Solo se activan si aceptas y puedes cambiar tu elección cuando quieras. <a href="cookies.html">Más información</a></p>' +
      '<div class="cc-btns"><button type="button" data-cc="denied">Rechazar</button>' +
      '<button type="button" data-cc="granted">Aceptar</button></div>';
    b.addEventListener("click", function (e) {
      var btn = e.target.closest("[data-cc]");
      if (btn) decide(btn.getAttribute("data-cc"));
    });
    document.body.appendChild(b);
  }

  function init() {
    if (read() === "granted") loadGTM();
    if (read() === null) showBanner();
    document.querySelectorAll("[data-cookie-settings]").forEach(function (a) {
      a.addEventListener("click", function (e) {
        e.preventDefault();
        showBanner();
      });
    });
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
})();
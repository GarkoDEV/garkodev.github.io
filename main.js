/* Shared site navigation, language switcher, games and tap counter. */
(() => {
  "use strict";

  const text = (en, es) => `<span class="en">${en}</span><span class="es">${es}</span>`;
  const page = (location.pathname.split("/").pop() || "index").replace(".html", "");
  const active = ["privacy", "terms", "404"].includes(page) ? page : page === "index" ? "home" : "";
  const header = document.getElementById("site-header");
  if (header) {
    header.innerHTML = `<header class="site"><div class="wrap">
      <a class="brand" href="./"><img src="assets/img/brand/icon_garkodev.webp" width="36" height="36" alt=""><span>GarkoDEV</span></a>
      <nav aria-label="Main navigation">
        <a href="./"${active === "home" ? " aria-current=page" : ""}>${text("Home", "Inicio")}</a>
        <a href="./#games">${text("Games", "Juegos")}</a>
        <a href="./#contact">${text("Contact", "Contacto")}</a>
        <a href="privacy.html"${active === "privacy" ? " aria-current=page" : ""}>${text("Privacy", "Privacidad")}</a>
        <a href="terms.html"${active === "terms" ? " aria-current=page" : ""}>${text("Terms", "Términos")}</a>
      </nav>
      <div class="lang" role="group" aria-label="Language"><button type="button" data-lang="en" aria-pressed="false" lang="en">EN</button><button type="button" data-lang="es" aria-pressed="false" lang="es">ES</button></div>
      <button class="theme-toggle" type="button" data-theme-toggle aria-pressed="false"><span class="theme-symbol" aria-hidden="true">☾</span><span class="theme-label">${text("Dark mode", "Modo oscuro")}</span></button>
    </div></header>`;
  }

  const footer = document.getElementById("site-footer");
  if (footer) footer.innerHTML = `<footer class="site"><div class="wrap"><span>© ${new Date().getFullYear()} GarkoDEV</span><span>${text("Made independently in Spain.", "Hecho de forma independiente en España.")}</span><span><a href="privacy.html">${text("Privacy policy", "Privacidad")}</a> · <a href="terms.html">${text("Terms", "Términos")}</a> · <a href="app-ads.txt">app-ads.txt</a></span></div></footer>`;

  const setLanguage = (language) => {
    const lang = language === "es" ? "es" : "en";
    document.documentElement.lang = lang;
    try { localStorage.setItem("lang", lang); } catch (_) { /* Storage may be disabled. */ }
    document.querySelectorAll(".lang [data-lang]").forEach((button) => {
      button.setAttribute("aria-pressed", String(button.dataset.lang === lang));
    });
    const navigation = document.querySelector("nav[aria-label]");
    if (navigation) navigation.setAttribute("aria-label", lang === "es" ? "Navegación principal" : "Main navigation");
    const languageGroup = document.querySelector(".lang[role='group']");
    if (languageGroup) languageGroup.setAttribute("aria-label", lang === "es" ? "Idioma" : "Language");
    const toggle = document.querySelector("[data-theme-toggle]");
    if (toggle) {
      const dark = document.documentElement.dataset.theme === "dark";
      toggle.setAttribute("aria-label", dark ? (lang === "es" ? "Cambiar a modo claro" : "Switch to light mode") : (lang === "es" ? "Cambiar a modo oscuro" : "Switch to dark mode"));
    }
    const tapButton = document.getElementById("tap");
    const tapCount = document.getElementById("count");
    if (tapButton && tapCount) tapButton.setAttribute("aria-label", lang === "es" ? `Contador de toques: ${tapCount.textContent}` : `Tap counter: ${tapCount.textContent}`);
  };
  document.querySelectorAll(".lang [data-lang]").forEach((button) => {
    button.addEventListener("click", () => {
      const target = button.dataset.lang;
      const alt = document.querySelector(`link[rel="alternate"][hreflang="${target}"]`);
      if (alt && target !== document.documentElement.lang) {
        try { localStorage.setItem("lang", target); } catch (_) { /* Storage may be disabled. */ }
        location.pathname = new URL(alt.href).pathname;
        return;
      }
      setLanguage(target);
    });
  });
  setLanguage(document.documentElement.lang);

  const themeButton = document.querySelector("[data-theme-toggle]");
  const themeColor = document.querySelector('meta[name="theme-color"]');
  const updateThemeButton = () => {
    const dark = document.documentElement.dataset.theme === "dark";
    if (!themeButton) return;
    themeButton.setAttribute("aria-pressed", String(dark));
    themeButton.querySelector(".theme-symbol").textContent = dark ? "☀" : "☾";
    themeButton.querySelector(".theme-label").innerHTML = dark ? text("Light mode", "Modo claro") : text("Dark mode", "Modo oscuro");
    themeButton.setAttribute("aria-label", dark ? (document.documentElement.lang === "es" ? "Cambiar a modo claro" : "Switch to light mode") : (document.documentElement.lang === "es" ? "Cambiar a modo oscuro" : "Switch to dark mode"));
    if (themeColor) themeColor.content = dark ? "#111318" : "#f7f8fc";
  };
  if (themeButton) {
    updateThemeButton();
    themeButton.addEventListener("click", () => {
      const dark = document.documentElement.dataset.theme === "dark";
      if (dark) delete document.documentElement.dataset.theme;
      else document.documentElement.dataset.theme = "dark";
      try { localStorage.setItem("theme", dark ? "light" : "dark"); } catch (_) { /* Theme still changes for this visit. */ }
      updateThemeButton();
    });
  }

  const tap = document.getElementById("tap");
  const count = document.getElementById("count");
  if (tap && count) {
    let total = 0;
    try { total = Math.max(0, Number.parseInt(localStorage.getItem("garkodev-taps") || "0", 10) || 0); } catch (_) { /* Storage may be disabled. */ }
    const renderCount = () => {
      count.textContent = total.toLocaleString(document.documentElement.lang);
      tap.setAttribute("aria-label", document.documentElement.lang === "es" ? `Contador de toques: ${count.textContent}` : `Tap counter: ${count.textContent}`);
    };
    renderCount();
    tap.addEventListener("click", () => {
      total = Math.min(1000000, total + 1);
      try { localStorage.setItem("garkodev-taps", String(total)); } catch (_) { /* Counter still works for this visit. */ }
      renderCount();
    });
  }
})();

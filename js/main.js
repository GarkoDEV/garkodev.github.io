/* Shared site navigation, language switcher, games and tap counter. */
(() => {
  "use strict";

  const games = [
    ["Tung Sahur Puzzle", "Puzzle", "TS", "com.GarkoDEV.TungSahurPuzzle", "Solve puzzles in a game featuring Tung Sahur.", "Resuelve puzles en un juego protagonizado por Tung Sahur."],
    ["Tung Sahur Clicker", "Clicker", "TC", "com.GarkoDEV.TungSahurClicker", "Tap to build your score in this Tung Sahur clicker game.", "Toca para aumentar tu puntuación en este juego clicker de Tung Sahur."],
    ["Kawaii Capibara Clicker", "Clicker", "KC", "com.GarkoDEV.KawaiiCapibaraClicker", "Tap to grow your score with a kawaii capybara.", "Toca para aumentar tu puntuación con un capibara kawaii."],
    ["Police Patrol: Highway Pursuit", "Action", "PP", "com.GarkoDEV.PolicePatrolHighwayPursuit", "Join a police patrol in a highway pursuit.", "Únete a una patrulla policial en una persecución por carretera."],
    ["Coin Flip Simulator", "Simulator", "CF", "com.GarkoDEV.CoinFlip", "Flip a virtual coin and get heads or tails.", "Lanza una moneda virtual y obtén cara o cruz."],
    ["Random Dice - Tap to Roll", "Utility", "RD", "com.GarkoDEV.RandomDice2", "Tap to roll a virtual die and get a random result.", "Toca para lanzar un dado virtual y obtener un resultado aleatorio."]
  ];

  const text = (en, es) => `<span class="en">${en}</span><span class="es">${es}</span>`;
  const page = location.pathname.split("/").pop() || "index.html";
  const active = page === "privacy.html" ? "privacy" : page === "terms.html" ? "terms" : "home";
  const header = document.getElementById("site-header");
  if (header) {
    header.innerHTML = `<header class="site"><div class="wrap">
      <a class="brand" href="index.html"><img src="Icon_512_GarkoDEV_Black.png" width="36" height="36" alt=""><span>GarkoDEV</span></a>
      <nav aria-label="Main navigation">
        <a href="index.html"${active === "home" ? " aria-current=page" : ""}>${text("Home", "Inicio")}</a>
        <a href="index.html#games">${text("Games", "Juegos")}</a>
        <a href="index.html#contact">${text("Contact", "Contacto")}</a>
        <a href="privacy.html"${active === "privacy" ? " aria-current=page" : ""}>${text("Privacy", "Privacidad")}</a>
        <a href="terms.html"${active === "terms" ? " aria-current=page" : ""}>${text("Terms", "Términos")}</a>
      </nav>
      <div class="lang" aria-label="Language"><button type="button" data-lang="en" aria-pressed="false" lang="en">EN</button><button type="button" data-lang="es" aria-pressed="false" lang="es">ES</button></div>
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
    const toggle = document.querySelector("[data-theme-toggle]");
    if (toggle) {
      const dark = document.documentElement.dataset.theme === "dark";
      toggle.setAttribute("aria-label", dark ? (lang === "es" ? "Cambiar a modo claro" : "Switch to light mode") : (lang === "es" ? "Cambiar a modo oscuro" : "Switch to dark mode"));
    }
  };
  document.querySelectorAll(".lang [data-lang]").forEach((button) => {
    button.addEventListener("click", () => setLanguage(button.dataset.lang));
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

  const list = document.getElementById("games");
  if (list) {
    list.innerHTML = games.map(([name, category, mark, packageId, en, es], index) => {
      const url = `https://play.google.com/store/apps/details?id=${encodeURIComponent(packageId)}`;
      return `<li class="card"><div class="game-mark mark-${index + 1}" aria-hidden="true">${mark}</div><h3>${name}</h3><p class="tag">${category}</p><p>${text(en, es)}</p><a class="btn" href="${url}" target="_blank" rel="noopener noreferrer">${text("View on Google Play", "Ver en Google Play")}</a></li>`;
    }).join("");
  }

  const tap = document.getElementById("tap");
  const count = document.getElementById("count");
  if (tap && count) {
    let total = 0;
    try { total = Math.max(0, Number.parseInt(localStorage.getItem("garkodev-taps") || "0", 10) || 0); } catch (_) { /* Storage may be disabled. */ }
    const renderCount = () => { count.textContent = total.toLocaleString(document.documentElement.lang); };
    renderCount();
    tap.addEventListener("click", () => {
      total = Math.min(1000000, total + 1);
      try { localStorage.setItem("garkodev-taps", String(total)); } catch (_) { /* Counter still works for this visit. */ }
      renderCount();
      tap.setAttribute("aria-label", `${total.toLocaleString(document.documentElement.lang)} taps`);
    });
  }
})();

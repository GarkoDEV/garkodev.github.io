/* Shared site navigation, language switcher, games and tap counter. */
(() => {
  "use strict";

  const games = [
    ["Tung Sahur Puzzle", "Puzzle", "Icon_TungSahurPuzzle.png", "com.GarkoDEV.TungSahurPuzzle", "Match puzzle pieces, beat the timer, and unlock Tung Sahur artwork.", "Une las piezas, supera el cronómetro y desbloquea ilustraciones de Tung Sahur."],
    ["Tung Sahur Clicker", "Clicker", "Icon_TungSahurClicker.png", "com.GarkoDEV.TungSahurClicker", "Tap, level up, and unlock funny Tung Sahur evolutions with sound effects.", "Toca, sube de nivel y desbloquea divertidas evoluciones de Tung Sahur con efectos de sonido."],
    ["Kawaii Capibara Clicker", "Clicker", "Icon_KawaiiCapibaraClicker.png", "com.GarkoDEV.KawaiiCapibaraClicker", "Tap your capybara, level up, and unlock cute evolutions.", "Toca a tu capibara, sube de nivel y desbloquea adorables evoluciones."],
    ["Police Patrol: Highway Pursuit", "Arcade", "Icon_PolicePatrolHighwayPursuit.png", "com.GarkoDEV.PolicePatrolHighwayPursuit", "Chase through highway traffic, complete missions, and customize your patrol car.", "Persigue entre el tráfico, completa misiones y personaliza tu coche patrulla."],
    ["Coin Flip Simulator", "Casual", "Icon_CoinFlip.png", "com.GarkoDEV.CoinFlip", "Flip gold or silver coins with animations, sounds, and a heads-and-tails counter.", "Lanza monedas de oro o plata con animaciones, sonidos y un contador de caras y cruces."],
    ["Random Dice - Tap to Roll", "Casual", "Icon_RandomDice2.png", "com.GarkoDEV.RandomDice2", "Roll 1 to 6 dice with animations, sound, and an automatic total.", "Lanza de 1 a 6 dados con animación, sonido y suma automática."]
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
    list.innerHTML = games.map(([name, category, icon, packageId, en, es]) => {
      const url = `https://play.google.com/store/apps/details?id=${encodeURIComponent(packageId)}`;
      return `<li class="card"><img class="game-icon" src="${icon}" width="84" height="84" loading="lazy" decoding="async" alt="${name} app icon"><h3>${name}</h3><p class="tag">${category}</p><p>${text(en, es)}</p><a class="btn" href="${url}" target="_blank" rel="noopener noreferrer">${text("View on Google Play", "Ver en Google Play")}</a></li>`;
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

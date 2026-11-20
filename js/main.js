/* Shared site navigation, language switcher, games and tap counter. */
(() => {
  "use strict";

  const playStore = "https://play.google.com/store/apps/developer?id=GarkoDEV";
  const games = [
    ["30s to Tap", "Arcade", "Icon_30sToTap.png", "SixtySecondsToTap", "How many times can you tap in 30 seconds? A quick reflex challenge with a simple goal.", "¿Cuántas veces puedes tocar la pantalla en 30 segundos? Un reto rápido de reflejos con un objetivo sencillo."],
    ["Bubble Pop It", "Casual", "Icon_BubblePopIt.png", "BubblePopIt", "Pop colorful bubbles and enjoy a satisfying, relaxing break.", "Explota burbujas de colores y disfruta de un descanso relajante."],
    ["Coin Flip", "Utility", "Icon_Coin_Flip.png", "CoinFlip", "Can't decide? Flip a coin and let chance choose heads or tails.", "¿No sabes qué elegir? Lanza una moneda y deja que el azar decida."],
    ["Dodge Tap", "Arcade", "Icon_DodgeTap.png", "DodgeTap", "Tap to dodge incoming obstacles and see how long you can last.", "Toca para esquivar obstáculos y descubre cuánto tiempo puedes aguantar."],
    ["One Million Clicker", "Clicker", "Icon_OneMillionClicker.png", "OneMillionClicker", "Tap your way toward one million and watch your counter grow.", "Toca para llegar al millón y observa cómo aumenta tu contador."],
    ["One Million Countdown", "Utility", "Icon_OneMillionCountdown.png", "OneMillionCountdown", "Keep track of the countdown to one million with a clear, simple display.", "Sigue la cuenta atrás hasta un millón con una pantalla clara y sencilla."],
    ["One Million Taps", "Clicker", "Icon_OneMillionTaps.png", "OneMillionTaps", "A tiny tapping challenge: keep going until you reach one million taps.", "Un pequeño reto de toques: sigue hasta alcanzar un millón."],
    ["Random Dice", "Utility", "Icon_RandomDice.png", "RandomDice", "Roll a virtual die whenever you need a random result.", "Lanza un dado virtual cuando necesites un resultado al azar."],
    ["Sliding Puzzle", "Puzzle", "Icon_SlidingPuzzle.png", "SlidingPuzzle", "Slide the tiles into order and solve a classic number puzzle.", "Desliza las fichas hasta ordenarlas y resuelve un clásico puzle numérico."],
    ["Temperature Converter", "Utility", "Icon_TemperatureConverter.png", "TemperatureConverter", "Convert temperatures between Celsius, Fahrenheit and Kelvin.", "Convierte temperaturas entre Celsius, Fahrenheit y Kelvin."]
  ];

  const text = (en, es) => `<span class="en">${en}</span><span class="es">${es}</span>`;
  const page = location.pathname.split("/").pop() || "index.html";
  const active = page === "privacy.html" ? "privacy" : page === "terms.html" ? "terms" : "home";
  const header = document.getElementById("site-header");
  if (header) {
    header.innerHTML = `<header class="site"><div class="wrap">
      <a class="brand" href="index.html"><img src="Icon_512_GarkoDEV_Black.png" width="36" height="36" alt=""><span>GarkoDEV</span></a>
      <nav aria-label="${"Main navigation"}">
        <a href="index.html"${active === "home" ? " aria-current=page" : ""}>${text("Home", "Inicio")}</a>
        <a href="index.html#games">${text("Games", "Juegos")}</a>
        <a href="index.html#contact">${text("Contact", "Contacto")}</a>
        <a href="privacy.html"${active === "privacy" ? " aria-current=page" : ""}>${text("Privacy", "Privacidad")}</a>
        <a href="terms.html"${active === "terms" ? " aria-current=page" : ""}>${text("Terms", "Términos")}</a>
      </nav>
      <div class="lang" aria-label="Language"><button type="button" data-lang="en" aria-pressed="false" lang="en">EN</button><button type="button" data-lang="es" aria-pressed="false" lang="es">ES</button></div>
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
  };
  document.querySelectorAll(".lang [data-lang]").forEach((button) => {
    button.addEventListener("click", () => setLanguage(button.dataset.lang));
  });
  setLanguage(document.documentElement.lang);

  const list = document.getElementById("games");
  if (list) {
    list.innerHTML = games.map(([name, category, icon, packageName, en, es]) => {
      const packageId = `com.GarkoDEV.${packageName}`;
      const url = `https://play.google.com/store/apps/details?id=${encodeURIComponent(packageId)}`;
      return `<li class="card"><img src="${icon}" width="84" height="84" loading="lazy" alt="${name} app icon"><h3>${name}</h3><p class="tag">${category}</p><p>${text(en, es)}</p><a class="btn" href="${url}" target="_blank" rel="noopener noreferrer">${text("View on Google Play", "Ver en Google Play")}</a></li>`;
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

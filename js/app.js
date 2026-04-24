// CORE GAME ENGINE

const App = (() => {

  let currentScreen = "screen-menu";

  function init() {
    Logger.info("App init");

    bindRoutes();
    bindGameActions();
    bindSettings();

    initPlayer();
    initQueue();

    Manifest.load().then(() => {
      Manifest.applyAssets();
    });

    registerSW();
  }

  // -------------------------
  // ROUTER
  // -------------------------
  function go(screenId) {
    document.querySelectorAll(".screen").forEach(s => s.classList.remove("active"));
    document.getElementById("screen-" + screenId).classList.add("active");

    currentScreen = screenId;
    State.set("game.currentScreen", screenId);

    Logger.info("Route change", screenId);
  }

  function bindRoutes() {
    document.querySelectorAll("[data-route]").forEach(btn => {
      btn.addEventListener("click", () => {
        const route = btn.getAttribute("data-route");
        go(route);
      });
    });
  }

  // -------------------------
  // PLAYER INIT
  // -------------------------
  function initPlayer() {
    const state = State.get();

    const nameInput = document.getElementById("player-name");
    const countryInput = document.getElementById("player-country");

    if (nameInput) nameInput.value = state.player.name;
    if (countryInput) countryInput.value = state.player.country;

    const profileName = document.getElementById("profile-name");
    if (profileName) profileName.innerText = state.player.name;

    document.querySelector("[data-route='lobby']")?.addEventListener("click", () => {
      const name = nameInput.value;
      const country = countryInput.value;

      State.set("player.name", name);
      State.set("player.country", country);

      if (profileName) profileName.innerText = name;
    });
  }

  // -------------------------
  // SPECIALTY
  // -------------------------
  function bindSpecialties() {
    document.querySelectorAll("[data-specialty]").forEach(btn => {
      btn.addEventListener("click", () => {
        const spec = btn.getAttribute("data-specialty");

        State.set("game.specialty", spec);
        document.getElementById("shift-specialty").innerText = spec;

        go("shift");
      });
    });
  }

  // -------------------------
  // SHIFT SYSTEM
  // -------------------------
  let score = 50;

  function bindGameActions() {
    bindSpecialties();

    document.querySelectorAll("[data-score]").forEach(btn => {
      btn.addEventListener("click", () => {
        const value = parseInt(btn.getAttribute("data-score"));
        score += value;

        toast("+" + value + " pontos");
        Logger.info("Score change", value);
      });
    });

    const finishBtn = document.getElementById("finish-case");
    if (finishBtn) {
      finishBtn.addEventListener("click", finishCase);
    }
  }

  function finishCase() {
    const final = Math.max(60, Math.min(100, score));

    document.getElementById("final-score").innerText = final;
    document.getElementById("final-score-copy").innerText = final;

    State.set("game.score", final);

    Logger.info("Case finished", final);

    go("result");
  }

  // -------------------------
  // PATIENT QUEUE
  // -------------------------
  function initQueue() {
    const names = [
      "Carlos Eduardo","Maria Aparecida","João Victor","Fernanda Lima",
      "Luís Fernando","Ana Clara","Marcos Vinícius","Patrícia Gomes",
      "Gabriel Alves","Beatriz Souza","Rafael Moreira","Juliana Costa"
    ];

    const container = document.getElementById("patient-queue");
    if (!container) return;

    container.innerHTML = names.map((n,i)=>`
      <div class="queue-item ${i===6?'active':''}">
        <strong>${String(i+1).padStart(2,"0")} ${n}</strong>
        <span>${i===6?'Em atendimento':'Aguardando'}</span>
      </div>
    `).join("");
  }

  // -------------------------
  // SETTINGS
  // -------------------------
  function bindSettings() {
    const saveBtn = document.getElementById("save-settings");

    if (saveBtn) {
      saveBtn.addEventListener("click", () => {
        const quality = document.getElementById("quality-select").value;

        State.set("settings.quality", quality);

        toast("Configurações salvas");
      });
    }
  }

  // -------------------------
  // ADMIN PANEL
  // -------------------------
  function renderAdmin() {
    const manifestView = document.getElementById("manifest-view");
    const logsView = document.getElementById("logs-view");

    if (manifestView) {
      manifestView.textContent = JSON.stringify(Manifest.get(), null, 2);
    }

    if (logsView) {
      logsView.textContent = Logger.getLogs().map(l => JSON.stringify(l)).join("\n");
    }
  }

  document.addEventListener("click", (e) => {
    if (e.target.closest("[data-route='admin']")) {
      setTimeout(renderAdmin, 100);
    }
  });

  document.getElementById("clear-logs")?.addEventListener("click", () => {
    Logger.clear();
    renderAdmin();
  });

  document.getElementById("clear-cache")?.addEventListener("click", () => {
    caches.keys().then(keys => keys.forEach(k => caches.delete(k)));
    toast("Cache limpo");
  });

  // -------------------------
  // TOAST
  // -------------------------
  function toast(msg) {
    const el = document.getElementById("toast");
    if (!el) return;

    el.innerText = msg;
    el.classList.add("show");

    setTimeout(() => el.classList.remove("show"), 1500);
  }

  // -------------------------
  // SERVICE WORKER
  // -------------------------
  function registerSW() {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.register("./service-worker.js")
        .then(() => Logger.info("SW registrado"))
        .catch(err => Logger.error("SW erro", err));
    }
  }

  return { init, go };
})();

// INIT
document.addEventListener("DOMContentLoaded", App.init);

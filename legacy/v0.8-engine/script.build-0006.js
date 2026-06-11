/* =========================================================
   Simulador Médico — Vale Edition (Local Engine)
   Stage 2: engine local para eliminar dependências remotas
   ========================================================= */

(function () {
  "use strict";

  // Build metadata (visível no jogo)
  const BUILD_ID = "0006";
  const BUILD_TS = "2026-02-18 15:28:46 UTC";
  const STAGE = "2";
  const BUILD_LABEL = `Build ${BUILD_ID} • ${BUILD_TS} • Stage ${STAGE}`;


  // ---------------------------
  // Helpers
  // ---------------------------
  const $ = (id) => document.getElementById(id);
  const clamp = (n, a, b) => Math.max(a, Math.min(b, n));
  const round = (n) => Math.round(n);
  const max0 = (n) => Math.max(0, n);
  const rand = (a, b) => Math.floor(Math.random() * (b - a + 1)) + a;
  const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];
  const nowMs = () => Date.now();

  const STORAGE_KEY = "medsim_save_v1";
  const TUTORIAL_KEY = "medsim_tutorial_seen_v2";
  const CASE_COOLDOWN_MS = 2500;

  // ---------------------------
  // Data (avatars)
  // ---------------------------
  window.avatars = Array.from({ length: 6 }, (_, i) => ({
    id: i + 1,
    image: `images/avatar${i + 1}.png`,
  }));

  // ---------------------------
  // UI Class
  // ---------------------------
  class GameUI {
    constructor() {
      this.screens = {
        logo: $("logo-screen"),
        cover: $("cover-screen"),
        welcome: $("welcome-screen"),
        lobby: $("lobby-screen"),
        menu: $("menu-screen"),
        office: $("office-screen"),
        game: $("game-screen"),
      };

      this.playerNameInput = $("player-name");
      this.playerAvatar = $("player-avatar");
      this.avatarSelection = $("avatar-selection");

      this.officeName = $("office-name");
      this.officeLevel = $("office-level");
      this.officeAvatar = $("office-avatar");
      this.officeScore = $("office-score");

      this.statTotal = $("stat-total");
      this.statCorrect = $("stat-correct");
      this.statIncorrect = $("stat-incorrect");
      this.statDeaths = $("stat-deaths");

      this.modeSelect = $("mode-select");
      this.specialtySelect = $("specialty-select");

      this.levelDisplay = $("level-display");
      this.scoreDisplay = $("score-display");

      this.patientsList = $("patients-list");
      this.patientDetails = $("patient-details");

      this.examPage = $("exam-page");
      this.examContent = $("exam-content");
      this.treatPage = $("treatment-page");
      this.treatContent = $("treatment-content");
      this.dxPage = $("diagnosis-page");
      this.dxContent = $("diagnosis-content");

      this.tutorialPage = $("tutorial-page");

      this._bindNav();
      this._renderAvatars();
    }

       _bindNav() {
      const startButton = $("start-button");
      const nextCaseButton = $("next-case-button");
      const backOffice = $("back-office");
      const pauseBtn = $("pause-btn");

      const cover = this.screens.cover;
      const welcome = this.screens.welcome;

      // cover -> welcome (toque em qualquer lugar)
      if (cover) cover.addEventListener("click", () => this.showScreen("welcome"));

      // welcome -> menu (toque em qualquer lugar)
      if (welcome) welcome.addEventListener("click", () => this.showScreen("menu"));

      // menu buttons
      $("btn-continue")?.addEventListener("click", () => {
        if (window.engine?.hasProfile()) {
          this.showScreen("office");
          this.refreshOffice(window.engine.state);
        } else {
          this.showScreen("lobby");
        }
      });
      $("btn-new")?.addEventListener("click", () => {
        window.engine?.newCareer();
        this.showScreen("lobby");
      });
      $("btn-tutorial")?.addEventListener("click", () => {
        this.maybeShowTutorial(() => {});
      });

      // lobby -> office (cria/atualiza perfil)
      if (startButton) {
        startButton.addEventListener("click", () => {
          const name = (this.playerNameInput?.value || "").trim();
          if (!name) {
            alert("Digite seu nome para continuar.");
            return;
          }
          const mode = this.modeSelect?.value || "training";
          const specialty = this.specialtySelect?.value || "Clínica Geral";
          window.engine.setProfile({ name, mode, specialty });
          this.showScreen("office");
          this.refreshOffice(window.engine.state);
          this.refreshMenu(window.engine.state);
        });
      }

      // office -> game
      if (nextCaseButton) {
        nextCaseButton.addEventListener("click", () => {
          this.showScreen("game");
          this.maybeShowTutorial(() => window.engine.start());
        });
      }

      if (backOffice) {
        backOffice.addEventListener("click", () => {
          window.engine.resetRunOnly();
          this.showScreen("menu");
          this.refreshMenu(window.engine.state);
        });
      }

      if (pauseBtn) {
        pauseBtn.addEventListener("click", () => {
          window.engine.togglePause();
          pauseBtn.textContent = window.engine.state.paused ? "Retomar" : "Pausar";
        });
      }

      // overlays back buttons
      $("exam-back")?.addEventListener("click", () => this.hideOverlay(this.examPage));
      $("treatment-back")?.addEventListener("click", () => this.hideOverlay(this.treatPage));
      $("diagnosis-back")?.addEventListener("click", () => this.hideOverlay(this.dxPage));

      // tutorial
      $("tutorial-close")?.addEventListener("click", () => {
        this.hideOverlay(this.tutorialPage);
        try { localStorage.setItem(TUTORIAL_KEY, "1"); } catch (_) {}
        if (this._onTutorialDone) {
          const fn = this._onTutorialDone;
          this._onTutorialDone = null;
          fn();
        }
      });
    }

    _renderAvatars() {
      if (!this.avatarSelection) return;
      this.avatarSelection.innerHTML = "";
      const saved = window.engine?.state?.profile?.avatarId || 1;

      window.avatars.forEach((av) => {
        const btn = document.createElement("button");
        btn.type = "button";
        btn.className = av.id === saved ? "selected" : "";
        btn.innerHTML = `<img src="${av.image}" alt="Avatar ${av.id}">`;
        btn.addEventListener("click", () => {
          this.avatarSelection.querySelectorAll("button").forEach((b) => b.classList.remove("selected"));
          btn.classList.add("selected");
          window.engine.state.profile.avatarId = av.id;
          this._updateLobbyAvatar();
          window.engine.save();
        });
        this.avatarSelection.appendChild(btn);
      });

      this._updateLobbyAvatar();
    }

    _updateLobbyAvatar() {
      if (!this.playerAvatar) return;
      const avId = window.engine?.state?.profile?.avatarId || 1;
      const av = window.avatars.find((a) => a.id === avId) || window.avatars[0];
      this.playerAvatar.src = av.image;
    }

    showScreen(key) {
      Object.values(this.screens).forEach((s) => s && s.classList.remove("active"));
      const target = this.screens[key];
      if (target) target.classList.add("active");
    }

    

    maybeShowTutorial(onDone){
      let seen = false;
      try { seen = localStorage.getItem(TUTORIAL_KEY) === "1"; } catch (_) {}
      if (seen || !this.tutorialPage){
        onDone && onDone();
        return;
      }
      this._onTutorialDone = onDone;
      this.showOverlay(this.tutorialPage);
    }
showOverlay(el) {
      if (!el) return;
      el.classList.remove("hidden");
    }
    hideOverlay(el) {
      if (!el) return;
      el.classList.add("hidden");
    }

    refreshOffice(state) {
      const p = state.profile;
      if (this.officeName) this.officeName.textContent = p.name || "—";
      if (this.officeLevel) this.officeLevel.textContent = `Nível ${state.level} • ${state.rank}`;

      const xpEl = document.getElementById("office-xp");
      const xpFill = document.getElementById("office-xpfill");
      if (xpEl) xpEl.textContent = `XP ${state.xp || 0}/${state.xpNext || 100}`;
      if (xpFill) {
        const pct = Math.max(0, Math.min(100, ((state.xp || 0) / (state.xpNext || 100)) * 100));
        xpFill.style.width = pct.toFixed(1) + "%";
      }

      if (this.officeScore) this.officeScore.textContent = String(state.score);

      // avatar
      if (this.officeAvatar) {
        const avId = p.avatarId || 1;
        const av = window.avatars.find((a) => a.id === avId) || window.avatars[0];
        this.officeAvatar.innerHTML = `<img src="${av.image}" alt="Avatar">`;
      }

      // stats
      if (this.statTotal) this.statTotal.textContent = String(state.stats.total);
      if (this.statCorrect) this.statCorrect.textContent = String(state.stats.correct);
      if (this.statIncorrect) this.statIncorrect.textContent = String(state.stats.incorrect);
      if (this.statDeaths) this.statDeaths.textContent = String(state.stats.deaths);

      this.refreshMenu(state);
    }


    refreshMenu(state){
      const el = $("menu-profile");
      if (!el) return;
      const p = state?.profile || {};
      const has = !!(p.name && String(p.name).trim());
      const lvl = state?.level || 1;
      const rank = state?.rank || "—";
      const xp = state?.xp || 0;
      const xpNext = state?.xpNext || 100;
      el.textContent = has
        ? `Perfil: ${p.name} • ${p.specialty || "Clínica Geral"}
Nível ${lvl} • ${rank} • XP ${xp}/${xpNext}`
        : "Sem carreira salva. Crie um perfil para começar.";
      const btnC = $("btn-continue");
      if (btnC) btnC.textContent = has ? "Continuar carreira" : "Começar";
    }

    refreshTopBar(state) {
      if (this.levelDisplay) this.levelDisplay.textContent = `Nível ${state.level}`;
      if (this.scoreDisplay) this.scoreDisplay.textContent = `Pontuação: ${state.score}`;
      const xpDisp = document.getElementById("xp-display");
      if (xpDisp) xpDisp.textContent = `XP: ${state.xp || 0}/${state.xpNext || 100}`;
    }


    refreshPatients(patients, activeId) {
      if (!this.patientsList) return;
      this.patientsList.innerHTML = "";
      if (!patients || patients.length === 0) {
        this.patientsList.innerHTML = `<div class="muted">Nenhum paciente no momento.</div>`;
        return;
      }

      patients.forEach((p) => {
        const chip = document.createElement("div");
        chip.className = "patient-chip" + (p.id === activeId ? " active" : "");
        const av = pick([ "images/patient_male.png", "images/patient_female.png" ]);
        const badgeClass = p.stability <= 30 ? "red" : p.stability <= 60 ? "yellow" : "green";
        const badgeText = p.stability <= 30 ? "Crítico" : p.stability <= 60 ? "Atenção" : "Estável";
        chip.innerHTML = `
          <div class="mini-avatar"><img src="${av}" alt=""></div>
          <div class="patient-meta">
            <div class="name">${p.name}</div>
            <div class="sub">${p.age} anos • ${p.complaint}</div>
          </div>
          <div class="badge ${badgeClass}">${badgeText}</div>
        `;
        chip.addEventListener("click", () => {
          window.engine.setActivePatient(p.id);
        });
        this.patientsList.appendChild(chip);
      });
    }

    showInfo(title, message) {
      const box = this.patientDetails?.querySelector(".info-container");
      if (!box) return;
      box.innerHTML = `<h4>${title}</h4><pre>${message}</pre>`;
    }

    renderPatientDetails(p, engine) {
      if (!this.patientDetails) return;

      if (!p) {
        this.patientDetails.innerHTML = `<div class="muted">Selecione um paciente na fila.</div>`;
        return;
      }

      const avId = engine.state.profile.avatarId || 1;
      const doctorAv = window.avatars.find((a) => a.id === avId) || window.avatars[0];

      this.patientDetails.innerHTML = `
        <div class="profile-row">
          <img src="${doctorAv.image}" alt="Médico" style="width:40px;height:40px;border-radius:14px;border:1px solid rgba(255,255,255,.16)">
          <div>
            <div class="profile-name">${p.name}</div>
            <div class="muted">${p.age} anos • ${p.sex} • ${p.complaint}</div>
          </div>
        </div>

        <div class="section-title">Sinais vitais</div>
        <div class="vitals">
          <div class="vital"><div class="k">PA</div><div class="v">${p.vitals.bp}</div></div>
          <div class="vital"><div class="k">FC</div><div class="v">${p.vitals.hr} bpm</div></div>
          <div class="vital"><div class="k">SpO₂</div><div class="v">${p.vitals.spo2}%</div></div>
          <div class="vital"><div class="k">FR</div><div class="v">${p.vitals.rr} irpm</div></div>
          <div class="vital"><div class="k">Temp</div><div class="v">${p.vitals.temp}°C</div></div>
          <div class="vital"><div class="k">Dor</div><div class="v">${p.vitals.pain}/10</div></div>
        </div>

        <div class="section-title">História & exame</div>
        <div class="info-container">
          <h4>Queixa e história</h4>
          <pre>${p.history}</pre>
        </div>

        <div class="actions-area">
          <div class="actions-row">
            <button class="action-btn" id="btn-exams"><i>🧪</i><span>Exames</span></button>
            <button class="action-btn" id="btn-treat"><i>💉</i><span>Condutas</span></button>
            <button class="action-btn" id="btn-dx"><i>🩺</i><span>Diagnóstico</span></button>
          </div>
          <div class="actions-row">
            <button class="action-btn" id="btn-finish"><i>✅</i><span>Finalizar caso</span></button>
            <button class="action-btn" id="btn-notes"><i>🗒️</i><span>Resumo do caso</span></button>
            <button class="action-btn" id="btn-hint"><i>💡</i><span>Dica</span></button>
            <button class="action-btn" id="btn-help"><i>❓</i><span>Ajuda</span></button>
          </div>
        </div>
      `;

      // Bind buttons
      this.patientDetails.querySelector("#btn-exams")?.addEventListener("click", () => this.renderExamOverlay(p, engine));
      this.patientDetails.querySelector("#btn-treat")?.addEventListener("click", () => this.renderTreatmentOverlay(p, engine));
      this.patientDetails.querySelector("#btn-dx")?.addEventListener("click", () => this.renderDiagnosisOverlay(p, engine));
      this.patientDetails.querySelector("#btn-finish")?.addEventListener("click", () => engine.evaluateCase(p));
      this.patientDetails.querySelector("#btn-notes")?.addEventListener("click", () => {
        const notes = [
          `Queixa: ${p.complaint}`,
          `História: ${p.history}`,
          `Exames solicitados: ${(p.orderedExams.length ? p.orderedExams.join(", ") : "Nenhum")}`,
          `Condutas/meds: ${(p.givenMeds.length ? p.givenMeds.join(", ") : "Nenhuma")}`,
          `Diagnóstico selecionado: ${p.selectedDiagnosis || "—"}`,
        ].join("\n");
        this.showInfo("Resumo", notes);
      });
      this.patientDetails.querySelector("#btn-hint")?.addEventListener("click", () => {
        const msg = engine.buildHint(p);
        this.showInfo("Dicas", msg);
      });

      this.patientDetails.querySelector("#btn-help")?.addEventListener("click", () => {
        this.showInfo("Ajuda rápida",
          "Fluxo recomendado:\n" +
          "1) Leia a história e sinais vitais.\n" +
          "2) Peça exames que confirmem hipóteses.\n" +
          "3) Inicie condutas/medicações indicadas.\n" +
          "4) Selecione o diagnóstico.\n" +
          "5) Finalize o caso.\n\n" +
          "Dica: No modo Treinamento, o paciente piora mais devagar."
        );
      });
    }

    renderExamOverlay(p, engine) {
      this.examContent.innerHTML = "";
      const title = document.createElement("h2");
      title.textContent = "Solicitar exames";
      const sub = document.createElement("div");
      sub.className = "muted";
      sub.textContent = "Escolha exames laboratoriais e de imagem. Alguns demoram um pouco para retornar.";

      const list = document.createElement("div");
      list.className = "grid-list";

      const exams = (engine.catalog?.exams || []).slice().sort((a, b) => a.name.localeCompare(b.name, "pt-BR"));
      exams.forEach((e) => {
        const btn = document.createElement("button");
        btn.className = "item-btn";
        const already = p.orderedExams.includes(e.name);
        btn.innerHTML = `<strong>${e.name}</strong><span class="small">${already ? "Já solicitado" : (e.description || "")}</span>`;
        btn.disabled = already;
        btn.addEventListener("click", () => {
          engine.orderExam(p, e.name);
          btn.disabled = true;
          btn.querySelector(".small").textContent = "Já solicitado";
        });
        list.appendChild(btn);
      });

      this.examContent.appendChild(title);
      this.examContent.appendChild(sub);
      this.examContent.appendChild(list);
      this.showOverlay(this.examPage);
    }

    renderTreatmentOverlay(p, engine) {
      this.treatContent.innerHTML = "";
      const title = document.createElement("h2");
      title.textContent = "Condutas e medicações (sem dose)";
      const sub = document.createElement("div");
      sub.className = "muted";
      sub.textContent = "Aqui você escolhe intervenções e medicações por indicação (sem dosagens).";

      const list = document.createElement("div");
      list.className = "grid-list";

      const meds = (engine.catalog?.meds || []).slice().sort((a, b) => a.name.localeCompare(b.name, "pt-BR"));
      meds.forEach((m) => {
        const btn = document.createElement("button");
        btn.className = "item-btn";
        const already = p.givenMeds.includes(m.name);
        btn.innerHTML = `<strong>${m.name}</strong><span class="small">${already ? "Já aplicado" : (m.description || "")}</span>`;
        btn.disabled = already;
        btn.addEventListener("click", () => {
          engine.giveMed(p, m.name);
          btn.disabled = true;
          btn.querySelector(".small").textContent = "Já aplicado";
        });
        list.appendChild(btn);
      });

      this.treatContent.appendChild(title);
      this.treatContent.appendChild(sub);
      this.treatContent.appendChild(list);
      this.showOverlay(this.treatPage);
    }

    renderDiagnosisOverlay(p, engine) {
      this.dxContent.innerHTML = "";
      const title = document.createElement("h2");
      title.textContent = "Selecionar diagnóstico";
      const sub = document.createElement("div");
      sub.className = "muted";
      sub.textContent = "Escolha o diagnóstico mais provável baseado nos achados.";

      const list = document.createElement("div");
      list.className = "grid-list";

      const dxs = (engine.catalog?.diagnoses || []).slice().sort((a, b) => a.name.localeCompare(b.name, "pt-BR"));
      dxs.forEach((d) => {
        const btn = document.createElement("button");
        btn.className = "item-btn";
        const selected = p.selectedDiagnosis === d.name;
        btn.innerHTML = `<strong>${d.name}</strong><span class="small">${selected ? "Selecionado" : (d.description || "")}</span>`;
        btn.addEventListener("click", () => {
          p.selectedDiagnosis = d.name;
          engine.ui.showInfo("Diagnóstico", `Selecionado: ${d.name}`);
          // update labels
          this.dxContent.querySelectorAll(".item-btn .small").forEach((el) => {
            if (el.textContent === "Selecionado") el.textContent = "";
          });
          btn.querySelector(".small").textContent = "Selecionado";
          engine.save();
        });
        list.appendChild(btn);
      });

      this.dxContent.appendChild(title);
      this.dxContent.appendChild(sub);
      this.dxContent.appendChild(list);
      this.showOverlay(this.dxPage);
    }
  }

  // ---------------------------
  // Engine
  // ---------------------------
  class Engine {
    constructor() {
      this.ui = new GameUI();

      this.config = {
        tickMs: 1200,
        baseNewPatientIntervalMs: 25000,
        deteriorationMultiplier: 1.0,
        training: {
          deteriorationMultiplier: 0.25,
          penaltyMultiplier: 0.35,
        },
        shift: {
          deteriorationMultiplier: 1.0,
          penaltyMultiplier: 1.0,
        },
      };

      this.catalog = null;
      this.cases = [];

      this.state = this._loadOrCreateState();
      this.patients = [];
      this.activePatientId = null;

      this._tickTimer = null;
      this.newPatientInterval = null;

      this._cooldownUntil = 0;

      this._init();
    }

    async _init() {
      await this.loadCatalog();
      await this.loadCases();
      this.ui._renderAvatars();

      // If saved profile exists, go to cover; otherwise cover anyway.
      this.ui.showScreen("logo");
      // cover will be shown by custom.js (logo fade), but we ensure fallback
      setTimeout(() => {
        // Atualiza badge (mesmo se o HTML já tiver texto)
        const badge = document.querySelector(".build-badge");
        if (badge) badge.textContent = BUILD_LABEL;

        // Se ainda estiver na tela de logo após o fade, força a capa.
        if (this.ui.screens.logo?.classList.contains("active")) {
          this.ui.showScreen("cover");
        }
      }, 2900);

      this.ui.refreshOffice(this.state);
      this.ui.refreshTopBar(this.state);
      this.ui.refreshMenu(this.state);
      this.ui.refreshMenu(this.state);
    }

    _loadOrCreateState() {
      try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (raw) return JSON.parse(raw);
      } catch (_) {}

      return {
        profile: { name: "", avatarId: 1, mode: "training", specialty: "Clínica Geral" },
        level: 1,
        rank: "Interno",
        xp: 0,
        xpNext: 100,
        score: 0,
        stats: { total: 0, correct: 0, incorrect: 0, deaths: 0 },
        paused: false,
      };
    }

    save() {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(this.state));
      } catch (_) {}
    }

    resetRunOnly() {
      // doesn't wipe career, just stops running timers/patients
      this.stop();
      this.patients = [];
      this.activePatientId = null;
      this.ui.refreshPatients(this.patients, this.activePatientId);
      this.ui.renderPatientDetails(null, this);
    }

    setProfile({ name, mode, specialty }) {
      this.state.profile.name = name;
      this.state.profile.mode = mode;
      this.state.profile.specialty = specialty;
      // garante xpNext
      if (!this.state.xpNext) this.state.xpNext = this._xpForNext(this.state.level || 1);
      this.save();
    }

    hasProfile() {
      const n = (this.state.profile?.name || "").trim();
      return !!n;
    }

    newCareer() {
      // reseta carreira (mantém avatar atual por conveniência)
      const avatarId = this.state.profile?.avatarId || 1;
      this.state = {
        profile: { name: "", avatarId, mode: "training", specialty: "Clínica Geral" },
        level: 1,
        rank: "Interno",
        xp: 0,
        xpNext: 100,
        score: 0,
        stats: { total: 0, correct: 0, incorrect: 0, deaths: 0 },
        paused: false,
      };
      this.save();
      this.resetRunOnly();
      this.ui._renderAvatars();
      this.ui.refreshOffice(this.state);
      this.ui.refreshTopBar(this.state);
      this.ui.refreshMenu(this.state);
    }

    _xpForNext(level) {
      return 100 + (level - 1) * 60;
    }

    addXP(amount) {
      const gain = Math.max(0, Math.round(amount || 0));
      this.state.xp = Math.max(0, (this.state.xp || 0) + gain);
      if (!this.state.xpNext) this.state.xpNext = this._xpForNext(this.state.level || 1);

      let safety = 0;
      while ((this.state.xp || 0) >= (this.state.xpNext || 0) && safety < 20) {
        this.state.xp -= (this.state.xpNext || 0);
        this.state.level += 1;
        this.state.rank = this._rankForLevel(this.state.level);
        this.state.xpNext = this._xpForNext(this.state.level);
        this.ui.showInfo("Subiu de nível!", `Parabéns! Você agora é Nível ${this.state.level} • ${this.state.rank}.`);
        safety++;
      }
      this.save();
    }

    _caseMinLevel(c) {
      if (!c) return 1;
      if (typeof c.minLevel === "number") return c.minLevel;
      const sev = String(c.severity || "mid").toLowerCase();
      if (sev === "low") return 1;
      if (sev === "mid") return 2;
      if (sev === "high") return 4;
      return 2;
    }

    async loadCatalog() {
      const normalizeList = (val) => {
        // Accept: ["A","B"], [{name:"A"}], {group:[...], group2:[...]}
        const out = [];
        if (!val) return out;

        const pushItem = (it) => {
          if (!it) return;
          if (typeof it === "string") out.push({ name: it, description: "" });
          else if (typeof it === "object") {
            if (typeof it.name === "string") out.push({ name: it.name, description: it.description || "" });
            else if (typeof it.title === "string") out.push({ name: it.title, description: it.description || "" });
          }
        };

        if (Array.isArray(val)) {
          val.forEach(pushItem);
          return out;
        }
        if (typeof val === "object") {
          Object.values(val).forEach((v) => {
            if (Array.isArray(v)) v.forEach(pushItem);
            else if (typeof v === "object") {
              Object.values(v).forEach((vv) => Array.isArray(vv) ? vv.forEach(pushItem) : pushItem(vv));
            } else pushItem(v);
          });
          return out;
        }
        pushItem(val);
        return out;
      };

      try {
        const res = await fetch("./data/catalog.json", { cache: "no-store" });
        if (!res.ok) throw new Error("HTTP " + res.status);
        const raw = await res.json();
        this.catalogRaw = raw;

        // Normalize to arrays of {name, description}
        this.catalog = {
          exams: normalizeList(raw.exams),
          meds: normalizeList(raw.meds || raw.treatments),
          diagnoses: normalizeList(raw.diagnoses),
        };

        // Sort once (pt-BR)
        const sortByName = (a, b) => String(a.name).localeCompare(String(b.name), "pt-BR");
        this.catalog.exams.sort(sortByName);
        this.catalog.meds.sort(sortByName);
        this.catalog.diagnoses.sort(sortByName);
      } catch (e) {
        console.error("Falha ao carregar catalog.json", e);
        this.catalogRaw = null;
        this.catalog = { exams: [], meds: [], diagnoses: [] };
      }
    }

    async loadCases() {
      try {
        const res = await fetch("./data/cases.json", { cache: "no-store" });
        if (!res.ok) throw new Error("HTTP " + res.status);
        const data = await res.json();
        this.cases = Array.isArray(data) ? data : (data.cases || []);
      } catch (e) {
        console.error("Falha ao carregar cases.json", e);
        this.cases = [];
      }
    }

    start() {
      this.stop();
      this.state.paused = false;
      this._cooldownUntil = 0;

      // spawn initial patient
      this.spawnPatient();
// tick loop
      this._tickTimer = setInterval(() => this.tick(), this.config.tickMs);

      // UI update
      this.ui.refreshTopBar(this.state);
    }

    stop() {
      if (this._tickTimer) clearInterval(this._tickTimer);
      this._tickTimer = null;
      if (this.newPatientInterval) clearInterval(this.newPatientInterval);
      this.newPatientInterval = null;
    }

    togglePause() {
      this.state.paused = !this.state.paused;
      this.save();
    }

    setActivePatient(id) {
      this.activePatientId = id;
      this.ui.refreshPatients(this.patients, this.activePatientId);
      const p = this.patients.find((x) => x.id === id) || null;
      this.ui.renderPatientDetails(p, this);
      this.ui.refreshTopBar(this.state);
    }

    _modeCfg() {
      const m = this.state.profile.mode || "training";
      return this.config[m] || this.config.training;
    }

    tick() {
      if (this.state.paused) return;
      if (!this.patients || this.patients.length === 0) return;

      const mcfg = this._modeCfg();
      const detMult = (mcfg.deteriorationMultiplier ?? 1) * (this.config.deteriorationMultiplier ?? 1);

      for (const p of this.patients) {
        if (p.closed) continue;
        // deterioration baseline depends on severity
        const base = p.severity === "high" ? 2.2 : p.severity === "mid" ? 1.4 : 0.9;
        p.stability = clamp(p.stability - base * detMult, 0, 100);

        // vital drift
        if (p.stability < 50) p.vitals.hr = clamp(p.vitals.hr + rand(0, 2), 45, 170);
        if (p.stability < 35) p.vitals.spo2 = clamp(p.vitals.spo2 - rand(0, 2), 70, 100);
        if (p.stability < 35) p.vitals.rr = clamp(p.vitals.rr + rand(0, 2), 10, 40);

        if (p.stability <= 0 && !p.dead) {
          p.dead = true;
          p.closed = true;
          this.state.stats.total += 1;
          this.state.stats.deaths += 1;
          this.state.stats.incorrect += 1;
          this.state.score = Math.max(0, this.state.score - 15);
          this.ui.showInfo("Óbito", "O paciente evoluiu a óbito antes da conclusão do caso.");
          this.save();
          // remove patient after a short delay
          setTimeout(() => {
            this._removePatient(p.id);
            this._cooldownUntil = Date.now() + CASE_COOLDOWN_MS;
            setTimeout(() => this.spawnPatient(), CASE_COOLDOWN_MS + 50);
          }, 1800);
        }
      }

      this.ui.refreshPatients(this.patients, this.activePatientId);
      const active = this.patients.find((x) => x.id === this.activePatientId) || this.patients[0] || null;
      if (active && (!this.activePatientId || !this.patients.some(x=>x.id===this.activePatientId))) {
        this.activePatientId = active.id;
      }
      this.ui.renderPatientDetails(active, this);
      this.ui.refreshTopBar(this.state);
    }

    _removePatient(id) {
      this.patients = (this.patients || []).filter((x) => x.id !== id);
      if (this.activePatientId === id) this.activePatientId = this.patients[0]?.id || null;
      this.ui.refreshPatients(this.patients, this.activePatientId);
      const p = this.patients.find((x) => x.id === this.activePatientId) || null;
      this.ui.renderPatientDetails(p, this);
    }

    spawnPatient() {
      // Limite: 1 paciente por vez + cooldown entre casos
      if (this.patients && this.patients.length > 0) return;
      const now = Date.now();
      if (now < (this._cooldownUntil || 0)) return;
const template = this._pickCase();
      const p = this._createPatientFromCase(template);
      this.patients.push(p);
      this.activePatientId = p.id;

      this.ui.refreshPatients(this.patients, this.activePatientId);
      this.ui.renderPatientDetails(p, this);
      this.ui.showInfo("Novo caso", "Leia a história, peça exames e inicie condutas conforme necessário.");
      this.save();
    }

    _pickCase() {
      if (!this.cases || this.cases.length === 0) {
        return {
          id: "fallback",
          diagnosis: "Caso genérico",
          symptoms: ["Mal-estar", "Dor"],
          history: "Paciente refere sintomas inespecíficos.",
          requiredExams: [],
          requiredMeds: [],
          harmfulExams: [],
          harmfulMeds: [],
          examResults: {},
          severity: "mid",
        };
      }
            const eligible = this.cases.filter((c) => (this.state.level||1) >= this._caseMinLevel(c));
      return pick(eligible.length ? eligible : this.cases);
    }

    _createPatientFromCase(c) {
      const namesM = ["Lucas", "Miguel", "Arthur", "Gabriel", "Matheus", "Rafael", "Pedro", "João"];
      const namesF = ["Ana", "Julia", "Mariana", "Beatriz", "Larissa", "Camila", "Fernanda", "Carolina"];
      const sex = Math.random() < 0.5 ? "Masculino" : "Feminino";
      const name = (sex === "Masculino" ? pick(namesM) : pick(namesF)) + " " + pick(["Silva", "Souza", "Oliveira", "Santos", "Lima", "Pereira"]);
      const age = rand(12, 78);
      const complaint = (c.symptoms && c.symptoms.length) ? c.symptoms[0] : "Queixa inespecífica";

      // make vitals based on severity
      const sev = c.severity || (c.diagnosis && /embol|TEP|septic|choque/i.test(c.diagnosis) ? "high" : "mid");
      const vitals = {
        bp: sev === "high" ? `${rand(80, 95)}/${rand(50, 65)}` : `${rand(105, 130)}/${rand(65, 85)}`,
        hr: sev === "high" ? rand(110, 140) : rand(78, 108),
        rr: sev === "high" ? rand(24, 34) : rand(16, 22),
        spo2: sev === "high" ? rand(84, 92) : rand(94, 99),
        temp: sev === "high" ? (Math.random() < 0.5 ? (rand(38, 40) + 0.0).toFixed(1) : (rand(36, 37) + 0.0).toFixed(1)) : (rand(36, 38) + 0.0).toFixed(1),
        pain: sev === "high" ? rand(6, 10) : rand(3, 8),
      };

      const history = c.history || `Paciente refere: ${ (c.symptoms||[]).join(", ") || "sintomas variados" }.`;

      return {
        id: `${nowMs()}_${Math.random().toString(16).slice(2, 8)}`,
        caseId: c.id || c.diagnosis,
        diagnosis: c.diagnosis,
        name,
        sex,
        age,
        complaint,
        history,
        severity: sev,
        stability: 100,
        vitals,
        requiredExams: c.requiredExams || [],
        harmfulExams: c.harmfulExams || [],
        requiredMeds: c.requiredMeds || [],
        harmfulMeds: c.harmfulMeds || [],
        examResults: c.examResults || {},
        orderedExams: [],
        givenMeds: [],
        selectedDiagnosis: "",
        closed: false,
        dead: false,
      };
    }

    orderExam(p, examName) {
      if (!p || p.closed) return;
      if (!p.orderedExams.includes(examName)) p.orderedExams.push(examName);

      // delay result a bit for feel
      const delay = this.state.profile.mode === "training" ? rand(600, 1200) : rand(900, 1800);
      this.ui.showInfo("Exame solicitado", `${examName}\n\nAguardando resultado...`);
      setTimeout(() => {
        const res = p.examResults?.[examName];
        const text = res ? `${examName}:\n${res}` : `${examName}:\nResultado sem achados relevantes.`;
        this.ui.showInfo("Resultado de exame", text);
        this.save();
      }, delay);
      this.save();
    }

    giveMed(p, medName) {
      if (!p || p.closed) return;
      if (!p.givenMeds.includes(medName)) p.givenMeds.push(medName);
      this.ui.showInfo("Conduta aplicada", `${medName}\n\nRegistrado no prontuário (sem dose).`);
      // small stabilization if correct med
      if (p.requiredMeds.includes(medName)) {
        p.stability = clamp(p.stability + 10, 0, 100);
      } else if (p.harmfulMeds.includes(medName)) {
        p.stability = clamp(p.stability - 12, 0, 100);
      }
      this.save();
    }

    evaluateCase(p) {
      if (!p || p.closed) return;

      p.closed = true;

      const mcfg = this._modeCfg();
      const penaltyMult = mcfg.penaltyMultiplier ?? 1.0;

      let scoreDelta = 0;
      let correct = false;
      let death = false;

      if (p.dead) {
        death = true;
      } else {
        // correctness: diagnosis match + required meds mostly present
        const dxOk = p.selectedDiagnosis && p.selectedDiagnosis === p.diagnosis;
        const medsOk = (p.requiredMeds || []).every((m) => p.givenMeds.includes(m));
        correct = dxOk && medsOk;

        // scoring
        scoreDelta += dxOk ? 20 : -10;
        scoreDelta += medsOk ? 15 : -8;

        // exams: reward required, penalize harmful and excessive
        const reqEx = p.requiredExams || [];
        const harmEx = p.harmfulExams || [];
        const reqHit = reqEx.filter((x) => p.orderedExams.includes(x)).length;
        scoreDelta += reqHit * 3;

        const harmHit = harmEx.filter((x) => p.orderedExams.includes(x)).length;
        scoreDelta -= harmHit * 6;

        // small cost for too many exams
        const excess = Math.max(0, p.orderedExams.length - Math.max(2, reqEx.length));
        scoreDelta -= excess * 1.5;

        // harmful meds
        const harmMeds = (p.harmfulMeds || []).filter((x) => p.givenMeds.includes(x)).length;
        scoreDelta -= harmMeds * 8;

        // time pressure via stability
        scoreDelta += Math.round((p.stability - 50) / 5);
      }

      // apply penalty multiplier for negatives
      if (scoreDelta < 0) scoreDelta = Math.round(scoreDelta * penaltyMult);

      this.state.score = Math.max(0, Math.round(this.state.score + scoreDelta));
      this.state.stats.total += 1;
      if (death) this.state.stats.deaths += 1;

      if (correct && !death) this.state.stats.correct += 1;
      else this.state.stats.incorrect += 1;
      // XP de progressão (independente da pontuação)
      let xpGain = 0;
      if (death) xpGain = 8;
      else if (correct) xpGain = 40;
      else xpGain = 18;
      xpGain += Math.max(0, Math.round((p.stability - 50) / 10));
      this.addXP(xpGain);

      const summary = [
        `Diagnóstico real: ${p.diagnosis}`,
        `Seu diagnóstico: ${p.selectedDiagnosis || "—"}`,
        `Exames solicitados: ${p.orderedExams.length ? p.orderedExams.join(", ") : "Nenhum"}`,
        `Condutas/meds: ${p.givenMeds.length ? p.givenMeds.join(", ") : "Nenhuma"}`,
        "",
        `Resultado: ${death ? "Óbito" : (correct ? "Correto" : "Incompleto/errado")}`,
        `Pontuação: ${scoreDelta >= 0 ? "+" : ""}${scoreDelta}`,
      ].join("\n");

      this.ui.showInfo("Encerramento do caso", summary);
      this.ui.refreshTopBar(this.state);
      this.ui.refreshOffice(this.state);
      this.save();

      // close and rotate patient after cooldown
      setTimeout(() => {
        this._removePatient(p.id);
        this._cooldownUntil = Date.now() + CASE_COOLDOWN_MS;
        setTimeout(() => this.spawnPatient(), CASE_COOLDOWN_MS + 50);}, 2200);
    }

    buildHint(p) {
      if (!p) return "Sem paciente ativo.";
      const missingEx = (p.requiredExams || []).filter(x => !p.orderedExams.includes(x));
      const missingMeds = (p.requiredMeds || []).filter(x => !p.givenMeds.includes(x));
      const avoidEx = (p.harmfulExams || []).slice(0, 3);
      const avoidMeds = (p.harmfulMeds || []).slice(0, 3);

      const parts = [];

      if (missingEx.length) {
        parts.push(
          "Exames sugeridos:\n- " +
            missingEx.slice(0, 5).join("\n- ")
        );
      } else {
        parts.push("Exames: você já solicitou os principais (ou este caso não exige exames específicos).");
      }

      if (missingMeds.length) {
        parts.push(
          "Condutas/medicações sugeridas:\n- " +
            missingMeds.slice(0, 5).join("\n- ")
        );
      } else {
        parts.push("Condutas: você já aplicou as principais (ou este caso não exige conduta específica).");
      }

      parts.push("Hipótese provável: " + (p.diagnosis || "—"));

      if (avoidEx.length)
        parts.push(
          "Evite (pode piorar a pontuação):\nExames: " + avoidEx.join(", ")
        );
      if (avoidMeds.length)
        parts.push(
          "Evite (pode piorar a pontuação):\nMeds/condutas: " +
            avoidMeds.join(", ")
        );

      return parts.join("\n\n");
    }

    _rankForLevel(lv) {
      if (lv >= 25) return "Consultor";
      if (lv >= 18) return "Chefe de Plantão";
      if (lv >= 12) return "Especialista";
      if (lv >= 7) return "Residente";
      if (lv >= 3) return "Plant. Júnior";
      return "Interno";
    }
  }

  // Expose
  window.GameUI = GameUI;
  document.addEventListener("DOMContentLoaded", () => {
    // Boot log + badge
    try {
      const badge = document.querySelector(".build-badge");
      if (badge) badge.textContent = BUILD_LABEL;
    } catch (_) {}
    console.log(`[Medical Simulator] ${BUILD_LABEL}`);

    try {
      window.engine = new Engine();
    } catch (e) {
      console.error("Falha ao iniciar engine", e);
      const badge = document.querySelector(".build-badge");
      if (badge) badge.textContent = `${BUILD_LABEL} • BOOT ERROR`;
      const cover = document.getElementById("cover-screen");
      const logo = document.getElementById("logo-screen");
      if (logo) logo.classList.remove("active");
      if (cover) cover.classList.add("active");
    }
  });
})();

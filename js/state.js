// STATE MANAGEMENT (localStorage persistente)

const State = (() => {
  const KEY = "MS_STATE_V1";

  const defaultState = {
    player: {
      name: "Dra. Ana Laura",
      country: "Brasil",
      level: 1,
      xp: 650
    },
    settings: {
      quality: "auto"
    },
    game: {
      currentScreen: "menu",
      specialty: "Clínica Médica",
      score: 0
    }
  };

  function load() {
    try {
      const data = JSON.parse(localStorage.getItem(KEY));
      return data ? { ...defaultState, ...data } : defaultState;
    } catch {
      return defaultState;
    }
  }

  let state = load();

  function save() {
    localStorage.setItem(KEY, JSON.stringify(state));
    Logger.info("State saved", state);
  }

  function get() {
    return state;
  }

  function set(path, value) {
    const keys = path.split(".");
    let obj = state;

    while (keys.length > 1) {
      const k = keys.shift();
      if (!obj[k]) obj[k] = {};
      obj = obj[k];
    }

    obj[keys[0]] = value;
    save();
  }

  function update(partial) {
    state = { ...state, ...partial };
    save();
  }

  function reset() {
    state = { ...defaultState };
    save();
  }

  return {
    get,
    set,
    update,
    reset
  };
})();

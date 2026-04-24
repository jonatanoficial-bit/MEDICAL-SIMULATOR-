// LOGGER SYSTEM (local-first)

const Logger = (() => {
  const KEY = "MS_LOGS_V1";
  const MAX = 200;

  function _get() {
    try {
      return JSON.parse(localStorage.getItem(KEY)) || [];
    } catch {
      return [];
    }
  }

  function _save(logs) {
    localStorage.setItem(KEY, JSON.stringify(logs.slice(-MAX)));
  }

  function log(type, message, data = null) {
    const entry = {
      time: new Date().toISOString(),
      type,
      message,
      data
    };

    const logs = _get();
    logs.push(entry);
    _save(logs);

    // console mirror
    if (type === "error") console.error(message, data);
    else if (type === "warn") console.warn(message, data);
    else console.log(message, data);
  }

  function info(msg, data) {
    log("info", msg, data);
  }

  function warn(msg, data) {
    log("warn", msg, data);
  }

  function error(msg, data) {
    log("error", msg, data);
  }

  function getLogs() {
    return _get().reverse();
  }

  function clear() {
    localStorage.removeItem(KEY);
  }

  function exportLogs() {
    const blob = new Blob([JSON.stringify(_get(), null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "medical_simulator_logs.json";
    a.click();
    URL.revokeObjectURL(url);
  }

  return {
    info,
    warn,
    error,
    getLogs,
    clear,
    exportLogs
  };
})();

// Global error capture
window.addEventListener("error", (e) => {
  Logger.error("Global Error", {
    message: e.message,
    file: e.filename,
    line: e.lineno
  });
});

window.addEventListener("unhandledrejection", (e) => {
  Logger.error("Unhandled Promise", {
    reason: e.reason
  });
});

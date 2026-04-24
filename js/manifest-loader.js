// ASSET MANIFEST LOADER + CDN + VERSIONING

const Manifest = (() => {
  let manifest = null;

  async function load() {
    try {
      const res = await fetch("./config/assets_manifest.json?v=" + Date.now());
      manifest = await res.json();
      Logger.info("Manifest carregado", manifest);
      return manifest;
    } catch (e) {
      Logger.error("Erro ao carregar manifest", e);
      manifest = { assets: [], cdnBaseUrl: "" };
      return manifest;
    }
  }

  function get() {
    return manifest;
  }

  function getAsset(id) {
    if (!manifest) return "";

    const asset = manifest.assets.find(a => a.id === id);
    if (!asset) {
      Logger.warn("Asset não encontrado", id);
      return "";
    }

    const base = manifest.cdnBaseUrl || "";
    return `${base}${asset.path}?v=${asset.hash}`;
  }

  function applyAssets() {
    document.querySelectorAll("[data-asset]").forEach(el => {
      const id = el.getAttribute("data-asset");
      const path = getAsset(id);

      if (!path) return;

      el.style.backgroundImage = `url('${path}')`;
    });
  }

  return {
    load,
    get,
    getAsset,
    applyAssets
  };
})();

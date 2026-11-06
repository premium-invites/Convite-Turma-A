(() => {
  const cfg = window.INVITE_CONFIG || {};
  const params = new URLSearchParams(window.location.search);
  const editorMode = params.get("editor") === "1";

  const openingScreen = document.getElementById("openingScreen");
  const mainScreen = document.getElementById("mainScreen");
  const openingVideo = document.getElementById("openingVideo");
  const mainVideo = document.getElementById("mainVideo");
  const musicAudio = document.getElementById("musicAudio");
  const startButton = document.getElementById("startButton");
  const startOverlay = document.getElementById("startOverlay");
  const openingError = document.getElementById("openingError");
  const mainVideoError = document.getElementById("mainVideoError");
  const soundError = document.getElementById("soundError");
  const stagePoster = document.getElementById("stagePoster");
  const buttons = {
    location: document.querySelector('[data-key="location"]'),
    manual: document.querySelector('[data-key="manual"]')
  };

  openingVideo.src = cfg.openingVideo || "assets/opening.mp4";
  mainVideo.src = cfg.mainVideo || "assets/main.mp4";
  musicAudio.src = cfg.music || "assets/trilha.wav";
  stagePoster.src = cfg.editorPoster || "assets/editor-poster.webp";
  buttons.location.href = cfg.mapUrl || "#";
  buttons.manual.href = cfg.manualUrl || "manual.html";

  const defaults = {
    buttons: {
      location: {x: 50, y: 76, w: 72},
      manual: {x: 50, y: 86, w: 72}
    }
  };
  let layout = JSON.parse(JSON.stringify(defaults));
  let selected = "location";

  function applyLayout() {
    Object.entries(buttons).forEach(([key, el]) => {
      const p = layout.buttons[key] || defaults.buttons[key];
      el.style.left = `${p.x}%`;
      el.style.top = `${p.y}%`;
      el.style.width = `${p.w}%`;
    });
    updateEditorControls();
  }

  async function loadLayout() {
    try {
      const response = await fetch(`layout.json?v=${Date.now()}`, {cache:"no-store"});
      if (response.ok) {
        const remote = await response.json();
        if (remote && remote.buttons) layout = {...defaults, ...remote, buttons:{...defaults.buttons, ...remote.buttons}};
      }
    } catch (_) {}
    try {
      const saved = localStorage.getItem(`cepa-layout-${cfg.className || "invite"}`);
      if (saved) {
        const local = JSON.parse(saved);
        if (local && local.buttons) layout = {...layout, ...local, buttons:{...layout.buttons, ...local.buttons}};
      }
    } catch (_) {}
    applyLayout();
  }

  function showMain() {
    openingScreen.hidden = true;
    mainScreen.hidden = false;
  }

  function startMain() {
    mainScreen.hidden = false;
    mainScreen.style.opacity = "0";
    openingScreen.style.opacity = "1";
    requestAnimationFrame(() => {
      mainScreen.style.opacity = "1";
      openingScreen.style.opacity = "0";
    });
    window.setTimeout(() => {
      openingScreen.hidden = true;
      openingScreen.style.opacity = "";
      mainScreen.style.opacity = "";
    }, 700);
    // A trilha externa é a música da página principal; o vídeo de fundo fica sem áudio
    // para evitar mistura acidental com uma faixa embutida no MP4.
    mainVideo.muted = true;
    mainVideo.volume = 0;
    mainVideo.loop = true;
    const videoPlay = mainVideo.play();
    if (videoPlay && typeof videoPlay.catch === "function") {
      videoPlay.catch(() => { mainVideoError.hidden = false; });
    }
    musicAudio.volume = Number(cfg.musicVolume ?? 0.14);
    musicAudio.loop = true;
    const musicPlay = musicAudio.play();
    if (musicPlay && typeof musicPlay.catch === "function") {
      musicPlay.catch(() => { soundError.hidden = false; });
    }
  }

  openingVideo.addEventListener("error", () => {
    openingError.hidden = false;
    startOverlay.hidden = false;
  });
  mainVideo.addEventListener("error", () => {
    mainVideoError.hidden = false;
    mainVideo.pause();
  });
  mainVideo.addEventListener("canplay", () => { mainVideoError.hidden = true; });
  musicAudio.addEventListener("error", () => { soundError.hidden = false; });
  musicAudio.addEventListener("canplay", () => { soundError.hidden = true; });

  startButton.addEventListener("click", async () => {
    startButton.disabled = true;
    startButton.textContent = "Abrindo o convite…";
    // Tenta liberar a reprodução da trilha dentro do gesto do usuário,
    // mas mantém a música pausada até o fim do opening.
    try {
      musicAudio.muted = true;
      await musicAudio.play();
      musicAudio.pause();
      musicAudio.currentTime = 0;
      musicAudio.muted = false;
    } catch (_) {
      musicAudio.muted = false;
    }
    openingVideo.muted = false;
    openingVideo.volume = 1;
    try {
      await openingVideo.play();
      startOverlay.hidden = true;
    } catch (err) {
      startButton.disabled = false;
      startButton.textContent = "Tentar novamente";
      openingError.hidden = false;
    }
  });

  openingVideo.addEventListener("ended", startMain);

  // Visual editor is opened with ?editor=1. It bypasses the intro so buttons
  // can be positioned directly on the main-video stage.
  const editorPanel = document.getElementById("editorPanel");
  if (editorMode) {
    document.body.classList.add("editor-mode");
    openingScreen.hidden = true;
    mainScreen.hidden = false;
    editorPanel.hidden = false;
    mainVideo.muted = true;
    mainVideo.loop = true;
    mainVideo.play().catch(() => {});
  }

  const buttonSelect = document.getElementById("buttonSelect");
  const xRange = document.getElementById("xRange");
  const yRange = document.getElementById("yRange");
  const wRange = document.getElementById("wRange");
  const xValue = document.getElementById("xValue");
  const yValue = document.getElementById("yValue");
  const wValue = document.getElementById("wValue");
  const editorStatus = document.getElementById("editorStatus");

  function updateEditorControls() {
    if (!editorMode) return;
    const p = layout.buttons[selected];
    xRange.value = p.x; yRange.value = p.y; wRange.value = p.w;
    xValue.value = `${Number(p.x).toFixed(1)}%`;
    yValue.value = `${Number(p.y).toFixed(1)}%`;
    wValue.value = `${Number(p.w).toFixed(0)}%`;
  }
  function setSelected(key) {
    selected = key;
    buttonSelect.value = key;
    updateEditorControls();
  }
  function updateSelected() {
    const p = layout.buttons[selected];
    p.x = Number(xRange.value);
    p.y = Number(yRange.value);
    p.w = Number(wRange.value);
    applyLayout();
    editorStatus.textContent = "Pré-visualização atualizada.";
  }
  [xRange,yRange,wRange].forEach(el => el.addEventListener("input", updateSelected));
  buttonSelect.addEventListener("change", () => setSelected(buttonSelect.value));

  Object.entries(buttons).forEach(([key, el]) => {
    el.addEventListener("click", event => {
      if (editorMode) { event.preventDefault(); setSelected(key); }
    });
    el.addEventListener("pointerdown", event => {
      if (!editorMode) return;
      event.preventDefault();
      setSelected(key);
      el.setPointerCapture(event.pointerId);
      const stage = document.getElementById("stage");
      const rect = stage.getBoundingClientRect();
      const move = e => {
        const x = Math.max(5, Math.min(95, ((e.clientX - rect.left) / rect.width) * 100));
        const y = Math.max(5, Math.min(95, ((e.clientY - rect.top) / rect.height) * 100));
        layout.buttons[key].x = x;
        layout.buttons[key].y = y;
        applyLayout();
      };
      const up = () => {
        el.removeEventListener("pointermove", move);
        el.removeEventListener("pointerup", up);
        el.removeEventListener("pointercancel", up);
        editorStatus.textContent = "Posição ajustada. Salve ou exporte o layout.";
      };
      el.addEventListener("pointermove", move);
      el.addEventListener("pointerup", up);
      el.addEventListener("pointercancel", up);
    });
  });

  document.getElementById("saveLayout").addEventListener("click", () => {
    try {
      localStorage.setItem(`cepa-layout-${cfg.className || "invite"}`, JSON.stringify(layout, null, 2));
      editorStatus.textContent = "Layout salvo neste navegador.";
    } catch (_) {
      editorStatus.textContent = "Não foi possível salvar localmente. Use Baixar layout.json.";
    }
  });
  document.getElementById("exportLayout").addEventListener("click", () => {
    const blob = new Blob([JSON.stringify(layout, null, 2)], {type:"application/json"});
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = "layout.json"; a.click();
    URL.revokeObjectURL(url);
    editorStatus.textContent = "Arquivo layout.json baixado. Substitua o arquivo no GitHub.";
  });
  document.getElementById("resetLayout").addEventListener("click", () => {
    layout = JSON.parse(JSON.stringify(defaults));
    try { localStorage.removeItem(`cepa-layout-${cfg.className || "invite"}`); } catch (_) {}
    applyLayout();
    editorStatus.textContent = "Posições padrão restauradas.";
  });
  document.getElementById("closeEditor").addEventListener("click", () => {
    const url = new URL(window.location.href);
    url.searchParams.delete("editor");
    window.location.href = url.toString();
  });

  loadLayout();
})();

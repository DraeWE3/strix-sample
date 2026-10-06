import { useCallback, useEffect, useRef, useState } from "react";

// Click-to-load YouTube player. No YouTube request is made before Play.
// Ported from strix-production-services/media.js.

const YOUTUBE_ID = /^[a-zA-Z0-9_-]{11}$/;
let apiPromise = null;

function loadYouTubeApi() {
  if (window.YT?.Player) return Promise.resolve(window.YT);
  if (apiPromise) return apiPromise;
  apiPromise = new Promise((resolve, reject) => {
    const previous = window.onYouTubeIframeAPIReady;
    const timeout = setTimeout(() => reject(new Error("The video service could not be reached.")), 16000);
    window.onYouTubeIframeAPIReady = () => { clearTimeout(timeout); previous?.(); resolve(window.YT); };
    const script = document.createElement("script");
    script.src = "https://www.youtube.com/iframe_api";
    script.onerror = () => { clearTimeout(timeout); reject(new Error("The video service could not be reached.")); };
    document.head.append(script);
  }).catch((error) => { apiPromise = null; throw error; });
  return apiPromise;
}

const useInlineYouTube = ({ rootRef, mountRef, playButtonRef, videoId, isDemo = false }) => {
  const id = YOUTUBE_ID.test(videoId || "") ? videoId : "";
  const [playing, setPlaying] = useState(false);
  const playerRef = useRef(null);
  const generationRef = useRef(0);
  const playingRef = useRef(false);

  const destroyPlayer = () => {
    if (playerRef.current) {
      try { playerRef.current.destroy(); } catch { /* player already gone */ }
      playerRef.current = null;
    }
  };

  const close = useCallback((restore = true) => {
    generationRef.current += 1;
    destroyPlayer();
    const mount = mountRef.current;
    if (mount) mount.replaceChildren();
    playingRef.current = false;
    setPlaying(false);
    if (restore) playButtonRef.current?.focus({ preventScroll: true });
  }, [mountRef, playButtonRef]);

  const play = useCallback(async () => {
    const mount = mountRef.current;
    if (!id || !mount) return;
    const current = ++generationRef.current;
    playingRef.current = true;
    setPlaying(true);
    const host = document.createElement("div");
    host.id = "strix-inline-player";
    const status = document.createElement("div");
    status.className = "case-media-status";
    status.setAttribute("role", "status");
    const text = document.createElement("p");
    text.textContent = "Loading video…";
    const external = document.createElement("a");
    external.href = `https://www.youtube.com/watch?v=${id}`;
    external.target = "_blank";
    external.rel = "noopener noreferrer";
    external.textContent = "Watch on YouTube ↗";
    status.append(text, external);
    const button = document.createElement("button");
    button.type = "button";
    button.className = "case-media-close";
    button.textContent = "×";
    button.setAttribute("aria-label", "Close video");
    button.addEventListener("click", () => close());
    mount.replaceChildren(host, status, button);
    mount.hidden = false;
    button.focus({ preventScroll: true });
    if (isDemo) {
      const note = document.createElement("span");
      note.className = "case-media-note";
      note.textContent = "Demo video · replace in CMS";
      mount.append(note);
    }
    const fail = () => {
      if (generationRef.current !== current) return;
      text.textContent = "This video cannot play here. Open it on YouTube or close to return to the project.";
      status.hidden = false;
    };
    const timeout = setTimeout(fail, 22000);
    try {
      const YT = await loadYouTubeApi();
      if (generationRef.current !== current) { clearTimeout(timeout); return; }
      const vars = { autoplay: 1, playsinline: 1, rel: 0 };
      if (/^https?:$/.test(location.protocol)) vars.origin = location.origin;
      playerRef.current = new YT.Player(host, {
        host: "https://www.youtube-nocookie.com",
        width: "100%",
        height: "100%",
        videoId: id,
        playerVars: vars,
        events: {
          onReady: (event) => {
            if (generationRef.current !== current) return;
            clearTimeout(timeout);
            status.hidden = true;
            const frame = event.target.getIframe();
            frame.title = isDemo ? "Demo YouTube video" : "Project video";
            frame.setAttribute("referrerpolicy", "strict-origin-when-cross-origin");
            frame.setAttribute("allow", "autoplay; encrypted-media; picture-in-picture; fullscreen");
            event.target.playVideo();
          },
          onError: () => { clearTimeout(timeout); fail(); },
        },
      });
    } catch {
      clearTimeout(timeout);
      fail();
    }
  }, [id, isDemo, mountRef, close]);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return undefined;
    const onKeyDown = (event) => {
      if (event.key === "Escape" && playingRef.current) { event.preventDefault(); close(); }
    };
    root.addEventListener("keydown", onKeyDown);
    return () => {
      root.removeEventListener("keydown", onKeyDown);
      close(false);
    };
  }, [rootRef, close]);

  return { available: Boolean(id), playing, play, close };
};

export default useInlineYouTube;

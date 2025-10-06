// src/components/GlobalChat.jsx
import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import "../styles/stuff.css";

export default function GlobalChat() {
  const wrapRef = useRef(null);
  const { pathname } = useLocation();
  const isCommission = pathname.toLowerCase().startsWith("/commission");

  useEffect(() => {
    let cancelled = false;
    const load = (src) =>
      new Promise((res, rej) => {
        if (document.querySelector(`script[data-chattable-src="${src}"]`)) { res(); return; }
        const s = document.createElement("script");
        s.src = src;
        s.async = true;
        s.dataset.chattableSrc = src;
        s.onload = res;
        s.onerror = rej;
        document.head.appendChild(s);
      });
    (async () => {
      try {
        try { await load("https://iframe.chat/scripts/main.min.js"); }
        catch { await load("https://beta.iframe.chat/scripts/main.min.js"); }
        if (cancelled) return;
        if (!window.__CHATTABLE_INIT && window.chattable?.initialize) {
          window.chattable.initialize({ stylesheet: "/chattable.css" });
          window.__CHATTABLE_INIT = true;
        }
      } catch {}
    })();
    return () => { cancelled = true; };
  }, []);

  const [isMobile, setIsMobile] = useState(
    () => typeof window !== "undefined" && window.matchMedia("(max-width: 768px)").matches
  );
  useEffect(() => {
    if (typeof window === "undefined") return;
    const mql = window.matchMedia("(max-width: 768px)");
    const onChange = (e) => setIsMobile(e.matches);
    mql.addEventListener?.("change", onChange);
    mql.addListener?.(onChange);
    setIsMobile(mql.matches);
    return () => {
      mql.removeEventListener?.("change", onChange);
      mql.removeListener?.(onChange);
    };
  }, []);

  const MIN_W = 350, MAX_W = 960;
  const MIN_H = 260, MAX_H = 800;
  const EDGE_PAD = 0;

  const [pos,  setPos]  = useState({ x: 120, y: 120 });
  const [size, setSize] = useState({ w: 360, h: 520 });
  const [open, setOpen] = useState(false);
  const [anim, setAnim] = useState("");

  const draggingRef  = useRef(false);
  const startPosRef  = useRef({ x: 0, y: 0 });
  const startPtrRef  = useRef({ x: 0, y: 0 });
  const resizingRef  = useRef(false);
  const resizeDirRef = useRef(null);
  const startSizeRef = useRef({ w: 0, h: 0 });
  const rafIdRef     = useRef(0);
  const pendingSizeRef = useRef(null);
  const SNAP = 1;

  const viewportSize = () => {
    const de = document.documentElement;
    return { vw: de.clientWidth, vh: de.clientHeight };
  };
  const elementSize = () => {
    const el = wrapRef.current;
    if (!el) return { w: size.w, h: size.h };
    return { w: el.offsetWidth, h: el.offsetHeight };
  };
  const clampPosToViewport = (x, y, w, h) => {
    const { vw, vh } = viewportSize();
    const minX = EDGE_PAD, minY = EDGE_PAD;
    const maxX = Math.max(EDGE_PAD, vw - w - EDGE_PAD);
    const maxY = Math.max(EDGE_PAD, vh - h - EDGE_PAD);
    return { x: Math.min(Math.max(x, minX), maxX), y: Math.min(Math.max(y, minY), maxY) };
  };
  const clampSizeToLimits = (w, h, x, y) => {
    const { vw, vh } = viewportSize();
    let cw = Math.min(Math.max(w, MIN_W), MAX_W);
    let ch = Math.min(Math.max(h, MIN_H), MAX_H);
    cw = Math.min(cw, vw - x - EDGE_PAD);
    ch = Math.min(ch, vh - y - EDGE_PAD);
    return { w: cw, h: ch };
  };

  const FAB_GAP = 64;

  const liveWindowSize = () => {
    const el = wrapRef.current;
    if (el) {
      const w = el.offsetWidth  || size.w;
      const h = el.offsetHeight || size.h;
      return { w, h };
    }
    return { w: size.w, h: size.h };
  };

  const anchorToFab = (gap = FAB_GAP) => {
    const { w, h } = liveWindowSize();
    const fab = document.querySelector(".chat-fab");
    if (fab && fab.getBoundingClientRect) {
      const r = fab.getBoundingClientRect();
      const x = Math.round(r.right - w);
      const y = Math.round(r.top - gap - h);
      return clampPosToViewport(x, y, w, h);
    }
    const { vw, vh } = viewportSize();
    return clampPosToViewport(vw - w - 16, vh - h - 16 - 84 - gap, w, h);
  };

  useEffect(() => {
    try {
      const raw = localStorage.getItem("chatWin");
      if (!raw) return;
      const { pos: p, size: s } = JSON.parse(raw);
      if (p && typeof p.x === "number" && typeof p.y === "number") setPos(p);
      if (s && typeof s.w === "number" && typeof s.h === "number") setSize(s);
    } catch {}
  }, []);
  useEffect(() => {
    try { localStorage.setItem("chatWin", JSON.stringify({ pos, size })); } catch {}
  }, [pos, size]);

  useLayoutEffect(() => {
    const s = clampSizeToLimits(size.w, size.h, pos.x, pos.y);
    const p = clampPosToViewport(pos.x, pos.y, s.w, s.h);
    if (s.w !== size.w || s.h !== size.h) setSize(s);
    if (p.x !== pos.x || p.y !== pos.y) setPos(p);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  useEffect(() => {
    const onResize = () => {
      setSize((s) => clampSizeToLimits(s.w, s.h, pos.x, pos.y));
      const { w, h } = elementSize();
      setPos((p) => clampPosToViewport(p.x, p.y, w, h));
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [pos.x, pos.y]);

  useEffect(() => {
    const onPointerMove = (e) => {
      let handled = false;
      if (draggingRef.current) {
        const dx = e.clientX - startPtrRef.current.x;
        const dy = e.clientY - startPtrRef.current.y;
        const { w, h } = elementSize();
        const next = { x: startPosRef.current.x + dx, y: startPosRef.current.y + dy };
        setPos(clampPosToViewport(next.x, next.y, w, h));
        handled = true;
      }
      if (resizingRef.current) {
        const dx = e.clientX - startPtrRef.current.x;
        const dy = e.clientY - startPtrRef.current.y;
        let newW = startSizeRef.current.w;
        let newH = startSizeRef.current.h;
        if (resizeDirRef.current === "e"  || resizeDirRef.current === "se") newW += dx;
        if (resizeDirRef.current === "s"  || resizeDirRef.current === "se") newH += dy;
        let clamped = clampSizeToLimits(newW, newH, pos.x, pos.y);
        clamped = { w: Math.round(clamped.w / SNAP) * SNAP, h: Math.round(clamped.h / SNAP) * SNAP };
        pendingSizeRef.current = clamped;
        if (!rafIdRef.current) {
          rafIdRef.current = requestAnimationFrame(() => {
            rafIdRef.current = 0;
            if (pendingSizeRef.current) { setSize(pendingSizeRef.current); pendingSizeRef.current = null; }
          });
        }
        handled = true;
      }
      if (handled) e.preventDefault();
    };
    const onPointerUp = () => {
      if (draggingRef.current || resizingRef.current) {
        draggingRef.current = false;
        resizingRef.current = false;
        wrapRef.current?.classList.remove("dragging", "resizing");
        const iframe = wrapRef.current?.querySelector("iframe");
        if (iframe) iframe.style.pointerEvents = "auto";
        if (rafIdRef.current) { cancelAnimationFrame(rafIdRef.current); rafIdRef.current = 0; }
        pendingSizeRef.current = null;
      }
    };
    document.addEventListener("pointermove", onPointerMove, { passive: false });
    document.addEventListener("pointerup", onPointerUp);
    return () => {
      document.removeEventListener("pointermove", onPointerMove);
      document.removeEventListener("pointerup", onPointerUp);
    };
  }, [pos.x, pos.y]);

  const startDrag = (e) => {
    if (e.button !== undefined && e.button !== 0) return;
    if (e.target.closest(".pw-controls")) return;
    startPosRef.current = { x: pos.x, y: pos.y };
    startPtrRef.current = { x: e.clientX, y: e.clientY };
    draggingRef.current = true;
    wrapRef.current?.classList.add("dragging");
    const iframe = wrapRef.current?.querySelector("iframe");
    if (iframe) iframe.style.pointerEvents = "none";
    e.preventDefault();
  };

  const startResize = (dir) => (e) => {
    if (e.button !== undefined && e.button !== 0) return;
    resizeDirRef.current = dir;
    startSizeRef.current = { w: size.w, h: size.h };
    startPtrRef.current  = { x: e.clientX, y: e.clientY };
    resizingRef.current  = true;
    wrapRef.current?.classList.add("resizing");
    const iframe = wrapRef.current?.querySelector("iframe");
    if (iframe) iframe.style.pointerEvents = "none";
    e.stopPropagation();
    e.preventDefault();
  };

  const handleClose = (e) => {
    e.stopPropagation();
    draggingRef.current = resizingRef.current = false;
    wrapRef.current?.classList.remove("dragging", "resizing");
    wrapRef.current?.querySelector("iframe")?.style && (wrapRef.current.querySelector("iframe").style.pointerEvents = "auto");
    setAnim("closing");
  };

  const handleMinimize = (e) => {
    e.stopPropagation();
    draggingRef.current = resizingRef.current = false;
    wrapRef.current?.classList.remove("dragging", "resizing");
    wrapRef.current?.querySelector("iframe")?.style && (wrapRef.current.querySelector("iframe").style.pointerEvents = "auto");
    setAnim("minimizing");
  };

  const toggleChat = () => {
    if (isMobile) return;
    if (open) {
      draggingRef.current = false;
      resizingRef.current = false;
      wrapRef.current?.classList.remove("dragging", "resizing");
      const iframe = wrapRef.current?.querySelector("iframe");
      if (iframe) iframe.style.pointerEvents = "auto";
      setAnim("minimizing");
    } else {
      setPos(anchorToFab());
      setOpen(true);
      setAnim("");
    }
  };

  const finalizeHide = () => {
    if (!anim) return;
    setOpen(false);
    setAnim("");
  };

  useEffect(() => {
    if (isCommission && open) setOpen(false);
  }, [isCommission, open]);

  const IFRAME_SRC = "https://iframe.chat/embed?chat=97796464";

  return (
    <>
      {!isMobile && !isCommission && (
        <button
          className="chat-fab"
          aria-label={open ? "Hide chat" : "Open chat"}
          title={open ? "Hide chat" : "Open chat"}
          aria-pressed={open}
          onClick={toggleChat}
        >
          <img src="https://files.catbox.moe/hglacs.png" alt="" draggable="false" />
        </button>
      )}

      <div
        ref={wrapRef}
        className={[
          "chattable-wrapper",
          "pixel-window",
          (!open || isMobile || isCommission) ? "chat-hidden" : "",
          anim === "closing" ? "shrink-close" : "",
          anim === "minimizing" ? "shrink-min" : "",
        ].join(" ")}
        style={{
          position: "fixed",
          left: `${pos.x}px`,
          top: `${pos.y}px`,
          width: `${size.w}px`,
          height: `${size.h}px`,
          zIndex: 2147483647,
          willChange: anim ? "transform, opacity, filter" : "auto",
          pointerEvents: anim ? "none" : "auto",
        }}
        onAnimationEnd={finalizeHide}
      >
        <div className="pw-titlebar" onPointerDown={startDrag}>
          <span className="pw-title">CHAT._</span>
          <div className="pw-controls">
            <button type="button" className="pw-btn pw-min"  aria-label="Minimize"
              onPointerDown={(e) => e.stopPropagation()} onClick={handleMinimize} />
            <button type="button" className="pw-btn pw-max"  aria-label="Maximize"
              onPointerDown={(e) => e.stopPropagation()} />
            <button type="button" className="pw-btn pw-close" aria-label="Close"
              onPointerDown={(e) => e.stopPropagation()} onClick={handleClose} />
          </div>
        </div>

        <div className="pw-body">
          <iframe
            id="chattable"
            src={IFRAME_SRC}
            title="Chattable"
            allow="clipboard-write; microphone; camera; display-capture"
            loading="eager"
          />
        </div>

        <div className="pw-status">
          <div className="pw-led" />
          <span className="pw-hint">online</span>
        </div>

        <div className="pw-resize-e"  onPointerDown={startResize("e")} />
        <div className="pw-resize-s"  onPointerDown={startResize("s")} />
        <div className="pw-resize-se" onPointerDown={startResize("se")} />
      </div>
    </>
  );
}

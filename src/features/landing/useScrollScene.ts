import { useCallback, useEffect, useRef, useState } from "react";

const clamp = (value: number, max: number) => Math.max(0, Math.min(max, value));

function paintPosition(scene: HTMLElement, position: number) {
  scene.style.setProperty("--scene-position", position.toFixed(4));
  scene.querySelectorAll<HTMLElement>("[data-hero-chrome]").forEach((element) => {
    element.inert = scene.dataset.scrolling === "true" && position > 0.3;
  });
  // Linear offsets preserve a clear first and last card while scrubbing.
  scene.querySelectorAll<HTMLElement>("[data-fan-index]").forEach((card) => {
    const index = Number(card.dataset.fanIndex);
    const offset = index - position;
    card.style.setProperty("--fan-offset", offset.toFixed(4));
    card.style.zIndex = String(100 - Math.round(Math.abs(offset) * 10));
  });
}

/** Native page scrolling drives a sticky scene; wheel/touch events are never intercepted. */
export function useScrollScene<T extends HTMLElement = HTMLElement>(count: number, reducedMotion: boolean, settleToItem = false, responseMs = 55, stepOnly = false) {
  const ref = useRef<T>(null);
  const [active, setActive] = useState(0);
  const [scrolling, setScrolling] = useState(false);
  const activeRef = useRef(0);

  useEffect(() => {
    const media = window.matchMedia("(min-width: 801px) and (min-height: 600px)");
    const update = () => setScrolling(media.matches && !reducedMotion);
    update();
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, [reducedMotion]);

  useEffect(() => {
    const scene = ref.current;
    if (!scene || !scrolling) return;
    let frame = 0;
    let idleTimer: ReturnType<typeof setTimeout> | undefined;
    let start = 0;
    let distance = 1;
    let painted = Number(scene.style.getPropertyValue("--scene-position")) || 0;
    let target = stepOnly ? Math.round(painted) : painted;
    let previousTime = 0;
    const readPosition = () => clamp((window.scrollY - start) / distance, 1) * (count - 1);
    const paint = (time: number) => {
      frame = 0;
      const elapsed = previousTime ? Math.min(50, time - previousTime) : 16;
      previousTime = time;
      const difference = target - painted;
      painted = !settleToItem || Math.abs(difference) < 0.0005
        ? target
        : painted + difference * (1 - Math.exp(-elapsed / responseMs));
      paintPosition(scene, painted);
      const next = Math.round(painted);
      if (next !== activeRef.current) {
        activeRef.current = next;
        setActive(next);
      }
      if (Math.abs(target - painted) > 0.0001) frame = requestAnimationFrame(paint);
      else previousTime = 0;
    };
    const requestPaint = () => { if (!frame) frame = requestAnimationFrame(paint); };
    const schedule = () => {
      clearTimeout(idleTimer);
      const raw = readPosition();
      if (stepOnly) {
        // Hysteresis prevents oscillation around a slide boundary. Only whole
        // slides are destinations; the painter completes each soft transition.
        if (Math.abs(raw - target) > 0.6) target = Math.round(raw);
        requestPaint();
        return;
      }
      const base = Math.floor(raw);
      const fraction = raw - base;
      // Gentle dwell near whole items, without changing the document's scroll position.
      target = settleToItem ? base + fraction - Math.sin(fraction * Math.PI * 2) * 0.07 : raw;
      requestPaint();
      if (settleToItem) idleTimer = setTimeout(() => {
        target = Math.round(readPosition());
        requestPaint();
      }, 200);
    };
    const measure = () => {
      start = scene.getBoundingClientRect().top + window.scrollY;
      const sticky = scene.querySelector<HTMLElement>(".ml-scene-sticky");
      distance = Math.max(1, scene.offsetHeight - (sticky?.offsetHeight ?? window.innerHeight));
      schedule();
    };
    const observer = new ResizeObserver(measure);
    observer.observe(scene);
    observer.observe(document.body);
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", measure);
    measure();
    return () => {
      cancelAnimationFrame(frame);
      clearTimeout(idleTimer);
      observer.disconnect();
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", measure);
    };
  }, [count, scrolling, settleToItem, responseMs, stepOnly]);

  // Preserve the currently selected item when switching to a static/mobile scene.
  useEffect(() => {
    if (!scrolling && ref.current) paintPosition(ref.current, active);
  }, [active, scrolling, count]);

  const select = useCallback((index: number) => {
    const next = clamp(index, count - 1);
    const scene = ref.current;
    if (!scene) return;
    if (scrolling) {
      const sticky = scene.querySelector<HTMLElement>(".ml-scene-sticky");
      const distance = scene.offsetHeight - (sticky?.offsetHeight ?? window.innerHeight);
      window.scrollTo({
        top: scene.getBoundingClientRect().top + window.scrollY + distance * next / (count - 1),
        behavior: "smooth",
      });
    } else {
      activeRef.current = next;
      setActive(next);
    }
  }, [count, scrolling, settleToItem]);

  return { ref, active, scrolling, select };
}

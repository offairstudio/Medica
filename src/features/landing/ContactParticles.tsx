import { useEffect, useRef } from "react";

type Dot = { x: number; y: number; phase: number; driftX: number; driftY: number };

/** Sample the actual brand silhouette; animate only its dots, never redraw the logo. */
export function ContactParticles({ reducedMotion }: { reducedMotion: boolean }) {
  const root = useRef<HTMLDivElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const element = root.current;
    const surface = canvas.current;
    const context = surface?.getContext("2d");
    const section = element?.closest("section");
    if (!element || !surface || !context || !section) return;
    let dots: Dot[] = [];
    let width = 1, height = 1, frame = 0, last = 0, time = 0;
    let visible = false, disposed = false;
    const pointer = { x: -1000, y: -1000 };
    const draw = (elapsed: number) => {
      context.clearRect(0, 0, width, height);
      const breath = reducedMotion ? 0 : Math.sin(elapsed * .85);
      const scale = 1 + breath * .018;
      for (const dot of dots) {
        const x = (dot.x - .5) * width * scale + width * .5;
        const y = (dot.y - .5) * height * scale + height * .5;
        const dx = x - pointer.x, dy = y - pointer.y;
        const distance = Math.hypot(dx, dy);
        const influence = !reducedMotion ? Math.max(0, 1 - distance / 150) : 0;
        const force = influence * influence * 17;
        const targetX = distance ? dx / distance * force : 0;
        const targetY = distance ? dy / distance * force : 0;
        dot.driftX += (targetX - dot.driftX) * .13;
        dot.driftY += (targetY - dot.driftY) * .13;
        const wave = reducedMotion ? 0 : Math.sin(elapsed * .7 + dot.phase + dot.y * 4);
        const alpha = (.35 + (wave + 1) * .19) * (.86 + breath * .14) + influence * .25;
        context.fillStyle = `rgba(184,202,241,${alpha.toFixed(3)})`;
        context.beginPath();
        context.arc(x + dot.driftX + wave * 2, y + dot.driftY + wave * 4.5, Math.max(1, width / 360) + influence * .9 + breath * .15, 0, Math.PI * 2);
        context.fill();
      }
    };
    const loop = (now: number) => {
      if (now - last >= 32) {
        time += last ? Math.min(now - last, 50) / 1000 : 0;
        last = now;
        draw(time);
      }
      frame = requestAnimationFrame(loop);
    };
    const update = () => {
      cancelAnimationFrame(frame); last = 0;
      if (dots.length && visible && !document.hidden && !reducedMotion) frame = requestAnimationFrame(loop);
      else if (dots.length) draw(time);
    };
    const resize = () => {
      const rect = element.getBoundingClientRect();
      width = rect.width; height = rect.height;
      const ratio = Math.min(window.devicePixelRatio || 1, 1.5);
      surface.width = Math.round(width * ratio); surface.height = Math.round(height * ratio);
      context.setTransform(ratio, 0, 0, ratio, 0, 0);
      draw(time);
    };
    const move = (event: PointerEvent) => {
      if (reducedMotion || event.pointerType !== "mouse") return;
      const rect = element.getBoundingClientRect();
      pointer.x = event.clientX - rect.left; pointer.y = event.clientY - rect.top;
    };
    const leave = () => { pointer.x = -1000; pointer.y = -1000; };
    const image = new Image();
    image.onload = () => {
      if (disposed) return;
      const mask = document.createElement("canvas"); mask.width = 203; mask.height = 231;
      const sampler = mask.getContext("2d", { willReadFrequently: true });
      if (!sampler) return;
      sampler.drawImage(image, 0, 0, 203, 231);
      const pixels = sampler.getImageData(0, 0, 203, 231).data;
      dots = [];
      for (let y = 2; y < 231; y += 3) for (let x = 2; x < 203; x += 3) {
        if (pixels[(y * 203 + x) * 4 + 3] > 100) dots.push({ x: x / 203, y: y / 231, phase: x * .08 + y * .04, driftX: 0, driftY: 0 });
      }
      resize(); element.dataset.ready = "true"; update();
    };
    image.src = "/brand/medica-mark.svg";
    const sizes = new ResizeObserver(resize); sizes.observe(element);
    const observer = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; update(); });
    observer.observe(element);
    section.addEventListener("pointermove", move, { passive: true });
    section.addEventListener("pointerleave", leave);
    document.addEventListener("visibilitychange", update);
    return () => {
      disposed = true; image.onload = null; cancelAnimationFrame(frame);
      sizes.disconnect(); observer.disconnect();
      section.removeEventListener("pointermove", move); section.removeEventListener("pointerleave", leave);
      document.removeEventListener("visibilitychange", update);
    };
  }, [reducedMotion]);
  return <div className="ml-contact-particles" ref={root} aria-hidden="true"><div className="ml-contact-particles-fallback" /><canvas ref={canvas} /></div>;
}

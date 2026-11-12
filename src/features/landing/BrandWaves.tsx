import { useEffect, useId, useRef } from "react";

// Independent curved ridges change shape continuously, rather than sliding a repeated image.
function ridge(time: number, layer: number) {
  const points = Array.from({ length: 9 }, (_, i) => ({
    x: -240 + i * 240,
    y: 130 + layer * 62 + Math.sin(i * 1.63 + time * (0.34 + layer * 0.07)) * (64 - layer * 8)
      + Math.cos(i * 0.84 - time * 0.23 + layer * 2) * 40,
  }));
  let path = `M ${points[0].x} ${points[0].y}`;
  for (let i = 1; i < points.length; i++) {
    const previous = points[i - 1];
    const point = points[i];
    const middle = (previous.x + point.x) / 2;
    path += ` C ${middle} ${previous.y.toFixed(2)} ${middle} ${point.y.toFixed(2)} ${point.x} ${point.y.toFixed(2)}`;
  }
  return `${path} L 1680 650 L -240 650 Z`;
}

export function BrandWaves() {
  const root = useRef<HTMLDivElement>(null);
  const paths = useRef<(SVGPathElement | null)[]>([]);
  const id = useId();
  useEffect(() => {
    if (!root.current) return;
    const media = matchMedia("(prefers-reduced-motion: reduce)");
    let visible = false, frame = 0, last = 0, phase = 0;
    const draw = (time: number) => {
      if (time - last >= 32) {
        phase += last ? Math.min(time - last, 50) / 1000 : 0;
        last = time;
        paths.current.forEach((path, i) => path?.setAttribute("d", ridge(phase, i)));
      }
      frame = requestAnimationFrame(draw);
    };
    const update = () => {
      cancelAnimationFrame(frame); last = 0;
      if (visible && !document.hidden && !media.matches) frame = requestAnimationFrame(draw);
    };
    const observer = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; update(); });
    observer.observe(root.current);
    document.addEventListener("visibilitychange", update);
    media.addEventListener("change", update);
    return () => { cancelAnimationFrame(frame); observer.disconnect(); document.removeEventListener("visibilitychange", update); media.removeEventListener("change", update); };
  }, []);
  return <div className="ml-brand-waves" ref={root} aria-hidden="true"><svg viewBox="0 0 1440 600" preserveAspectRatio="none">
    <defs>{["#462e79", "#63469e", "#c3afe2"].map((color, i) => <linearGradient key={color} id={`${id}-wave-${i}`} x1="0" x2="0" y1="0" y2="1"><stop stopColor={color} stopOpacity={i === 0 ? .33 : .45}/><stop offset="1" stopColor={color} stopOpacity="0.04"/></linearGradient>)}</defs>
    {[0,1,2].map(i => <path key={i} ref={el => paths.current[i] = el} d={ridge(0, i)} fill={`url(#${id}-wave-${i})`} />)}
  </svg></div>;
}

import { useEffect, useRef, useState, type CSSProperties } from "react";

/** A selected centre plays once, holds its last frame, and restarts on a later visit. */
export function CentreBackdrop({ centreKey, index, active, reducedMotion }: {
  centreKey: string; index: number; active: boolean; reducedMotion: boolean;
}) {
  const ref = useRef<HTMLVideoElement>(null);
  const [failed, setFailed] = useState(false);
  const base = `/landing/video/centre-${centreKey}`;
  const film = centreKey === "elisha" ? `${base}-v2.mp4` : `${base}.mp4`;
  useEffect(() => {
    const video = ref.current;
    if (!video || !active || reducedMotion || failed) return;
    let visible = false;
    let finished = false;
    video.currentTime = 0;
    const update = () => {
      if (visible && !document.hidden && !finished) void video.play().catch(() => {});
      else video.pause();
    };
    const end = () => { finished = true; };
    const observer = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; update(); }, { threshold: 0.15 });
    observer.observe(video);
    video.addEventListener("ended", end);
    document.addEventListener("visibilitychange", update);
    return () => {
      video.pause(); observer.disconnect();
      video.removeEventListener("ended", end);
      document.removeEventListener("visibilitychange", update);
    };
  }, [active, reducedMotion, failed]);
  return <div className="ml-centre-backdrop" style={{ "--card-index": index } as CSSProperties}>
    <img src={`${base}.jpg`} alt="" loading="lazy" />
    {!reducedMotion && !failed && <video ref={ref} src={active ? film : undefined}
      poster={`${base}.jpg`} muted playsInline preload="metadata" onError={() => setFailed(true)} />}
  </div>;
}

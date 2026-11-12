import { useRef, type CSSProperties } from "react";
import { specialties } from "./content";

type Props = { active: number; scrolling: boolean; onSelect: (index: number) => void; onEnquire: (name: string) => void };

/** Expanding centre card with two compact previews on either side. */
export function SpecialtyCarousel({ active, scrolling, onSelect, onEnquire }: Props) {
  const touchStart = useRef<{ x: number; y: number } | null>(null);
  return <div className="ml-specialty-carousel" data-reveal>
    <div className="ml-specialty-deck" role="region" aria-label="בחירת תחום רפואי" aria-roledescription="קרוסלה" tabIndex={0}
      onKeyDown={event => {
        if (event.target !== event.currentTarget || !["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)) return;
        event.preventDefault();
        onSelect(event.key === "Home" ? 0 : event.key === "End" ? specialties.length - 1 : active + (event.key === "ArrowLeft" ? 1 : -1));
      }}
      onTouchStart={event => { const t = event.touches[0]; touchStart.current = { x: t.clientX, y: t.clientY }; }}
      onTouchEnd={event => {
        const start = touchStart.current; touchStart.current = null; if (!start) return;
        const t = event.changedTouches[0], dx = t.clientX - start.x, dy = t.clientY - start.y;
        if (Math.abs(dx) > 40 && Math.abs(dx) > Math.abs(dy)) onSelect(active + (dx > 0 ? 1 : -1));
      }}>
      {specialties.map((specialty, index) => <article key={specialty.name} className="ml-specialty-slide" data-fan-index={index}
        data-selected={index === active} style={{ "--fan-offset": index } as CSSProperties} aria-label={specialty.name}>
        <img className="ml-specialty-slide-image" src={`/landing/${specialty.image}`} alt={index === active ? specialty.alt : ""} loading="lazy" />
        <div className="ml-specialty-slide-copy" aria-hidden={index !== active}>
          <h3>{specialty.name}</h3>
          <button className="ml-button" disabled={index !== active} tabIndex={index === active ? 0 : -1} onClick={() => onEnquire(specialty.name)}>לתיאום תור</button>
        </div>
        {index !== active && <button className="ml-specialty-preview" aria-label={`הצגת ${specialty.name}`} tabIndex={Math.abs(index - active) <= 2 ? 0 : -1}
          aria-hidden={Math.abs(index - active) > 2} onClick={() => onSelect(index)} />}
      </article>)}
    </div>
    <div className="ml-specialty-navigation">
      <div className="ml-specialty-pagination" aria-label="בחירת תחום">
        {specialties.map((specialty, index) => <button key={specialty.name} aria-label={`מעבר לתחום ${specialty.name}`} aria-current={index === active ? "true" : undefined} onClick={() => onSelect(index)}><span /></button>)}
      </div>
    </div>
    <span className="sr-only" aria-live={scrolling ? "off" : "polite"}>{specialties[active].name}</span>
  </div>;
}

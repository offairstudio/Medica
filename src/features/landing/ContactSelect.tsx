import { useEffect, useLayoutEffect, useRef, useState, type CSSProperties } from "react";
import { createPortal } from "react-dom";
import { Check, ChevronDown } from "lucide-react";

export function ContactSelect({ value, onChange, options }: {
  value: string; onChange: (value: string) => void; options: string[];
}) {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);
  const [position, setPosition] = useState<CSSProperties>({});
  const trigger = useRef<HTMLButtonElement>(null);
  const menu = useRef<HTMLDivElement>(null);
  const search = useRef({ text: "", time: 0 });
  const items = [{ value: "", label: "ללא העדפה" }, ...options.map(label => ({ value: label, label }))];
  const selected = Math.max(0, items.findIndex(item => item.value === value));
  const choose = (index: number) => { onChange(items[index].value); setOpen(false); trigger.current?.focus({ preventScroll: true }); };
  const show = () => { setActive(selected); setOpen(true); };
  useLayoutEffect(() => {
    if (!open) return;
    const place = () => {
      const rect = trigger.current?.getBoundingClientRect();
      if (!rect) return;
      const gap = 8, margin = 12;
      const below = window.innerHeight - rect.bottom - gap - margin;
      const above = rect.top - gap - margin;
      const up = below < 240 && above > below;
      const height = Math.max(80, Math.min(items.length * 42 + 12, 320, up ? above : below));
      const width = Math.min(rect.width, window.innerWidth - margin * 2);
      setPosition({ width, maxHeight: height, left: Math.max(margin, Math.min(rect.left, window.innerWidth - width - margin)), top: up ? rect.top - gap - height : rect.bottom + gap });
    };
    place();
    window.addEventListener("resize", place);
    window.addEventListener("scroll", place, true);
    return () => { window.removeEventListener("resize", place); window.removeEventListener("scroll", place, true); };
  }, [open, items.length]);
  useEffect(() => {
    if (!open) return;
    const outside = (event: PointerEvent) => {
      const target = event.target as Node;
      if (!trigger.current?.contains(target) && !menu.current?.contains(target)) setOpen(false);
    };
    document.addEventListener("pointerdown", outside);
    return () => document.removeEventListener("pointerdown", outside);
  }, [open]);
  useEffect(() => {
    if (open) document.getElementById(`contact-option-${active}`)?.scrollIntoView({ block: "nearest" });
  }, [active, open, position.top]);
  return <div className="ml-field ml-custom-select">
    <label id="contact-interest-label" htmlFor="contact-interest">תחום רפואי</label>
    <input type="hidden" name="specialty" value={value} />
    <button id="contact-interest" ref={trigger} type="button" className="ml-select-trigger" role="combobox"
      aria-labelledby="contact-interest-label" aria-haspopup="listbox" aria-expanded={open}
      aria-controls={open ? "contact-interest-options" : undefined} aria-activedescendant={open ? `contact-option-${active}` : undefined}
      onClick={() => open ? setOpen(false) : show()}
      onKeyDown={event => {
        const key = event.key;
        if (key === "Escape" && open) { event.preventDefault(); event.stopPropagation(); setOpen(false); }
        else if (key === "Tab") setOpen(false);
        else if (key === "Enter" || key === " ") { event.preventDefault(); if (open) choose(active); else show(); }
        else if (key === "ArrowDown" || key === "ArrowUp") {
          event.preventDefault();
          if (!open) { setActive(selected); setOpen(true); }
          else setActive(index => Math.max(0, Math.min(items.length - 1, index + (key === "ArrowDown" ? 1 : -1))));
        } else if (key === "Home" || key === "End") { event.preventDefault(); setActive(key === "Home" ? 0 : items.length - 1); setOpen(true); }
        else if (key.length === 1 && !event.ctrlKey && !event.metaKey && !event.altKey) {
          const now = performance.now();
          search.current = { text: (now - search.current.time < 700 ? search.current.text : "") + key, time: now };
          const index = items.findIndex(item => item.label.startsWith(search.current.text));
          if (index >= 0) { event.preventDefault(); setActive(index); setOpen(true); }
        }
      }}><span>{items[selected].label}</span><ChevronDown size={18} aria-hidden="true" /></button>
    {open && createPortal(<div ref={menu} id="contact-interest-options" className="ml-select-menu" style={position} role="listbox" aria-labelledby="contact-interest-label" dir="rtl">
      {items.map((item, index) => <div key={item.value} id={`contact-option-${index}`} role="option" aria-selected={selected === index}
        data-active={active === index} className="ml-select-option" onPointerMove={() => setActive(index)}
        onMouseDown={event => event.preventDefault()} onClick={() => choose(index)}>
        <span>{item.label}</span><Check size={17} aria-hidden="true" />
      </div>)}
    </div>, document.body)}
  </div>;
}

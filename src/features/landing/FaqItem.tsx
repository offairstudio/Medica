import { useId, useLayoutEffect, useRef, useState, type ReactNode } from "react";
import { Plus } from "lucide-react";

export function FaqItem({ question, children }: { question: string; children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const id = useId();
  const panel = useRef<HTMLDivElement>(null);
  useLayoutEffect(() => { if (panel.current) panel.current.inert = !open; }, [open]);
  return <article className="ml-faq-item" data-open={open}>
    <h3><button id={`${id}-question`} className="ml-faq-question" type="button" aria-expanded={open}
      aria-controls={`${id}-answer`} onClick={() => setOpen(value => !value)}>{question}<Plus size={20} aria-hidden="true" /></button></h3>
    <div ref={panel} id={`${id}-answer`} className="ml-faq-answer" role="region" aria-labelledby={`${id}-question`} aria-hidden={!open}>
      <div className="ml-faq-answer-clip"><div className="ml-faq-answer-content">{children}</div></div>
    </div>
  </article>;
}

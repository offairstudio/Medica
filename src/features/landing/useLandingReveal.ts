import { useLayoutEffect } from "react";

/** A staged opening, followed by one-time reveals driven by native scrolling. */
export function useLandingReveal(reducedMotion: boolean) {
  useLayoutEffect(() => {
    const hero = document.querySelector<HTMLElement>(".ml-hero-scene");
    const header = document.querySelector<HTMLElement>(".ml-header");
    const elements = document.querySelectorAll<HTMLElement>(".medica-landing [data-reveal]");
    const pending = new Set<HTMLElement>();
    const targets = new Map<Element, HTMLElement[]>();
    let scanFrame = 0, disposed = false;
    let introTimer: ReturnType<typeof setTimeout> | undefined;
    const finishIntro = () => {
      if (hero) hero.dataset.intro = "complete";
      if (header) header.dataset.intro = "complete";
    };
    const show = (element: HTMLElement) => {
      element.dataset.revealState = "visible";
      pending.delete(element);
    };
    // Bounding boxes do not depend on the animated clip-path. This also covers
    // restored scroll positions, fast jumps and missed sticky observer callbacks.
    const scheduleScan = () => {
      if (disposed || reducedMotion || scanFrame || !pending.size) return;
      scanFrame = requestAnimationFrame(() => {
        scanFrame = 0;
        pending.forEach(element => {
          const rect = element.getBoundingClientRect();
          if (rect.bottom > 0 && rect.top < window.innerHeight * .94) show(element);
        });
      });
    };
    const updateScrollCue = () => { if (hero) hero.dataset.scrollCue = window.scrollY > 12 ? "hidden" : "visible"; };
    const onScroll = () => { updateScrollCue(); if (window.scrollY > 160) finishIntro(); scheduleScan(); };
    updateScrollCue();
    const onVisible = () => { if (!document.hidden) scheduleScan(); };
    if (hero) {
      hero.dataset.intro = reducedMotion || window.scrollY > 160 ? "complete" : "playing";
      if (header) header.dataset.intro = hero.dataset.intro;
      introTimer = setTimeout(finishIntro, 2600);
    }
    elements.forEach(element => {
      if (reducedMotion || element.getBoundingClientRect().bottom <= 0) show(element);
      else {
        element.dataset.revealState = "pending";
        pending.add(element);
        // Never observe the same heading whose clip-path starts with zero area.
        const target = element.matches("h2") ? element.parentElement ?? element : element;
        targets.set(target, [...(targets.get(target) ?? []), element]);
      }
    });
    void document.body.offsetHeight;
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        targets.get(entry.target)?.forEach(show);
        observer.unobserve(entry.target);
      });
    }, { threshold: .12, rootMargin: "0px 0px -6% 0px" });
    targets.forEach((_, target) => observer.observe(target));
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", scheduleScan);
    window.addEventListener("pageshow", scheduleScan);
    document.addEventListener("visibilitychange", onVisible);
    void document.fonts.ready.then(scheduleScan);
    scheduleScan();
    return () => {
      disposed = true;
      clearTimeout(introTimer);
      cancelAnimationFrame(scanFrame);
      observer.disconnect();
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", scheduleScan);
      window.removeEventListener("pageshow", scheduleScan);
      document.removeEventListener("visibilitychange", onVisible);
      elements.forEach(element => delete element.dataset.revealState);
      if (hero) { delete hero.dataset.intro; delete hero.dataset.scrollCue; }
      if (header) delete header.dataset.intro;
    };
  }, [reducedMotion]);
}

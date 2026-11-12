import { useEffect, useRef, useState, type CSSProperties, type FormEvent } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, ArrowUp, Phone, Facebook, Instagram, Youtube, Check, UserRound, Stethoscope } from "lucide-react";
import { SpecialtyCarousel } from "../features/landing/SpecialtyCarousel";
import { FaqItem } from "../features/landing/FaqItem";
import { DigitalExperience } from "../features/landing/DigitalExperience";
import { ContactSelect } from "../features/landing/ContactSelect";
import { ContactParticles } from "../features/landing/ContactParticles";
import { BrandWaves } from "../features/landing/BrandWaves";
import { useLandingReveal } from "../features/landing/useLandingReveal";
import { CentreBackdrop } from "../features/landing/CentreBackdrop";
import { centres, specialties } from "../features/landing/content";
import { useScrollScene } from "../features/landing/useScrollScene";
import "../styles/landing.css";
import "../styles/landing-motion.css";
import "../styles/landing-lower.css";

function useReducedMotion() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduced(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);
  return reduced;
}

export function Landing() {
  const [interest, setInterest] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const heroVideoRef = useRef<HTMLVideoElement>(null);
  const [videoPaused, setVideoPaused] = useState(false);
  const [videoFailed, setVideoFailed] = useState(false);
  const reducedMotion = useReducedMotion();
  useLandingReveal(reducedMotion);
  const heroScene = useScrollScene<HTMLDivElement>(2, reducedMotion);
  const specialtyScene = useScrollScene(specialties.length, reducedMotion, true, 110, true);
  const centreScene = useScrollScene(centres.length, reducedMotion, true, 110, true);
  const orderedCentres = [centres[1], centres[0], centres[2], centres[3], centres[4]];
  const centre = orderedCentres[centreScene.active];

  useEffect(() => {
    const scene = heroScene.ref.current;
    if (!scene || !heroScene.scrolling) return;
    const hero = scene.querySelector<HTMLElement>(".ml-hero");
    const slot = scene.querySelector<HTMLElement>(".ml-hero-media-slot");
    if (!hero || !slot) return;
    const measure = () => {
      const outer = hero.getBoundingClientRect();
      const media = slot.getBoundingClientRect();
      const inset = 0;
      scene.style.setProperty("--hero-media-x", `${inset - (media.left - outer.left)}px`);
      scene.style.setProperty("--hero-media-y", `${inset - (media.top - outer.top)}px`);
      scene.style.setProperty("--hero-media-grow-x", `${outer.width - inset * 2 - media.width}px`);
      scene.style.setProperty("--hero-media-grow-y", `${outer.height - inset * 2 - media.height}px`);
    };
    const observer = new ResizeObserver(measure);
    observer.observe(hero);
    observer.observe(slot);
    measure();
    return () => observer.disconnect();
  }, [heroScene.ref, heroScene.scrolling]);

  useEffect(() => {
    const video = heroVideoRef.current;
    if (!video || reducedMotion || videoFailed) return;
    let visible = false;
    let disposed = false;
    const update = () => {
      if (visible && !document.hidden && !videoPaused) {
        void video.play().catch(() => { if (!disposed) setVideoPaused(true); });
      } else video.pause();
    };
    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      update();
    }, { threshold: 0.1 });
    observer.observe(video);
    document.addEventListener("visibilitychange", update);
    return () => {
      disposed = true;
      observer.disconnect();
      document.removeEventListener("visibilitychange", update);
      video.pause();
    };
  }, [reducedMotion, videoPaused, videoFailed]);


  function enquire(value = "") {
    setInterest(value);
    setSubmitted(false);
    document
      .getElementById("contact")
      ?.scrollIntoView({ behavior: reducedMotion ? "auto" : "smooth" });
    document.getElementById("contact-name")?.focus({ preventScroll: true });
  }
  function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitted(true);
  }

  return (
    <div className="medica-landing" dir="rtl" lang="he">
      <a className="ml-skip" href="#main">
        דילוג לתוכן
      </a>
      <header className="ml-header">
        <Link to="/" aria-label="מדיקה — עמוד הבית">
          <img
            className="ml-logo"
            src="/brand/medica-excellence.svg"
            alt="מדיקה — מצוינות בבריאות"
          />
        </Link>
        <div className="ml-header-actions">
          <Link className="ml-portal-trigger ml-patient-entry" to="/p/login"><UserRound size={19} strokeWidth={1.7} aria-hidden="true" />כניסה למטופל</Link>
          <Link className="ml-portal-trigger ml-doctor-entry" to="/login"><Stethoscope size={19} strokeWidth={1.7} aria-hidden="true" />כניסת רופאים</Link>
          <button
            className="ml-button ml-header-contact"
            onClick={() => enquire()}
          >
            לתיאום תור
          </button>
        </div>
      </header>
      <main id="main">
        <div className="ml-hero-scene" ref={heroScene.ref} data-scrolling={heroScene.scrolling}>
        <section className="ml-hero ml-scene-sticky" aria-labelledby="hero-title">
          <div className="ml-hero-heading" data-hero-chrome>
            <p>ברוכים הבאים</p>
            <h1 id="hero-title"><span className="ml-title-clip"><span className="ml-title-line">לרשת <em>מדיקה</em></span></span></h1>
          </div>
          <div className="ml-hero-composition">
            <div className="ml-hero-media-slot">
            <div className="ml-hero-photo">
              {reducedMotion || videoFailed ? (
                <img src="/landing/video/medica-atmosphere-v3-poster.jpg" alt="צוות מדיקה מקבל מטופלים ומלווה אותם במרכז הרפואי" loading="eager" />
              ) : (
                <>
                  <video
                    ref={heroVideoRef}
                    autoPlay={!videoPaused}
                    muted
                    loop
                    playsInline
                    preload="metadata"
                    poster="/landing/video/medica-atmosphere-v3-poster.jpg"
                    aria-label="סרטון אווירה שקט של מרכזי מדיקה"
                    onError={() => setVideoFailed(true)}
                  >
                    <source src="/landing/video/medica-atmosphere-v3.mp4" type="video/mp4" />
                  </video>
                  <button
                    className="ml-video-toggle"
                    onClick={() => setVideoPaused((paused) => !paused)}
                    aria-label={videoPaused ? "הפעלת סרטון האווירה" : "עצירת סרטון האווירה"}
                  >
                    <span className={videoPaused ? "ml-video-play" : "ml-video-pause"} aria-hidden="true" />
                  </button>
                </>
              )}
            </div>
            </div>
            <div className="ml-hero-copy" data-hero-chrome>
              <p>בתי חולים ומרכזים רפואיים בפריסה ארצית, המעניקים מגוון שירותים רפואיים מתקדמים, בהובלת רופאים מומחים ובזמינות גבוהה.</p>
              <div className="ml-hero-actions">
              <button className="ml-button" onClick={() => enquire()}>לתיאום תור</button>
                <button
                  type="button"
                  className="ml-hero-scroll-cue"
                  aria-label="גלילה להמשך"
                  onClick={() => {
                    if (heroScene.scrolling && heroScene.ref.current) {
                      const scene = heroScene.ref.current;
                      const start = scene.getBoundingClientRect().top + window.scrollY;
                      window.scrollTo({ top: start + Math.min(window.innerHeight * .8, scene.offsetHeight - window.innerHeight), behavior: "smooth" });
                    } else {
                      document.getElementById("specialties")?.scrollIntoView({ behavior: reducedMotion ? "auto" : "smooth" });
                    }
                  }}
                >
                  <svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M12 5v14m-6-6 6 6 6-6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
                </button>
              </div>
            </div>
          </div>
          <div className="ml-hero-brands" data-hero-chrome aria-label="מרכזי רשת מדיקה">
            {centres.map((c) => (
              <a
                key={c.key}
                href="#centres"
                onClick={(event) => {
                  event.preventDefault();
                  centreScene.select(orderedCentres.findIndex((item) => item.key === c.key));
                  if (!centreScene.scrolling) document.getElementById("centres")?.scrollIntoView({ behavior: reducedMotion ? "auto" : "smooth" });
                }}
              >
                <img src={c.key === "diagnostics" ? "/brand/medica-diagnostics.svg" : `/landing/figma/logo-${c.key}.png`} alt={c.name} />
              </a>
            ))}
          </div>

        </section>

        </div>

        <section
          className="ml-specialties-scene"
          id="specialties"
          aria-labelledby="specialties-title"
          ref={specialtyScene.ref}
          data-scrolling={specialtyScene.scrolling}
          style={{ "--scene-count": specialties.length } as CSSProperties}
        >
          <div className="ml-scene-sticky ml-specialties-sticky">
            <h2 id="specialties-title" data-reveal>מגוון רחב של תחומי רפואה</h2>
            <SpecialtyCarousel active={specialtyScene.active} scrolling={specialtyScene.scrolling}
              onSelect={specialtyScene.select} onEnquire={enquire} />
          </div>
        </section>

        <section
          className="ml-centres-scene"
          id="centres"
          aria-labelledby="centres-title"
          ref={centreScene.ref}
          data-scrolling={centreScene.scrolling}
          style={{ "--scene-count": centres.length } as CSSProperties}
        >
          <div className="ml-scene-sticky ml-centres-sticky">
            <h2 id="centres-title" className="sr-only">המרכזים שלנו</h2>
            <div className="ml-centres-backdrops" aria-hidden="true">
              {orderedCentres.map((c, i) => <CentreBackdrop key={c.key} centreKey={c.key}
                index={i} active={centreScene.active === i} reducedMotion={reducedMotion} />)}
            </div>
            <div className="ml-centres-composition" data-reveal>
              <div className="ml-centre-list-window">
                <div className="ml-centre-logo-track">
                  {orderedCentres.map((c, i) => <button
                    key={c.key} onClick={() => centreScene.select(i)}
                    aria-label={`הצגת ${c.name}`} aria-pressed={centreScene.active === i}
                    style={{ "--card-index": i } as CSSProperties}
                  ><img className={c.key === "diagnostics" ? "ml-diagnostics-white" : undefined} src={c.key === "diagnostics" ? "/brand/medica-diagnostics.svg" : `/landing/figma/white-${c.key}.png`} alt={c.name} /></button>)}
                </div>
              </div>
              <div className="ml-centre-story">
                <div className="ml-scene-copy" key={centre.key} aria-live={centreScene.scrolling ? "off" : "polite"}>
                  <h3>{centre.key === "diagnostics" ? centre.name : `${centre.type === "בית חולים" ? "בית החולים" : "המרכז הרפואי"} ${centre.name}`}</h3>
                  <p>{centre.about}</p>
                </div>
                {centre.url && <a className="ml-button ml-centre-site" href={centre.url} target="_blank" rel="noreferrer">לאתר {centre.type === "בית חולים" ? "בית החולים" : "המרכז הרפואי"} <ArrowLeft size={18} aria-hidden="true" /></a>}

              </div>
            </div>
          </div>
        </section>

        <DigitalExperience />

        <section className="ml-faq" id="faq" aria-labelledby="faq-title">
          <div className="ml-faq-intro" data-reveal><h2 id="faq-title">שאלות ותשובות</h2><p>ריכזנו כמה דברים שיעזרו לכם<br />להגיע לשלב הבא.</p></div>
          <div className="ml-faq-list" data-reveal>
            <FaqItem question="איך מתאמים תור במדיקה?"><p>לתיאום תור ובירור על השירות המתאים לכם, אפשר לפנות למוקד מדיקה בטלפון <a href="tel:*2323" dir="ltr">*2323</a>. תיאום ניתוח נעשה מול הרופא המטפל או המנתח ובהתאם להנחיות המרכז.</p></FaqItem>
            <FaqItem question="איפה נמצאים המרכזים של מדיקה?"><p>מדיקה אלישע בחיפה, מדיקה רפאל בפארק עתידים בתל אביב, מדיקה תל אביב ברמת החייל ומדיקה RMC בעפולה. <a href="#centres">להיכרות עם המרכזים ופרטי ההגעה</a>.</p></FaqItem>
            <FaqItem question="מה אפשר למצוא באזור האישי?"><p>תורים, מסמכים רפואיים ותוצאות בדיקות שהועלו למערכת. המידע המוצג תלוי בשירות ובמרכז שבו טופלתם. <Link to="/p/login">לכניסה לאזור האישי</Link>.</p></FaqItem>
            <FaqItem question="איך מבררים על כיסוי ביטוחי והשתתפות עצמית?"><p>לבירור הזכאות וההשתתפות העצמית פונים לקופת החולים או לחברת הביטוח. לפרטים על השירות המבוקש וההסדרים במרכז שבו יינתן הטיפול, אפשר לפנות גם למוקד מדיקה.</p></FaqItem>
            <FaqItem question="לא בטוחים לאיזה מרכז לפנות?"><p>אפשר להתחיל <a href="#specialties">בבחירת תחום רפואי</a> או להתקשר למוקד <a href="tel:*2323" dir="ltr">*2323</a> ולברר אילו שירותים ניתנים בכל מרכז.</p></FaqItem>
          </div>
        </section>

        <section
          className="ml-contact"
          id="contact"
          aria-labelledby="contact-title"
        >
          <ContactParticles reducedMotion={reducedMotion} />
          <div className="ml-contact-inner">
            <div className="ml-contact-copy" data-reveal>
              <h2 id="contact-title">
                לתיאום תור
                <br />
                או בירור נוסף
              </h2>
              <a className="ml-contact-phone" href="tel:*2323">
                <span className="ml-phone-icon"><Phone size={22} aria-hidden="true" /></span>
                <span dir="ltr">*2323</span>
                <span>מוקד מדיקה</span>
              </a>
            </div>
            <form onSubmit={submit} className="ml-contact-form" data-reveal>
              <div className="ml-form-heading"><p>השאירו פרטים ונחזור אליכם</p></div>
              <label className="ml-field" htmlFor="contact-name">
                <span>שם מלא</span>
                <input
                  id="contact-name"
                  name="name"
                  autoComplete="name"
                  required
                  maxLength={100}
                  onChange={() => setSubmitted(false)}
                />
              </label>
              <label className="ml-field" htmlFor="contact-phone">
                <span>טלפון</span>
                <input
                  id="contact-phone"
                  type="tel"
                  name="phone"
                  autoComplete="tel"
                  inputMode="tel"
                  required
                  pattern={String.raw`[0-9+\s\-]{9,20}`}
                  maxLength={20}
                  onChange={() => setSubmitted(false)}
                />
              </label>
              <ContactSelect value={interest} options={specialties.map(item => item.name)} onChange={value => { setInterest(value); setSubmitted(false); }} />
              <label className="ml-consent">
                <span className="ml-consent-control"><input type="checkbox" required /><Check size={13} aria-hidden="true" /></span>
                אני מאשר/ת שיחזרו אליי בנוגע לפנייה.
              </label>
              <button className="ml-button" type="submit">
                שליחת פנייה <ArrowLeft size={18} aria-hidden="true" />
              </button>
              {submitted && (
                <p className="ml-form-status" role="status">
                  ההדגמה הושלמה. לפנייה למוקד חייגו{" "}
                  <a href="tel:*2323" dir="ltr">
                    *2323
                  </a>
                  .
                </p>
              )}
            </form>
          </div>
        </section>
      </main>
      <footer className="ml-footer">
        <BrandWaves />
        <div className="ml-footer-invitation" data-reveal><span className="ml-eyebrow">מצוינות בבריאות.</span><h2>מקום טוב להתחיל<br />להרגיש טוב יותר.</h2><button className="ml-button" onClick={() => enquire()}>לתיאום תור <ArrowLeft size={18} aria-hidden="true" /></button></div>
        <div className="ml-footer-top" data-reveal>
          <div className="ml-footer-brand"><a href="#main" aria-label="מדיקה — חזרה לתחילת העמוד"><img src="/brand/medica-logo-no-tagline.svg" alt="מדיקה — מצוינות בבריאות" /></a><p>רשת מרכזים רפואיים.<br />אנשים, מומחיות ורפואה מתקדמת.</p>
            <div className="ml-footer-portals"><Link to="/p/login">כניסת מטופלים <ArrowLeft size={15} aria-hidden="true" /></Link><Link to="/login">כניסת רופאים <ArrowLeft size={15} aria-hidden="true" /></Link></div>
            <div className="ml-social-links" aria-label="מדיקה ברשתות החברתיות">
              <a href="https://www.facebook.com/medicacarecenters/" aria-label="מדיקה בפייסבוק" target="_blank" rel="noreferrer"><Facebook size={19} /></a>
              <a href="https://www.instagram.com/medica.medical.centers/" aria-label="מדיקה באינסטגרם" target="_blank" rel="noreferrer"><Instagram size={19} /></a>
              <a href="https://www.youtube.com/@Medica-il" aria-label="מדיקה ביוטיוב" target="_blank" rel="noreferrer"><Youtube size={21} /></a>
            </div>
          </div>
          <nav aria-label="קישורים בתחתית הדף">
            <div><h3>סניפי הרשת</h3>{orderedCentres.map(c => <a key={c.key} href={c.url || "#centres"} target={c.url ? "_blank" : undefined} rel={c.url ? "noreferrer" : undefined} onClick={c.url ? undefined : (event) => { event.preventDefault(); centreScene.select(orderedCentres.findIndex(item => item.key === c.key)); if (!centreScene.scrolling) document.getElementById("centres")?.scrollIntoView({ behavior: reducedMotion ? "auto" : "smooth" }); }}>{c.name}<span>{c.city}</span></a>)}</div>
            <div><h3>לשירותכם</h3><a href="#specialties">תחומי רפואה</a><Link to="/p/login">אזור מטופלים</Link><Link to="/login">אזור רופאים</Link><a href="#faq">שאלות ותשובות</a><a href="#contact">יצירת קשר</a></div>
            <div><h3>מידע נוסף</h3><a href="https://www.medica.co.il/הצהרת-נגישות/" target="_blank" rel="noreferrer">הצהרת נגישות</a><a href="https://www.medica.co.il/מדיניות-פרטיות/" target="_blank" rel="noreferrer">מדיניות פרטיות</a><a href="https://www.medica.co.il/תקנון-האתר/" target="_blank" rel="noreferrer">תקנון האתר</a></div>
          </nav>
        </div>
        <div className="ml-footer-bottom"><span>© {new Date().getFullYear()} מדיקה. כל הזכויות שמורות.</span><a href="tel:*2323" className="ml-footer-phone"><span dir="ltr">*2323</span> מוקד מדיקה</a><a className="ml-back-top" href="#main" aria-label="חזרה למעלה" onClick={e => { e.preventDefault(); window.scrollTo({ top: 0, behavior: reducedMotion ? "auto" : "smooth" }); }}><ArrowUp size={20} aria-hidden="true" /></a></div>
      </footer>
    </div>
  );
}

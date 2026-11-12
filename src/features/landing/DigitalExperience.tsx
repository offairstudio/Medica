import { Link } from "react-router-dom";

/** A single editorial product composition, rather than a second interactive app. */
export function DigitalExperience() {
  return <section className="ml-digital" id="digital" aria-labelledby="digital-title">
    <div className="ml-digital-copy" data-reveal>
      <h2 id="digital-title">הבריאות שלכם.<br /><span>במקום אחד.</span></h2>
      <p>התורים, המסמכים ותוצאות הבדיקות שלכם.<br />פשוט להגיע למה שחשוב, גם מהבית.</p>
      <Link className="ml-button ml-digital-entry" to="/p/login">כניסה לאזור האישי</Link>
    </div>
    <figure className="ml-portal-presentation" data-reveal aria-label="האזור האישי של מדיקה — תורים, מסמכים רפואיים ותוצאות בדיקות">
      <div className="ml-portal-screen">
        <img src="/landing/product/portal-presentation-v2.png" alt="מסך התורים בממשק האישי של מדיקה" width="1171" height="806" loading="lazy" />
      </div>
      <span className="ml-portal-art ml-portal-art-documents" aria-hidden="true">
        <img src="/landing/product/art/documents-flat-v2.webp" alt="" width="1254" height="1254" loading="lazy" />
      </span>
      <span className="ml-portal-art ml-portal-art-results" aria-hidden="true">
        <img src="/landing/product/art/results-flat-v2.webp" alt="" width="1254" height="1254" loading="lazy" />
      </span>
    </figure>
  </section>;
}

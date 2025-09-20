import React from "react";
import "../styles/commissions.css";

/** Base-aware helper for assets under /public */
const asset = (p) => import.meta.env.BASE_URL + p.replace(/^\/+/, "");

/** Sticky note IMAGE with clickable text (hangs a little outside the frame) */
function StickyNoteImage({
  src,
  top = "-4.0%",
  right = "-2.5%",     // negative = hangs out a bit (CSS clamps on small)
  left,                // optional: anchor left instead
  w = "26%",           // scales with sheet width
  rotate = -1.2,
  children,
}) {
  const noteSrc = src || asset("/images/commissionui/sticky.png");
  const style = {
    "--sticky-top": top,
    "--sticky-right": right,
    "--sticky-left": left ?? "auto",
    "--sticky-w": typeof w === "number" ? `${w}px` : w,
    "--sticky-rot": `${rotate}deg`,
  };
  return (
    <div className="sticky-note-wrap notepad-affix" style={style}>
      <img src={noteSrc} alt="" className="sticky-note-img" aria-hidden="true" />
      <div className="sticky-note-content">{children}</div>
    </div>
  );
}

function CommissionCard({ src, alt, note }) {
  return (
    <figure className="commission-card">
      <img src={src} alt={alt || "commission sample"} />
      {note && <figcaption>{note}</figcaption>}
    </figure>
  );
}

function SectionBody({
  title = "+ CHARACTER SHEET +",
  samples = [
    asset("/images/landing/landing1.jpg"),
    asset("/images/landing/landing2.jpg"),
    asset("/images/landing/landing3.jpg"),
    asset("/images/landing/landing4.jpg"),
  ],
}) {
  return (
    <>
      {/* Title moves inside .samples as an overlay */}
      <div className="panel__grid panel--aligned">
        {/* LEFT: 2×2 grid with title centered over it */}
        <div className="samples">
          <h2 className="sheet-title overlay">{title}</h2>
          <div className="samples__grid">
            {samples.map((s, i) => (
              <CommissionCard key={i} src={s} alt={`Sample ${i + 1}`} />
            ))}
          </div>
        </div>

        {/* RIGHT: info column (unchanged) */}
        <div className="info">
          <h3 className="info__heading">STANDARD</h3>
          <p className="info__muted">$00 PACKAGE INCLUDES:</p>
          <ul className="plus-list">
            <li>Full body front &amp; back view</li>
            <li>Colored</li>
            <li>Simple render</li>
            <li>2 facial expressions</li>
          </ul>

          <div className="info__divider" />

          <h3 className="info__heading">ADDONS:</h3>
          <ul className="plus-list">
            <li>Add-on info here</li>
            <li>Add-on info here</li>
            <li>Add-on info here</li>
          </ul>

          <h3 className="info__heading">FINAL INFORMATION</h3>
          <ul className="star-list">
            <li>Delivery estimate info</li>
            <li>Payment process, licensing info, etc…</li>
          </ul>
        </div>
      </div>
    </>
  );
}

/** One sheet section (blue frame + binder blocks + optional pink tab) */
function CommissionSection({
  showTab = true,
  showContact = true,
  stickySrc,

  stickyTop = "-4.0%",
  stickyRight = "-2.5%",
  stickyLeft,
  stickyW = "20%",
  stickyRotate = -1.2,

  children,
}) {
  // Pass the sticky width as a CSS var so we can reserve a right gutter
    const hasSticky = !!showContact; // your StickyNoteImage is only rendered when this is true
  // Only set CSS vars (and gutter) when the sticky exists
  const sheetStyle = hasSticky
    ? {
        "--sticky-gutter": typeof stickyW === "number" ? `${stickyW}px` : stickyW,
        "--sticky-top":   stickyTop,
        "--sticky-right": stickyRight,
        "--sticky-left":  stickyLeft ?? "auto",
        "--sticky-w":     typeof stickyW === "number" ? `${stickyW}px` : stickyW,
        "--sticky-rot":   `${stickyRotate}deg`,
      }
    : {};

  return (
    <section className={`sheet ${hasSticky ? "has-sticky" : ""}`} style={sheetStyle}>
      {/* Binder blocks */}
      <div className="sheet-binder" aria-hidden="true">
        <span /><span /><span /><span /><span />
      </div>

      {/* Pink tab on the top rail */}
      {showTab && <div className="sheet-tab" aria-hidden="true" />}

      {/* Sticky note (image) */}
      {hasSticky && (
        <StickyNoteImage
          src={stickySrc}
          top={stickyTop}
          right={stickyRight}
          left={stickyLeft}
          w={stickyW}
          rotate={stickyRotate}
        >
          <p>DM on <a href="https://x.com/yourhandle">Twitter/X</a></p>
          <p>Email: <a href="mailto:you@example.com">you@example.com</a></p>
          <p>Discord: yourname#1234</p>
        </StickyNoteImage>
      )}

      {/* CLIPPING WRAPPER to prevent “leaks” past the blue frame */}
      <div className="sheet-inner">
        <div className="notepad-content">
          {children ?? <SectionBody />}
        </div>
      </div>
    </section>
  );
}

export default function CommissionsPage() {
  return (
    <main className="commissions-canvas">
      <CommissionSection />

      <CommissionSection showTab={false}>
        <SectionBody title="Full Illustrations" status="Open" />
      </CommissionSection>

      <CommissionSection showTab={false} showContact={false}>
        <SectionBody title="Character Concepts" status="Waitlist" />
      </CommissionSection>
    </main>
  );
}

import React, { useMemo, useState, useEffect, useCallback } from "react";
import "../styles/commissions.css";
import { createPortal } from "react-dom";

/** Base-aware helper for assets under /public */
const asset = (p) => import.meta.env.BASE_URL + p.replace(/^\/+/, "");

/** Sticky note IMAGE with clickable text (hangs outside the frame) */
function StickyNoteImage({
  src,
  top = "-4.0%",
  right = "-2.5%",
  left,
  w = "26%",
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

function CommissionCard({ src, alt, onClick }) {
  return (
    <figure className="commission-card" onClick={onClick}>
      <img src={src} alt={alt || "commission sample"} />
    </figure>
  );
}

function StickyDockInline({
  links = [],               // NEW: array of { text, href }
  src,
  w = "320px",
  rotate = -2,
}) {
  const noteSrc = src || asset("/images/commissionui/sticky.png");
  const style = {
    "--sticky-dock-inline-w": typeof w === "number" ? `${w}px` : w,
    "--sticky-dock-rot": `${rotate}deg`,
  };

  return (
    <div className="sticky-dock-inline" style={style}>
      <img className="sticky-note-img" src={noteSrc} alt="" aria-hidden="true" />
      <div className="sticky-note-content">
        {links.map((link, i) => (
          <a
            key={i}
            href={link.href}
            target="_blank"
            rel="noreferrer"
            className="sticky-link"
            style={{ color: link.color || "#407dff" }} 
          >
            {link.text}
          </a>
        ))}
      </div>
    </div>
  );
}


function BackgroundSticker({
  href,                   // e.g. "/contact" or full URL
  onClick,                // or use an onClick instead of href
  img = asset("/images/commissionui/sticker.png"),
  width = "220px",        // cap width (responsive below)
  bottom = "max(16px, env(safe-area-inset-bottom) + 16px)",
  right  = "max(16px, env(safe-area-inset-right)  + 16px)",
  rotate = -4,
  ariaLabel = "Open link",
  title = "",
}) {
  const style = {
    "--bgsticker-w": typeof width === "number" ? `${width}px` : width,
    "--bgsticker-bottom": bottom,
    "--bgsticker-right": right,
    "--bgsticker-rot": `${rotate}deg`,
  };
  const Wrapper = href ? "a" : "button";
  const wrapperProps = href
    ? { href, target: href.startsWith("http") ? "_blank" : undefined, rel: "noreferrer" }
    : { type: "button", onClick };

  return (
    <Wrapper
    className="bg-sticker"
    style={style}
    aria-label={ariaLabel}
    title={title || ariaLabel}
    {...wrapperProps}   // <-- add this
  >
    <img src={img} alt="" aria-hidden="true" />
  </Wrapper>
  );
}

function MobileCarousel({ images, onOpen, startIndex = 0 }) {
  const trackRef = React.useRef(null);

  // Go to a given slide
  const goTo = React.useCallback((i) => {
    const el = trackRef.current?.children?.[i];
    if (el) el.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
  }, []);

  // Buttons: compute active index by nearest slide
  const [idx, setIdx] = React.useState(startIndex);
  React.useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    const handler = () => {
      const slides = [...track.children];
      if (!slides.length) return;
      let best = 0, bestDist = Infinity;
      slides.forEach((s, i) => {
        const rect = s.getBoundingClientRect();
        // distance from center of viewport
        const dist = Math.abs((rect.left + rect.right) / 2 - window.innerWidth / 2);
        if (dist < bestDist) { bestDist = dist; best = i; }
      });
      setIdx(best);
    };
    handler();
    track.addEventListener("scroll", handler, { passive: true });
    window.addEventListener("resize", handler);
    return () => {
      track.removeEventListener("scroll", handler);
      window.removeEventListener("resize", handler);
    };
  }, []);

  const prev = () => goTo(Math.max(0, idx - 1));
  const next = () => goTo(Math.min(images.length - 1, idx + 1));

  return (
    <div className="carousel">
      <div className="carousel__track" ref={trackRef}>
        {images.map((src, i) => (
          <button
            key={i}
            className="carousel__slide"
            onClick={() => onOpen(i)}
            aria-label={`Open sample ${i + 1}`}
          >
            <img src={src} alt={`Sample ${i + 1}`} />
          </button>
        ))}
      </div>

      {/* arrows */}
      <button
        className="carousel__nav carousel__nav--prev"
        onClick={prev}
        aria-label="Previous"
        disabled={idx === 0}
      >
        ‹
      </button>
      <button
        className="carousel__nav carousel__nav--next"
        onClick={next}
        aria-label="Next"
        disabled={idx === images.length - 1}
      >
        ›
      </button>

      {/* dots */}
      <div className="carousel__dots" role="tablist" aria-label="Slides">
        {images.map((_, i) => (
          <button
            key={i}
            className={`carousel__dot ${i === idx ? "is-active" : ""}`}
            onClick={() => goTo(i)}
            role="tab"
            aria-selected={i === idx}
            aria-label={`Go to slide ${i + 1}`}
          />
        ))}
      </div>
    </div>
  );
}



/** One sheet's body: samples + info + SIMPLE lightbox (portal) */
function SectionBody({
  title = "+ CHARACTER SHEET +",
  samples,                 // icon list (public/)
  fullDirPublic,           // e.g. "/images/commission_examples/full_image/character_sheets"
  packageLabel = "STANDARD",
  priceText = "$75 Starting Package Includes:",
  includes = [
    "Full body front & back view",
    "Colored and Rendered",
    "Simple render",
    "2 facial expressions",
    "300 DPI",
    "Personal Use License"
  ],
  addons = ["Add-on info here", "Add-on info here", "Add-on info here"],
  finalInfo = ["Delivery estimate info", "Payment / licensing info"],
}) {
  const icons = useMemo(() => samples ?? [], [samples]);

  // map icon URL -> full-size URL in another folder (same filename)
  const toFullSrc = useCallback(
    (iconUrl) => {
      const name = iconUrl.split("/").pop()?.split("?")[0] || "";
      return fullDirPublic
        ? asset(`${fullDirPublic}/${name}`)
        : iconUrl.replace("/icons/", "/full_image/");
    },
    [fullDirPublic]
  );
  const fullSrcs = useMemo(() => icons.map(toFullSrc), [icons, toFullSrc]);

  // lightbox
  const [openIdx, setOpenIdx] = useState(null);
  const close = useCallback(() => setOpenIdx(null), []);

  useEffect(() => {
    if (openIdx === null) return;
    const onKey = (e) => e.key === "Escape" && close();
    window.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [openIdx, close]);

  return (
    <>
      <div className="panel__grid panel--aligned">
        <div className="samples">
          <h2 className="sheet-title overlay">{title}</h2>
          <MobileCarousel
            images={icons}
            onOpen={(i) => setOpenIdx(i)}
            startIndex={0} // shows the 1st image first
          />
          <div className="samples__grid">
            {icons.map((src, i) => (
              <CommissionCard
                key={i}
                src={src}
                alt={`Sample ${i + 1}`}
                onClick={() => setOpenIdx(i)}
              />
            ))}
          </div>
        </div>

        <div className="info">
          <h3 className="info__heading">{packageLabel}</h3>
          <p className="info__muted">{priceText}</p>

          <ul className="plus-list">
            {includes.map((t, i) => (
              <li key={`inc-${i}`}>{t}</li>
            ))}
          </ul>

          <div className="info__divider" />

          <h3 className="info__heading">ADDONS:</h3>
          <ul className="plus-list">
            {addons.map((t, i) => (
              <li key={`add-${i}`}>{t}</li>
            ))}
          </ul>

          <h3 className="info__heading">FINAL INFORMATION</h3>
          <ul className="star-list">
            {finalInfo.map((t, i) => (
              <li key={`fin-${i}`}>{t}</li>
            ))}
          </ul>
        </div>
      </div>
      
      {/* SIMPLE centered overlay (portal to <body>) */}
      {openIdx !== null &&
        createPortal(
          <div className="lb lb--simple" role="dialog" aria-modal="true" onClick={close}>
            <img
              className="lb__img-simple"
              src={fullSrcs[openIdx]}
              alt={`Image ${openIdx + 1}`}
              onClick={(e) => e.stopPropagation()} // don't close when clicking the image
            />
          </div>,
          document.body
        )}
    </>
  );
}


/** One sheet section (frame + binder blocks + optional pink tab + sticky) */
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
  const hasSticky = !!showContact;

  const sheetStyle = hasSticky
    ? {
        "--sticky-top": stickyTop,
        "--sticky-right": stickyRight,
        "--sticky-left": stickyLeft ?? "auto",
        "--sticky-w": typeof stickyW === "number" ? `${stickyW}px` : stickyW,
        "--sticky-rot": `${stickyRotate}deg`,
      }
    : {};

  return (
    <section className={`sheet ${hasSticky ? "has-sticky" : ""}`} style={sheetStyle}>
      {/* Binder blocks */}
      <div className="sheet-binder" aria-hidden="true">
        <span />
        <span />
        <span />
        <span />
        <span />
      </div>

      {/* Pink tab */}
      {showTab && <div className="sheet-tab">COMMISSIONS</div>}

      {/* Sticky note (outside) */}
      {hasSticky && (
        <StickyNoteImage
          src={stickySrc}
          top={stickyTop}
          right={stickyRight}
          left={stickyLeft}
          w={stickyW}
          rotate={stickyRotate}
        >
        <a 
          href="https://twitter.com/Nalkaloun" 
          className="p-link-top" 
          target="_blank" 
          rel="noreferrer"
          
        >
          Follow me on Twitter! 𝕏
        </a>
        <a 
          href="https://bsky.app/profile/nalkaloun.bsky.social" 
          className="p-link-bottom" 
          target="_blank" 
          rel="noreferrer"
        >
          Follow me on Bluesky! :3
        </a>
        </StickyNoteImage>
      )}

      {/* Paper content */}
      <div className="sheet-inner">
        <div className="notepad-content">{children}</div>
      </div>

      {/* Bottom arrow (hidden on last sheet via CSS in your styles) */}
      <div className="sheet-arrow-overlay" aria-hidden="true">
        <span className="arrow" />
        <span className="arrow" />
        <span className="arrow" />
      </div>
    </section>
    
  );
}

export default function CommissionsPage() {
  return (
    <main className="commissions-canvas">
      {/* 1) Character Sheet */}
      <CommissionSection>
        <SectionBody
          title="+ CHARACTER SHEET +"
          samples={[
            asset("/images/commission_examples/icons/character_sheets/1.jpg"),
            asset("/images/commission_examples/icons/character_sheets/2.jpg"),
            asset("/images/commission_examples/icons/character_sheets/3.jpg"),
            asset("/images/commission_examples/icons/character_sheets/4.jpg"),
          ]}
          fullDirPublic="/images/commission_examples/full_image/character_sheets"
          packageLabel="STANDARD"
          priceText="$75 Starting Package Includes:"
          includes={[
            "Front & back full body",
            "Colored, simple render",
            "2 facial expressions",
            "300 DPI",
            "Personal Use License",
          ]}
          addons={["+ Simple Splash Background / Scene", "+ More Facial Expressions", "+ Additional Pose", "+ Use Licences: Monetized content, Commercial merchandising"]}
          finalInfo={[
            "Estimated 2-3 week Delivery Time (Varies on Complexity of Order)",
            "PNG (and PSD on request)",
          ]}
        />
      </CommissionSection>

      {/* 2) Character Sketches */}
      <CommissionSection showTab={false} showContact= {false}>
        <SectionBody
          title="Character Sketches"
          samples={[
            asset("/images/commission_examples/icons/character_sketches/1.jpg"),
            asset("/images/commission_examples/icons/character_sketches/2.jpg"),
            asset("/images/commission_examples/icons/character_sketches/3.jpg"),
            asset("/images/commission_examples/icons/character_sketches/4.jpg"),
          ]}
          fullDirPublic="/images/commission_examples/full_image/character_sketches"
          packageLabel="SKETCH"
          priceText="$45 Starting Package Includes:"
          includes={[
            "Up to Fullbody",
            "Rough Colored and Rendered",
            "Simple Splash Background / Scene",
            "144 DPI",
            "Personal Use License Only",
          ]}
          addons={["+ Additional Pose ", "+ Additional Character"]}
          finalInfo={["Estimated up to 1 Week Delivery Time (Varies on Complexity of Order)", "PNG (Optional Transparent)"]}
        />
      </CommissionSection>

      {/* 3) Full Illustrations */}
      <CommissionSection showTab={false} showContact={false}>
        <SectionBody
          title="Full Illustrations"
          samples={[
            asset("/images/commission_examples/icons/full_illustration/1.jpg"),
            asset("/images/commission_examples/icons/full_illustration/2.jpg"),
            asset("/images/commission_examples/icons/full_illustration/3.jpg"),
            asset("/images/commission_examples/icons/full_illustration/4.jpg"),
          ]}
          fullDirPublic="/images/commission_examples/full_image/full_illustration"
          packageLabel="BASE"
          priceText="$60 Starting Package Includes:"
          includes={[
            "Up to Fullbody",
            "Colored and Rendered",
            "Simple Splash Background / Scene",
            "300 DPI",
            "Personal Use License"
          ]}
          addons={["+ Additional Rendered Character", "+ Full Background / Scene"]}
          finalInfo={[
            "Estimated up to 2 Week Delivery Time (Varies on Complexity of Order)",
            "PNG",
          ]}
        />
      </CommissionSection>
      <StickyDockInline
        links={[
          { text: "Follow me on Twitter! 𝕏", href: "https://twitter.com/Nalkaloun", color:"#283035ff"},
          { text: "Follow me on Bluesky! :3", href: "https://bsky.app/profile/nalkaloun.bsky.social" , color: "#1DA1F2"}
        ]}
      />
      <BackgroundSticker
        href="/contact"
        img={asset("/images/commissionui/Moolly_Home_Sticker.png")}
        width="200px"
        ariaLabel="Contact for commissions"
        title="Contact for commissions"
      />
    </main>
  );
}

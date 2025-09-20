import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "../styles/landingpage.css";

const asset = (p) => import.meta.env.BASE_URL + p.replace(/^\/+/, "");

const socials = [
  { label: "Vgen",    href: "https://vgen.co/Nalkaloun", icon: "images/appicon/vgen.png" },
  { label: "Twitter", href: "https://x.com/Nalkaloun",   icon: "images/appicon/Twitter.png" },
  { label: "Bluesky", href: "https://bsky.app/profile/nalkaloun.bsky.social", icon: "images/appicon/Bluesky.png" },
  { label: "Ko-Fi",   href: "https://ko-fi.com/nalkaloun", icon: "images/appicon/Kofi.png" },
];

const heroImages = [
  { id: 1, src: "images/landing/landing1.jpg", alt: "panel 1" },
  { id: 2, src: "images/landing/landing2.jpg", alt: "panel 2" },
  { id: 3, src: "images/landing/landing3.jpg", alt: "panel 3" },
  { id: 4, src: "images/landing/landing4.jpg", alt: "panel 4" },
];

function SocialButton({ href, label, icon }) {
  const isImg = typeof icon === "string";
  return (
    <a href={href} title={label} className="landing-social-btn" aria-label={label} target="_blank" rel="noopener noreferrer">
      {isImg ? <img src={asset(icon)} alt={label} className="icon-img" /> : React.cloneElement(icon, { className: "icon-img" })}
    </a>
  );
}

function CtaButton({ href, children, icon, label }) {
  const isExternal = /^https?:\/\//i.test(href);
  const Icon = typeof icon === "string"
    ? <img src={asset(icon)} alt={label || children} className="icon-img" />
    : React.cloneElement(icon, { className: "icon-img" });

  const inner = (<><span className="cta-icon">{Icon}</span><span>{children}</span></>);

  return isExternal
    ? <a href={href} className="cta diag-swipe" target="_blank" rel="noopener noreferrer">{inner}</a>
    : <Link to={href} className="cta diag-swipe">{inner}</Link>;
}

export default function Landingpage() {
  const [brandImg, setBrandImg] = useState(null);
  const [selectedId, setSelectedId] = useState(null);

  const selected = heroImages.find(img => img.id === selectedId);
  const effectiveBrandImg = selected ? `url("${asset(selected.src)}")` : brandImg;
  const ctaPhase = selectedId ? "compact" : "normal";

  const [brandPhase, setBrandPhase] = useState("");

  useEffect(() => {
    if (selectedId) {
      setBrandPhase("x-shift");                     // step 1
      setTimeout(() => setBrandPhase("x-shift y-shift"), 350); // step 2 after .35s
    } else {
      setBrandPhase("");
    }
  }, [selectedId]);

  return (
    <div className={`bg-neutral-900 text-neutral-100 ${selectedId ? "is-hero-focused" : ""}`}>
      {/* HERO — click empty space clears selection */}
      <section className="w-full" onClick={() => setSelectedId(null)}>
        <div className="landing-hero-grid">
          {heroImages.map(img => {
            const url = `url("${asset(img.src)}")`;
            const cls =
              selectedId == null
                ? "landing-hero-panel"
                : selectedId === img.id
                ? "landing-hero-panel selected"
                : "landing-hero-panel dimmed";

            return (
              <div
                key={img.id}
                className={cls}
                onMouseEnter={() => { if (!selectedId) setBrandImg(url); }}
                onMouseLeave={() => { if (!selectedId) setBrandImg(null); }}
                onClick={(e) => {
                  e.stopPropagation();                  // don’t bubble to section
                  setSelectedId(selectedId === img.id ? null : img.id);
                }}
              >
                <img src={asset(img.src)} alt={img.alt} />
              </div>
            );
          })}
        </div>
      </section>

      {/* BAND — click ANYWHERE here to reset */}
      <section className="landing-band" onClick={() => setSelectedId(null)}>
        <div className="band-inner">
          <div>
            <div
              className={`brand ${brandPhase} ${effectiveBrandImg ? "" : "is-idle"}`}
              style={{ ["--brand-image"]: effectiveBrandImg }}
            >
              「NALKALOUN」
            </div>
            <div className="sub" aria-hidden={!!selectedId}>Concept Design digital artist</div>
            <p className="blurb" aria-hidden={!!selectedId}>You can contact me through Twitter or Discord (@nalkaloun)!</p>
            <div className="support-title" aria-hidden={!!selectedId}>SUPPORT ME BY FOLLOWING<br/>OR DONATING AT:</div>
            <div className="support-row" aria-hidden={!!selectedId}>
              {socials.map((s) => <SocialButton key={s.label} {...s} />)}
            </div>
          </div>

          {/* right — CTAs disappear when selected */}
          <div className={`cta-stack ${ctaPhase}`} onClick={(e)=>e.stopPropagation()}>
            <CtaButton href="/portfolio"   icon={<svg viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="12" r="10"/></svg>}>Portfolio</CtaButton>
            <CtaButton href="/commissions" icon={<svg viewBox="0 0 24 24" fill="currentColor"><path d="M4 12h16M4 7h16M4 17h10"/></svg>}>Commissions</CtaButton>
            <CtaButton href="https://vgen.co/Nalkaloun" icon="images/appicon/vgen.png" label="VGen">Vgen</CtaButton>
            <CtaButton href="/terms" icon={<svg viewBox="0 0 24 24" fill="currentColor"><path d="M6 6h12v12H6z"/></svg>} >Terms of Service</CtaButton>
          </div>
        </div>
      </section>
    </div>
  );
}

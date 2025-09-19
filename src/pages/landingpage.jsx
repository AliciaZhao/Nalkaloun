import React from "react";
import "../styles/landingpage.css";

const socials = [
  { label: "Vgen", href: "https://vgen.co/Nalkaloun", icon: "/images/appicon/vgen.png" },
  //{ label: "Discord", href: "#", icon: "/images/appicon/discord.png" },
  { label: "Twitter", href: "https://x.com/Nalkaloun", icon: "/images/appicon/Twitter.png" },
  { label: "Bluesky",   href: "https://bsky.app/profile/nalkaloun.bsky.social", icon: "/images/appicon/Bluesky.png" },
  { label: "Ko-Fi",  href: "https://ko-fi.com/nalkaloun", icon: "/images/appicon/Kofi.png" },
];

const heroImages = [
  { id: 1, src: "/images/landing/landing1.jpg", alt: "panel 1" },
  { id: 2, src: "/images/landing/landing2.jpg", alt: "panel 2" },
  { id: 3, src: "/images/landing/landing3.jpg", alt: "panel 3" },
  { id: 4, src: "/images/landing/landing4.jpg", alt: "panel 4" },
];

function SocialButton({ href, label, icon }) {
  const isImg = typeof icon === "string";
  return (
    <a href={href} title={label} className="landing-social-btn" aria-label={label}>
      {isImg ? (
        <img src={icon} alt={label} className="icon-img" />
      ) : (
        React.cloneElement(icon, { className: "icon-img" })
      )}
    </a>
  );
}

function CtaButton({ href, children, icon, label }) {
  const isImg = typeof icon === "string";
  return (
    <a href={href} className="cta">
      <span className="cta-icon">
        {isImg ? (
          <img src={icon} alt={label || children} className="icon-img" />
        ) : (
          React.cloneElement(icon, { className: "icon-img" })
        )}
      </span>
      <span>{children}</span>
    </a>
  );
}

export default function Landingpage() {
  return (
    <div className="bg-neutral-900 text-neutral-100">
      {/* 4-panel hero */}
      <section className="w-full">
        <div className="landing-hero-grid">
        {heroImages.map(img => (
            <div key={img.id} className="landing-hero-panel">
            <img src={img.src} alt={img.alt}/>
            </div>
        ))}
        </div>
      </section>

      {/* bottom band */}
      <section className="landing-band">
        <div className="band-inner">
          {/* left side */}
          <div>
            <div className="brand">「NALKALOUN」</div>
            <div className="sub">Concept Design digital artist</div>
            <p className="blurb">You can contact me through Twitter or Discord (@nalkaloun)!</p>

            <div className="support-title">SUPPORT ME BY FOLLOWING<br/>OR DONATING AT:</div>
            <div className="support-row">
              {socials.map((s) => <SocialButton key={s.label} {...s} />)}
            </div>
          </div>

          {/* right side */}
          <div className="cta-stack">
            <CtaButton href="/portfolio"   icon={<svg viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="12" r="10"/></svg>}>Portfolio</CtaButton>
            <CtaButton href="/commissions" icon={<svg viewBox="0 0 24 24" fill="currentColor"><path d="M4 12h16M4 7h16M4 17h10"/></svg>}>Commissions</CtaButton>
            <CtaButton href="https://vgen.co/Nalkaloun" icon="/images/appicon/vgen.png" label="Vgen">Vgen</CtaButton>
            <CtaButton href="/terms"       icon={<svg viewBox="0 0 24 24" fill="currentColor"><path d="M6 6h12v12H6z"/></svg>}>Terms of Service</CtaButton>
          </div>
        </div>
      </section>
    </div>
  );
}
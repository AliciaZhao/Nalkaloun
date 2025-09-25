import React, { useMemo, useState, useEffect } from "react";
import "../styles/portfolio.css";
import manifest from "../assets/portfolio.manifest.json";

// Vite glob to get final file URLs
const GLOB = import.meta.glob(
  "/src/assets/portfolio/**/*.{png,jpg,jpeg,gif,webp,avif}",
  { eager: true, import: "default" }
);

export default function Portfolio() {
  // ensure scroll on this page even if landing disabled it
  useEffect(() => {
    document.documentElement.classList.add("allow-portfolio-scroll");
    document.body.classList.add("allow-portfolio-scroll");
    return () => {
      document.documentElement.classList.remove("allow-portfolio-scroll");
      document.body.classList.remove("allow-portfolio-scroll");
    };
  }, []);

  // quick lookup: path -> dims/placeholder
  const byPath = useMemo(() => {
    const m = new Map();
    for (const e of manifest) m.set(e.path, e);
    return m;
  }, []);

  // natural sort so "2" < "10"
  const collator = useMemo(
    () => new Intl.Collator(undefined, { numeric: true, sensitivity: "base" }),
    []
  );

  const images = useMemo(() => {
    return Object.entries(GLOB)
      .map(([path, url]) => {
        const meta = byPath.get(path) || {};
        return {
          key: path,
          url,
          name: meta.name || path.split("/").pop(),
          width: meta.width,
          height: meta.height,
          ratio: meta.ratio,
          placeholder: meta.placeholder
        };
      })
      .sort((a, b) => collator.compare(a.name ?? "", b.name ?? ""));
  }, [byPath, collator]);

  const [lb, setLb] = useState(null);

  return (
    <div className="portfolio-page">
      <div className="portfolio-canvas">
        {/* ===== Page Header ===== */}
      <div className="portfolio-header">
        <h1>
          「PORTFOLIO」
          <span className="sub-en">RECENT ARTWORKS</span>
        </h1>
        <div className="portfolio-sub">
          <hr />
          <p>Below are some recent personal artworks I have finished.</p>
        </div>
      </div>
        <div className="masonry">
          {images.map((img, i) => {
            const eager = i < 8; // first row paints fast
            const wrapStyle = img.width && img.height
              ? { aspectRatio: `${img.width} / ${img.height}` }
              : undefined;

            return (
              <figure className="masonry-item" key={img.key} onClick={() => setLb(img.url)}>
                <div className="ph-wrap" style={wrapStyle}>
                  {/* tiny blurred preview */}
                  {img.placeholder && (
                    <img
                      className="ph"
                      src={img.placeholder}
                      alt=""
                      aria-hidden="true"
                    />
                  )}

                  {/* full image fades in; when loaded, mark parent ready to hide blur */}
                  <img
                    className="full"
                    src={img.url}
                    alt={img.name}
                    loading={eager ? "eager" : "lazy"}
                    fetchpriority={eager ? "high" : "auto"}
                    decoding="async"
                    {...(img.width && img.height ? { width: img.width, height: img.height } : {})}
                    onLoad={(e) => {
                      const parent = e.currentTarget.closest(".ph-wrap");
                      if (parent) parent.dataset.ready = "1";
                    }}
                  />
                </div>
              </figure>
            );
          })}
        </div>
      </div>

      {lb && (
        <div className="lb" onClick={() => setLb(null)} role="dialog" aria-modal="true">
          <img className="lb__img" src={lb} alt="" />
        </div>
      )}
    </div>
  );
}

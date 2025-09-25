import React, { useEffect } from "react";
import "../styles/terms.css"; // your CSS file

export default function TermsOfService() {
  useEffect(() => {
    document.documentElement.classList.add("allow-scroll");
    document.body.classList.add("allow-scroll");
    return () => {
      document.documentElement.classList.remove("allow-scroll");
      document.body.classList.remove("allow-scroll");
    };
  }, []);

  return (
    <div className="tos-canvas">
      <div className="container">
        {/* NAV BAR */}
        <nav className="navbar">
          <a href="index.html" className="nav-btn is-primary">HOME</a>
          <a href="commissions.html" className="nav-btn">COMMISSION SHEET</a>
        </nav>

        {/* PAGE HEADER */}
        <section className="page-header">
          <h1>「TERMS OF SERVICE」</h1>
        </section>

        {/* PAYMENT & REFUNDS */}
        <section className="tos-section">
          <h2>PAYMENT & REFUNDS</h2>
          <ul>
            <li>Payment will not be asked for until after the client has chosen and reviewed the thumbnail design/sketches sent to them. </li>
            <li>Thumbnails will not have all the listed features and will be in a lower image quality.</li>
            <li>The order will not continue to be worked on beyond initial sketch/thumbnail until after the payment has been paid.</li>
            <li>Payment will be required and asked for in order to finish the commission with all the listed features.</li>
          </ul>
        </section>

        {/* revisions */}
        <section className="tos-section">
          <h2>REVISIONS</h2>
          <ul>
            <li>During the Request / WIP stage, the client may ask for edits and revisions. </li>
            <li>You will not be able to ask for major revisions after the commission has been delivered. </li>
          </ul>
        </section>
        
        {/* ART USAGE */}
        <section className="tos-section">
          <h2>ART USAGE</h2>
          <ul>
            <li>NO AI / NO NFT</li>
            <li>Use of the work is always on a consensual bases between the buyer and me per piece. </li>
            <li>Commercial use is listed in the request form, and requires a payment to be used as such. </li>
            <li>Do not use my work for commercial purposes if the license has not been paid.</li>
          </ul>
        </section>

        {/* INTELLECTUAL PROPERTY RIGHTS */}
        <section className="tos-section">
          <h2>INTELLECTUAL PROPERTY RIGHTS</h2>
          <ul>
            <li>Do not redistribute these works as your own. </li>
            <li>I, Nalkaloun, own the rights to these works, and if needed, should be credited as the sole artist.</li>
          </ul>
        </section>

        {/* REFUNDS */}
        <section className="tos-section">
          <h2>REFUNDS</h2>
          <ul>
            <li>There are NO refunds offered for finished commissions.</li>
            <li>Please if their is a problem during the WIP stage, let me know and we'll sort it out.</li>
          </ul>
        </section>
        
        {/* COMMUNICATION */}
        <section className="tos-section">
          <h2>COMMUNICATION</h2>
          <ul>
            <li>Communication between the Buyer and the artist is integral to ensure the satisfaction of the customer-- </li>
            <li>If there are any complaints/changes to be had, the customer holds the responsibility to express these grievances to ensure customer satisfaction.</li>
          </ul>
        </section>
      </div>
    </div>
  );
}

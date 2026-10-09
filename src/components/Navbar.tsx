import { useEffect, useState } from "react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import HoverLinks from "./HoverLinks";
import { gsap } from "gsap";
import { ScrollSmoother } from "gsap-trial/ScrollSmoother";
import "./styles/Navbar.css";

gsap.registerPlugin(ScrollSmoother, ScrollTrigger);
export let smoother: ScrollSmoother;

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined" && "scrollRestoration" in window.history) {
      window.history.scrollRestoration = "manual";
    }
    window.scrollTo(0, 0);

    smoother = ScrollSmoother.create({
      wrapper: "#smooth-wrapper",
      content: "#smooth-content",
      smooth: 0.8,
      speed: 1,
      effects: true,
      autoResize: true,
      ignoreMobileResize: true,
    });

    smoother.scrollTop(0);
    smoother.paused(true);

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMenuOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);

    return () => {
      window.removeEventListener("keydown", onKeyDown);
      smoother?.kill();
    };
  }, []);

  const handleLinkClick = (
    e: React.MouseEvent<HTMLAnchorElement>,
    sectionId: string
  ) => {
    setMenuOpen(false);
    if (window.innerWidth > 1024) {
      e.preventDefault();
      smoother?.scrollTo(sectionId, true, "top top");
    } else {
      e.preventDefault();
      const target = document.querySelector(sectionId);
      if (target) {
        target.scrollIntoView({ behavior: "smooth" });
      }
    }
  };

  return (
    <>
      <header className="header">
        <a href="/#" className="navbar-title" data-cursor="disable">
          SM
        </a>
        <a
          href="mailto:thesidharth.cse@gmail.com"
          className="navbar-connect"
          data-cursor="disable"
        >
          thesidharth.cse@gmail.com
        </a>

        {/* Desktop Navigation */}
        <ul className="desktop-nav">
          <li>
            <a
              data-href="#about"
              href="#about"
              onClick={(e) => handleLinkClick(e, "#about")}
            >
              <HoverLinks text="ABOUT" />
            </a>
          </li>
          <li>
            <a
              data-href="#career"
              href="#career"
              onClick={(e) => handleLinkClick(e, "#career")}
            >
              <HoverLinks text="EXPERIENCE" />
            </a>
          </li>
          <li>
            <a
              data-href="#work"
              href="#work"
              onClick={(e) => handleLinkClick(e, "#work")}
            >
              <HoverLinks text="WORK" />
            </a>
          </li>
          <li>
            <a
              data-href="#contact"
              href="#contact"
              onClick={(e) => handleLinkClick(e, "#contact")}
            >
              <HoverLinks text="CONTACT" />
            </a>
          </li>
        </ul>

        {/* Mobile Hamburger Button */}
        <button
          className={`mobile-hamburger ${menuOpen ? "active" : ""}`}
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          aria-expanded={menuOpen}
          aria-controls="mobile-nav-overlay"
        >
          <span className="hamburger-line"></span>
          <span className="hamburger-line"></span>
          <span className="hamburger-line"></span>
        </button>
      </header>

      {/* Mobile Navigation Drawer / Overlay */}
      <div
        id="mobile-nav-overlay"
        className={`mobile-nav-overlay ${menuOpen ? "open" : ""}`}
        aria-hidden={!menuOpen}
      >
        <div className="mobile-nav-backdrop" onClick={() => setMenuOpen(false)} />
        <nav className="mobile-nav-content">
          <ul className="mobile-nav-list">
            <li>
              <a
                href="#about"
                onClick={(e) => handleLinkClick(e, "#about")}
              >
                ABOUT
              </a>
            </li>
            <li>
              <a
                href="#career"
                onClick={(e) => handleLinkClick(e, "#career")}
              >
                EXPERIENCE
              </a>
            </li>
            <li>
              <a
                href="#work"
                onClick={(e) => handleLinkClick(e, "#work")}
              >
                WORK
              </a>
            </li>
            <li>
              <a
                href="#contact"
                onClick={(e) => handleLinkClick(e, "#contact")}
              >
                CONTACT
              </a>
            </li>
          </ul>

          <div className="mobile-nav-footer">
            <a
              href="mailto:thesidharth.cse@gmail.com"
              className="mobile-email-link"
            >
              thesidharth.cse@gmail.com
            </a>
          </div>
        </nav>
      </div>

      <div className="landing-circle1"></div>
      <div className="landing-circle2"></div>
      <div className="nav-fade"></div>
    </>
  );
};

export default Navbar;

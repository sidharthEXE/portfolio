import {
  FaGithub,
  FaInstagram,
  FaLinkedinIn,
  FaXTwitter,
} from "react-icons/fa6";
import "./styles/SocialIcons.css";
import { TbNotes } from "react-icons/tb";
import { useEffect } from "react";
import HoverLinks from "./HoverLinks";

const SocialIcons = () => {
  useEffect(() => {
    const social = document.getElementById("social") as HTMLElement;
    if (!social) return;

    const cleanupFns: (() => void)[] = [];

    social.querySelectorAll("span").forEach((item) => {
      const elem = item as HTMLElement;
      const link = elem.querySelector("a") as HTMLElement;
      if (!link) return;

      const onMouseMove = (e: MouseEvent) => {
        const rect = elem.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        link.style.setProperty("--siLeft", `${x}px`);
        link.style.setProperty("--siTop", `${y}px`);
      };

      const onMouseLeave = () => {
        link.style.setProperty("--siLeft", "50%");
        link.style.setProperty("--siTop", "50%");
      };

      elem.addEventListener("mousemove", onMouseMove, { passive: true });
      elem.addEventListener("mouseleave", onMouseLeave);

      cleanupFns.push(() => {
        elem.removeEventListener("mousemove", onMouseMove);
        elem.removeEventListener("mouseleave", onMouseLeave);
      });
    });

    return () => {
      cleanupFns.forEach((fn) => fn());
    };
  }, []);

  return (
    <div className="icons-section">
      <div className="social-icons" data-cursor="icons" id="social">
        <span>
          <a
            href="https://github.com/sidharthEXE"
            target="_blank"
            rel="noreferrer"
            aria-label="GitHub Profile"
          >
            <FaGithub />
          </a>
        </span>
        <span>
          <a
            href="https://www.linkedin.com/in/sidharthEXE"
            target="_blank"
            rel="noreferrer"
            aria-label="LinkedIn Profile"
          >
            <FaLinkedinIn />
          </a>
        </span>
        <span>
          <a
            href="https://x.com/SIDHARTH00007"
            target="_blank"
            rel="noreferrer"
            aria-label="X (Twitter) Profile"
          >
            <FaXTwitter />
          </a>
        </span>
        <span>
          <a
            href="https://www.instagram.com/hashtag.sid"
            target="_blank"
            rel="noreferrer"
            aria-label="Instagram Profile"
          >
            <FaInstagram />
          </a>
        </span>
      </div>
      <a
        className="resume-button"
        href="mailto:thesidharth.cse@gmail.com?subject=Resume%20Request%20-%20Sidharth%20Mohanty"
        data-cursor="disable"
        aria-label="Request Resume"
      >
        <HoverLinks text="RESUME" />
        <span>
          <TbNotes />
        </span>
      </a>
    </div>
  );
};

export default SocialIcons;

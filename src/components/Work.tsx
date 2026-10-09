import { useState } from "react";
import "./styles/Work.css";
import WorkImage from "./WorkImage";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import { MdArrowOutward } from "react-icons/md";

const projects = [
  {
    name: "ResQ",
    category: "Emergency Response & Service Locator",
    tools: "React, Node.js, Express.js, MongoDB, Geolocation API",
    image: "/images/resq.png",
    link: "https://resq-services.vercel.app/",
  },
];

const Work = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const total = projects.length;
  const hasMultiple = total > 1;
  const currentProject = projects[currentIndex];

  const prevProject = () => {
    setCurrentIndex((prev) => (prev === 0 ? total - 1 : prev - 1));
  };

  const nextProject = () => {
    setCurrentIndex((prev) => (prev === total - 1 ? 0 : prev + 1));
  };

  return (
    <div className="work-section" id="work">
      <div className="work-container section-container">
        <div className="work-title-wrap">
          <h2>
            My <span>Work</span>
          </h2>
          <div className="work-divider" />
        </div>

        <div className="work-showcase">
          {hasMultiple && (
            <button
              className="work-nav-btn work-prev"
              onClick={prevProject}
              aria-label="Previous project"
              data-cursor="disable"
            >
              <FiChevronLeft />
            </button>
          )}

          <div className="work-content-grid" key={currentIndex}>
            <div className="work-info">
              <div className="work-header">
                <span className="work-number">
                  {String(currentIndex + 1).padStart(2, "0")}
                </span>
                <div className="work-titles">
                  <h3 className="work-name">{currentProject.name}</h3>
                  <p className="work-category">{currentProject.category}</p>
                </div>
              </div>

              <div className="work-tools-group">
                <h4 className="work-tools-label">TOOLS & FEATURES</h4>
                <p className="work-tools-list">{currentProject.tools}</p>
              </div>

              {currentProject.link && (
                <div className="work-action">
                  <a
                    href={currentProject.link}
                    target="_blank"
                    rel="noreferrer"
                    className="work-live-link"
                    data-cursor="disable"
                  >
                    <span>Live Demo</span>
                    <MdArrowOutward />
                  </a>
                </div>
              )}
            </div>

            <div className="work-preview">
              <WorkImage
                image={currentProject.image}
                alt={currentProject.name}
                link={currentProject.link}
              />
            </div>
          </div>

          {hasMultiple && (
            <button
              className="work-nav-btn work-next"
              onClick={nextProject}
              aria-label="Next project"
              data-cursor="disable"
            >
              <FiChevronRight />
            </button>
          )}
        </div>

        {hasMultiple && (
          <div className="work-pagination">
            {projects.map((_, i) => (
              <button
                key={i}
                className={`work-dot ${i === currentIndex ? "active" : ""}`}
                onClick={() => setCurrentIndex(i)}
                aria-label={`Go to slide ${i + 1}`}
                data-cursor="disable"
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Work;

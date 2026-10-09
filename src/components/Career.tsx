import "./styles/Career.css";
const Career = () => {
  return (
    <div className="career-section section-container" id="career">
      <div className="career-container">
        <h2>
          My career <span>&</span>
          <br /> experience
        </h2>
        <div className="career-info">
          <div className="career-timeline">
            <div className="career-dot"></div>
          </div>
          <div className="career-info-box">
            <div className="career-info-in">
              <div className="career-role">
                <h4>CBSE Class X</h4>
                <h5>Sivananda Centenary Boys School, Bhubaneswar</h5>
              </div>
              <h3>2021</h3>
            </div>
            <p>
              Secondary school education in Bhubaneswar, Odisha, establishing a strong discipline and foundation in science, mathematics, and computers.
            </p>
          </div>
          <div className="career-info-box">
            <div className="career-info-in">
              <div className="career-role">
                <h4>CBSE Class XII</h4>
                <h5>Sivananda Centenary Boys School, Bhubaneswar</h5>
              </div>
              <h3>2023</h3>
            </div>
            <p>
              Higher secondary education in Bhubaneswar, Odisha, establishing a strong discipline and foundation in PCM and CS with Python and DBMS.
            </p>
          </div>
          <div className="career-info-box">
            <div className="career-info-in">
              <div className="career-role">
                <h4>CSE (8.15 CGPA)</h4>
                <h5>Brainware University, Kolkata</h5>
              </div>
              <h3>2024</h3>
            </div>
            <p>
              Currently in 4th Semester with an 8.15 CGPA. Mastering core computer science disciplines including OOP, DBMS, Computer Networks, Operating Systems, and Data Structures.
            </p>
          </div>
          <div className="career-info-box">
            <div className="career-info-in">
              <div className="career-role">
                <h4>Cybersecurity Intern</h4>
                <h5>NIIT Foundation</h5>
              </div>
              <h3>2025</h3>
            </div>
            <p>
              Completed 4-week structured training in Cybersecurity with AI. Gained practical exposure to threat concepts, defensive approaches, vulnerability identification, and diagnostic support.
            </p>
          </div>
          <div className="career-info-box">
            <div className="career-info-in">
              <div className="career-role">
                <h4>Industrial Training — MERN & AI</h4>
                <h5>Digontom Private Limited</h5>
              </div>
              <h3>NOW</h3>
            </div>
            <p>
              Engaged in advanced training covering the full-stack MERN ecosystem with AI integration. Designing responsive UIs, backend microservices, and connected database schemas.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Career;
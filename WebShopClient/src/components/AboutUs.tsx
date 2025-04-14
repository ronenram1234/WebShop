import { FunctionComponent } from "react";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHandshake,
  faLeaf,
  faShieldAlt,
  faLightbulb,
} from "@fortawesome/free-solid-svg-icons";

const ParallaxItem = ({ children }: { children: React.ReactNode }) => {
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.2,
  });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.8 }}
    >
      {children}
    </motion.div>
  );
};

const AboutUs: FunctionComponent = () => {
  return (
    <div className="about-us-container">
      {/* Hero Section */}
      <section className="about-hero">
        <div className="hero-image">
          <img
            src="aboutus.jpg"
            alt="TinkerTech Team"
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
        </div>
        <div className="hero-content">
          <h1>About TinkerTech</h1>
          <p className="hero-subtitle">
            Your Trusted Partner in IT Asset Management and Sustainability
          </p>
        </div>
      </section>

      {/* Mission */}
      <section className="mission-section">
        <div className="container">
          <ParallaxItem>
            <h2>Our Mission</h2>
            <p className="mission-statement">
              TinkerTech strives to be the IT management support system that
              customers can depend on, using our data security, environmental,
              health, and safety principles as the core foundation for
              everything we do.
            </p>
          </ParallaxItem>
        </div>
      </section>

      {/* Values */}
      <section className="values-section">
        <div className="container">
          <h2>Our Core Values</h2>
          <div className="values-grid">
            {[faShieldAlt, faLeaf, faHandshake, faLightbulb].map(
              (icon, idx) => (
                <ParallaxItem key={idx}>
                  <div className="value-card">
                    <FontAwesomeIcon icon={icon} className="value-icon" />
                    <h3>Value {idx + 1}</h3>
                    <p>Description of core value {idx + 1}.</p>
                  </div>
                </ParallaxItem>
              )
            )}
          </div>
        </div>
      </section>

      {/* Policy */}
      <section className="policy-section">
        <div className="container">
          <h2>Quality, Environmental, Health and Safety Policy</h2>
          <div className="policy-grid">
            {[
              "Environment",
              "Improvement",
              "Biodiversity",
              "Health & Safety",
              "Participation",
              "Standards",
            ].map((title, idx) => (
              <ParallaxItem key={idx}>
                <div className="policy-item">
                  <h3>{title}</h3>
                  <p>Short description for {title} policy.</p>
                </div>
              </ParallaxItem>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutUs;

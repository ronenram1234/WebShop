import { FunctionComponent } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUsers,
  faChartLine,
  faHandshake,
  faLeaf,
  faShieldAlt,
  faLightbulb,
  faPhone,
  faMapMarkerAlt,
} from "@fortawesome/free-solid-svg-icons";

interface Props {}

const AboutUs: FunctionComponent<Props> = () => {
  return (
    <div className="about-us-container">
      {/* Hero Section */}
      <section className="about-hero">
        <div className="hero-image">
          <img
            src="aboutus.jpg"
            alt="TinkerTech Team"
            className="img-fluid rounded-0"
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

      {/* Mission Statement */}
      <section className="mission-section">
        <div className="container">
          <h2>Our Mission</h2>
          <p className="mission-statement">
            TinkerTech strives to be the IT management support system that
            customers can depend on, using our data security, environmental,
            health, and safety principles as the core foundation for everything
            we do.
          </p>
        </div>
      </section>

      {/* Core Values */}
      <section className="values-section">
        <div className="container">
          <h2>Our Core Values</h2>
          <div className="values-grid">
            <div className="value-card">
              <FontAwesomeIcon icon={faShieldAlt} className="value-icon" />
              <h3>Security</h3>
              <p>
                Protecting your data with industry-leading security measures
              </p>
            </div>
            <div className="value-card">
              <FontAwesomeIcon icon={faLeaf} className="value-icon" />
              <h3>Sustainability</h3>
              <p>Committed to eco-friendly IT asset management</p>
            </div>
            <div className="value-card">
              <FontAwesomeIcon icon={faHandshake} className="value-icon" />
              <h3>Partnership</h3>
              <p>Building lasting relationships with our clients</p>
            </div>
            <div className="value-card">
              <FontAwesomeIcon icon={faLightbulb} className="value-icon" />
              <h3>Innovation</h3>
              <p>Continuously improving our processes and services</p>
            </div>
          </div>
        </div>
      </section>

      {/* Policy Section */}
      <section className="policy-section">
        <div className="container">
          <h2>Quality, Environmental, Health and Safety Policy</h2>
          <div className="policy-grid">
            <div className="policy-item">
              <h3>Environment</h3>
              <p>
                Environment-friendly practices guide our approach to managing
                end-of-life electronic assets.
              </p>
            </div>
            <div className="policy-item">
              <h3>Improvement</h3>
              <p>
                We are committed to continuous improvement across all
                operational areas.
              </p>
            </div>
            <div className="policy-item">
              <h3>Biodiversity</h3>
              <p>
                Responsible recycling protects vital ecosystems and supports
                global biodiversity.
              </p>
            </div>
            <div className="policy-item">
              <h3>Health & Safety</h3>
              <p>
                Health and safety are foundational in all workplace conditions
                we provide.
              </p>
            </div>
            <div className="policy-item">
              <h3>Participation</h3>
              <p>
                Inclusive teamwork encourages meaningful participation in
                sustainability decisions.
              </p>
            </div>
            <div className="policy-item">
              <h3>Standards</h3>
              <p>
                We comply with environmental, health, and legal standards at
                every level.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="contact-section">
        <div className="container">
          <h2>Get in Touch</h2>
          <p>
            Ready to discuss your IT asset management needs? Contact us today.
          </p>
          <div className="contact-info">
            <div className="contact-item">
              <FontAwesomeIcon icon={faPhone} className="contact-icon" />
              <p>613-222-3456</p>
            </div>
            <div className="contact-item">
              <FontAwesomeIcon icon={faMapMarkerAlt} className="contact-icon" />
              <p>5530 Windward Pkwy, Alpharetta, GA 30004, United States</p>
            </div>
          </div>
          <button className="contact-btn">Contact Us</button>
        </div>
      </section>

      {/* Map Section */}
      <section className="map-section">
        <div className="map-container">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3307.6750797489584!2d-84.2816247!3d34.0485566!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x88f57584bd57b43d%3A0x33e34c523398d59a!2s5530%20Windward%20Pkwy%2C%20Alpharetta%2C%20GA%2030004!5e0!3m2!1sen!2sus!4v1680978456789!5m2!1sen!2sus"
            width="100%"
            height="400"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="TinkerTech Location"
          ></iframe>
        </div>
      </section>
    </div>
  );
};

export default AboutUs;

import { FunctionComponent } from "react";
// import { Carousel } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import HomeCarousel from "./HomeCarousel";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faServer,
  faFileAlt,
  faRecycle,
} from "@fortawesome/free-solid-svg-icons";

const Home: FunctionComponent = () => {
  return (
    <>
      <HomeCarousel />;
      <div className="home-container">
        {/* Top Section */}
        <div className="sustainability-section">
          <div className="sustainability-text">
            <h1>
              Maximize Sustainability through
              <br />
              Prolonged Use of IT Hardware
            </h1>
          </div>
          <div className="sustainability-content">
            <p>
              Our ongoing mission is to extend the useful life of IT assets and
              encourage a sustainable future. We strive to achieve this by
              offering certified, cost-effective, and eco-conscious IT asset
              disposition (ITAD) and refurbished hardware services.
            </p>
            <div className="sustainability-label">
              IMPROVE YOUR GREEN FOOTPRINT
            </div>
          </div>
        </div>

        {/* Environmental Impact Section */}
      </div>
      <div className="impact-section">
        <h2 className="impact-title">4.95 Million KG of CO2 Reduced</h2>
        <div className="impact-stats">
          <div className="impact-item">
            <h3>Equivalent to 500+ Global Circuits</h3>
            <p>
              Comparable to driving a typical car for over 20 million kilometers
              — enough distance to circle the planet <strong>500+ times</strong>
              .
            </p>
          </div>
          <div className="impact-item">
            <h3>Decades of Continuous Driving</h3>
            <p>Similar to driving non-stop at 100 km/h for over two decades.</p>
          </div>
          <div className="impact-item">
            <h3>Millions of Device Charges</h3>
            <p>
              Equivalent to supplying energy for 1,800 households annually or
              <strong> charging millions of smartphones.</strong>
            </p>
          </div>
        </div>
        <p className="impact-note">
          These impressive numbers reflect the positive environmental impact
          achieved in 2024. Our validated data underlines the contribution
          toward a more sustainable future.
        </p>
      </div>
      <div className="third-section">
        <div className="third-content">
          <h1>Stay updated and upgraded</h1>
          <p>
            Inside Systems champions a sustainable IT management philosophy by
            adhering to the principle of{" "}
            <strong>"If it ain't broken, don't fix it"</strong> — rejecting the
            industry trend of planned obsolescence.
          </p>
          <p>
            We extend the lifespan of IT assets beyond manufacturer warranties,
            offering a cost-effective solution that avoids unnecessary upgrades.
            This approach not only maximizes the utility of technology
            investments but also significantly reduces e-waste, aligning with
            global sustainability goals.
          </p>
          <p>
            By focusing on maintaining existing IT assets, Inside Systems
            promotes both economic and environmental sustainability, positioning
            itself as a leader in ethical IT asset management.
          </p>
        </div>

        <div className="third-icons">
          {/* Smarter IT Management */}
          <div className="icon-item">
            <FontAwesomeIcon icon={faServer} className="icon-style fa-spin" />
            <div className="icon-text">
              <h3>Smarter IT Management</h3>
              <p>
                Keep systems in peak performance affordably by avoiding
                unnecessary upgrades. This cost-effective approach extends
                equipment life and reduces waste.
              </p>
            </div>
          </div>

          {/* Secure Data Erasure */}
          <div className="icon-item">
            <FontAwesomeIcon icon={faFileAlt} className="icon-style fa-pulse" />
            <div className="icon-text">
              <h3>Secure Data Erasure</h3>
              <p>
                Ensure data security, ensuring total information destruction —
                compliance with NIST SP 800-88r1 standards.
              </p>
            </div>
          </div>

          {/* Certified IT Hardware Recycling */}
          <div className="icon-item">
            <FontAwesomeIcon icon={faRecycle} className="icon-style fa-spin" />
            <div className="icon-text">
              <h3>Certified IT Hardware Recycling</h3>
              <p>
                A strict zero-landfill policy, ensuring all disposed IT assets
                are repurposed, reused, or recycled — compliant with ISO 14001
                and 17025.
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;

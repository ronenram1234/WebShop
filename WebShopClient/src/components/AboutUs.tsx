import { FunctionComponent } from "react";

interface Props {}

const AboutUs: FunctionComponent<Props> = () => {
  return (
    <>
      <div className="container py-5">
        <h2 className="text-center fw-bold mb-4">ABOUT US</h2>

        <div className="mb-4">
          <h5>
            <strong>TinkerTech </strong>{" "}
          </h5>
          <ol>
            <li>
              A large stone at the top of an arch that locks the other stones in
              place.
            </li>
            <li>Something on which other things depend for support</li>
          </ol>
          <p>
            TinkerTech strives to be the IT management support system that
            customers can depend on, using our data security, environmental,
            health, and safety principles as the core foundation for everything
            we do.
          </p>
        </div>

        {/* 🔻 Image as separator */}
        <div className="text-center my-5">
          <img
            src="aboutus.jpg"
            alt="Nature"
            className="img-fluid rounded shadow"
            style={{ maxHeight: "500px", objectFit: "cover" }}
          />
        </div>

        {/* 🔻 Policy section below image */}
        <div className="text-start">
          <h4 className="fw-semibold mb-3">
            Quality, Environmental, Health and Safety Policy
          </h4>
          <p>
            <strong>TinkerTech is committed to:</strong>
          </p>
          <ul className="list-group list-group-flush">
            <li className="list-group-item">
              <span className="fw-bold">Environment</span>-friendly practices
              guide our approach to managing end-of-life electronic assets.
            </li>
            <li className="list-group-item">
              We are committed to continuous{" "}
              <span className="fw-bold">improvement</span> across all
              operational areas.
            </li>
            <li className="list-group-item">
              Responsible recycling protects vital ecosystems and supports
              global <span className="fw-bold">biodiversity</span>.
            </li>
            <li className="list-group-item">
              <span className="fw-bold">Health</span> and safety are
              foundational in all workplace conditions we provide.
            </li>
            <li className="list-group-item">
              Inclusive teamwork encourages meaningful{" "}
              <span className="fw-bold">participation</span> in sustainability
              decisions.
            </li>
            <li className="list-group-item">
              We comply with environmental, health, and legal{" "}
              <span className="fw-bold">standards</span> at every level.
            </li>
            <li className="list-group-item">
              <span className="fw-bold">Goals</span> are established and
              reviewed to guide our quality and safety progress.
            </li>
            <li className="list-group-item">
              We minimize waste by promoting reuse and responsible{" "}
              <span className="fw-bold">disposal</span> of electronics.
            </li>
            <li className="list-group-item">
              Our system ensures focus materials are ethically handled from
              start to <span className="fw-bold">completion</span>.
            </li>
            <li className="list-group-item">
              <span className="fw-bold">Monitoring</span> helps us evaluate
              progress and fuel continuous improvement.
            </li>
            <li className="list-group-item">
              We clearly communicate our values to clients, partners, and{" "}
              <span className="fw-bold">stakeholders</span>.
            </li>
          </ul>
        </div>
      </div>
    </>
  );
};

export default AboutUs;

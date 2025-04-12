import { FunctionComponent, useContext } from "react";
import { Container, Row, Col } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCircleInfo,
  faHeart,
  faShoppingCart,
  faEnvelope,
} from "@fortawesome/free-solid-svg-icons";

import "bootstrap/dist/css/bootstrap.min.css";
import { useNavigate } from "react-router-dom";
import { GlobalProps } from "../context/GlobalContext";

const Footer: FunctionComponent = () => {
  const navigate = useNavigate();
  const { setSearchString, currentUser } = useContext(GlobalProps);

  function init(): void {
    setSearchString(""); // Reset the searchString state
  }

  return (
    <footer className="bg-dark text-light py-4 fixed-bottom">
      <Container>
        <Row className="d-flex justify-content-center">
          <Col xs="auto">
            <FontAwesomeIcon
              icon={faCircleInfo}
              onClick={() => {
                navigate(`/about`);
                init();
              }}
              title="About"
              size="2x"
              className="mx-2"
            />
          </Col>
          {currentUser && (
            <>
              <Col xs="auto">
                <FontAwesomeIcon
                  icon={faHeart}
                  onClick={() => {
                    navigate(`/favcards`);
                    init();
                  }}
                  title="Favorites"
                  size="2x"
                  className="mx-2"
                />
              </Col>
              <Col xs="auto">
                <FontAwesomeIcon
                  icon={faShoppingCart}
                  onClick={() => {
                    navigate(`/cart`);
                    init();
                  }}
                  title="Cart"
                  size="2x"
                  className="mx-2"
                />
              </Col>
            </>
          )}
          <Col xs="auto">
            <FontAwesomeIcon
              icon={faEnvelope}
              onClick={() => {
                navigate(`/contact`);
                init();
              }}
              title="Contact"
              size="2x"
              className="mx-2"
            />
          </Col>
        </Row>
      </Container>
    </footer>
  );
};

export default Footer;

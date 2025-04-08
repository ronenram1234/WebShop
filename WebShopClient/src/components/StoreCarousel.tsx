import { FunctionComponent } from "react";
import { Card, Carousel } from "react-bootstrap";
import { Logo } from "../interfaces/Logo";
import LazyImage from "./LazyImage";

interface StoreCarouselProps {
  logos: Logo[];
  getLogoUrl: (fileName: string) => Promise<string>;
}

const StoreCarousel: FunctionComponent<StoreCarouselProps> = ({
  logos,
  getLogoUrl,
}) => {
  const chunkedLogos = Array.from(
    { length: Math.ceil(logos.length / 4) },
    (_, i) => logos.slice(i * 4, i * 4 + 4)
  );

  const customPrevIcon = (
    <div className="carousel-nav-button prev">
      <span className="carousel-control-prev-icon" />
    </div>
  );

  const customNextIcon = (
    <div className="carousel-nav-button next">
      <span className="carousel-control-next-icon" />
    </div>
  );

  return (
    <div className="container mt-4 store-carousel-container">
      <Carousel
        interval={null}
        indicators={false}
        prevIcon={customPrevIcon}
        nextIcon={customNextIcon}
        className="store-carousel"
      >
        {chunkedLogos.map((logoGroup, groupIndex) => (
          <Carousel.Item key={groupIndex}>
            <div className="d-flex justify-content-around">
              {logoGroup.map((logo, index) => (
                <Card key={index} className="store-card">
                  <Card.Body>
                    <Card.Title className="store-card-title">
                      {logo.brand}
                    </Card.Title>
                  </Card.Body>
                  <LazyImage
                    fileName={logo.fileName}
                    brand={logo.brand}
                    getImageUrl={getLogoUrl}
                    className="store-card-image"
                  />
                </Card>
              ))}
            </div>
          </Carousel.Item>
        ))}
      </Carousel>
    </div>
  );
};

export default StoreCarousel;

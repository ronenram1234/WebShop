import { FunctionComponent } from "react";
import { Carousel } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";

// interface Props {

// }

// const : FunctionComponent<Props> = () => {
const HomeCarousel: FunctionComponent = () => {
  return (
    <>
      <Carousel
        interval={4000}
        pause={false}
        indicators={false}
        prevIcon={null}
        nextIcon={null}
        fade
      >
        {/* Slide 1 */}
        <Carousel.Item className="custom-caption">
          <video
            className="d-block w-100 block-home"
            src="/mov1.mp4"
            autoPlay
            loop
            muted
            playsInline
            preload="auto"
          />
          <Carousel.Caption className="custom-caption">
            <h2 className="carousel-text">FULLY TESTED</h2>
            <h1 className="carousel-title">MEMORY AND CPUS</h1>
            <p className="carousel-text-small">NEW AND USED</p>
          </Carousel.Caption>
        </Carousel.Item>

        {/* Slide 2 */}
        <Carousel.Item className="custom-caption">
          <video
            className="d-block w-100 block-home"
            src="/mov2.mp4"
            autoPlay
            loop
            muted
            playsInline
          />
          <Carousel.Caption className="custom-caption">
            <h2 className="carousel-text">EXCESS INVENTORY?</h2>
            <h1 className="carousel-title">SELL US EQUIPMENT</h1>
            <p className="carousel-text-small">WE BUY RAM AND CPUS</p>
          </Carousel.Caption>
        </Carousel.Item>

        {/* Slide 3 */}
        <Carousel.Item className="custom-caption">
          <video
            className="d-block w-100 block-home"
            src="/mov3.mp4"
            autoPlay
            loop
            muted
            playsInline
          />
          <Carousel.Caption className="custom-caption">
            <h2 className="carousel-text">LOOKING TO BUY?</h2>
            <h1 className="carousel-title">VISIT US ON EBAY!</h1>
            <p className="carousel-text-small">MOST ITEMS SHIP FREE</p>
          </Carousel.Caption>
        </Carousel.Item>

        {/* Slide 4 */}
        <Carousel.Item className="custom-caption">
          <video
            className="d-block w-100 block-home"
            src="/mov4.mp4"
            autoPlay
            loop
            muted
            playsInline
          />
          <Carousel.Caption className="custom-caption">
            <h2 className="carousel-text">FULLY TESTED</h2>
            <h1 className="carousel-title">MEMORY AND CPUS</h1>
            <p className="carousel-text-small">NEW AND USED</p>
          </Carousel.Caption>
        </Carousel.Item>

        {/* Slide 5 */}
        <Carousel.Item className="custom-caption">
          <video
            className="d-block w-100 block-home"
            src="/mov5.mp4"
            autoPlay
            loop
            muted
            playsInline
          />
          <Carousel.Caption className="custom-caption">
            <h2 className="carousel-text">EXCESS INVENTORY?</h2>
            <h1 className="carousel-title">SELL US EQUIPMENT</h1>
            <p className="carousel-text-small">WE BUY RAM AND CPUS</p>
          </Carousel.Caption>
        </Carousel.Item>

        {/* Slide 6 */}
        <Carousel.Item className="custom-caption">
          <video
            className="d-block w-100 block-home"
            src="/mov6.mp4"
            autoPlay
            loop
            muted
            playsInline
          />
          <Carousel.Caption className="custom-caption">
            <h2 className="carousel-text">LOOKING TO BUY?</h2>
            <h1 className="carousel-title">VISIT US ON EBAY!</h1>
            <p className="carousel-text-small">MOST ITEMS SHIP FREE</p>
          </Carousel.Caption>
        </Carousel.Item>
      </Carousel>
    </>
  );
};

export default HomeCarousel;

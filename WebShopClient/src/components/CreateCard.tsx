import { FunctionComponent, useContext, useEffect, useState } from "react";
import { CardRecFull } from "../interfaces/Card";

import Card from "react-bootstrap/Card";
import ListGroup from "react-bootstrap/ListGroup";
import Col from "react-bootstrap/Col";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCopy,
  faHeart,
  faPenToSquare,
  faPhone,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";
import { faHeart as faRegularHeart } from "@fortawesome/free-regular-svg-icons"; // Regular heart icon

import { GlobalProps } from "../context/GlobalContext";
import { deleteCard, setLikeDislike } from "../services/cardServices";

import { useNavigate } from "react-router-dom";
import { errorMsg, successMsg } from "../services/feedbackService";
import Swal from "sweetalert2";

interface CreateCardProps {
  item: CardRecFull;
  ind: number;
  originScreen: string;
}

const CreateCard: FunctionComponent<CreateCardProps> = ({
  item,
  ind,
  originScreen,
}) => {
  const navigate = useNavigate();
  const {
    currentUser,
    token,
    cardArray,
    setCardArray,
    isDarkMode,
    imageError,
    setImageError,
  } = useContext(GlobalProps);
  const [address, setAddress] = useState<string>(
    `${item.address.street} ${item.address.houseNumber}, ${item.address.city},  ${item.address.country}, ${item.address.zip}`
  );

  const [imgError, setImgError] = useState<boolean>(false);
  const [isHeartSelected, setIsHeartSelected] = useState(
    item.likes?.includes(currentUser?._id || "")
  );

  useEffect(() => {
    setIsHeartSelected(item.likes?.includes(currentUser?._id || ""));
  }, [currentUser?._id, item.likes]);

  // Handle image error
  const handleImageError = () => {
    !imageError.includes(item._id) && imageError.push(item._id);
    setImageError(imageError);

    setImgError(true);
  };

  const handleHeartClick = (id: string) => {
    setLikeDislike(id, token)
      .then((res) => {
        setIsHeartSelected((prev) => !prev);
        let dbRec: CardRecFull = res.data;
        const updatedCardArray =
          cardArray?.map((rec) => {
            if (item._id === rec._id) {
              return { ...rec, likes: dbRec.likes };
            }
            return rec;
          }) || [];
        setCardArray(updatedCardArray);
      })
      .catch((err) => {
        errorMsg("Error updating like status");
      });
  };

  function handleTrashClick(bizNumber: number, token: string, cardId: string) {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        deleteCard(bizNumber, token, cardId)
          .then((res) => {
            successMsg("Card deleted successfully!");
            if (cardArray !== null)
              setCardArray(cardArray.filter((card) => card._id !== cardId));
          })
          .catch((error) => {
            errorMsg("Error deleting card");
          });
      }
    });
  }

  function handleEditClick(item: CardRecFull) {
    // Temporarily disable edit functionality since the route no longer exists
    errorMsg("Edit functionality is currently unavailable");
  }

  function handleNewFromCurrentClick(item: CardRecFull) {
    // Temporarily disable copy functionality since the route no longer exists
    errorMsg("Copy functionality is currently unavailable");
  }

  function handleCardClick() {
    // Temporarily disable card details view since the route no longer exists
    errorMsg("Card details view is currently unavailable");
  }

  const handleError = (err: any) => {
    setError(err.message || "An error occurred");
  };

  const handleValidationError = (error: any) => {
    setError(error.message || "Validation failed");
  };

  return (
    <>
      <Col key={ind}>
        <Card
          className={`h-100 ${
            isDarkMode ? "bg-dark text-light" : "bg-light text-dark"
          }`}
        >
          <Card.Img
            variant="top"
            src={
              imgError ? "image_error_replacment_picture.jpg" : item.image.url
            }
            alt={item.image.alt}
            className="image"
            onError={handleImageError}
          />
          <Card.Body className="card-body">
            <Card.Title>{item.title}</Card.Title>
            <Card.Text>{item.description}</Card.Text>
            <Card.Text></Card.Text>
          </Card.Body>
          <ListGroup className="list-group-flush">
            <ListGroup.Item>phone: {item.phone}</ListGroup.Item>
            <ListGroup.Item>Address: {address}</ListGroup.Item>
            <ListGroup.Item>Card Number: {item._id}</ListGroup.Item>
          </ListGroup>
          <Card.Body className="icons">
            <>
              <FontAwesomeIcon
                icon={faPhone}
                title="Call Number - will ve develop in the future"
              />

              {/* {console.log(isHeartSelected)} */}
              {isHeartSelected ? (
                <FontAwesomeIcon
                  icon={faHeart}
                  onClick={() => handleHeartClick(item._id)}
                  title="Likes/Dislike"
                />
              ) : (
                <FontAwesomeIcon
                  icon={faRegularHeart}
                  onClick={() => handleHeartClick(item._id)}
                  title="Likes/Dislike"
                />
              )}

              {(currentUser?.isAdmin ||
                (currentUser?.isRegisterUser &&
                  originScreen === "Mycards")) && (
                <>
                  <FontAwesomeIcon
                    icon={faPenToSquare}
                    onClick={() => {
                      if (item.bizNumber !== undefined) handleEditClick(item);
                    }}
                    title="Edit card"
                  />

                  <FontAwesomeIcon
                    icon={faCopy}
                    onClick={() => {
                      if (item.bizNumber !== undefined)
                        handleNewFromCurrentClick(item);
                    }}
                    title="Copy card to create new one"
                  />

                  <FontAwesomeIcon
                    icon={faTrash}
                    onClick={() => {
                      if (item.bizNumber !== undefined)
                        handleTrashClick(item.bizNumber, token, item._id);
                    }}
                    title="Delete card"
                  />
                </>
              )}
            </>
          </Card.Body>
          <Card.Footer>
            <div className="d-flex justify-content-center">
              <button
                className="btn btn-info"
                onClick={() => handleCardClick()}
              >
                Additional Details
              </button>
            </div>
          </Card.Footer>
        </Card>
      </Col>
    </>
  );
};

export default CreateCard;

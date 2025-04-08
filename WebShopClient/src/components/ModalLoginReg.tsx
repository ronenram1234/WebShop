import { FunctionComponent, useContext, useState, useEffect } from "react";
import { Modal } from "react-bootstrap";
import Login from "./Login";
import { GlobalProps } from "../context/GlobalContext";
import Register from "./Register";

interface ModalLoginRegProps {
  onClose?: () => void;
  show?: boolean;
}

const ModalLoginReg: FunctionComponent<ModalLoginRegProps> = ({
  onClose,
  show = true,
}) => {
  const { isUserLogedin } = useContext(GlobalProps);
  const [isRegister, setIsRegister] = useState(false);

  // Reset to login screen whenever modal is shown
  useEffect(() => {
    if (show) {
      setIsRegister(false);
    }
  }, [show]);

  return (
    <>
      <Modal
        show={show && !isUserLogedin}
        onHide={onClose}
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
        className="auth-modal"
      >
        <Modal.Header closeButton className="border-0 pb-0">
          <Modal.Title
            id="contained-modal-title-vcenter"
            className="w-100 text-center"
          >
            <div className="auth-header">
              <img
                src="/card.jpg"
                alt="TinkerTech Logo"
                className="auth-logo"
              />
              <h2 className="mt-3">
                {isRegister ? "Create Account" : "Welcome Back"}
              </h2>
              <p className="text-muted">
                {isRegister
                  ? "Join our community of tech enthusiasts"
                  : "Sign in to access your account"}
              </p>
            </div>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="px-4 pt-0">
          {isRegister ? (
            <Register setIsRegister={setIsRegister} />
          ) : (
            <Login setIsRegister={setIsRegister} />
          )}
        </Modal.Body>
      </Modal>
    </>
  );
};

export default ModalLoginReg;

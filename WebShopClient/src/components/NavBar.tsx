import { FunctionComponent, useContext, useState } from "react";
import { NavigateFunction, NavLink, useNavigate } from "react-router-dom";
import { GlobalProps } from "../context/GlobalContext";
import ModalLoginReg from "./ModalLoginReg";

const NavBar: FunctionComponent = () => {
  const { currentUser, isDarkMode, setIsDarkMode } = useContext(GlobalProps);
  const navigate: NavigateFunction = useNavigate();
  const [showLoginModal, setShowLoginModal] = useState(false);

  function handleDark() {
    setIsDarkMode(!isDarkMode);
  }

  return (
    <>
      <div className="company-header">
        <div className="container-fluid header-container">
          <div className="company-info">
            <img src="/card.jpg" alt="Card Image" id="store-logo" />
            <span className="company-name">TinkerTech</span>
          </div>
        </div>
      </div>

      <nav
        className="navbar navbar-expand-lg bg-primary text-light"
        data-bs-theme="dark"
      >
        <div className="container-fluid">
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarSupportedContent"
            aria-controls="navbarSupportedContent"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarSupportedContent">
            <ul className="navbar-nav me-auto mb-2 mb-lg-0">
              <li className="nav-item">
                <NavLink className="nav-link custom-link" to="/home">
                  HOME
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink className="nav-link custom-link" to="/selltous">
                  SELL TO US
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink className="nav-link custom-link" to="/aboutus">
                  ABOUT US
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink
                  className="nav-link custom-link"
                  to="/storeproductscards"
                >
                  STORE
                </NavLink>
              </li>

              {currentUser && (
                <>
                  <li>
                    <NavLink className="nav-link custom-link" to="/favcards">
                      FAVORITE
                    </NavLink>
                  </li>
                  <li>
                    <NavLink className="nav-link custom-link" to="/cart">
                      CART
                    </NavLink>
                  </li>
                </>
              )}

              {currentUser?.isAdmin && (
                <li className="nav-item dropdown">
                  <a
                    className="nav-link custom-link dropdown-toggle"
                    href="#"
                    id="sandboxDropdown"
                    role="button"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                    onClick={(e) => e.preventDefault()}
                  >
                    SANDBOX
                  </a>
                  <ul
                    className="dropdown-menu"
                    aria-labelledby="sandboxDropdown"
                  >
                    <li>
                      <NavLink
                        className="dropdown-item"
                        to="/sandbox/adminusers"
                      >
                        All Users
                      </NavLink>
                    </li>

                    <li>
                      <NavLink
                        className="dropdown-item"
                        to="/sandbox/adminproducts"
                      >
                        All Products
                      </NavLink>
                    </li>
{/* 
                    <li>
                      <NavLink
                        className="dropdown-item"
                        to="/sandbox/adminstats"
                      >
                        Admin Dashboard
                      </NavLink>
                    </li> */}
                    <li>
                      <NavLink
                        className="dropdown-item"
                        to="/sandbox/adminfavorites"
                      >
                        All Favorites
                      </NavLink>
                    </li>
                    <li>
                      <NavLink
                        className="dropdown-item"
                        to="/sandbox/admincart"
                      >
                        All Cart Items
                      </NavLink>
                    </li>
                  </ul>
                </li>
              )}
            </ul>

            <div className="d-flex align-items-center">
              {currentUser ? (
                <div className="d-flex align-items-center">
                  <span className="text-light me-3">
                    Welcome {currentUser.name?.first || "User"}
                  </span>
                  <button
                    className="btn btn-outline-info me-3"
                    onClick={() => {
                      localStorage.removeItem("crmUserId");
                      navigate("/");
                      window.location.reload(); // Force reload to update the state
                    }}
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <div className="d-flex">
                  <button
                    className="btn btn-outline-info me-3"
                    onClick={() => setShowLoginModal(true)}
                  >
                    Login / Register
                  </button>
                </div>
              )}

              {isDarkMode ? (
                <i
                  className="fa-solid fa-moon"
                  onClick={handleDark}
                  style={{ width: "10px", margin: "10px", color: "black" }}
                ></i>
              ) : (
                <i
                  className="fa-solid fa-sun"
                  onClick={handleDark}
                  style={{ width: "10px", margin: "10px", color: "white" }}
                ></i>
              )}
            </div>
          </div>
        </div>
      </nav>

      <ModalLoginReg
        show={showLoginModal}
        onClose={() => setShowLoginModal(false)}
      />
    </>
  );
};

export default NavBar;

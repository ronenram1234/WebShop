import { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import "./App.css";
import NavBar from "./components/NavBar";

import PageNotFound from "./components/PageNotFound";
import Footer from "./components/Footer";

import { User } from "./interfaces/User";
import { Jwt } from "./interfaces/Jwt";

import {
  getTokenLocalStorage,
  getUserDetail,
  removeTokenLocalStorage,
  tokenToDecoode,
} from "./services/userServices";

import { GlobalProps, GlobalPropsType } from "./context/GlobalContext";

import About from "./components/About";
import FavCards from "./components/FavCards";

import AdminUsers from "./components/AdminUsers";
import AdminCustomerRequests from "./components/AdminCustomerRequests";

import CartTable from "./components/CartTable";
import AdminProducts from "./components/AdminProducts";
import AdminFavorites from "./components/AdminFavorites";
import AdminCart from "./components/AdminCart";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Home from "./components/Home";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import SellToUs from "./components/SellToUs";
import AboutUs from "./components/AboutUs";
import Contact from "./components/Contact";

import { errorMsg } from "./services/feedbackService";
import StoreProductsCards from "./components/StoreProductsCards";
import { Logo } from "./interfaces/Logo";
import { getAllLogos, getLogoFile } from "./services/getLogos";

function App() {
  const localToken = getTokenLocalStorage() || "";
  const [logos, setLogos] = useState<Logo[]>([]);
  const [imageUrls, setImageUrls] = useState<{ [key: string]: string }>({});
  const [isLoading, setIsLoading] = useState(true);
  const [token, setToken] = useState(localToken);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [searchString, setSearchString] = useState("");
  const [sort, setSort] = useState("");
  const [imageError, setImageError] = useState<string[]>([]);
  const [addressError, setAddressError] = useState<string[]>([]);
  const [isUserLogedin, setIsUsserLogedin] = useState(localToken !== "");

  const globalContextValue: GlobalPropsType = {
    isUserLogedin,
    setIsUsserLogedin,
    token,
    setToken,
    currentUser,
    setCurrentUser,
    isDarkMode,
    setIsDarkMode,
    searchString,
    setSearchString,
    sort,
    setSort,
    imageError,
    setImageError,
    addressError,
    setAddressError,
    logos,
    imageUrls,
  };

  useEffect(() => {
    const checkAuth = async () => {
      try {
        if (localToken) {
          const jwtUser: Jwt = tokenToDecoode(localToken);
          const userData = await getUserDetail(jwtUser._id, localToken);
          setCurrentUser(userData.data);
          setIsUsserLogedin(true);
        } else {
          setCurrentUser(null);
          setIsUsserLogedin(false);
        }
      } catch (error) {
        console.error("Auth check failed:", error);
        removeTokenLocalStorage();
        setCurrentUser(null);
        setIsUsserLogedin(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, [localToken]);

  useEffect(() => {
    document.body.classList.toggle("dark-mode", isDarkMode);
    document.body.classList.toggle("light-mode", !isDarkMode);
  }, [isDarkMode]);

  useEffect(() => {
    const loadLogos = async () => {
      try {
        const response = await getAllLogos();
        setLogos(response.data);

        // Pre-load all images
        const urls: { [key: string]: string } = {};
        for (const logo of response.data) {
          if (logo.fileName) {
            try {
              const fileResponse = await getLogoFile(logo.fileName);
              const imageUrl = URL.createObjectURL(fileResponse.data);
              urls[logo.fileName] = imageUrl;
              // Preload image
              const img = new Image();
              img.src = imageUrl;
            } catch (error) {
              console.error(`Error loading logo file ${logo.fileName}:`, error);
            }
          }
        }
        setImageUrls(urls);
      } catch (error) {
        console.error("Error loading logos:", error);
        errorMsg("Failed to load banners");
      }
    };

    loadLogos();
  }, []);

  if (isLoading) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <GlobalProps.Provider value={globalContextValue}>
      <Router>
        <div className="App">
          <NavBar />
          <ToastContainer />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/home" element={<Home />} />
            <Route path="/selltous" element={<SellToUs />} />
            <Route path="/aboutus" element={<AboutUs />} />
            <Route
              path="/storeproductscards"
              element={<StoreProductsCards />}
            />
            <Route path="/contact" element={<Contact />} />
            <Route path="/about" element={<About />} />
            <Route path="/favcards" element={<FavCards />} />
            <Route path="/cart" element={<CartTable />} />
            <Route path="/sandbox">
              <Route path="adminusers" element={<AdminUsers />} />
              <Route path="adminproducts" element={<AdminProducts />} />
              <Route path="adminfavorites" element={<AdminFavorites />} />
              <Route path="admincart" element={<AdminCart />} />
              <Route
                path="admincustomerrequests"
                element={<AdminCustomerRequests />}
              />
            </Route>

            <Route path="*" element={<PageNotFound />} />
          </Routes>
          <Footer />
        </div>
      </Router>
    </GlobalProps.Provider>
  );
}

export default App;

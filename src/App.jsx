import { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Navbar from "./component/Navbar";
import Home from "./component/Home";
import Shop from "./component/Shop";
import Footer from "./component/Footer";
import ProductDetail from "./component/ProductDetail";
import ViewCart from "./component/ViewCart";
import CheckOut from "./component/CheckOut";
import Invocie from "./component/Invocie";
import InvoiceBill from "./component/InvoiceBill";
import toastr from "toastr";
import "toastr/build/toastr.min.css";
import Login from "./Hooks/Login";
import ScrollToTop from "./Hooks/ScrollToTop";
import Profile from "./component/Profile";
import Signup from "./component/Signup";
import Wishlist from "./component/Wishlist";
import AllBrands from "./component/AllBrands";
import BrandItem from "./component/BrandItem";
import WalletLedger from "./component/WalletLedger";
import OrderHistory from "./component/OrderHistory";
import "./Api/axiosSetup";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    return !!localStorage.getItem("customer_token");
  });

  const [refreshNavbar, setRefreshNavbar] = useState(false);

  const openLoginModal = () => {
    const modalEl = document.getElementById("deal-box");
    if (modalEl) {
      const modalInstance = new window.bootstrap.Modal(modalEl);
      modalInstance.show();
    }
  };

  useEffect(() => {
    const handleStorageChange = () => {
      const token = localStorage.getItem("customer_token");
      setIsLoggedIn(!!token);
    };

    window.addEventListener("storage", handleStorageChange);
    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  return (
    <BrowserRouter>
      <Navbar
        isLoggedIn={isLoggedIn}
        setIsLoggedIn={setIsLoggedIn}
        refreshNavbar={refreshNavbar}
        openLoginModal={openLoginModal}
      />
      <ScrollToTop />
      <Routes>
        <Route
          path="/"
          element={
            <Home
              isLoggedIn={isLoggedIn}
              openLoginModal={openLoginModal}
              setRefreshNavbar={setRefreshNavbar}
            />
          }
        />
        <Route
          path="/shop/category/:categoryId"
          element={
            <Shop
              isLoggedIn={isLoggedIn}
              setIsLoggedIn={setIsLoggedIn}
              refreshNavbar={refreshNavbar}
              openLoginModal={openLoginModal}
            />
          }
        />
        <Route
          path="/shop/subcategorycategory/:subcategoryId"
          element={
            <Shop
              isLoggedIn={isLoggedIn}
              setIsLoggedIn={setIsLoggedIn}
              refreshNavbar={refreshNavbar}
              openLoginModal={openLoginModal}
              setRefreshNavbar={setRefreshNavbar}
            />
          }
        />
        <Route
          path="/shop/category/:categoryId/subcategory/:subcategoryId"
          element={
            <Shop
              isLoggedIn={isLoggedIn}
              setIsLoggedIn={setIsLoggedIn}
              setRefreshNavbar={setRefreshNavbar}
              refreshNavbar={refreshNavbar}
              openLoginModal={openLoginModal}
            />
          }
        />
        <Route
          path="/shop/brand/:brandId"
          element={
            <Shop
              isLoggedIn={isLoggedIn}
              setIsLoggedIn={setIsLoggedIn}
              refreshNavbar={refreshNavbar}
              openLoginModal={openLoginModal}
              setRefreshNavbar={setRefreshNavbar}
            />
          }
        />
        <Route
          path="/brand/:brandName/:brandId"
          element={
            <BrandItem
              isLoggedIn={isLoggedIn}
              setIsLoggedIn={setIsLoggedIn}
              refreshNavbar={refreshNavbar}
              openLoginModal={openLoginModal}
              setRefreshNavbar={setRefreshNavbar}
            />
          }
        />
        <Route
          path="/brand/:brandName/:brandId/subcategory/:subId"
          element={
            <BrandItem
              isLoggedIn={isLoggedIn}
              openLoginModal={openLoginModal}
              setRefreshNavbar={setRefreshNavbar}
            />
          }
        />
        <Route
          path="/shop/search"
          element={
            <Shop
              isLoggedIn={isLoggedIn}
              setIsLoggedIn={setIsLoggedIn}
              refreshNavbar={refreshNavbar}
              openLoginModal={openLoginModal}
            />
          }
        />
        <Route
          path="/product-detail/:id"
          element={
            <ProductDetail
              isLoggedIn={isLoggedIn}
              setIsLoggedIn={setIsLoggedIn}
              refreshNavbar={refreshNavbar}
              openLoginModal={openLoginModal}
              setRefreshNavbar={setRefreshNavbar}
            />
          }
        />
        <Route path="/view-cart" element={<ViewCart />} />
        <Route
          path="/view-wishlist"
          element={<Wishlist refreshNavbar={refreshNavbar} />}
        />
        <Route path="/view-brands" element={<AllBrands />} />
        <Route path="/checkout" element={<CheckOut />} />
        <Route path="/invoice/:id" element={<Invocie />} />
        <Route path="/invoice-bill/:id" element={<InvoiceBill />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/wallet-ledger" element={<WalletLedger />} />
        <Route path="/order-list" element={<OrderHistory />} />
        <Route path="/sign-up" element={<Signup />} />
        <Route
          path="*"
          element={<h2 className="text-center mt-5">404 - Page Not Found</h2>}
        />
      </Routes>

      <Login
        setIsLoggedIn={setIsLoggedIn}
        setRefreshNavbar={setRefreshNavbar}
        openLoginModal={openLoginModal} // pass modal opener
      />
      <Footer isLoggedIn={isLoggedIn} openLoginModal={openLoginModal} />
    </BrowserRouter>
  );
}

export default App;

import { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Navbar from "./component/Navbar";
import Home from "./component/Home";
import Shop from "./component/Shop";
import Footer from "./component/Footer";
import Login from "./Hooks/Login";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    return !!localStorage.getItem("customer_token");
  });

  const [refreshNavbar, setRefreshNavbar] = useState(0);

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
      />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/shop/category/:categoryId" element={<Shop key="category" />} />
        <Route path="/shop/subcategorycategory/:subcategoryId" element={<Shop key="subcategory" />} />
        <Route path="/shop/category/:categoryId/subcategory/:subcategoryId" element={<Shop />} />
        <Route path="/shop/brand/:brandId" element={<Shop />} />
        <Route path="/shop/search" element={<Shop />} />
        <Route path="*" element={<h2 className="text-center mt-5">404 - Page Not Found</h2>} />
      </Routes>
      <Login
        setIsLoggedIn={setIsLoggedIn}
        setRefreshNavbar={setRefreshNavbar}
      />
      <Footer />
    </BrowserRouter>
  );
}

export default App;

import { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Navbar from "./component/Navbar";
import Slider from "./component/Slider"; // optional here
import Home from "./component/Home";
import Shop from "./component/Shop";
import Footer from "./component/Footer";
import LoginModal from "./component/LoginModal";

function App() {
  const [showModal, setShowModal] = useState(false);

  return (
    <BrowserRouter>
      <Navbar onLoginClick={() => setShowModal(true)} />
      <LoginModal isOpen={showModal} onClose={() => setShowModal(false)} />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/shop" element={<Shop />} />
      </Routes>

      <Footer />
    </BrowserRouter>
  );
}

export default App;

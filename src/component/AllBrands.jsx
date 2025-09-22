import React, { useState, useEffect } from "react";
import axios from "axios";
import Carousel from "react-bootstrap/Carousel";  
import { toTitleCase } from "../Hooks/Helper";
import { LIVE_URL } from "../Api/Route";


export default function AllBrands() {
  const [brands, setBrands] = useState([]);
  const [filteredBrands, setFilteredBrands] = useState([]);
  const [activeLetter, setActiveLetter] = useState("A");
  const [slider, setSlider] = useState([]);

  // ✅ Fetch all brands
  const fetchBrands = async () => {
    try {
      const response = await axios.get(`${LIVE_URL}/get-brands`);
      let sortedBrands = (response.data.data || []).sort((a, b) =>
        a.name.localeCompare(b.name)
      );
      setBrands(sortedBrands);

      // Default show "A" brands
      const defaultBrands = sortedBrands.filter((brand) =>
        brand.name.toLowerCase().startsWith("a")
      );
      setFilteredBrands(defaultBrands);
    } catch (error) {
      console.error("Error fetching brands:", error);
    }
  };

  // ✅ Fetch brand slider
  const fetchSlider = async () => {
    try {
      const response = await axios.get(`${LIVE_URL}/get-brand-slider`);
      setSlider(response.data.data || []);
    } catch (error) {
      console.error("Error fetching brand slider:", error);
    }
  };

  useEffect(() => {
    fetchBrands();
    fetchSlider();
  }, []);

  // ✅ Filter brands by alphabet
  const handleFilter = (letter) => {
    setActiveLetter(letter);
    const filtered = brands.filter((brand) =>
      brand.name.toLowerCase().startsWith(letter.toLowerCase())
    );
    setFilteredBrands(filtered);
  };

  return (
    <>
      {/* Slider Section */}
      <section className="section-b-space">
        <div className="container-fluid">
          <div className="row">
            <Carousel
              data-bs-theme="dark"
              controls={false}
              indicators={false}
              interval={3000}
              pause={false}
            >
              {slider.length > 0 ? (
                slider.map((banner, index) => (
                  <Carousel.Item key={index}>
                    <img
                      className="d-block w-100"
                      src={`https://store.bulkbasketindia.com/sliders/${banner.image}`}
                      alt={`Brand Banner ${index + 1}`}
                    />
                  </Carousel.Item>
                ))
              ) : (
                <Carousel.Item>
                  <img
                    className="d-block w-100"
                    src="/assets/images/placeholder.jpg"
                    alt="Default Banner"
                  />
                </Carousel.Item>
              )}
            </Carousel>
          </div>
        </div>
      </section>

      {/* Brand Section */}
      <section className="blog-section section-b-space">
        <div className="container-fluid-lg">
          {/* A-Z Stylish Filter Bar */}
          <div className="alphabet-bar d-flex flex-wrap justify-content-center mb-5">
            {"ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("").map((letter) => (
              <div
                key={letter}
                className={`alphabet-item ${activeLetter === letter ? "active" : ""}`}
                onClick={() => handleFilter(letter)}
              >
                {letter}
              </div>
            ))}
          </div>

          {/* Brand Grid */}
          <div className="row g-4">
            <div className="col-12">
              <div className="row g-4 ratio_65">
                {filteredBrands.length > 0 ? (
                  filteredBrands.map((brand, index) => (
                    <div key={index} className="col-6 col-sm-4 col-md-3 col-lg-2">
                      <div className="blog-box wow fadeInUp text-center">
                        <div className="blog-image brand-fix-size">
                          <a href={`/brand/${brand.name.toLowerCase()}/${brand.id}`}>
                            <img
                              src={
                                brand.image
                                  ? `https://store.bulkbasketindia.com/master images/${brand.image}`
                                  : "/assets/images/default.png"
                              }
                              className="img-fluid blur-up lazyload"
                              alt={brand.name}
                            />
                          </a>
                        </div>
                        <div className="line-light"></div>
                        <div className="blog-contain mt-2">
                          <a href={`/brand/${brand.name.toLowerCase()}/${brand.id}`}>
                            <h6 className="text-truncate" style={{ color:"#477a37",fontWeight:"600" }}>{toTitleCase(brand.name)}</h6>
                          </a>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-center">No brands found</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* A-Z Filter CSS */}
      <style>{`
        .alphabet-item {
          cursor: pointer;
          margin: 5px 8px;
          padding: 6px 11px;
          font-weight: 600;
          border-radius: 8px;
          transition: all 0.3s ease;
          color: #333;
          background: #fff;
          user-select: none;
        }
        .alphabet-item:hover {
          background: #f1f1f1;
          transform: translateY(-2px);
        }
        .alphabet-item.active {
          background: #437a3a;
          color: #fff;
          border-color: #437a3a;
          transform: scale(1.05);
        }
      `}</style>
    </>
  );
}

import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { LIVE_URL } from "../Api/Route";

export default function AllBrands() {
  const [brands, setBrands] = useState([]);

  const fetchBrands = async () => {
    try {
      const response = await axios.get(`${LIVE_URL}/get-brands`);
      setBrands(response.data.data || []);
    } catch (error) {
      console.error("Error fetching brands:", error);
    }
  };

  useEffect(() => {
    fetchBrands();
  }, []);

  return (
    <>
      {/* Brand Section Start */}
      <section className="blog-section section-b-space">
        <div className="container-fluid-lg">
          <div className="row g-4">
            <div className="col-12">
              <div className="row g-4 ratio_65">
                {brands.length > 0 ? (
                  brands.map((brand, index) => (
                    <div key={index} className="col-2 col-sm-3 col-md-2">
                      <div className="blog-box wow fadeInUp text-center">
                        <div className="blog-image brand-fix-size">
                          <a href={`/shop/brand/${brand.id}`}>
                            <img
                              src={
                                brand.image
                                  ? `http://127.0.0.1:8000/master images/${brand.image}`
                                  : "/assets/images/default.png"
                              }
                              className="img-fluid blur-up lazyload"
                              alt={brand.name}
                            />
                          </a>
                        </div>
                        <div className="blog-contain mt-2">
                          <a href={`/shop/brand/${brand.id}`}>
                            <h6 className="text-truncate">{brand.name}</h6>
                          </a>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <p>No brands found</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* Brand Section End */}
    </>
  );
}

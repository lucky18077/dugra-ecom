import React, { useRef, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import Carousel from "react-bootstrap/Carousel";
import axios from "axios";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { toTitleCase } from "../Hooks/Helper";
import { LIVE_URL } from "../Api/Route";

export default function Home() {
  const [categories, setCategories] = useState([]);
  const [groupedCategories, setGroupedCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [dummyData, setDummyData] = useState([
    [
      {
        id: 1,
        name: "AMUL - FRENCH FRIES 9MM, 2.5KG",
        image: "/assets/images/deal.png",
        category: "EDIBLE OIL & FATS",
        quantity: 0,
        discount: 10,
      },
      {
        id: 2,
        name: "BALA JI - MASALA FRENCH FRIES, 1.5KG",
        image: "/assets/images/deal.png",
        category: "ATTA, MAIDA & FLOURS",
        quantity: 0,
        discount: 2,
      },
      {
        id: 3,
        name: "MCCAIN - POPULAR VEG BURGER TIKKI, 1.32KGS",
        image: "/assets/images/deal.png",
        category: "BAKERY ESSENTIALS",
        quantity: 0,
        discount: 8,
      },
      {
        id: 4,
        name: "SUN - PINK COLOUR LQD, 500ML",
        image: "/assets/images/deal.png",
        category: "EDIBLE OIL & FATS",
        quantity: 0,
        discount: 13,
      },
      {
        id: 5,
        name: "BUSH - KESRI COLOUR 100GM",
        image: "/assets/images/deal.png",
        category: "EDIBLE OIL & FATS",
        quantity: 0,
        discount: 19,
      },
      {
        id: 6,
        name: "RASPBERRY FROZEN, 1KG",
        image: "/assets/images/deal.png",
        category: "BAKERY ESSENTIALS",
        quantity: 0,
        discount: 2,
      },
    ],
    [
      {
        id: 7,
        name: "PILLSBURY - TEA TIME VANILLA PREMIX, 5KG",
        image: "/assets/images/deal.png",
        category: "DRY FRUITS, NUTS & CEREALS",
        quantity: 0,
        discount: 40,
      },
      {
        id: 8,
        name: "PILLSBURY - EGG FREE WAFFLE MIX, 1KG*16KG",
        image: "/assets/images/deal.png",
        category: "DRY FRUITS, NUTS & CEREALS",
        quantity: 0,
        discount: 20,
      },
    ],
  ]);

  const carouselRef = useRef(null);

  const chunkArray = (arr, size) => {
    const chunked = [];
    for (let i = 0; i < arr.length; i += size) {
      chunked.push(arr.slice(i, i + size));
    }
    return chunked;
  };

  const chunkedDummyData = chunkArray(dummyData.flat(), 4);

  const fetchCategories = async () => {
    try {
      const response = await axios.get(`${LIVE_URL}/get-category`);
      const categoryList = response.data.data || [];
      setCategories(categoryList);
      setGroupedCategories(chunkArray(categoryList, 18));
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const fetchBrands = async () => {
    try {
      const response = await axios.get(`${LIVE_URL}/get-brands`);
      setBrands(response.data.data || []);
    } catch (error) {
      console.error("Error fetching brands:", error);
    }
  };

  useEffect(() => {
    fetchCategories();
    fetchBrands();
  }, []);

  const groupedBrands = chunkArray(brands, 12);

  const handlePrev = () => carouselRef.current?.prev();
  const handleNext = () => carouselRef.current?.next();

  const handleAddToCart = (id) => {
    setDummyData((prev) =>
      prev.map((group) =>
        group.map((item) => (item.id === id ? { ...item, quantity: 1 } : item))
      )
    );
  };

  const increment = (id) => {
    setDummyData((prev) =>
      prev.map((group) =>
        group.map((item) =>
          item.id === id ? { ...item, quantity: item.quantity + 1 } : item
        )
      )
    );
  };

  const decrement = (id) => {
    setDummyData((prev) =>
      prev.map((group) =>
        group.map((item) =>
          item.id === id
            ? { ...item, quantity: Math.max(0, item.quantity - 1) }
            : item
        )
      )
    );
  };

  const updateQuantity = (id, qty) => {
    if (qty < 1 || isNaN(qty)) return;
    setDummyData((prev) =>
      prev.map((group) =>
        group.map((item) =>
          item.id === id ? { ...item, quantity: qty } : item
        )
      )
    );
  };

  return (
    <>
      {/* Top Banner */}
      <section
        style={{
          padding: 0,
          maxWidth: "1920px",
          margin: "0 auto",
        }}
      >
        <img
          src="/assets/images/banner-home-1.jpg"
          alt="Home Banner"
          style={{
            display: "block",
            width: "auto",
            height: "450px",
            maxWidth: "100%",
          }}
        />
      </section>

      {/* Category Section  */}
      <section className="section-b-space" style={{ backgroundColor: "#fff" }}>
        <div className="container-fluid-lg">
          <div className="row">
            <div className="col-xxl-12 col-lg-12">
              <div className="title d-block" style={{ marginBottom: "38px" }}>
                <h2 className="text-theme font-sm">SHOP BY CATEGORIES</h2>
                <p>A virtual assistant collects the products from your list</p>
              </div>
              {groupedCategories.map((group, i) => (
                <div
                  key={i}
                  className="row row-cols-xxl-6 row-cols-xl-4 row-cols-md-4 row-cols-2 g-sm-4 g-3 no-arrow section-b-space"
                >
                  {group.map((category, index) => (
                    <div key={index}>
                      <div className="product-box product-white-bg">
                        <div className="product-image" style={{ padding: "0" }}>
                          <Link to={`/shop/category/${category.id}`}>
                            <img
                              src={
                                category.image || "/assets/images/default.png"
                              }
                              className="img-fluid blur-up lazyload"
                              alt={category.name}
                            />
                          </Link>
                        </div>
                        <div className="product-detail position-relative">
                          <Link to={`/shop/category/${category.id}`}>
                            <h6 className="name" style={{ fontSize: "16px" }}>
                              {toTitleCase(category.name)}
                            </h6>
                          </Link>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Mid Banner */}
      <section className="section-b-space">
        <div className="container-fluid-lg">
          <div className="row">
            <Carousel
              data-bs-theme="dark"
              controls={false}
              indicators={false}
              interval={3000}
              pause={false}
            >
              <Carousel.Item>
                <div className="d-flex gap-3">
                  <img
                    className="d-block w-50"
                    src="/assets/images/mban1.png"
                    alt="Image 1"
                  />
                  <img
                    className="d-block w-50"
                    src="/assets/images/mban2.png"
                    alt="Image 2"
                  />
                </div>
              </Carousel.Item>

              <Carousel.Item>
                <div className="d-flex gap-3">
                  <img
                    className="d-block w-50"
                    src="/assets/images/mban3.png"
                    alt="Image 3"
                  />
                  <img
                    className="d-block w-50"
                    src="/assets/images/mban4.png"
                    alt="Image 4"
                  />
                </div>
              </Carousel.Item>
            </Carousel>
          </div>
        </div>
      </section>

      {/* Deal of the Day Section */}
      <section className="section-b-space" style={{ backgroundColor: "#fff" }}>
        <div className="container-fluid-lg">
          <div className="row">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <div className="title d-block">
                <h2 className="text-theme font-sm mb-0">DEAL OF THE DAY</h2>
                <p className="mb-0">
                  A virtual assistant collects the products from your list
                </p>
              </div>
              <div className="d-flex gap-2">
                <button
                  onClick={handlePrev}
                  className="btn btn-animation shadow-sm"
                >
                  <i className="fas fa-chevron-left"></i>
                </button>
                <button
                  onClick={handleNext}
                  className="btn btn-animation shadow-sm"
                >
                  <i className="fas fa-chevron-right"></i>
                </button>
              </div>
            </div>
            <Carousel
              controls={false}
              indicators={false}
              interval={null}
              ref={carouselRef}
            >
              {chunkedDummyData.map((group, i) => (
                <Carousel.Item key={i}>
                  <div className="row row-cols-xxl-4 row-cols-xl-4 row-cols-md-2 row-cols-2 g-sm-4 g-3">
                    {group.map((product) => (
                      <div key={product.id} className="col">
                        <div className="product-card">
                          <div className="fix-height">
                            <div className="discount-badge">
                              {product.discount}% OFF
                            </div>
                            <img
                              src={product.image || "/assets/images/shop7.png"}
                              alt={product.name}
                              className="product-img"
                            />
                            <h6
                              className="product-title"
                              style={{ color: "gray" }}
                            >
                              {product.category}
                            </h6>
                            <h6
                              className="product-title"
                              style={{ fontSize: "15px" }}
                            >
                              {" "}
                              {toTitleCase(product.name)}
                            </h6>
                            <p className="product-qty">1 pc</p>
                          </div>
                          <div className="line-light"></div>
                          <div className="price-action-wrap">
                            <div>
                              <span className="price">
                                ₹{(product.base_price || 100).toFixed(2)}
                              </span>
                              {product.mrp > 0 && (
                                <del className="mrp">
                                  ₹{product.mrp.toFixed(2)}
                                </del>
                              )}
                            </div>
                            {product.quantity === 0 ? (
                              <button
                                className="add-btn w-800"
                                onClick={() => handleAddToCart(product.id)}
                              >
                                ADD <span className="plus">+</span>
                              </button>
                            ) : (
                              <div className="qty-controls">
                                <button onClick={() => decrement(product.id)}>
                                  -
                                </button>
                                <input
                                  type="number"
                                  min="1"
                                  value={product.quantity}
                                  onChange={(e) =>
                                    updateQuantity(
                                      product.id,
                                      Number(e.target.value)
                                    )
                                  }
                                />
                                <button onClick={() => increment(product.id)}>
                                  +
                                </button>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </Carousel.Item>
              ))}
            </Carousel>
          </div>
        </div>
      </section>

      {/* Brands Section */}
      <section className="section-b-space" style={{ backgroundColor: "#fff" }}>
        <div className="container-fluid-lg">
          <div className="row">
            <div className="col-12">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <div className="title d-block">
                  <h2 className="text-theme font-sm mb-0">SHOP BY BRANDS</h2>
                  <p className="mb-0">
                    A virtual assistant collects the products from your list
                  </p>
                </div>
                <div className="d-flex gap-2">
                  <button
                    onClick={handlePrev}
                    className="btn btn-animation shadow-sm"
                  >
                    <i className="fas fa-chevron-left"></i>
                  </button>
                  <button
                    onClick={handleNext}
                    className="btn btn-animation shadow-sm"
                  >
                    <i className="fas fa-chevron-right"></i>
                  </button>
                </div>
              </div>
              <Carousel
                controls={false}
                indicators={false}
                interval={null}
                ref={carouselRef}
              >
                {groupedBrands.map((group, i) => (
                  <Carousel.Item key={i}>
                    <div className="row row-cols-xxl-6 row-cols-xl-6 row-cols-md-3 row-cols-2 g-sm-4 g-3">
                      {group.map((brand, index) => (
                        <div key={index}>
                          <div className="product-box product-white-bg">
                            <div
                              className="product-image"
                              style={{ padding: "0" }}
                            >
                              <Link to={`/shop/brand/${brand.id}`}>
                                <img
                                  src={
                                    brand.image || "/assets/images/default.png"
                                  }
                                  className="img-fluid blur-up lazyload"
                                  alt={brand.name}
                                />
                              </Link>
                            </div>
                            <div className="product-detail position-relative">
                              <Link to={`/shop/brand/${brand.id}`}>
                                <h6
                                  className="name"
                                  style={{ fontSize: "15px" }}
                                >
                                  {" "}
                                  {toTitleCase(brand.name)}
                                </h6>
                              </Link>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </Carousel.Item>
                ))}
              </Carousel>
            </div>
          </div>
        </div>
      </section>

       
    </>
  );
}

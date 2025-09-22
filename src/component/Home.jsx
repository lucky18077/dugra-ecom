import React, { useRef, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Carousel from "react-bootstrap/Carousel";
import axios from "axios";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { toTitleCase } from "../Hooks/Helper";
import { LIVE_URL } from "../Api/Route";

export default function Home({
  isLoggedIn = false,
  openLoginModal = () => {},
  setRefreshNavbar = () => {},
}) {
  const [categories, setCategories] = useState([]);
  const [groupedCategories, setGroupedCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [wishlisted, setWishlisted] = useState([]);
  const [dealDay, setDealDay] = useState([]);
  const [banner, setBanner] = useState(null);
  const [slider, setSlider] = useState(null);
  const [dealOfDaySlider, setDealOfDaySlider] = useState([]);
  const [activeTab, setActiveTab] = useState("About us");
  const [activeIndex, setActiveIndex] = useState(0);
  const token = localStorage.getItem("customer_token");

  const dealCarouselRef = useRef(null);
  const brandCarouselRef = useRef(null);

  const chunkArray = (arr, size) => {
    const chunked = [];
    for (let i = 0; i < arr.length; i += size) {
      chunked.push(arr.slice(i, i + size));
    }
    return chunked;
  };

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

  const fetchMainSlider = async () => {
    try {
      const response = await axios.get(`${LIVE_URL}/get-slider`);
      setBanner(response.data.data || []);
    } catch (error) {
      console.error("Error fetching brands:", error);
    }
  };

  const fetchSlider = async () => {
    try {
      const response = await axios.get(`${LIVE_URL}/get-banner`);
      setSlider(response.data.data || []);
    } catch (error) {
      console.error("Error fetching brands:", error);
    }
  };

  const fetchDealDay = async () => {
    try {
      const response = await axios.get(`${LIVE_URL}/get-products-deal`);
      const products = response.data || [];
      setDealDay(products.map((p) => ({ ...p, quantity: 0 })));
    } catch (error) {
      console.error("Error fetching get-products-deal:", error);
    }
  };

  const fetchDealOfDaySlider = async () => {
    try {
      const response = await axios.get(`${LIVE_URL}/get-banner-deal-of-day`);
      if (response.data.success) {
        console.log(response.data.data);
        setDealOfDaySlider(response.data.data || []);
      }
    } catch (error) {
      console.error("Error fetching deal of day slider:", error);
    }
  };

  const fetchWishlist = async () => {
    if (!token) return;
    try {
      const res = await axios.get(`${LIVE_URL}/whishlist-view`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const wishlistItems = res.data.data || [];
      const ids = wishlistItems.map((item) =>
        item.product_id ? item.product_id : item.id
      );
      setWishlisted(ids);
    } catch (err) {
      console.error("Wishlist fetch error:", err);
    }
  };

  useEffect(() => {
    fetchMainSlider();
    fetchCategories();
    fetchBrands();
    fetchDealDay();
    fetchWishlist();
    fetchSlider();
    fetchDealOfDaySlider();
  }, []);

  const groupedBrands = chunkArray(brands, 6);
  const chunkedDealDay = chunkArray(dealDay, 3);
  const handleDealPrev = () => dealCarouselRef.current?.prev();
  const handleDealNext = () => dealCarouselRef.current?.next();
  const handleBrandPrev = () => brandCarouselRef.current?.prev();
  const handleBrandNext = () => brandCarouselRef.current?.next();

  const increment = async (id) => {
    if (!isLoggedIn) {
      openLoginModal?.();
      return;
    }

    const currentProduct = dealDay.find((p) => p.id === id);
    if (!currentProduct) return;

    const newQty = currentProduct.quantity + 1;

    setDealDay((prev) =>
      prev.map((p) => (p.id === id ? { ...p, quantity: newQty } : p))
    );

    await handleCartUpdate(id, newQty, "plus");
  };

  const decrement = async (id) => {
    if (!isLoggedIn) {
      openLoginModal?.();
      return;
    }

    const currentProduct = dealDay.find((p) => p.id === id);
    if (!currentProduct) return;

    const newQty = Math.max(0, currentProduct.quantity - 1);

    setDealDay((prev) =>
      prev.map((p) => (p.id === id ? { ...p, quantity: newQty } : p))
    );

    if (newQty === 0) {
      await handleCartUpdate(id, 0, "remove");
    } else {
      await handleCartUpdate(id, newQty, "minus");
    }
  };

  const updateQuantity = async (id, qty) => {
    if (!isLoggedIn) {
      openLoginModal();
      return;
    }

    if (isNaN(qty)) return;

    setDealDay((prev) =>
      prev.map((p) => (p.id === id ? { ...p, quantity: qty } : p))
    );

    if (qty <= 0) {
      await handleCartUpdate(id, 0, "remove");
    } else {
      await handleCartUpdate(id, qty);
    }
  };

  const handleAddToCart = async (id) => {
    if (!isLoggedIn) {
      openLoginModal?.();
      return;
    }

    setDealDay((prev) =>
      prev.map((p) => (p.id === id ? { ...p, quantity: 1 } : p))
    );

    await handleCartUpdate(id, 1, "plus");
  };
  const handleCartUpdate = async (productId, qty = null, qtyType = null) => {
    try {
      await axios.post(
        `${LIVE_URL}/add-to-cart`,
        { product_id: productId, qty, qtyType },
        {
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setRefreshNavbar((prev) => !prev);
    } catch (error) {
      console.error("Cart update error:", error);
    }
  };
  const handleTierClick = async (product, qty) => {
    if (!isLoggedIn) {
      openLoginModal();
      return;
    }

    setDealDay((prev) =>
      prev.map((p) => (p.id === product.id ? { ...p, quantity: qty } : p))
    );

    await handleCartUpdate(product.id, qty);
  };
  const handleWishlistToggle = async (productId) => {
    if (!isLoggedIn) return openLoginModal();

    const isWishlisted = wishlisted.includes(productId);
    const url = isWishlisted
      ? `${LIVE_URL}/remove-wishlist`
      : `${LIVE_URL}/add-to-wishlist`;

    try {
      const response = await axios.post(
        url,
        { product_id: productId },
        {
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success) {
        if (isWishlisted) {
          toast.success("Removed from wishlist!");
          setWishlisted((prev) => prev.filter((id) => id !== productId));
        } else {
          toast.success("Added to wishlist!");
          setWishlisted((prev) => [...prev, productId]);
        }
      } else {
        toast.error(response.data.message || "Something went wrong!");
      }
    } catch (error) {
      console.error("Wishlist toggle error:", error);
      toast.error("Failed to update wishlist!");
    }
  };
  const faqData = {
    "About us": [
      {
        question: "What is Lorem Ipsum?",
        answer:
          "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s",
      },
      {
        question: "Where does it come from?",
        answer:
          "Contrary to popular belief, Lorem Ipsum is not simply random text. It has roots in a piece of classical Latin literature from 45 BC, making it over 2000 years old",
      },
      {
        question: "Why do we use it?",
        answer:
          "It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution",
      },
      {
        question: "Where can I get some?",
        answer:
          "There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in some form, by injected humour, or randomised words which don't look even slightly believable.",
      },
      {
        question: "What is Lorem Ipsum?",
        answer:
          "There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in some form, by injected humour, or randomised words which don't look even slightly believable.",
      },
    ],
    "Order related": [
      {
        question: "How long will delivery take?",
        answer:
          "Delivery time depends on your location, generally 2-3 working days.",
      },
      {
        question: "Can I change my delivery address?",
        answer:
          "Yes, you can change your address before your order is shipped.",
      },
    ],
    "Refund related": [
      {
        question: "How can I request a refund?",
        answer:
          "You can request a refund from your order details page within 7 days.",
      },
    ],
    "Account related": [
      {
        question: "How can I reset my password?",
        answer:
          "Go to the login page and click on 'Forgot password' to reset it.",
      },
    ],
    "Payment related": [
      {
        question: "What payment methods are accepted?",
        answer: "We accept UPI, credit/debit cards, net banking and wallets.",
      },
    ],
  };

  const steps = [
    {
      title: "Farm collection centres",
      desc: "We source directly from farmers, select the best produce at our collection centres, and deliver it fresh to your doorstep.",
      img: "/assets/images/sign-up.png",
    },
    {
      title: "State-of-the-art food park",
      desc: "We co-create and innovate recipe solutions and then bring them to life through our high-tech Food Park.",
      img: "/assets/images/sign-up.png",
    },
    {
      title: "Food safety compliant warehouse",
      desc: "We have a network of hygienic and sanitised warehouses that guarantee your supplies stay fresh and safe from start to finish.",
      img: "/assets/images/sign-up.png",
    },
    {
      title: "Frozen supply chain",
      desc: "Our temperature-controlled rooms and smart fleet ensure uninterrupted cooling at every step.",
      img: "/assets/images/sign-up.png",
    },
  ];

  return (
    <>
      {/* Top Banner */}
      <section style={{ padding: 0, maxWidth: "1920px", margin: "0 auto" }}>
        {banner && banner.length > 0 && (
          <Carousel
            controls={true}
            indicators={false}
            interval={5000}
            pause={false}
            className="hover-carousel"
          >
            {banner.map((b, index) => (
              <Carousel.Item key={index}>
                <a href={b.link || "#"}>
                  <img
                    src={`https://store.bulkbasketindia.com/sliders/${b.image}`}
                    alt={`Banner ${index + 1}`}
                    style={{
                      width: "100%",
                      height: "580px",
                    }}
                  />
                </a>
              </Carousel.Item>
            ))}
          </Carousel>
        )}
      </section>

      {/* Category Section */}
      <section
        className="section-b-space"
        style={{ backgroundColor: "#fff4e842" }}
      >
        <div className="container-fluid-lg">
          <div className="row">
            <div className="col-xxl-12 col-lg-12">
              <div className="title d-block mb-5 mt-3">
                <h2 className="text-theme font-sm">Shop By Categories</h2>
                <p>Explore wide range of categories</p>
              </div>
              {groupedCategories.map((group, i) => (
                <div
                  key={i}
                  className="row row-cols-xxl-6 row-cols-xl-6 row-cols-md-6 row-cols-2 g-sm-4 g-3 mb-4"
                >
                  {group.map((category, index) => (
                    <div key={index}>
                      <div className="product-box product-white-bg">
                        <div
                          className="product-image category-fix"
                          style={{ padding: "0" }}
                        >
                          <Link to={`/shop/category/${category.id}`}>
                            <img
                              src={
                                category.image
                                  ? `https://store.bulkbasketindia.com/master images/${category.image}`
                                  : "/assets/images/default.png"
                              }
                              className="img-fluid blur-up lazyload"
                              alt={category.name}
                            />
                          </Link>
                        </div>
                        <div className="line-light"></div>
                        <div className="product-detail position-relative">
                          <Link to={`/shop/category/${category.id}`}>
                            <h6
                              className="name"
                              style={{
                                fontSize: "15px",
                                fontFamily: "helvetica",
                                color: "#477a37",
                              }}
                            >
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
      <section
        className="section-b-space"
        style={{ backgroundColor: "#e8f1e6" }}
      >
        <div className="container-fluid-lg">
          <Carousel
            data-bs-theme="dark"
            controls={false}
            indicators={false}
            interval={3000}
            pause={false}
          >
            {slider && slider.length > 0 ? (
              slider
                .reduce((acc, _, i) => {
                  if (i % 2 === 0) acc.push(slider.slice(i, i + 2));
                  return acc;
                }, [])
                .map((pair, index) => (
                  <Carousel.Item key={index}>
                    <div className="d-flex gap-3">
                      {pair.map((b, idx) => (
                        <img
                          key={idx}
                          className="d-block w-50"
                          src={`https://store.bulkbasketindia.com/sliders/${b.image}`}
                          alt={`Mid Banner ${index}-${idx}`}
                        />
                      ))}
                    </div>
                  </Carousel.Item>
                ))
            ) : (
              // fallback if no API data
              <Carousel.Item>
                <div className="d-flex gap-3">
                  <img
                    className="d-block w-50"
                    src="/assets/images/mban1.png"
                    alt="Default 1"
                  />
                  <img
                    className="d-block w-50"
                    src="/assets/images/mban2.png"
                    alt="Default 2"
                  />
                </div>
              </Carousel.Item>
            )}
          </Carousel>
        </div>
      </section>

      {/* Deal of the Day */}
      <section
        className="section-b-space"
        style={{ backgroundColor: "#fff4e842" }}
      >
        <div className="container-fluid-lg">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <div className="title d-block mt-4 mb-4">
              <h2 className="text-theme font-sm mb-0"> Deal Of The Day</h2>
              <p className="mb-0">Special discounts, updated every day</p>
            </div>
            <div className="d-flex gap-2">
              <button
                onClick={handleDealPrev}
                className="btn btn-animation shadow-sm"
              >
                <i className="fas fa-chevron-left"></i>
              </button>
              <button
                onClick={handleDealNext}
                className="btn btn-animation shadow-sm"
              >
                <i className="fas fa-chevron-right"></i>
              </button>
            </div>
          </div>
          <div className="row">
            <div className="col-4">
              <Carousel
                controls={false}
                indicators={false}
                interval={3000}
                pause={false}
              >
                {dealOfDaySlider.map((item, index) => (
                  <Carousel.Item key={index}>
                    <img
                      src={`https://store.bulkbasketindia.com/sliders/${item.image}`}
                      alt={item.title || `Slide ${index + 1}`}
                      style={{
                        width: "400px",
                        height: "450px",
                        borderRadius: "10%",
                      }}
                    />
                  </Carousel.Item>
                ))}
              </Carousel>
            </div>
            <div className="col-8">
              <Carousel
                controls={false}
                indicators={false}
                interval={7000}
                pause={false}
                ref={dealCarouselRef}
              >
                {chunkedDealDay.map((group, i) => (
                  <Carousel.Item key={i}>
                    <div className="row row-cols-xxl-3 row-cols-xl-3 row-cols-md-3 row-cols-3 g-sm-4 g-3">
                      {group.map((product) => {
                        const hasTierDiscount =
                          product.details &&
                          product.details.length > 0 &&
                          Number(
                            product.details[product.details.length - 1]
                              .final_price
                          ) <
                            Number(
                              product.details[product.details.length - 1].price
                            );

                        const hasBaseDiscount =
                          (!product.details || product.details.length === 0) &&
                          Number(product.final_price) <
                            Number(product.base_price);

                        return (
                          <div key={product.id} className="col">
                            <div className="product-card">
                              {product.is_discount === 1 ? (
                                <span className="discount-badge">
                                  {product.discount}%
                                </span>
                              ) : null}
                              {/* <button
                          className="wishlist-btn"
                          onClick={() => handleWishlistToggle(product.id)}
                        >
                          <i
                            className="fa fa-heart"
                            style={{
                              color: wishlisted.includes(product.id)
                                ? "red"
                                : "white",
                              WebkitTextStroke: wishlisted.includes(product.id)
                                ? "1px #ff0000"
                                : "none",
                            }}
                          ></i>
                        </button> */}
                              <div className="fix-height">
                                <Link to={`/product-detail/${product.id}`}>
                                  <img
                                    src={
                                      product.image
                                        ? `https://store.bulkbasketindia.com/product images/${product.image}`
                                        : "/assets/images/shop7.png"
                                    }
                                    alt=""
                                    className="product-img"
                                  />
                                </Link>
                                <h6
                                  className="product-title"
                                  style={{ color: "black" }}
                                >
                                  {toTitleCase(product.category)}
                                </h6>
                                <Link
                                  to={`/product-detail/${product.id}`}
                                  style={{ color: "black" }}
                                >
                                  <h6
                                    className="product-title"
                                    style={{ fontSize: "13px" }}
                                  >
                                    {toTitleCase(product.name)}
                                  </h6>
                                </Link>
                                <p className="product-qty">1 {product.uom}</p>
                              </div>
                              <div
                                className="line-light"
                                style={{ width: "90%" }}
                              ></div>
                              {product.details.slice(0, 2).map((tier, idx) => (
                                <div
                                  key={idx}
                                  className="line-tire-wrapper d-flex tire-line"
                                  style={{ marginBottom: "6px" }}
                                >
                                  <div
                                    className="line-tire"
                                    style={{ fontSize: "12px" }}
                                    onClick={() =>
                                      handleTierClick(product, tier.qty)
                                    }
                                  >
                                    ₹{tier.final_price}/{product.uom} +
                                    <div className="sm-line"></div>
                                  </div>
                                  <div className="mt-3">
                                    <span
                                      className="add-qty-c"
                                      onClick={() =>
                                        handleTierClick(product, tier.qty)
                                      }
                                      style={{
                                        cursor: "pointer",
                                        fontSize: "12px",
                                      }}
                                    >
                                      Add{" "}
                                      <span className="plus">{tier.qty}</span>
                                    </span>
                                  </div>
                                </div>
                              ))}
                              <div
                                className="price-action-wrap"
                                style={{ background: "#e8f1e6" }}
                              >
                                {hasBaseDiscount ? (
                                  <>
                                    <div>
                                      <span className="price">
                                        ₹
                                        {Number(product.final_price).toFixed(2)}
                                      </span>
                                      <span className="mrp">
                                        ₹{Number(product.base_price).toFixed(2)}
                                      </span>
                                    </div>
                                  </>
                                ) : (
                                  <span className="price">
                                    ₹{Number(product.base_price).toFixed(2)}
                                  </span>
                                )}

                                {product.quantity === 0 ? (
                                  <button
                                    className="add-btn w-800"
                                    onClick={() => handleAddToCart(product.id)}
                                  >
                                    ADD <span className="plus">+</span>
                                  </button>
                                ) : (
                                  <div className="qty-controls">
                                    <button
                                      onClick={() => decrement(product.id)}
                                    >
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
                                    <button
                                      onClick={() => increment(product.id)}
                                    >
                                      +
                                    </button>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </Carousel.Item>
                ))}
              </Carousel>
            </div>
          </div>
        </div>
      </section>

      {/* Qulity Section */}
      <section className="fresh-vegetable-section section-lg-space">
        <div className="container-fluid-lg">
          <div className="row gx-xl-5 gy-xl-0 g-3 ratio_148_1">
            <div className="title d-block mb-4 mt-4">
              <h2 className="text-theme font-sm mb-0">Quality at every step</h2>
              <p className="mb-0">Built on trust</p>
            </div>

            <div className="col-7">
              <div className="fresh-contain p-center-left">
                <ul className="delivery-box list-unstyled">
                  {steps.map((step, index) => (
                    <li
                      key={index}
                      className={`mb-3 p-3 rounded-3 shadow-sm ${
                        activeIndex === index ? "active-step" : "bg-light"
                      }`}
                      style={{
                        cursor: "pointer",
                        border:
                          activeIndex === index
                            ? "2px solid #4CAF50"
                            : "2px solid transparent",
                        transition: "all 0.3s ease",
                      }}
                      onClick={() => setActiveIndex(index)}
                    >
                      <div className="delivery-detail">
                        <h4 className="mb-2">{step.title}</h4>
                        <p className="mb-0">{step.desc}</p>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="col-5">
              <div className="fresh-image-2 text-center">
                <img
                  src={steps[activeIndex].img}
                  className="bg-img blur-up lazyload rounded-4 shadow-lg"
                  alt={steps[activeIndex].title}
                  style={{
                    maxWidth: "100%",
                    transition: "opacity 0.4s ease",
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Brands */}
      <section
        className="section-b-space"
        style={{ backgroundColor: "#e8f1e6" }}
      >
        <div className="container-fluid-lg">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <div className="title d-block mb-4 mt-4">
              <h2 className="text-theme font-sm mb-0">Shop By Brands</h2>
              <p className="mb-0">Your favorite brands in one place</p>
            </div>
            <div className="d-flex gap-2">
              <button
                onClick={handleBrandPrev}
                className="btn btn-animation shadow-sm"
              >
                <i className="fas fa-chevron-left"></i>
              </button>
              <button
                onClick={handleBrandNext}
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
            ref={brandCarouselRef}
          >
            {groupedBrands.map((group, i) => (
              <Carousel.Item key={i}>
                <div className="row row-cols-xxl-6 row-cols-xl-6 row-cols-md-3 row-cols-2 g-sm-4 g-3">
                  {group.map((brand, index) => (
                    <div key={index}>
                      <div className="product-box product-white-bg ">
                        <div className="product-image" style={{ padding: "0" }}>
                          <Link
                            to={`/brand/${brand.name.toLowerCase()}/${
                              brand.id
                            }`}
                          >
                            <img
                              src={
                                brand.image
                                  ? `https://store.bulkbasketindia.com/master images/${brand.image}`
                                  : "/assets/images/default.png"
                              }
                              className="img-fluid blur-up lazyload"
                              alt={brand.name}
                            />
                          </Link>
                        </div>
                        <div className="line-light"></div>
                        <div className="product-detail position-relative">
                          <Link
                            to={`/brand/${brand.name.toLowerCase()}/${
                              brand.id
                            }`}
                          >
                            <h6
                              className="name"
                              style={{
                                fontSize: "15px",
                                fontFamily: "helvetica",
                                color: "#477a37",
                              }}
                            >
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
          <div className="d-flex justify-content-center mt-4">
            <Link to="/view-brands">
              <button className="btn btn-animation">View All</button>
            </Link>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="faq-box-contain section-b-space">
        <div className="container-fluid-lg">
          <h2 className="text-center fw-bold mb-4">
            Frequently asked questions
          </h2>

          {/* Tabs */}
          <div className="faq-tabs d-flex justify-content-center flex-wrap gap-3 mb-5">
            {Object.keys(faqData).map((tab) => (
              <button
                key={tab}
                className={`faq-tab ${activeTab === tab ? "active" : ""}`}
                onClick={() => setActiveTab(tab)}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Accordion */}
          <div className="row">
            <div className="col-8">
              <div className="faq-accordion">
                <div className="accordion" id="accordionExample">
                  {faqData[activeTab].map((item, index) => (
                    <div className="accordion-item" key={index}>
                      <h2 className="accordion-header" id={`heading${index}`}>
                        <button
                          className={`accordion-button ${
                            index === 0 ? "" : "collapsed"
                          }`}
                          type="button"
                          data-bs-toggle="collapse"
                          data-bs-target={`#collapse${index}`}
                        >
                          {item.question}
                          <i className="fa-solid fa-angle-down" />
                        </button>
                      </h2>
                      <div
                        id={`collapse${index}`}
                        className={`accordion-collapse collapse ${
                          index === 0 ? "show" : ""
                        }`}
                        data-bs-parent="#accordionExample"
                      >
                        <div className="accordion-body">
                          <p>{item.answer}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="col-4">
              <img
                src="assets/images/sign-up.png"
                alt=""
                className="img-fluid"
              />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

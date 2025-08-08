import React, { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { toTitleCase } from "../Hooks/Helper";
import feather from "feather-icons";
import { Link } from "react-router-dom";
import { LIVE_URL } from "../Api/Route";
import Carousel from "react-bootstrap/Carousel";

export default function ProductDetail({ isLoggedIn, openLoginModal }) {
  const [quantity, setQuantity] = useState(0);
  const [product, setProduct] = useState(null);
  const [supplier, setSupplier] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const { id } = useParams();
  const carouselRef = useRef();

  const handleAddToCart = () => {
    if (!isLoggedIn) return openLoginModal();
    setQuantity(1);
  };

  const increaseQty = () => {
    if (!isLoggedIn) return openLoginModal();
    setQuantity((prevQty) => prevQty + 1);
  };

  const decreaseQty = () => {
    if (!isLoggedIn) return openLoginModal();
    setQuantity((prevQty) => (prevQty > 1 ? prevQty - 1 : 0));
  };

  const handleQuantityUpdate = () => {
    if (!isLoggedIn) return openLoginModal();
    if (quantity < 1) setQuantity(0);
  };

  const groupByChunks = (array, chunkSize) => {
    const result = [];
    for (let i = 0; i < array.length; i += chunkSize) {
      result.push(array.slice(i, i + chunkSize));
    }
    return result;
  };

  const handleNext = () => {
    if (carouselRef.current) carouselRef.current.next();
  };

  const handlePrev = () => {
    if (carouselRef.current) carouselRef.current.prev();
  };
  const handleAddToCartRelated = (pid) => {
    if (!isLoggedIn) return openLoginModal();
    setRelatedProducts((prev) =>
      prev.map((group) =>
        group.map((p) => (p.id === pid ? { ...p, quantity: 1 } : p))
      )
    );
  };

  const increment = (pid) => {
    if (!isLoggedIn) return openLoginModal();
    setRelatedProducts((prev) =>
      prev.map((group) =>
        group.map((p) =>
          p.id === pid ? { ...p, quantity: (p.quantity || 0) + 1 } : p
        )
      )
    );
  };

  const decrement = (pid) => {
    if (!isLoggedIn) return openLoginModal();
    setRelatedProducts((prev) =>
      prev.map((group) =>
        group.map((p) =>
          p.id === pid
            ? { ...p, quantity: Math.max(0, (p.quantity || 1) - 1) }
            : p
        )
      )
    );
  };

  const updateQuantity = (pid, value) => {
    if (!isLoggedIn) return openLoginModal();
    const num = Math.max(0, value);
    setRelatedProducts((prev) =>
      prev.map((group) =>
        group.map((p) => (p.id === pid ? { ...p, quantity: num } : p))
      )
    );
  };

  useEffect(() => {
    axios
      .get(`${LIVE_URL}/get-product-detail/${id}`)
      .then((res) => {
        const data = res.data.data;
        setProduct(data.product);
        setSupplier(data.supplier);

        const products = data.related_products.map((p) => ({
          ...p,
          quantity: 0,
        }));
        setRelatedProducts(groupByChunks(products, 4));
      })
      .catch((err) => {
        console.error("Error fetching product:", err);
      });

    feather.replace();
  }, [id]);

  if (!product) return <div className="text-center py-5">Loading...</div>;

  return (
    <>
      {/* Products Detail */}
      <section className="product-section">
        <div className="container-fluid-lg">
          <div className="row">
            <div className="col-xxl-9 col-xl-8 col-lg-7">
              <div className="row g-4">
                <div className="col-xl-6">
                  <div className="product-left-box">
                    <img
                      src={
                        product.image
                          ? `http://127.0.0.1:8000/product images/${product.image}`
                          : "/assets/images/shop7.png"
                      }
                      className="img-fluid"
                      alt={product.name}
                    />
                  </div>
                </div>
                <div className="col-xl-6">
                  <div className="right-box-contain">
                    <h6 className="offer-top">30% Off</h6>
                    <h2 className="name">{toTitleCase(product.name)}</h2>
                    <div className="price-rating">
                      <h3 className="theme-color price">
                        ₹{product.base_price}
                      </h3>
                      <div className="product-rating custom-rate">
                        <span className="review">
                          {product.category} → {product.sub_category}
                        </span>
                      </div>
                    </div>
                    <div className="product-contain">
                      <p>{product.description}</p>
                    </div>

                    <div className="note-box product-package">
                      {quantity === 0 ? (
                        <button
                          className="btn btn-animation mt-xxl-4 home-button mend-auto"
                          onClick={handleAddToCart}
                        >
                          Add to Cart
                        </button>
                      ) : (
                        <div className="cart_qty qty-box product-qty">
                          <div className="input-group">
                            <button
                              type="button"
                              className="qty-left-minus"
                              onClick={decreaseQty}
                            >
                              <i className="fa fa-minus" />
                            </button>
                            <input
                              className="form-control input-number qty-input"
                              type="number"
                              min="0"
                              value={quantity}
                              onChange={(e) =>
                                setQuantity(Number(e.target.value))
                              }
                              onKeyDown={(e) => {
                                if (e.key === "Enter") {
                                  e.preventDefault();
                                  handleQuantityUpdate();
                                }
                              }}
                            />
                            <button
                              type="button"
                              className="qty-right-plus"
                              onClick={increaseQty}
                            >
                              <i className="fa fa-plus" />
                            </button>
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="share-option">
                      <h4>Share it</h4>
                      <ul className="social-share-list">
                        <li>
                          <a href="#">
                            <i className="fa-brands fa-facebook-f" />
                          </a>
                        </li>
                        <li>
                          <a href="#">
                            <i className="fa-brands fa-twitter" />
                          </a>
                        </li>
                        <li>
                          <a href="#">
                            <i className="fa-brands fa-linkedin-in" />
                          </a>
                        </li>
                        <li>
                          <a href="#">
                            <i className="fa-brands fa-whatsapp" />
                          </a>
                        </li>
                        <li>
                          <a href="#">
                            <i className="fa-solid fa-envelope" />
                          </a>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right sidebar */}
            <div className="col-xxl-3 col-xl-4 col-lg-5 d-none d-lg-block">
              <div className="right-sidebar-box">
                <div className="vendor-box">
                  <div className="vendor-contain">
                    <div className="vendor-image">
                      <img src="/assets/images/logo.png" alt="" />
                    </div>
                    <div className="vendor-name">
                      <h5>{supplier.name}</h5>
                      <div className="product-rating mt-1">
                        <ul className="rating">
                          {[...Array(5)].map((_, i) => (
                            <li key={i}>
                              <i data-feather="star" className="fill" />
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                  <div className="vendor-list">
                    <ul>
                      <li>
                        <i data-feather="map-pin" />
                        <h5>{supplier.address}</h5>
                      </li>
                      <li>
                        <i data-feather="headphones" />
                        <h5>+91-{supplier.number}</h5>
                      </li>
                    </ul>
                  </div>
                </div>
                <div className="pt-25">
                  <div className="hot-line-number">
                    <h5>Hotline Order:</h5>
                    <h6>Mon - Fri: 07:00 am - 08:30PM</h6>
                    <h3>+91-{supplier.number}</h3>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Related Products */}
      <section className="section-b-space" style={{ backgroundColor: "#fff" }}>
        <div className="container-fluid-lg">
          <div className="row">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <div>
                <h2 className="font-sm mb-0">Related Products</h2>
                <p>A virtual assistant collects the products from your list</p>
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
              {relatedProducts.map((group, i) => (
                <Carousel.Item key={i}>
                  <div className="row row-cols-xxl-4 row-cols-xl-4 row-cols-md-2 row-cols-2 g-sm-4 g-3">
                    {group.map((reproduct) => (
                      <div key={product.id} className="col">
                        <div className="product-card">
                          <Link
                            to={`/product-detail/${reproduct.id}`}
                          >
                            <img
                              src={
                                reproduct.image
                                  ? `http://127.0.0.1:8000/product images/${reproduct.image}`
                                  : "/assets/images/shop7.png"
                              }
                              alt={reproduct.name}
                              className="product-img"
                            />
                          </Link>
                          <h6
                            className="product-title"
                            style={{ color: "gray" }}
                          >
                            {reproduct.category}
                          </h6>
                          <Link
                            to={`/product-detail/${reproduct.id}`}
                            style={{ color: "black" }}
                          >
                            <h6 className="product-title">
                              {toTitleCase(reproduct.name)}
                            </h6>
                          </Link>
                          <p className="product-qty">1 pc</p>
                          <div className="price-action-wrap">
                            <span className="price">
                              ₹{reproduct.base_price}
                            </span>
                            {reproduct.quantity === 0 ? (
                              <button
                                className="add-btn w-800"
                                onClick={() =>
                                  handleAddToCartRelated(reproduct.id)
                                }
                              >
                                ADD <span className="plus">+</span>
                              </button>
                            ) : (
                              <div className="qty-controls">
                                <button onClick={() => decrement(reproduct.id)}>
                                  -
                                </button>
                                <input
                                  type="number"
                                  min="1"
                                  value={reproduct.quantity}
                                  onChange={(e) =>
                                    updateQuantity(
                                      reproduct.id,
                                      Number(e.target.value)
                                    )
                                  }
                                  onKeyDown={(e) => {
                                    if (e.key === "Enter") {
                                      updateQuantity(
                                        reproduct.id,
                                        Number(e.target.value)
                                      );
                                    }
                                  }}
                                />
                                <button onClick={() => increment(reproduct.id)}>
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
    </>
  );
}

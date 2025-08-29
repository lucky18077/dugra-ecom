import React, { useState, useEffect, useRef } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import { toTitleCase } from "../Hooks/Helper";
import feather from "feather-icons";
import Carousel from "react-bootstrap/Carousel";
import { LIVE_URL } from "../Api/Route";

export default function ProductDetail({
  isLoggedIn,
  openLoginModal,
  setRefreshNavbar,
}) {
  const [quantity, setQuantity] = useState(0);
  const [product, setProduct] = useState(null);
  const [supplier, setSupplier] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const token = localStorage.getItem("customer_token");
  const carouselRef = useRef();
  const { id } = useParams();
  const groupByChunks = (array, size) => {
    const result = [];
    for (let i = 0; i < array.length; i += size) {
      result.push(array.slice(i, i + size));
    }
    return result;
  };
  const handleNext = () => carouselRef.current?.next();
  const handlePrev = () => carouselRef.current?.prev();
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
      if (setRefreshNavbar) {
        setRefreshNavbar((prev) => !prev);
      }
    } catch (error) {
      console.error("Cart update error:", error);
    }
  };
  const handleAddToCart = () => {
    if (!isLoggedIn) return openLoginModal();
    setQuantity(1);
    handleCartUpdate(product.id, 1, null);
  };

  const increaseQty = () => {
    if (!isLoggedIn) return openLoginModal();
    setQuantity((prev) => {
      const newQty = prev + 1;
      handleCartUpdate(product.id, null, "plus");
      return newQty;
    });
  };

  const decreaseQty = () => {
    if (!isLoggedIn) return openLoginModal();
    setQuantity((prev) => {
      const newQty = prev > 1 ? prev - 1 : 0;
      if (newQty > 0) {
        handleCartUpdate(product.id, null, "minus");
      }
      return newQty;
    });
  };

  const handleQuantityUpdate = () => {
    if (!isLoggedIn) return openLoginModal();
    if (quantity < 1) setQuantity(0);
    else handleCartUpdate(product.id, quantity, null);
  };

  const handleAddToCartRelated = (pid) => {
    if (!isLoggedIn) return openLoginModal();

    setRelatedProducts((prev) =>
      prev.map((group) =>
        group.map((p) => (p.id === pid ? { ...p, quantity: 1 } : p))
      )
    );
    handleCartUpdate(pid, 1, null);
  };
  const incrementRelated = (pid) => {
    if (!isLoggedIn) return openLoginModal();

    setRelatedProducts((prev) =>
      prev.map((group) =>
        group.map((p) =>
          p.id === pid ? { ...p, quantity: (p.quantity || 0) + 1 } : p
        )
      )
    );
    handleCartUpdate(pid, null, "plus");
  };
  const decrementRelated = (pid) => {
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
    handleCartUpdate(pid, null, "minus");
  };
  const updateQuantityRelated = (pid, value) => {
    if (!isLoggedIn) return openLoginModal();
    const num = Math.max(0, value);

    setRelatedProducts((prev) =>
      prev.map((group) =>
        group.map((p) => (p.id === pid ? { ...p, quantity: num } : p))
      )
    );
    handleCartUpdate(pid, num, null);
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
      .catch((err) => console.error("Product fetch error:", err));

    feather.replace();
  }, [id]);
  if (!product) return <div className="text-center py-5">Loading...</div>;

  return (
    <>
      {/* Breadcrumb Section Start */}
      <section className="breadcrumb-section pt-0">
        <div className="container-fluid-lg">
          <div className="row">
            <div className="col-12">
              <div className="breadcrumb-contain">
                <nav style={{ marginLeft: "inherit" }}>
                  <ol className="breadcrumb mb-0">
                    <li className="breadcrumb-item active">
                      <Link to="/">Home</Link>
                    </li>
                    <li className="breadcrumb-item  active">
                      <Link to={`/shop/category/${product.category_id}`}>
                        {toTitleCase(product.category)}
                      </Link>
                    </li>
                    <li className="breadcrumb-item active">
                      <Link
                        to={`/shop/category/${product.category_id}/subcategory/${product.sub_category_id}`}
                      >
                        {toTitleCase(product.sub_category)}
                      </Link>
                    </li>
                    <li className="breadcrumb-item active">
                      {toTitleCase(product.name)}
                    </li>
                  </ol>
                </nav>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* Breadcrumb Section End */}

      {/* Product Detail */}
      <section className="product-section">
        <div className="container-fluid-lg">
          <div className="row">
            <div className="col-xxl-9 col-xl-8 col-lg-7">
              <div className="row g-4">
                <div className="col-xl-6">
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
                <div className="col-xl-6">
                  <div className="right-box-contain">
                    <h6 className="offer-top">30% Off</h6>
                    <h2 className="name">{toTitleCase(product.name)}</h2>
                    <div className="price-rating">
                      {isLoggedIn && (
                        <h3 className="theme-color price">
                          ₹{product.base_price}
                        </h3>
                      )}
                      <span className="review">
                        {product.category} → {product.sub_category}
                      </span>
                    </div>
                    <div className="product-contain">
                      <p className="w-100">{product.description}</p>
                    </div>

                    <div className="product-title">
                      <div>
                        {/* {product.details?.length > 0 && (
                          <div className="product-packs mb-2">
                            {product.details.map((detail, index) => (
                              <div key={index} className="pack-item small">
                                {detail.qty} Qty - ₹
                                {Number(detail.price).toFixed(2)}
                              </div>
                            ))}
                          </div>
                        )} */}
                      </div>
                    </div>

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
                            onClick={decreaseQty}
                            className="qty-left-minus"
                          >
                            <i className="fa fa-minus" />
                          </button>
                          <input
                            className="form-control input-number qty-input"
                            type="number"
                            value={quantity}
                            min="0"
                            onChange={(e) => {
                              const val = Number(e.target.value);
                              setQuantity(val);
                              if (val >= 0) {
                                handleCartUpdate(product.id, val, null);
                              }
                            }}
                          />
                          <button
                            onClick={increaseQty}
                            className="qty-right-plus"
                          >
                            <i className="fa fa-plus" />
                          </button>
                        </div>
                      </div>
                    )}

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

            {/* Right Sidebar */}
            <div className="col-xxl-3 col-xl-4 col-lg-5 d-none d-lg-block">
              <div className="right-sidebar-box">
                <div className="vendor-box">
                  <div className="vendor-contain">
                    <img src="/assets/images/logo.png" alt="" />
                    <h5>{supplier.name}</h5>
                    <ul className="rating">
                      {[...Array(5)].map((_, i) => (
                        <li key={i}>
                          <i data-feather="star" className="fill" />
                        </li>
                      ))}
                    </ul>
                    <ul>
                      <li>
                        <i data-feather="map-pin" /> {supplier.address}
                      </li>
                      <li>
                        <i data-feather="headphones" /> +91-{supplier.number}
                      </li>
                    </ul>
                  </div>
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
                  <i className="fas fa-chevron-left" />
                </button>
                <button
                  onClick={handleNext}
                  className="btn btn-animation shadow-sm"
                >
                  <i className="fas fa-chevron-right" />
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
                      <div key={reproduct.id} className="col">
                        <div className="product-card">
                          <Link to={`/product-detail/${reproduct.id}`}>
                            <img
                              src={
                                reproduct.image
                                  ? `http://127.0.0.1:8000/product images/${reproduct.image}`
                                  : "/assets/images/shop7.png"
                              }
                              className="product-img"
                              alt={reproduct.name}
                            />
                          </Link>
                          <h6 className="product-title text-muted">
                            {reproduct.category}
                          </h6>
                          <Link
                            to={`/product-detail/${reproduct.id}`}
                            className="text-dark"
                          >
                            <h6 className="product-title">
                              {toTitleCase(reproduct.name)}
                            </h6>
                          </Link>
                          <p className="product-qty">1 pc</p>
                          <div className="price-action-wrap">
                            <span className="price">
                              {isLoggedIn && <>₹{reproduct.base_price}</>}
                            </span>

                            {reproduct.quantity === 0 ? (
                              <button
                                className="add-btn"
                                onClick={() =>
                                  handleAddToCartRelated(reproduct.id)
                                }
                              >
                                ADD <span className="plus">+</span>
                              </button>
                            ) : (
                              <div className="qty-controls">
                                <button
                                  onClick={() => decrementRelated(reproduct.id)}
                                >
                                  -
                                </button>
                                <input
                                  type="number"
                                  value={reproduct.quantity}
                                  min="1"
                                  onChange={(e) =>
                                    updateQuantityRelated(
                                      reproduct.id,
                                      Number(e.target.value)
                                    )
                                  }
                                  onKeyDown={(e) => {
                                    if (e.key === "Enter") {
                                      updateQuantityRelated(
                                        reproduct.id,
                                        Number(e.target.value)
                                      );
                                    }
                                  }}
                                />
                                <button
                                  onClick={() => incrementRelated(reproduct.id)}
                                >
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

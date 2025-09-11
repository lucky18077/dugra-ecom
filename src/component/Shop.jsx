import React, { useEffect, useState, useRef } from "react";
import { Link, useNavigate, useParams, useLocation } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { toTitleCase } from "../Hooks/Helper";
import { LIVE_URL } from "../Api/Route";

export default function Shop({ isLoggedIn, openLoginModal, setRefreshNavbar }) {
  const token = localStorage.getItem("customer_token");
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [wishlisted, setWishlisted] = useState([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState(null);

  const { categoryId, subcategoryId, brandId } = useParams();
  const sliderRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();

  const query = new URLSearchParams(location.search);
  const searchQuery = query.get("q");

  // Fetch categories & subcategories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axios.get(`${LIVE_URL}/get-category`);
        const data = res.data.data || [];
        setCategories(data);
        if (!categoryId && data.length > 0) {
          setSelectedCategoryId(data[0].id);
        } else {
          setSelectedCategoryId(Number(categoryId));
        }
      } catch (err) {
        console.error("Category fetch error:", err);
      }
    };

    const fetchSubcategories = async () => {
      try {
        const res = await axios.get(`${LIVE_URL}/get-sub-category`);
        setSubcategories(res.data.data || []);
      } catch (err) {
        console.error("Subcategory fetch error:", err);
      }
    };

    fetchCategories();
    fetchSubcategories();
  }, [categoryId]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const params = {};
        if (categoryId) params.category_id = categoryId;
        if (subcategoryId) params.sub_category_id = subcategoryId;
        if (brandId) params.brand_id = brandId;
        if (searchQuery) params.search = searchQuery;

        const res = await axios.get(`${LIVE_URL}/get-all-products`, { params });
        const productData = res.data.data || [];
        let cartItems = [];
        if (token) {
          try {
            const cartRes = await axios.get(`${LIVE_URL}/cart-view`, {
              headers: { Authorization: `Bearer ${token}` },
            });
            cartItems = cartRes.data.data || [];
          } catch (err) {
            console.error("Cart fetch error:", err);
          }
        }

        // merge cart qty into product list
        const mergedProducts = productData.map((p) => {
          const cartItem = cartItems.find((c) => c.product_id === p.id);
          return {
            ...p,
            quantity: cartItem ? cartItem.qty : 0,
          };
        });

        setProducts(mergedProducts);
      } catch (err) {
        console.error("Product fetch error:", err);
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

    fetchProducts();
    fetchWishlist();
  }, [categoryId, subcategoryId, brandId, searchQuery, token]);

  const handleCategoryClick = (catId) => navigate(`/shop/category/${catId}`);
  const handleSubcategoryClick = (subId, catId) =>
    navigate(`/shop/category/${catId}/subcategory/${subId}`);

  const scrollLeft = () =>
    sliderRef.current?.scrollBy({ left: -200, behavior: "smooth" });
  const scrollRight = () =>
    sliderRef.current?.scrollBy({ left: 200, behavior: "smooth" });

  // ---------------- CART -----------------
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

  const increment = async (id) => {
    if (!isLoggedIn) return openLoginModal();
    const currentProduct = products.find((p) => p.id === id);
    const newQty = currentProduct.quantity + 1;
    setProducts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, quantity: newQty } : p))
    );
    await handleCartUpdate(id, newQty, "plus");
  };

  const decrement = async (id) => {
    if (!isLoggedIn) return openLoginModal();
    const currentProduct = products.find((p) => p.id === id);
    const newQty = Math.max(0, currentProduct.quantity - 1);

    setProducts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, quantity: newQty } : p))
    );

    if (newQty === 0) {
      await axios.post(
        `${LIVE_URL}/remove-cart`,
        { product_id: id },
        { headers: { Authorization: `Bearer ${token}` } }
      );
    } else {
      await handleCartUpdate(id, newQty, "minus");
    }
  };

  const updateQuantity = async (id, qty) => {
    if (!isLoggedIn) return openLoginModal();

    if (qty < 1 || isNaN(qty)) {
      setProducts((prev) =>
        prev.map((p) => (p.id === id ? { ...p, quantity: 0 } : p))
      );
      await axios.post(
        `${LIVE_URL}/remove-cart`,
        { product_id: id },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      return;
    }

    setProducts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, quantity: qty } : p))
    );
    await handleCartUpdate(id, qty);
  };

  const handleAddToCart = async (id) => {
    if (!isLoggedIn) return openLoginModal();
    setProducts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, quantity: 1 } : p))
    );
    await handleCartUpdate(id, 1);
  };

  const handleTierClick = async (product, qty) => {
    if (!isLoggedIn) return openLoginModal();
    setProducts((prev) =>
      prev.map((p) => (p.id === product.id ? { ...p, quantity: qty } : p))
    );
    await handleCartUpdate(product.id, qty);
  };

  // ---------------- WISHLIST -----------------
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

  const filteredSubcategories = subcategories.filter(
    (sub) => Number(sub.category_id) === Number(selectedCategoryId)
  );

  return (
    <>
      <section
        className="blog-section section-b-space"
        style={{ background: "#fff" }}
      >
        {/* Category Slider */}
        <div
          style={{
            position: "fixed",
            top: 100,
            left: 0,
            right: 0,
            zIndex: 99,
            backgroundColor: "#fff",
          }}
        >
          <div className="container-fluid-lg">
            <div className="row g-sm-4 g-3 shop-bg-fix">
              <div
                className="category-slider-wrapper d-flex align-items-center py-2"
                style={{ marginBottom: "20px" }}
              >
                <button className="slider-btn left" onClick={scrollLeft}>
                  <img
                    src="/assets/images/leftbtn.png"
                    alt="Left"
                    style={{ width: "50px", height: "40px" }}
                  />
                </button>
                <div
                  className="category-slider flex-nowrap overflow-auto"
                  ref={sliderRef}
                >
                  {categories.map((cat) => (
                    <span
                      key={cat.id}
                      className={`category-item mx-3 ${
                        Number(categoryId) === cat.id
                          ? "fw-bold text-category"
                          : ""
                      }`}
                      style={{ cursor: "pointer", fontSize: "18px" }}
                      onClick={() => handleCategoryClick(cat.id)}
                    >
                      {toTitleCase(cat.name)}
                    </span>
                  ))}
                </div>
                <button className="slider-btn right" onClick={scrollRight}>
                  <img
                    src="/assets/images/rightbtn.png"
                    alt="Right"
                    style={{ width: "50px", height: "40px" }}
                  />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Subcategory + Products */}
        <div className="container-fluid-lg mt-5 ">
          <div className="row ">
            {/* Sidebar */}
            <div
              className="col-xxl-4 col-xl-4 col-lg-4 d-lg-block d-none sidebar-shop sticky-top"
              style={{ height: "675px", top: "170px", zIndex: 1 }}
            >
              <div className="left-sidebar-box">
                <div className="accordion left-accordion-box">
                  <div className="accordion-item">
                    <div className="accordion-collapse collapse show">
                      <div className="accordion-body pt-0 on-scroll">
                        {filteredSubcategories.length > 0 ? (
                          filteredSubcategories.map((sub) => (
                            <div className="recent-post-box" key={sub.id}>
                              <div
                                className={`recent-box d-flex ${
                                  Number(subcategoryId) === sub.id
                                    ? "text-category"
                                    : ""
                                }`}
                                onClick={() =>
                                  handleSubcategoryClick(
                                    sub.id,
                                    selectedCategoryId
                                  )
                                }
                                style={{ cursor: "pointer" }}
                              >
                                <div className="py-1">
                                  <img
                                    src={
                                      sub.images || "/assets/images/shop7.png"
                                    }
                                    alt=""
                                    className="img-fluid blur-up lazyload"
                                    style={{
                                      background: "#f5f5f5",
                                      width: "60px",
                                      height: "60px",
                                      borderRadius: "50%",
                                    }}
                                  />
                                </div>
                                <div className="recent-detail">
                                  <h5 className="recent-name" style={{fontSize:"18px"}}>
                                    {toTitleCase(sub.name)}
                                  </h5>
                                </div>
                              </div>
                            </div>
                          ))
                        ) : (
                          <p className="text-muted">
                            No subcategories available.
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Product Grid */}
            <div
              className="product-section col-xxl-8 col-xl-8 col-lg-8 ratio_50"
              style={{ padding: 0,width:"73%" }}
            >
              <div className="row">
                {products.map((product) => {
                  // check if discount is really applied
                  const hasTierDiscount =
                    product.details &&
                    product.details.length > 0 &&
                    Number(
                      product.details[product.details.length - 1].final_price
                    ) <
                      Number(product.details[product.details.length - 1].price);

                  const hasBaseDiscount =
                    (!product.details || product.details.length === 0) &&
                    Number(product.final_price) < Number(product.base_price);

                  return (
                    <div
                      className="col-6 col-sm-6 col-md-4 mb-2"
                      key={product.id}
                    >
                      <div className="product-card ">
                        {/* Discount badge only if discount really applied */}
                        {product.is_discount === 1 &&
                          (hasTierDiscount || hasBaseDiscount) && (
                            <span className="discount-badge">
                              {product.discount}%
                            </span>
                          )}

                        {/* Wishlist button */}
                        <button
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
                        </button>

                        {/* Product Image + Title */}
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
                              style={{ fontSize: "15px" }}
                            >
                              {toTitleCase(product.name)}
                            </h6>
                          </Link>
                          <p className="product-qty">1 {product.uom}</p>
                        </div>
                        <div className="line-light"></div>
                        {/* Tier Pricing (only if logged in & details exist) */}
                        {isLoggedIn &&
                          product.details &&
                          product.details.length > 0 && (
                            <div
                              className="tire-bg mt-2"
                              style={{ marginLeft: "28px" }}
                            >
                              {product.details.slice(0, 2).map((tier, idx) => (
                                <div
                                  key={idx}
                                  className="line-tire-wrapper d-flex tire-line"
                                  style={{ marginBottom: "6px" }}
                                >
                                  <div
                                    className="line-tire"
                                    style={{ fontSize: "13px" }}
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
                                        fontSize: "13px",
                                      }}
                                    >
                                      Add{" "}
                                      <span className="plus">{tier.qty}</span>
                                    </span>
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}

                        {/* Price + Add to Cart (only when logged in) */}
                        {isLoggedIn && (
                          <>
                            <div
                              className="price-action-wrap"
                              style={{ background: "#e8f1e6" }}
                            >
                              <div>
                                {hasBaseDiscount ? (
                                  <>
                                    <span className="price">
                                      ₹{Number(product.final_price).toFixed(2)}
                                    </span>
                                    <del className="mrp">
                                      ₹{Number(product.base_price).toFixed(2)}
                                    </del>
                                  </>
                                ) : (
                                  <span className="price">
                                    ₹{Number(product.base_price).toFixed(2)}
                                  </span>
                                )}

                                {/* {Number(product.mrp) > 0 &&
                                  Number(product.mrp) >
                                    Number(product.base_price) && (
                                    <del className="mrp">
                                      ₹{Number(product.mrp).toFixed(2)}
                                    </del>
                                  )} */}
                              </div>

                              {/* Add to Cart / Qty controls */}
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
                          </>
                        )}
                      </div>
                    </div>
                  );
                })}
                {products.length === 0 && (
                  <div className="text-center mt-5">
                    <h5>No products found for the selected filters.</h5>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

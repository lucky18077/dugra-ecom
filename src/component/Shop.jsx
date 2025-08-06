import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { LIVE_URL } from "../Api/Route";

export default function Shop() {
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const { categoryId, subcategoryId, brandId } = useParams();
  const sliderRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();

  const query = new URLSearchParams(location.search);
  const searchQuery = query.get("q");

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
        setProducts(productData.map((p) => ({ ...p, quantity: 0 })));
      } catch (err) {
        console.error("Product fetch error:", err);
      }
    };
    fetchProducts();
  }, [categoryId, subcategoryId, brandId, searchQuery]);

  const handleCategoryClick = (catId) => {
    navigate(`/shop/category/${catId}`);
  };

  const handleSubcategoryClick = (subId, catId) => {
    navigate(`/shop/category/${catId}/subcategory/${subId}`);
  };

  const scrollLeft = () => {
    sliderRef.current?.scrollBy({ left: -200, behavior: "smooth" });
  };

  const scrollRight = () => {
    sliderRef.current?.scrollBy({ left: 200, behavior: "smooth" });
  };

  const increment = (id) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, quantity: p.quantity + 1 } : p))
    );
  };

  const decrement = (id) => {
    setProducts((prev) =>
      prev.map((p) =>
        p.id === id ? { ...p, quantity: Math.max(0, p.quantity - 1) } : p
      )
    );
  };

  const updateQuantity = (id, qty) => {
    if (qty < 1 || isNaN(qty)) return;
    setProducts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, quantity: qty } : p))
    );
  };

  const handleAddToCart = (id) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, quantity: 1 } : p))
    );
  };

  const handleSearch = () => {
    if (searchTerm.trim() !== "") {
      navigate(`/shop/search?q=${encodeURIComponent(searchTerm.trim())}`);
    }
  };

  const filteredSubcategories = subcategories.filter(
    (sub) => Number(sub.category_id) === Number(selectedCategoryId)
  );

  return (
    <section
      className="blog-section section-b-space"
      style={{ background: "#f8f8f8" }}
    >
      <div className="container-fluid-lg">
        <div className="row g-sm-4 g-3">
          <div className="category-slider-wrapper d-flex align-items-center sticky-top">
            <button className="slider-btn left" onClick={scrollLeft}>
              <img
                src="/assets/images/leftbtn.png"
                alt="Scroll Left"
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
                    Number(categoryId) === cat.id ? "fw-bold text-category" : ""
                  }`}
                  style={{ cursor: "pointer" }}
                  onClick={() => handleCategoryClick(cat.id)}
                >
                  {cat.name}
                </span>
              ))}
            </div>
            <button className="slider-btn right" onClick={scrollRight}>
              <img
                src="/assets/images/rightbtn.png"
                alt="Scroll Right"
                style={{ width: "50px", height: "40px" }}
              />
            </button>
          </div>
          <div
            className="col-xxl-4 col-xl-4 col-lg-4 d-lg-block d-none sidebar-shop sticky-top"
            style={{ height: "675px", top: "100px", zIndex: 1 }}
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
                                  src={sub.images || "/assets/images/shop7.png"}
                                  alt=""
                                  className="img-fluid blur-up lazyload"
                                  style={{
                                    background: "#f5f5f5",
                                    width: "75px",
                                    height: "70px",
                                    borderRadius: "50%",
                                  }}
                                />
                              </div>
                              <div className="recent-detail">
                                <h5 className="recent-name">{sub.name}</h5>
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

          <div
            className="product-section col-xxl-8 col-xl-8 col-lg-8  ratio_50"
            style={{ padding: 0 }}
          >
            <div className="row ">
              {products.map((product) => (
                <div className="col-6 col-sm-6 col-md-4 mb-2" key={product.id}>
                  <div className="product-card">
                    <div className="fix-height">
                      <img
                        src={
                          product.image
                            ? `http://127.0.0.1:8000/product images/${product.image}`
                            : "/assets/images/shop7.png"
                        }
                        alt=""
                        className="product-img"
                      />
                      <h6 className="product-title">{product.name}</h6>
                      <p className="product-qty">1 pc</p>
                    </div>
                    <div className="line-light"></div>
                    <div className="price-action-wrap">
                      <div>
                        <span className="price">
                          ₹{Number(product.base_price).toFixed(2)}
                        </span>
                        {Number(product.mrp) > 0 && (
                          <del className="mrp">
                            ₹{Number(product.mrp).toFixed(2)}
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
                              updateQuantity(product.id, Number(e.target.value))
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
  );
}

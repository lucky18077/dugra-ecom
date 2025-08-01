import React, { useState } from "react";
import { Link as To } from "react-router-dom";

export default function Shop() {
  const categories = [
    { name: "All", to: "/all", icon: "assets/images/shop-all.png" },
    {
      name: "Dried Berry & Fruits",
      to: "/electronics",
      icon: "assets/images/shop2.png",
    },
    {
      name: "Japanese, Thai & Oriental",
      to: "/fashion",
      icon: "assets/images/shop5.png",
    },
    {
      name: "Italian & European",
      to: "/home",
      icon: "assets/images/shop4.png",
    },
    { name: "Pasta & Noodles", to: "/toys", icon: "assets/images/shop5.png" },
    {
      name: "Olives, Jalapenoes & Canned Products",
      to: "/sports",
      icon: "assets/images/shop6.png",
    },
    {
      name: "Imported Bakery & Cheese",
      to: "/beauty",
      icon: "assets/images/shop7.png",
    },
    {
      name: "Coconut Milk Powder & Creams",
      to: "/grocery",
      icon: "assets/images/shop8.png",
    },
    { name: "Consumables", to: "/books", icon: "assets/images/shop9.png" },
    {
      name: "Cleaning Tools",
      to: "/automotive",
      icon: "assets/images/shop4.png",
    },
  ];
  const [products, setProducts] = useState([
    {
      id: 1,
      title: "GAGAN - DALDA GHEE, 1LTR",
      image: "assets/images/p-1.jpg",
      oldPrice: 90,
      price: 70,
      quantity: 0,
    },
    {
      id: 2,
      title: "BASSO - OLIVE OIL POMACE, 5LTR",
      image: "assets/images/p-2.jpg",
      oldPrice: 120,
      price: 100,
      quantity: 0,
    },
    {
      id: 3,
      title: "GOWARDHAN - DESI GHEE TETRA, 1LTR",
      image: "assets/images/p-3.jpg",
      oldPrice: 80,
      price: 60,
      quantity: 0,
    },
  ]);

  const handleAddToCart = (id) => {
    setProducts((prev) =>
      prev.map((product) =>
        product.id === id ? { ...product, quantity: 1 } : product
      )
    );
  };

  const increment = (id) => {
    setProducts((prev) =>
      prev.map((product) =>
        product.id === id
          ? { ...product, quantity: product.quantity + 1 }
          : product
      )
    );
  };

  const decrement = (id) => {
    setProducts((prev) =>
      prev.map((product) =>
        product.id === id
          ? {
              ...product,
              quantity: product.quantity > 1 ? product.quantity - 1 : 0,
            }
          : product
      )
    );
  };
  return (
    <>
      <main className="main">
        <div className="container">
          <div className="row">
            <div className="col-lg-9">
              <div className="row mt-4">
                {products.map((product) => (
                  <div className="col-6 col-sm-4" key={product.id}>
                    <div className="product-default">
                      <figure>
                        <a href="product.html">
                          <img
                            src={product.image}
                            width={280}
                            height={280}
                            alt={product.title}
                          />
                        </a>
                      </figure>
                      <div className="product-details">
                        <div className="category-wrap">
                          <div className="category-list">
                            <a
                              href="category.html"
                              className="product-category"
                            >
                              category
                            </a>
                          </div>
                        </div>
                        <h3 className="product-title">
                          <a href="product.html">{product.title}</a>
                        </h3>
                        <div className="price-box">
                          <span className="old-price">
                            ${product.oldPrice.toFixed(2)}
                          </span>
                          <span className="product-price">
                            ${product.price.toFixed(2)}
                          </span>
                        </div>
                        <div className="product-action">
                          {product.quantity === 0 ? (
                            <button
                              className="btn btn-dark add-cart mr-2"
                              onClick={() => handleAddToCart(product.id)}
                            >
                              Add to Cart
                            </button>
                          ) : (
                            <div className="quantity-container">
                              <button
                                onClick={() => decrement(product.id)}
                                className="qty-btn"
                              >
                                −
                              </button>
                              <span className="qty-value">
                                {product.quantity}
                              </span>
                              <button
                                onClick={() => increment(product.id)}
                                className="qty-btn"
                              >
                                +
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="sidebar-overlay" />
            <aside className="sidebar-shop col-lg-3 mt-4 order-lg-first mobile-sidebar">
              <div className="sidebar-wrapper">
                <div className="widget shop-side-bar">
                  {categories.map((item, index) => (
                    <div
                      className="widget-header d-flex align-items-center mb-3"
                      key={index}
                    >
                      <img
                        src={item.icon}
                        alt={`${item.name} Icon`}
                        className="menu-icon-shop"
                      />
                      <h3 className="widget-title mb-0 ms-2">
                        <To
                          to={item.to}
                          className="text-decoration-none text-dark"
                        >
                          {item.name}
                        </To>
                      </h3>
                    </div>
                  ))}
                </div>
              </div>
            </aside>
          </div>
        </div>
        <div className="mb-4" />
      </main>
    </>
  );
}

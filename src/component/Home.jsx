import React, { useRef, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import Carousel from "react-bootstrap/Carousel";
import axios from "axios";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { LIVE_URL } from "../Api/Route";

export default function Home() {
  const [categories, setCategories] = useState([]);
  const [groupedCategories, setGroupedCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const carouselRef = useRef(null);

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
      setGroupedCategories(chunkArray(categoryList, 12));
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

  const groupedBrands = chunkArray(brands, 6);

  const handlePrev = () => {
    if (carouselRef.current) {
      carouselRef.current.prev();
    }
  };

  const handleNext = () => {
    if (carouselRef.current) {
      carouselRef.current.next();
    }
  };

  return (
    <>
      <section className="hero-slider" style={{ padding: "0" }}>
        <Swiper
          modules={[Navigation, Pagination, Autoplay]}
          navigation
          pagination={{ clickable: true }}
          autoplay={{ delay: 5000 }}
          loop
          className="mySwiper"
        >
          <SwiperSlide>
            <div
              className="slider-content"
              style={{ backgroundImage: "url('/assets/images/s2.webp')" }}
            ></div>
          </SwiperSlide>
        </Swiper>
      </section>

      {/* Category Section Fixed */}
      <section
        className="section-b-space"
        style={{ backgroundColor: "#fff2f2" }}
      >
        <div className="container-fluid-lg">
          <div className="row">
            <div className="col-xxl-12 col-lg-12">
              <div className="title d-block">
                <h2 className="text-theme font-sm">SHOP BY CATEGORIES</h2>
                <p>A virtual assistant collects the products from your list</p>
              </div>
              {groupedCategories.map((group, i) => (
                <div
                  key={i}
                  className="row row-cols-xxl-5 row-cols-xl-6 row-cols-md-4 row-cols-2 g-sm-4 g-3 no-arrow section-b-space"
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
                            <h6 className="name">{category.name}</h6>
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

      <section className="section-b-space">
        <div className="container">
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

      {/* Brands Section Fixed */}
      <section
        className="section-b-space"
        style={{ backgroundColor: "#fff2f2" }}
      >
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
                                <h6 className="name">{brand.name}</h6>
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

      <section className="section-b-space">
        <div className="container">
          <div className="row">
            <Carousel
              data-bs-theme="dark"
              controls={false}
              indicators={false}
              interval={3000}
              pause={false}
            >
              <Carousel.Item>
                <img
                  className="d-block w-100"
                  src="/assets/images/ban1.png"
                  alt="First slide"
                />
              </Carousel.Item>
              <Carousel.Item>
                <img
                  className="d-block w-100"
                  src="/assets/images/ban2.png"
                  alt="Second slide"
                />
              </Carousel.Item>
              <Carousel.Item>
                <img
                  className="d-block w-100"
                  src="/assets/images/ban1.png"
                  alt="Third slide"
                />
              </Carousel.Item>
            </Carousel>
          </div>
        </div>
      </section>
    </>
  );
}

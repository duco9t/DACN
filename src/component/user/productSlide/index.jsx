import "./styleSlide.scss";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ROUTERS } from "../../../utils/router";
import { IMAGES } from "../../../assets/image";

const ProductsSlideComponent = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch(
          "http://localhost:3009/api/product/getAllProduct"
        );
        if (!response.ok) throw new Error(response.statusText);

        const data = await response.json();
        setProducts(Array.isArray(data.data) ? data.data : []);
        console.log(data.data);
      } catch (error) {
        console.error("Failed to fetch products:", error);
        setProducts([]);
      }
    };

    fetchProducts();
  }, []);

  const handleNext = () => {
    if (currentIndex < products.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  return (
    <div className="productSlide-wrapper">
      <button className="slider-control prev" onClick={handlePrev}>
        {"<"}
      </button>
      <div
        className="productSlide-list"
        style={{ transform: `translateX(-${currentIndex * 310}px)` }}
      >
        {products.map((product) => (
          <div className="productSlide-item" key={product._id}>
            <Link to={ROUTERS.USER.DETAILS} state={{ product }}>
              <img
                className="add-to-img"
                src={product.imageUrl}
                alt={product.name}
              />
            </Link>
            <Link to={ROUTERS.USER.DETAILS} state={{ product }}>
              <div className="item-productSlide-bottom">
                <h3>{product.company + " " + product.productsTypeName}</h3>
                <p>{product.prices}đ</p>
              </div>
            </Link>
          </div>
        ))}
      </div>
      <button className="slider-control next" onClick={handleNext}>
        {">"}
      </button>
    </div>
  );
};

export default ProductsSlideComponent;

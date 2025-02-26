import { memo, useEffect, useState } from "react";
import { AiOutlinePhone } from "react-icons/ai";
import { Link, useNavigate } from "react-router-dom";
import { ROUTERS } from "../../../utils/router";
import "./style.scss";

import SlideBanner from "../../../component/user/slideBaner";

import LoadingSpinner from "../../../component/general/LoadingSpinner";
import ProductTypeComponent from "../../../component/user/productType";
import { apiLink } from "../../../config/api";

const HomePage = () => {
  const navigator = useNavigate();
  const [products, setProducts] = useState([]);
  const [valueSearch, setValueSearch] = useState("");
  const [suggestions, setSuggestions] = useState([]);

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch(apiLink + "/api/product/getAllProduct");
        if (!response.ok) throw new Error(response.statusText);

        const data = await response.json();
        setProducts(data.data);
      } catch (error) {
        console.error("Failed to fetch products:", error);
      } finally {
        setTimeout(() => setIsLoading(false), 200);
      }
    };

    fetchProducts();
  }, []);

  useEffect(() => {
    if (valueSearch.trim() === "") {
      setSuggestions([]);
    } else {
      const filteredProducts = products.filter(
        (product) =>
          product?.name?.toLowerCase().includes(valueSearch?.toLowerCase()) ||
          product?.company?.toLowerCase().includes(valueSearch?.toLowerCase())
      );
      setSuggestions(filteredProducts);
    }
  }, [products, valueSearch]);

  useEffect(() => {
    const script1 = document.createElement("script");
    script1.async = true;
    script1.src = "https://www.googletagmanager.com/gtag/js?id=AW-16850404656";
    document.head.appendChild(script1);

    const script2 = document.createElement("script");
    script2.innerHTML = `
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());
      gtag('config', 'AW-16850404656');
    `;
    document.head.appendChild(script2);
  }, []);

  const handleClickSearch = (item) => {
    navigator(`${ROUTERS.USER.DETAILS}/${item._id}`, {
      state: { productId: item._id }
    });
  };

  const [menuCategories] = useState([
    {
      name: "Laptop Gaming",
      title: "laptopgaming",
      // icon: <AiOutlineRight />,
      path: ROUTERS.USER.PRODUCT_TYPE
    },
    {
      name: "Laptop AI",
      title: "laptopai",
      // icon: <AiOutlineRight />,
      path: ROUTERS.USER.PRODUCT_TYPE
    },
    {
      name: "Laptop đồ họa ",
      title: "laptopdohoa",
      // icon: <AiOutlineRight />,
      path: ROUTERS.USER.PRODUCT_TYPE
    },
    {
      name: "Laptop Văn phòng",
      title: "laptopvanphong",
      // icon: <AiOutlineRight />,
      path: ROUTERS.USER.PRODUCT_TYPE
    },

    {
      name: "Laptop Sinh viên",
      title: "laptopsinhvien",
      // icon: <AiOutlineRight />,
      path: ROUTERS.USER.PRODUCT_TYPE
    },
    {
      name: "Laptop cảm ứng",
      title: "laptopcamung",
      // icon: <AiOutlineRight />,
      path: ROUTERS.USER.PRODUCT_TYPE
    },
    {
      name: "Laptop mỏng nhẹ",
      title: "laptopmongnhẹ",
      // icon: <AiOutlineRight />,
      path: ROUTERS.USER.PRODUCT_TYPE
    },
    {
      name: "Laptop cũ",
      title: "laptopcu",
      // icon: <AiOutlineRight />,
      path: ROUTERS.USER.PRODUCT_TYPE
    }
  ]);

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <div>
      <div className="header-content">
        <div className="container">
          <div className="row categories-container">
            <div className="col-lg-3">
              <nav className="categories-list">
                <ul className="categories-menu">
                  {menuCategories.map((itemCategory, keyCategory) => (
                    <li key={keyCategory}>
                      <Link
                        to={`${itemCategory.path}/${itemCategory.title}`}
                        state={{ title: itemCategory.title }}
                      >
                        {itemCategory.name} {itemCategory.icon}
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>
            </div>
            <div className="col-lg-9 search-container">
              <div className="search">
                <div className="search-form">
                  <form>
                    <div className="input-search">
                      <input
                        onChange={(e) => {
                          setValueSearch(e.target.value);
                        }}
                        type="text"
                        placeholder="Bạn cần tìm kiếm gì?"
                      />
                      {valueSearch.trim() && (
                        <div className="suggestions">
                          {suggestions.map((item, key) => {
                            return (
                              <div
                                onClick={() => {
                                  handleClickSearch(item);
                                }}
                                key={key}
                                className="suggestion-item"
                              >
                                {`${item.company} ${item.name}`}
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  </form>
                </div>
                <div className="search-phone">
                  <div
                    className="search-phone-icon"
                    style={{ display: "block" }}
                  >
                    <AiOutlinePhone />
                  </div>
                  <div className="search-phone-number">
                    <p>Hotline: 0987.654.321</p>
                    <span>Hỗ trợ 24/7</span>
                  </div>
                </div>
              </div>
              <div className="item-home">
                <SlideBanner />
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-lg-12">
              <div className="slide-product">
                {/* <ProductsSlideComponent product={products} /> */}
                <ProductTypeComponent
                  title="discount"
                  heading="Sản phẩm giảm giá"
                />
                <ProductTypeComponent
                  title="laptopmongnhẹ"
                  heading="Laptop mỏng nhẹ"
                />
                <ProductTypeComponent
                  title="laptopsinhvien"
                  heading="Laptop sinh viên"
                />
                <ProductTypeComponent
                  title="laptopgaming"
                  heading="Laptop Gaming"
                />
                <ProductTypeComponent title="laptopai" heading="Laptop AI" />
                <ProductTypeComponent
                  title="laptopdohoa"
                  heading="Laptop đồ hoạ"
                />
                <ProductTypeComponent
                  title="laptopvanphong"
                  heading="Laptop văn phòng"
                />
                <ProductTypeComponent title="laptopcu" heading="Laptop cũ" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default memo(HomePage);

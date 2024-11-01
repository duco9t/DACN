import "./style.scss";
import { memo, useContext, useEffect, useState } from "react";
import { ROUTERS } from "../../../utils/router";
import Breadcrumb from "../theme/breadcrumb";
import { IMAGES } from "../../../assets/image";
import { AiOutlineClose } from "react-icons/ai";
import ProductsComponent from "../../../component/user/productGrid/index";
import { AiOutlineSearch } from "react-icons/ai";
import { Link } from "react-router-dom";
import { BsDeviceSsdFill } from "react-icons/bs";
import { PiFrameCornersBold } from "react-icons/pi";
import { FaMemory } from "react-icons/fa";
import { RiCpuLine } from "react-icons/ri";
import { UserContext } from "../../../middleware/UserContext";

const ProductPage = () => {
  const { user, countCart, updateCartCount } = useContext(UserContext);
  const [products, setProducts] = useState([]);
  const [productsAll, setProductsAll] = useState(products);
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch(
          "http://localhost:3001/api/product/getAllProduct"
        );
        if (!response.ok) throw new Error(response.statusText);

        const data = await response.json();
        setProducts(Array.isArray(data.data) ? data.data : []);
        setProductsAll(Array.isArray(data.data) ? data.data : []);
      } catch (error) {
        console.error("Failed to fetch products:", error);
        setProducts([]);
      }
    };

    fetchProducts();
  }, []);
  const handleCart = async (product) => {
    if (!user) alert("Vui lòng đăng nhập");
    try {
      const response = await fetch(
        "http://localhost:3001/api/cart/add-update",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            userId: user.dataUser.id,
            productId: product._id,
            quantity: 1,
            prices: product.prices.toLocaleString("vi-VN")
          })
        }
      );
      if (!response.ok) {
        throw new Error(response.statusText);
      }
      const dataCart = await response.json();
      const updatedCount = dataCart.products.length;
      updateCartCount(updatedCount);
      // alert("Thêm giỏ hàng thành công");
    } catch (error) {
      console.error("Failed to add product to cart:", error);
    }
  };
  const sorts = [
    "Mới nhất",
    "Giá thấp đến cao",
    "Giá cao đến thấp",
    "Đang giảm giá"
  ];
  const [categories] = useState([
    {
      name: "Điện thoại, Tablet",
      path: ROUTERS.USER.PRODUCTS
    },
    {
      name: "Laptop",
      path: ROUTERS.USER.PRODUCTS
    },
    {
      name: "Âm thanh",
      path: ROUTERS.USER.PRODUCTS
    },
    {
      name: "Đồ gia dụng",
      path: ROUTERS.USER.PRODUCTS
    },
    {
      name: "Phụ kiện",
      path: ROUTERS.USER.PRODUCTS
    },
    {
      name: "Máy tính để bàn",
      path: ROUTERS.USER.PRODUCTS
    },
    {
      name: "Màn hình",
      path: ROUTERS.USER.PRODUCTS
    },
    {
      name: "Tivi",
      path: ROUTERS.USER.PRODUCTS
    }
  ]);

  const [suggestions, setSuggestions] = useState([]);

  const Search = (event) => {
    const valueInputSearch = event.target.value.toLowerCase();
    if (valueInputSearch === "") {
      setProducts(productsAll);
      setSuggestions([]);
      return;
    }
    const filteredProducts = productsAll.filter((product) => {
      return (
        product.name.toLowerCase().includes(valueInputSearch) ||
        product.productsTypeName.toLowerCase().includes(valueInputSearch)
      );
    }, []);
    setProducts(filteredProducts);
    setSuggestions(filteredProducts);
  };

  const [priceMin, setPriceMin] = useState(0);
  const [priceMax, setPriceMax] = useState(0);

  const handleOptionMin = (e) => {
    setPriceMin(e.target.value);
  };
  const handleOptionMax = (e) => {
    setPriceMax(e.target.value);
  };

  const [filteredProducts, setFilteredProducts] = useState([]);
  const [noResults, setNoResults] = useState(false);

  const handlePriceRange = () => {
    const min = parseFloat(priceMin);
    const max = parseFloat(priceMax);

    if (min === 0 && max === 0) {
      setFilteredProducts(productsAll);
      setProducts(productsAll);
      setNoResults(false);
    } else {
      const dataNewSearchPrice = productsAll.filter((item) => {
        const price = parseFloat(item.prices);
        if (min > 0 && max > 0) {
          return price >= min && price <= max;
        } else if (min > 0) {
          return price >= min;
        } else if (max > 0) {
          return price <= max;
        }
        return true;
      });

      if (dataNewSearchPrice.length === 0) {
        setNoResults(true);
        setFilteredProducts([]);
        setProducts([]);
      } else {
        setNoResults(false);
        setFilteredProducts(dataNewSearchPrice);
        setProducts(dataNewSearchPrice);
      }

      return dataNewSearchPrice;
    }
  };

  const Sort = (key) => {
    const dataNewSort = [
      ...(filteredProducts.length > 0 ? filteredProducts : productsAll)
    ];

    switch (key) {
      case 0:
        dataNewSort.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );
        break;
      case 1:
        dataNewSort.sort((a, b) => a.prices - b.prices);
        break;
      case 2:
        dataNewSort.sort((a, b) => b.prices - a.prices);
        break;
      case 3:
        dataNewSort.sort((a, b) => b.discount - a.discount);
        break;
      default:
        break;
    }

    setProducts(dataNewSort);
    setFilteredProducts(dataNewSort);
  };

  const clearSidebar = () => {
    setProducts(productsAll);
    setNoResults(false);
    setPriceMin("");
    setPriceMax("");
    setFilteredProducts([]);
  };
  return (
    <>
      <Breadcrumb />
      <div className="container-product product">
        <div className="row">
          <div className="col-lg-3">
            <div className="sidebar">
              <div className="sidebar-item sidebar-item-search">
                <div className="top-sidebar-item">
                  <h3>Tìm kiếm</h3>
                  <AiOutlineClose
                    className="icon-close"
                    onClick={clearSidebar}
                  />
                </div>
                <input type="text" onChange={Search} />
                <div className="suggestions">
                  {suggestions.map((item) => (
                    <div key={item.laptop_ID} className="suggestion-item">
                      {item.Type_name} - {item.Company}
                    </div>
                  ))}
                </div>
              </div>

              <div className="sidebar-item">
                <h3> Mức Giá</h3>
                <div className="price-range-wrap">
                  <div>
                    <p>Từ </p>
                    <select
                      onChange={handleOptionMin}
                      className="optionPrice"
                      value={priceMin}
                    >
                      <option value="0">---Chọn---</option>
                      <option value="10000000">10.000.000</option>
                      <option value="20000000">20.000.000</option>
                      <option value="30000000">30.000.000</option>
                      <option value="40000000">40.000.000</option>
                      <option value="50000000">50.000.000</option>
                      <option value="60000000">60.000.000</option>
                      <option value="70000000">70.000.000</option>
                      <option value="80000000">80.000.000</option>
                    </select>
                    <input
                      type="number"
                      value={priceMin || ""}
                      min={0}
                      onChange={(e) => {
                        setPriceMin(e.target.value);
                      }}
                    />
                  </div>
                  <div>
                    <p>Đến</p>
                    <select
                      onChange={handleOptionMax}
                      className="optionPrice"
                      value={priceMax}
                    >
                      <option value="0">---Chọn---</option>
                      <option value="10000000">10.000.000</option>
                      <option value="20000000">20.000.000</option>
                      <option value="30000000">30.000.000</option>
                      <option value="40000000">40.000.000</option>
                      <option value="50000000">50.000.000</option>
                      <option value="60000000">60.000.000</option>
                      <option value="70000000">70.000.000</option>
                      <option value="80000000">80.000.000</option>
                    </select>
                    <input
                      type="number"
                      value={priceMax || ""}
                      min={0}
                      onChange={(e) => {
                        setPriceMax(e.target.value);
                      }}
                    />
                  </div>
                  <div>
                    <AiOutlineSearch onClick={handlePriceRange} />
                  </div>
                </div>
              </div>
              <div className="sidebar-item">
                <h3>Sắp xếp</h3>
                <div className="tags">
                  {sorts.map((item, key) => (
                    <div
                      className={`tag ${key}`}
                      key={key}
                      onClick={() => Sort(key)}
                    >
                      {item}
                    </div>
                  ))}
                </div>
              </div>
              {/* <div className="sidebar-item">
                <h3>Thể loại khác</h3>
                <ul>
                  {categories.map((category, key) => (
                    <li key={key}>
                      <Link to={category.path}>{category.name}</Link>
                    </li>
                  ))}
                </ul>
              </div> */}
            </div>
          </div>

          <div className="col-lg-9">
            {noResults ? (
              <h2>Không tìm thấy sản phẩm </h2>
            ) : (
              <div className="product-list">
                {products.length > 0 ? (
                  products.map((product) => (
                    <div className="product-item" key={product._id}>
                      <div className="product-item-image">
                        <Link
                          to={`${ROUTERS.USER.DETAILS}/${product._id}`}
                          state={{ product }}
                        >
                          <img
                            className="add-to-img"
                            src={product.imageUrl}
                            alt={product.name}
                          />
                        </Link>
                      </div>

                      <div className="product-item-bottom">
                        <Link
                          to={`${ROUTERS.USER.DETAILS}/${product._id}`}
                          state={{ product }}
                        >
                          <div className="item-product-bottom">
                            <h3>{product.name}</h3>
                            <div className="proloop-technical">
                              {[
                                {
                                  tag: "ssd",
                                  icon: <BsDeviceSsdFill />,
                                  value: product.memory
                                },
                                {
                                  tag: "lcd",
                                  icon: <PiFrameCornersBold />,
                                  value: `${product.inches} inch ${product.screenResolution}`
                                },
                                {
                                  tag: "ram",
                                  icon: <FaMemory />,
                                  value: product.ram
                                },
                                {
                                  tag: "cpu",
                                  icon: <RiCpuLine />,
                                  value: product.cpu
                                }
                              ].map((item) => (
                                <div
                                  className="proloop-technical--line"
                                  data-tag={item.tag}
                                  key={item.tag}
                                >
                                  {item.icon}
                                  <span>{item.value}</span>
                                </div>
                              ))}
                            </div>
                            <p>
                              {product.prices.toLocaleString("vi-VN")
                                ? product.prices.toLocaleString("vi-VN")
                                : "N/A"}
                              đ
                            </p>{" "}
                          </div>
                        </Link>
                      </div>
                      <div className="product-item-cart">
                        <button
                          onClick={() => {
                            handleCart(product);
                          }}
                          type="submit"
                          className="button btn-buyonl"
                          name="buy-onl"
                          id="buy-onl"
                        >
                          <span>Thêm vào giỏ</span>
                        </button>
                      </div>
                    </div>
                  ))
                ) : (
                  <p>No products available</p>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default memo(ProductPage);

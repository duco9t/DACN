import React, { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { IMAGES } from "../../../assets/image";
import { NotificationContext } from "../../../middleware/NotificationContext";
import { UserContext } from "../../../middleware/UserContext";
import { ROUTERS } from "../../../utils/router";
import SuccessAnimation from "../../general/Success";
import "./style.scss";

const ProductManagement = () => {
  const { addNotification } = useContext(NotificationContext);
  const { user } = useContext(UserContext);
  const [products, setProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 4;
  const [message, setMessage] = useState("");
  const [trigger, setTrigger] = useState(false);
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch(
          "https://doanpro-production.up.railway.app/api/product/getAllProduct"
        );
        if (!response.ok) throw new Error(response.statusText);
        const data = await response.json();
        setProducts(Array.isArray(data.data) ? data.data : []);
      } catch (error) {
        console.error("Failed to fetch products:", error);
        setProducts([]);
      }
    };
    fetchProducts();
  }, []);

  const handleDeleteProduct = async (id) => {
    if (window.confirm("Bạn có chắc chắn muốn xoá sản phẩm này?")) {
      try {
        const response = await fetch(
          `https://doanpro-production.up.railway.app/api/product/delete-product/${id}`,
          {
            method: "DELETE",
            headers: { "Content-Type": "application/json" }
          }
        );
        if (!response.ok) throw new Error(await response.text());

        const deletedProduct = products.find((product) => product._id === id);
        setProducts((prevProducts) =>
          prevProducts.filter((product) => product._id !== id)
        );
        setMessage("Xoá sản phẩm thành công");
        setTrigger(true);
        addNotification(
          `${deletedProduct?.name} đã được xoá khỏi danh sách sản phẩm.`
        );
      } catch (error) {
        console.error("Error deleting product: ", error);
      }
    }
  };

  const currentProducts = products.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );
  const totalPages = Math.ceil(products.length / itemsPerPage);

  return (
    <div>
      <div className="product-table-container">
        <table className="product-table">
          <thead>
            <tr>
              <th>STT</th>
              <th>Sản phẩm</th>
              <th>Nhãn hàng</th>
              <th>Số lượng</th>
              <th>Giá</th>
              <th>Hành động</th>
            </tr>
          </thead>
          <tbody>
            {currentProducts.map((product, index) => {
              return (
                <tr key={product._id}>
                  <td>{(currentPage - 1) * itemsPerPage + index + 1}</td>

                  <td>
                    <div className="product-info">
                      <img
                        src={product.imageUrl || IMAGES.defaultImage}
                        alt={product.name}
                        style={{ width: "100px" }}
                      />
                      <div style={{ marginLeft: "20px" }}>
                        <h4>{`${product.company} ${product.name}`}</h4>
                      </div>
                    </div>
                  </td>
                  <td>{product.company}</td>
                  <td>{product.quantityInStock}</td>
                  <td>
                    {" "}
                    {product?.prices == parseInt(product?.promotionPrice) ? (
                      <div className="grp-price">
                        <p className="prices">
                          {`${product?.prices.toLocaleString("vi-VN")} ₫`}
                        </p>
                      </div>
                    ) : (
                      <div className="grp-price">
                        <p className="price-old">
                          {`${product?.prices.toLocaleString("vi-VN")} ₫`}
                        </p>
                        <div className="grp-price-new">
                          <p className="price-new">
                            {`${parseInt(
                              parseInt(product?.promotionPrice)
                            ).toLocaleString("vi-VN")}
                               ₫`}
                          </p>
                          <p className="discount">{`-${product?.discount}%`}</p>
                        </div>
                      </div>
                    )}
                  </td>

                  <td>
                    <Link
                      to={`${ROUTERS.ADMIN.PRODUCTS_DETAIL}/${product._id}`}
                      className="view-btn"
                      state={{ product, id: product._id }}
                    >
                      👁️
                    </Link>
                    <Link
                      to={`${ROUTERS.ADMIN.UPDATE_PRODUCT}/${product._id}`}
                      className="edit-btn"
                      state={{ product, id: product._id }}
                    >
                      ✏️
                    </Link>
                    {user?.dataUser?.isAdmin && (
                      <button
                        onClick={() => handleDeleteProduct(product._id)}
                        className="delete-btn"
                      >
                        🗑️
                      </button>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <div className="pagination-product-manager">
        {[...Array(totalPages).keys()].map((n) => (
          <button
            key={n + 1}
            onClick={() => setCurrentPage(n + 1)}
            className={`page-number ${currentPage === n + 1 ? "active" : ""}`}
          >
            {n + 1}
          </button>
        ))}
      </div>
      <SuccessAnimation message={message} trigger={trigger} />
    </div>
  );
};

export default ProductManagement;

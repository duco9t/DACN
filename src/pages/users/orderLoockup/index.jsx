import React, { useState } from "react";
import "./style.scss";
import { AiOutlineSearch } from "react-icons/ai";

const OrderLookup = () => {
  const [orderInfo, setOrderInfo] = useState({
    buyerName: "",
    address: {
      address: ""
    },
    orderNumber: "",
    products: [],
    totalAmount: 0,
    orderDate: "",
    status: ""
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [value, setValue] = useState("");

  const handlePriceRange = async (id) => {
    console.log(id);
    try {
      const response = await fetch(`http://localhost:3001/api/order/get/${id}`);
      if (!response.ok) {
        throw new Error(response.statusText);
      }
      const data = await response.json();
      console.log(data.data);

      setOrderInfo({
        buyerName: data.data.name,
        address: data.data.shippingAddress,
        orderNumber: data.data._id,
        products: data.data.products,
        totalAmount: data.data.totalPrice,
        orderDate: data.data.updatedAt,
        status: data.data.status
      });
      setSearchTerm(data.data.products);
    } catch (error) {
      alert("Tra cứu đơn hàng thất bại");
    }
  };
  console.log(orderInfo);
  return (
    <div className="order-lookup-container">
      <h2>Tra cứu Đơn hàng</h2>
      <div className="search-order">
        <input
          className="input-search"
          type="text"
          placeholder="Nhập mã đơn hàng"
          onChange={(e) => setValue(e.target.value)}
        />
        <div className="icon-search">
          <AiOutlineSearch onClick={() => handlePriceRange(value)} />
        </div>
      </div>

      {searchTerm && (
        <div className="order-info">
          <div className="order-header">
            <p>
              <strong>Người mua:</strong> {orderInfo.buyerName}
            </p>
            <p>
              <strong>Địa chỉ nhận hàng:</strong> {orderInfo.address.address}
            </p>
            <p>
              <strong>Mã đơn hàng:</strong> {orderInfo.orderNumber}
            </p>
            <p>
              <strong>Ngày đặt:</strong> {orderInfo.orderDate}
            </p>
            <p>
              <strong>Trạng thái:</strong> {orderInfo.status}
            </p>
          </div>
          <div className="order-products">
            <h3>Chi tiết sản phẩm</h3>
            <table className="product-table">
              <thead>
                <tr>
                  <th>Tên sản phẩm</th>
                  <th>Số lượng</th>
                  <th>Giá</th>
                </tr>
              </thead>
              <tbody>
                {Array.isArray(searchTerm) && searchTerm.length > 0 ? (
                  searchTerm.map((product, index) => (
                    <tr key={index}>
                      <td>{product.productId.name}</td>
                      <td>{product.quantity}</td>
                      <td>
                        {product.productId.prices.toLocaleString("vi-VN")} VND
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="3">Không có sản phẩm</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="order-total">
            <strong>Tổng cộng:</strong>{" "}
            {orderInfo.totalAmount.toLocaleString("vi-VN")} VND
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderLookup;

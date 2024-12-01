import { useState, useEffect, useContext, useCallback } from "react";
import { UserContext } from "../../../middleware/UserContext";
import { useLocation, useNavigate } from "react-router-dom";
import { ROUTERS } from "../../../utils/router";
import "./style.scss";
import LuckyWheelVoucher from "../../../component/general/LuckyWheelVoucher";

const OrderPage = () => {
  const { pathname } = useLocation();
  const navigator = useNavigate();
  const location = useLocation();
  const { selectedProducts } = location.state || {};
  const [voucher, setVoucher] = useState(null);

  const { user } = useContext(UserContext) || {};
  const [cartId, setCartId] = useState();
  const [dataOrder, setDataOrder] = useState(null);

  const [paymentDetails, setPaymentDetails] = useState({
    name: user?.dataUser?.name || "",
    phone: user?.dataUser?.phone || "",
    email: user?.dataUser?.email || "",
    shippingAddress: ""
  });
  const [suggestions, setSuggestions] = useState([]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  const handleVoucherSelection = (selectedVoucher) => {
    setVoucher(selectedVoucher);
  };
  const getAllCart = useCallback(async () => {
    if (!user || !user.dataUser) return;
    const id = user.dataUser.id;
    try {
      const response = await fetch(
        ` http://localhost:3001/api/cart/get-cart/${id}`
      );
      if (!response.ok) throw new Error(response.statusText);
      const data = await response.json();
      setCartId(data?._id);
      const filteredData = data.products.filter((product) =>
        selectedProducts.includes(product.productId._id)
      );

      setDataOrder({ ...data, products: filteredData });
    } catch (error) {
      console.error("Failed to fetch cart data:", error);
    }
  }, [user]);

  useEffect(() => {
    getAllCart();
  }, [getAllCart]);
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setPaymentDetails({ ...paymentDetails, [name]: value });

    if (name === "shippingAddress") {
      fetchSuggestions(value);
    }
  };
  const fetchSuggestions = async (query) => {
    if (!query) {
      setSuggestions([]);
      return;
    }
    try {
      const response = await fetch(
        `https://rsapi.goong.io/Place/AutoComplete?api_key=YAAkQr05IwPk9mIFw3zTv9FE0LX4cJ1wryk77Bfb&input=${query}`
      );
      const data = await response.json();
      setSuggestions(data.predictions || []);
    } catch (error) {
      console.error("Error fetching shippingAddress suggestions:", error);
    }
  };

  const handleSelectSuggestion = (suggestion) => {
    setPaymentDetails({
      ...paymentDetails,
      shippingAddress: suggestion.description
    });
    setSuggestions([]);
  };
  const [orderId, setOrderId] = useState();
  const handlePayment = async () => {
    if (window.confirm("Bạn có chắc chắn đặt hàng không?")) {
      try {
        const response = await fetch("http://localhost:3001/api/order/create", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            ...paymentDetails,
            userId: user?.dataUser?.id,
            productIds: selectedProducts,
            cartId: cartId,
            voucherCode: voucher?.code || 0
          })
        });

        if (!response.ok) throw new Error("Order creation failed.");
        const data = await response.json();

        setOrderId(data?.data?.data?._id);
      } catch (error) {
        alert("Đặt hàng thất bại");
      }
    }
  };
  useEffect(() => {
    if (!orderId) return;
    const createPayment = async () => {
      const returnUrl = "http://localhost:3000/ket-qua-thanh-toan";

      try {
        const response = await fetch(
          "http://localhost:3001/api/payments/create_payment",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json"
            },
            body: JSON.stringify({
              orderId,
              returnUrl
            })
          }
        );

        if (!response.ok) throw new Error(response.statusText);
        const data = await response.json();

        if (data?.paymentURL) {
          window.location.href = data.paymentURL;
        } else {
          console.error("Không tìm thấy URL thanh toán.");
        }
      } catch (error) {
        console.error("Failed to create payment:", error);
      }
    };

    createPayment();
  }, [orderId]);
  const totalPrice = dataOrder
    ? dataOrder.products.reduce(
        (acc, item) =>
          acc + parseInt(item.productId.promotionPrice) * item.quantity,
        0
      )
    : 0;
  const shippingCost = totalPrice && totalPrice > 50000000 ? 0 : 800000;
  const vat = parseInt(totalPrice ? totalPrice * 0.1 : 0);
  const grandTotal = totalPrice + vat + shippingCost;
  return (
    <div className="container">
      <div className="row">
        <div className="payment-page">
          <h1>Thanh Toán</h1>
          <div className="payment-form">
            <h2>Thông tin đặt hàng</h2>
            <input
              type="text"
              name="name"
              placeholder="Tên người nhận"
              value={paymentDetails.name}
              onChange={handleInputChange}
            />
            <input
              type="text"
              name="phone"
              placeholder="Số điện thoại"
              value={paymentDetails.phone}
              onChange={handleInputChange}
            />
            <input
              type="text"
              name="email"
              placeholder="Email"
              value={paymentDetails.email}
              onChange={handleInputChange}
            />
            <input
              type="text"
              name="shippingAddress"
              placeholder="Địa chỉ nhận hàng"
              value={paymentDetails.shippingAddress}
              onChange={handleInputChange}
            />
            {suggestions.length > 0 && (
              <ul className="address-suggestions">
                {suggestions.map((suggestion) => (
                  <li
                    key={suggestion.place_id}
                    onClick={() => handleSelectSuggestion(suggestion)}
                  >
                    {suggestion.description}
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="order-summary">
            <h2>Thông tin đơn hàng</h2>
            {dataOrder &&
            dataOrder.products &&
            dataOrder.products.length > 0 ? (
              <div className="order-container">
                <table className="order-table">
                  <thead>
                    <tr>
                      <th>STT</th>
                      <th>Sản phẩm</th>
                      <th>Giá</th>
                      <th>Số lượng</th>
                      <th>Tổng tiền</th>
                    </tr>
                  </thead>
                  <tbody>
                    {dataOrder.products.map((item, key) => (
                      <tr key={item._id}>
                        <td>{key + 1}</td>
                        <td>{item?.productId.name}</td>
                        <td>
                          {" "}
                          {parseInt(item?.productId?.prices) ==
                          item?.productId?.promotionPrice ? (
                            <div className="grp-price">
                              <p className="prices">
                                {`${parseInt(item?.productId?.prices).toLocaleString("vi-VN")} ₫`}
                              </p>
                            </div>
                          ) : (
                            <div className="grp-price">
                              <p className="price-old">
                                {`${parseInt(item?.productId?.prices).toLocaleString("vi-VN")} ₫`}
                              </p>
                              <div className="grp-price-new">
                                <p className="price-new">
                                  {`${parseInt(
                                    item?.productId?.promotionPrice
                                  ).toLocaleString("vi-VN")}
                               ₫`}
                                </p>
                                <p className="discount">
                                  {`-${item?.productId?.discount}%`}
                                </p>
                              </div>
                            </div>
                          )}
                        </td>
                        <td>{item?.quantity}</td>
                        <td
                          style={{
                            fontWeight: "bold",
                            color: "#d70018",
                            fontSize: "16px"
                          }}
                        >
                          {(
                            parseInt(item?.productId.promotionPrice) *
                            item?.quantity
                          ).toLocaleString("vi-VN")}{" "}
                          ₫
                        </td>
                      </tr>
                    ))}

                    <tr>
                      <td
                        colSpan="4"
                        style={{
                          textAlign: "right"
                        }}
                      >
                        Tổng tiền hàng:
                      </td>
                      <td
                        style={{
                          fontWeight: "bold",
                          color: "#d70018",
                          fontSize: "16px"
                        }}
                      >
                        {totalPrice.toLocaleString("vi-VN")} ₫
                      </td>
                    </tr>
                    <tr>
                      <td colSpan="4" style={{ textAlign: "right" }}>
                        VAT:
                      </td>
                      <td>{vat.toLocaleString("vi-VN")} ₫</td>
                    </tr>
                    <tr>
                      <td colSpan="4" style={{ textAlign: "right" }}>
                        Chi phí vận chuyển:
                      </td>
                      <td>{shippingCost.toLocaleString("vi-VN")} ₫</td>
                    </tr>

                    <tr>
                      <td colSpan="4" style={{ textAlign: "right" }}>
                        Tổng tiền:
                      </td>
                      <td
                        style={{
                          fontWeight: "bold",
                          color: "#d70018",
                          fontSize: "16px",
                          textAlign: "left"
                        }}
                      >
                        {grandTotal.toLocaleString("vi-VN")} ₫
                      </td>
                    </tr>
                    <tr>
                      <td colSpan="4" style={{ textAlign: "right" }}>
                        Voucher
                      </td>
                      <td>
                        <input
                          type="text"
                          className="voucher-code"
                          value={voucher ? voucher.code : ""}
                          readOnly
                        />
                      </td>
                    </tr>
                    <tr>
                      <td colSpan="4" style={{ textAlign: "right" }}>
                        Thành tiền:
                      </td>
                      <td
                        colSpan="4"
                        style={{
                          fontWeight: "bold",
                          color: "#d70018",
                          fontSize: "18px",
                          textAlign: "left"
                        }}
                      >
                        {voucher
                          ? `${parseInt(
                              grandTotal -
                                grandTotal * (parseInt(voucher?.label) / 100)
                            ).toLocaleString("vi-VN")} ₫`
                          : `${grandTotal.toLocaleString("vi-VN")} ₫`}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            ) : (
              <p>Không có sản phẩm trong giỏ hàng.</p>
            )}
            <button className="complete-payment" onClick={handlePayment}>
              Thanh toán
            </button>
          </div>
          <LuckyWheelVoucher onVoucherSelected={handleVoucherSelection} />
        </div>
      </div>
    </div>
  );
};

export default OrderPage;

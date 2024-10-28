import React, { useEffect, useState } from "react";
import "./style.scss";
import { Link } from "react-router-dom";
import { ROUTERS } from "../../../utils/router";

const Dashboard = () => {
  const CardUser = () => {
    const [count, setCount] = useState(0);

    useEffect(() => {
      const fetchCount = async () => {
        try {
          const response = await fetch(
            "http://localhost:3009/api/user/getAllUser"
          );
          if (!response.ok) throw new Error(response.statusText);

          const dataUser = await response.json();
          setCount(dataUser.data.length);
        } catch (error) {
          console.error("Failed to fetch count for users:", error);
        }
      };

      fetchCount();
    }, []);

    return (
      <Link to={ROUTERS.ADMIN.MANAGE_STAFF}>
        <div className="card green">
          <div className="card-content">
            <h3>Tổng người dùng</h3>
            <p className="count">{count}</p>
          </div>
          <div className="icon">👤</div>
        </div>
      </Link>
    );
  };

  const CardOrders = () => {
    const [count, setCount] = useState(0);

    useEffect(() => {
      const fetchCount = async () => {
        try {
          const response = await fetch("http://localhost:3009/api/order/count");
          if (!response.ok) throw new Error(response.statusText);

          const data = await response.json();
          setCount(data.total);
        } catch (error) {
          console.error("Failed to fetch count for orders:", error);
        }
      };

      fetchCount();
    }, []);

    return (
      <Link to={ROUTERS.ADMIN.REVENUE_STATS}>
        <div className="card purple">
          <div className="card-content">
            <h3>Tổng đơn hàng</h3>
            <p className="count">{count}</p>
          </div>
          <div className="icon">🛒</div>
        </div>
      </Link>
    );
  };

  const CardProducts = () => {
    const [count, setCount] = useState(0);

    useEffect(() => {
      const fetchCount = async () => {
        try {
          const response = await fetch(
            "http://localhost:3009/api/product/getAllProduct"
          );
          if (!response.ok) throw new Error(response.statusText);

          const data = await response.json();
          setCount(data.total);
        } catch (error) {
          console.error("Failed to fetch count for products:", error);
        }
      };

      fetchCount();
    }, []);

    return (
      <Link to={ROUTERS.ADMIN.PRODUCT_LIST}>
        <div className="card blue">
          <div className="card-content">
            <h3>Tổng sản phẩm</h3>
            <p className="count">{count}</p>
          </div>
          <div className="icon">💻</div>
        </div>
      </Link>
    );
  };

  const CardReviews = () => {
    const [count, setCount] = useState(0);

    useEffect(() => {
      const fetchCount = async () => {
        try {
          const response = await fetch(
            "http://localhost:3009/api/review/count"
          );
          if (!response.ok) throw new Error(response.statusText);

          const data = await response.json();
          setCount(data.total);
        } catch (error) {
          console.error("Failed to fetch count for reviews:", error);
        }
      };

      fetchCount();
    }, []);

    return (
      <Link to={ROUTERS.ADMIN.PURCHASE_HISTORY}>
        <div className="card orange">
          <div className="card-content">
            <h3>Tổng đánh giá</h3>
            <p className="count">{count}</p>
          </div>
          <div className="icon">⭐</div>
        </div>
      </Link>
    );
  };

  return (
    <div className="dashboard-cards">
      <CardUser />
      <CardOrders />
      <CardProducts />
      <CardReviews />
    </div>
  );
};

export default Dashboard;

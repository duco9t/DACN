import { memo, useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../../../../component/admin/Sidebar/Sidebar";
import { NotificationProvider } from "../../../../middleware/NotificationContext";
import { UserProvider } from "../../../../middleware/UserContext";
import HeaderAdmin from "../header/header";
import "./style.scss";

import LoadingSpinner from "../../../../component/general/LoadingSpinner";
import NotFoundPage from "../../../../component/general/NotFoundPage";

const AdminLayout = (props) => {
  const [isAuthorized, setIsAuthorized] = useState(null);
  const [loading, setLoading] = useState(true);
  const refreshToken = async () => {
    const storedRefreshToken = localStorage.getItem("refresh_token");

    try {
      const response = await fetch("https://doanpro-production.up.railway.app/api/refresh-token", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ refresh_token: storedRefreshToken })
      });

      if (!response.ok) throw new Error("Unable to refresh token");

      const data = await response.json();

      localStorage.setItem("access_token", data.access_token);
      return data.access_token;
    } catch (error) {
      console.error("Token refresh failed:", error);
      window.location.href = "/login";
      return null;
    }
  };

  useEffect(() => {
    const checkAuthorization = async () => {
      try {
        const token = localStorage.getItem("access_token");

        if (!token) {
          setIsAuthorized(false);
          setLoading(false);
          return;
        }

        const response = await fetch("https://doanpro-production.up.railway.app/api/check/admin", {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        if (!response.ok) {
          const newToken = await refreshToken();
          if (!newToken) {
            setIsAuthorized(false);
            return;
          }

          const retryResponse = await fetch(
            "https://doanpro-production.up.railway.app/api/check/admin",
            {
              headers: {
                Authorization: `Bearer ${newToken}`
              }
            }
          );

          if (!retryResponse.ok) {
            setIsAuthorized(false);
            return;
          }
        }

        setIsAuthorized(true);
      } catch (error) {
        console.error("Lỗi xác thực:", error.message);
        setIsAuthorized(false);
      } finally {
        setLoading(false);
      }
    };

    checkAuthorization();
  }, []);

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!isAuthorized) {
    return <NotFoundPage replace />;
  }
  return (
    <UserProvider>
      <NotificationProvider>
        {/* <ChatbotWrapper /> */}
        <div {...props} className="container-layout">
          <HeaderAdmin />
          <div className="row">
            <div className="col-lg-3">
              <Sidebar />
            </div>
            <div className="col-lg-9 main-content">
              <Outlet />
            </div>
          </div>
        </div>
      </NotificationProvider>
    </UserProvider>
  );
};

export default memo(AdminLayout);

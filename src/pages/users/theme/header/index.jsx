import { memo, useState, useContext, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./style.scss";
import {
  AiOutlineHeart,
  AiOutlineShoppingCart,
  AiOutlineUser
} from "react-icons/ai";
import Login from "../../auth/login/Login";
import SignUp from "../../auth/signup/Signup";
import { Link } from "react-router-dom";
import { ROUTERS } from "../../../../utils/router";
import { UserContext } from "../../../../middleware/UserContext";

const Header = () => {
  const { user, countCart, updateCartCount } = useContext(UserContext);
  useEffect(() => {
    const getAllCart = async () => {
      if (!user || !user.dataUser) return;

      const id = user.dataUser.id;
      try {
        const response = await fetch(
          `http://localhost:3001/api/cart/get-cart/${id}`
        );
        if (!response.ok) throw new Error(response.statusText);
        const dataCart = await response.json();
        updateCartCount(dataCart.products.length);
      } catch (error) {
        console.error("Failed to fetch cart count:", error);
      }
    };
    getAllCart();
  }, [user, updateCartCount]);

  const navigate = useNavigate();

  const [isShowProfile, setShowProfile] = useState(false);
  const [isShowLoginForm, setShowLoginForm] = useState(false);
  const [isShowSignUpForm, setShowSignUpForm] = useState(false);
  const menusHeader = [
    { name: "Trang chủ", path: ROUTERS.USER.HOME },
    { name: "Sản phẩm", path: ROUTERS.USER.PRODUCTS },
    { name: "Liên hệ", path: ROUTERS.USER.CONTACTS },
    { name: "Tra cứu", path: ROUTERS.USER.ORDERLOOKUP }
  ];

  const location = useLocation();
  const { product } = location.state || {};

  const handleLoginClick = () => {
    setShowLoginForm(true);
  };

  const closeLoginForm = () => {
    setShowLoginForm(false);
  };
  const handleSignUpClick = () => {
    setShowSignUpForm(true);
  };

  const closeSignUpForm = () => {
    setShowSignUpForm(false);
  };
  const handleLogOutClick = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    window.location.reload();
  };
  const handleProfileClick = () => {
    navigate(ROUTERS.USER.PROFILE);
  };
  const handleAdminClick = () => {
    navigate("/admin");
  };
  const handleCart = () => {
    user
      ? navigate(`${ROUTERS.USER.CART}/${user.dataUser.id}`, {
          state: { product }
        })
      : alert("Vui lòng đăng nhập");
  };
  const handleFavourite = () => {
    user
      ? navigate(ROUTERS.USER.CART, { state: { product } })
      : alert("Vui lòng đăng nhập");
  };
  return (
    <>
      <div className="header-main">
        <div className="container-fixed ">
          <div className="row">
            <div className="col-xl-3">
              <div className="header-logo">
                <Link to={ROUTERS.USER.HOME}>
                  <img
                    style={{ width: "200px", height: "auto" }}
                    src={require("../../../../assets/users/header/1.png")}
                  />
                </Link>
              </div>
            </div>
            <div className="col-xl-6">
              <nav className="header-menu">
                <ul>
                  {menusHeader?.map((menu, menuKey) => (
                    <li key={menuKey} className={menuKey === 0 ? "active" : ""}>
                      <Link to={menu.path}>{menu?.name}</Link>
                    </li>
                  ))}
                </ul>
              </nav>
            </div>

            <div className="col-xl-3">
              <div className="header-cart">
                <ul>
                  <li>
                    <button onClick={handleFavourite}>
                      <AiOutlineHeart />
                    </button>
                  </li>
                  <li>
                    <button onClick={handleCart}>
                      <AiOutlineShoppingCart />
                    </button>
                    <span className="count-cart">{countCart}</span>
                  </li>
                  <li
                    className="profile-user"
                    onClick={() => setShowProfile(!isShowProfile)}
                  >
                    <button>
                      <AiOutlineUser />
                    </button>
                    {user
                      ? isShowProfile && (
                          <ul className="sub-profile">
                            <li onClick={handleProfileClick}>
                              Thông tin cá nhân
                            </li>
                            {user.dataUser.isAdmin && (
                              <li onClick={handleAdminClick}>Trang Admin</li>
                            )}
                            <li onClick={handleLogOutClick}>Đăng xuất</li>
                          </ul>
                        )
                      : isShowProfile && (
                          <ul className="sub-profile">
                            <li onClick={handleLoginClick}>Đăng nhập</li>
                            <li onClick={handleSignUpClick}>Đăng kí</li>
                          </ul>
                        )}
                  </li>
                  <li
                    className="text-user"
                    onClick={() => setShowProfile(!isShowProfile)}
                  >
                    {user ? (user.dataUser?.isAdmin ? "Admin" : "Khách") : ""}
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Login
        isShowLoginForm={isShowLoginForm}
        closeLoginForm={closeLoginForm}
      />
      <SignUp
        isShowSignUpForm={isShowSignUpForm}
        closeSignUpForm={closeSignUpForm}
      />
    </>
  );
};

export default memo(Header);

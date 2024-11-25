import { memo } from "react";
import "./style.scss";

import { Outlet } from "react-router-dom";
import { UserProvider } from "../../../../middleware/UserContext";
import SideBarProfile from "../../../../pages/users/profilePage/sidebarProfile";
import Footer from "../footer";
import Header from "../header";
import ChatbotWrapper from "../../../../component/general/ChatBox";
const ProfilePageLayout = (props) => {
  return (
    <UserProvider>
      <ChatbotWrapper />

      <Header />
      <div {...props} className="profile-page">
        <div className="container">
          <div className="row">
            <div className="col-lg-3 colleft ">
              <SideBarProfile />
            </div>
            <div className="col-lg-9 colright ">
              <div className="right-main">
                <Outlet />
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </UserProvider>
  );
};

export default memo(ProfilePageLayout);

import React from "react";
import { AiOutlineExclamationCircle } from "react-icons/ai";
import "./Popup.scss";

const Popup = ({ children, onClose }) => {
    return (
        <div className="popup">
            <AiOutlineExclamationCircle className="popup-icon" />
            {children}
            <button onClick={onClose}>Đóng</button>
        </div>
    );
};

export default Popup;

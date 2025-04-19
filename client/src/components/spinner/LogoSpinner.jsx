import React from "react";
import logo from "../../assets/helwan-logo.png";
import "./LogoSpinner.css";

const LogoSpinner = () => {
    return (
        <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
            <div
                className="spinner-grow slow-spin d-flex flex-column justify-content-center align-items-center"
                role="status"
            >
                <img src={logo} alt="logo" className="spinner-logo" />
                <span className="text-warning fs-6 loading-text">.....جاري التحميل</span>
            </div>
        </div>
    );
};

export default LogoSpinner;

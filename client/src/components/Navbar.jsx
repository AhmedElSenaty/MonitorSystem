import React, { useState, useEffect } from "react";
import "./Navbar.css";
import { useAuth } from "../Context/AuthContext";
import { useNavigate } from "react-router";

const Navbar = () => {
    const navigate = useNavigate();
    const {logout, user} = useAuth();
    const [role, setRole] = useState("");
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    // TODO: get Role from Auth Context use useState
    //   const role = "superadmin";
    // const role = "admin";
    // const role = "employee";
    // const isLoggedIn = true;
    // const isLoggedIn = false;
    useEffect(() => {
        setRole(user.role);
        setIsLoggedIn(user.isLoggedIn);
    })

    const onLogout = () => {
        console.log("Logout clicked");
        logout();
        navigate("/login");
    };

    return (
        <div>
            <nav className="navbar navbar-expand-lg shadow" style={{ backgroundColor: "#19355A" }} dir="rtl">
                <div className="container-fluid">
                    <a className="navbar-brand" >
                        <img src="/assets/helwan-logo.png" alt="Logo" width="50" height="50" className="d-inline-block align-text-top" />
                    </a>
                    <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarScroll" aria-controls="navbarScroll" aria-expanded="false" aria-label="Toggle navigation">
                        <span className="navbar-toggler-icon"></span>
                    </button>
                    <div className="collapse navbar-collapse" id="navbarScroll">
                        {role === "superadmin" && (
                            <ul className="navbar-nav me-auto my-2 my-lg-0 navbar-nav-scroll gap-2" style={{ "--bs-scroll-height": "100px" }}>
                                <li className="nav-item">
                                    <a className="nav-link" href="#" style={{ color: "white" }}>قائمة الموظفين</a>
                                </li>
                                <li className="nav-item " >
                                    <a className="nav-link" href="#" style={{ color: "white" }}>قائمة الكليات</a>
                                </li>
                            </ul>
                        )}
                        {isLoggedIn && (
                        <div className={role === "superadmin" ? "d-flex" : "d-flex me-auto my-2 my-lg-0"} role="logout">
                            <button className="btn btn-outline-info me-5" type="button" onClick={onLogout}>تسجيل خروج</button>
                        </div>
                        )}
                    </div>
                </div>
            </nav>
        </div>
    );
};

export default Navbar;

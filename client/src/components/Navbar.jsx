import React, { useState, useEffect } from "react";
import "./Navbar.css";
import { useAuth } from "../Context/AuthContext";
import { useNavigate, Link } from "react-router-dom";

const Navbar = () => {
    const navigate = useNavigate();
    const { logout, user } = useAuth();
    const [role, setRole] = useState(null);
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    // Sync local state when auth context changes
    useEffect(() => {
        if (user && user.isLoggedIn) {
            setRole(user.role);
            setIsLoggedIn(true);
        } else {
            setRole(null);
            setIsLoggedIn(false);
        }
    }, [user]);

    const onLogout = () => {
        logout();
        navigate("/login");
    };

    return (
        <nav className="navbar navbar-expand-lg shadow" style={{ backgroundColor: "#19355A" }} dir="rtl">
            <div className="container-fluid">
                <Link className="navbar-brand" to="/">
                    <img
                        src="/assets/helwan-logo.png"
                        alt="Logo"
                        width="50"
                        height="50"
                        className="d-inline-block align-text-top"
                    />
                </Link>
                {isLoggedIn && (
                    <button
                        className="navbar-toggler"
                        type="button"
                        data-bs-toggle="collapse"
                        data-bs-target="#navbarScroll"
                        aria-controls="navbarScroll"
                        aria-expanded="false"
                        aria-label="Toggle navigation"
                    >
                        <span className="navbar-toggler-icon"></span>
                    </button>
                )}
                <div className="collapse navbar-collapse" id="navbarScroll">
                    {role === "superadmin" && (
                        <ul className="navbar-nav me-auto my-2 my-lg-0 navbar-nav-scroll gap-2" style={{ "--bs-scroll-height": "100px" }}>
                            <li className="nav-item">
                                <Link className="nav-link" to="/admins" style={{ color: "white" }}>
                                    قائمة المشرفين
                                </Link>
                            </li>
                            <li className="nav-item">
                                <Link className="nav-link" to="/faculties" style={{ color: "white" }}>
                                    قائمة الكليات
                                </Link>
                            </li>
                            <li className="nav-item">
                                <Link className="nav-link" to="/requests" style={{ color: "white" }}>
                                    قائمة الطلبات
                                </Link>
                            </li>
                        </ul>
                    )}
                    {role === "admin" && (
                        <ul className="navbar-nav me-auto my-2 my-lg-0 navbar-nav-scroll gap-2" style={{ "--bs-scroll-height": "100px" }}>
                            <li className="nav-item">
                                <Link className="nav-link" to="/faculties" style={{ color: "white" }}>
                                    قائمة الكليات
                                </Link>
                            </li>
                        </ul>
                    )}
                    {isLoggedIn && (
                        <div className={( role === "superadmin" || role === "admin") ? "d-flex" : "d-flex me-auto my-2 my-lg-0"} role="logout">
                            <button className="btn btn-outline-info me-5" type="button" onClick={onLogout}>
                                تسجيل خروج
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;


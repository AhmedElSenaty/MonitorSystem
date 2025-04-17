import React from "react";
import logo from "/assets/helwan-logo.png"; // Replace with your actual path

const Navbar = () => {

    const role = "superAdmin";


//TODO: Replace with your actual logout function
    const onLogout = () => {
    console.log("Logout clicked");
  }
  return (
    <nav className="navbar navbar-expand p-3 shadow" style={{ backgroundColor: "#19355A" }} dir="ltr">
      <div className="container-fluid d-flex align-items-center justify-content-between text-white">

        {/* Logo */}
        <div className="d-flex align-items-center">
          <img src={logo} alt="Helwan Logo" style={{ height: 60 }} className="me-3" />
          
        </div>

        {/* Role-specific Links */}
        <div className="d-flex gap-4 align-items-center">
          {role === "superAdmin" && (
            <>
            {/* TODO: Super Admin Links */}
              <span className="nav-link text-white">قائمة الموظفين</span>
              <span className="nav-link text-white">قائمة الكليات</span>
            </>
          )}
          <button className="btn btn-outline-light ms-5" onClick={onLogout}>تسجيل خروج</button>
        </div>

      </div>
    </nav>
  );
};

export default Navbar;

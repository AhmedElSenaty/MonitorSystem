import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./Login.css"; // for custom styles
import { decodeJWT } from "../../utils/decodeJWT";
import {useAuth} from '../../Context/AuthContext'
const Login = () => {
    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false);
    const {setUser} = useAuth();
        const [loader, setLoader] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm();

  //TODO: post method
    const onSubmit = async (data) => {
      setLoader(true);
    try {
      //change url
        const res = await axios.post(`https://localhost:7057/api/Account/Login`, {
        
          "email": data.email,
          "password": data.password
        
      });

      if (res.data  ) {
        toast.success("تم تسجيل الدخول بنجاح", { rtl: true });
          // Proceed with navigation or state update
          
          const token = decodeJWT(res.data.data.token);
          const userData = {
              id: token.Id,
              role: token.role.toLowerCase(),
              token: res.data.data.token,
              isLoggedIn: true
          }
          setUser(userData);
          localStorage.setItem("user", JSON.stringify(userData));
          switch (token.role.toLowerCase()) {
              case "admin":
                  navigate("/requests");
                  break;
              case "superadmin":
                  navigate("/admins");
                  break;
              case "employee":
                  navigate(`/profile/${token.Id}`);
                  break;
          }
      } else {
        toast.error("بيانات الدخول غير صحيحة", { rtl: true });
      }
    } catch (error) {
        // toast.error("حدث خطأ أثناء محاولة الدخول", { rtl: true });
        // Object.values(error.response.data.data.errors).forEach(msg => toast.error(msg, { rtl: true }));
        // console.warn(error.response.data.data.errors);
        setLoader(false);

        // If axios got a response from the server with an error status:
        if (error.response && error.response.data) {
            const errs = error.response.data.data?.errors;
            if (errs) {
                // iterate over API validation errors
                Object.values(errs).forEach(msg => toast.error(msg, { rtl: true }));
            } else if (error.response.data.message) {
                // or a single error message
                toast.error(error.response.data.message, { rtl: true });
            } else {
                toast.error('حدث خطأ في الاستجابة من الخادم', { rtl: true });
            }
        }
        // If no response at all (network error, CORS, timeout, etc.)
        else {
            toast.error('تعذر الاتصال بالخادم. الرجاء التحقق من الإنترنت.', { rtl: true });
        }

        console.error('Login error:', error);
    }finally{
        setLoader(false);
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
      <div
        className="d-flex shadow rounded overflow-hidden login-container"
        style={{ maxWidth: 900, width: "100%", height: "70%" }}
      >
        {/* Left Side: Image */}
        <div
          className="login-left d-none d-md-block"
          style={{ maxWidth: 500, width: "100%" }}
        />

        {/* Right Side: Form */}
        <div className="bg-white p-5 w-100" dir="rtl">
          <h4 className="mb-4 text-center fw-bold pb-5 pt-3">تسجيل الدخول</h4>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="mb-3">
              <input
                className="form-control"
                placeholder="البريد الإلكتروني"
                {...register("email", { required: "هذا الحقل مطلوب" })}
              />
              {errors.email && (
                <small className="text-danger">{errors.email.message}</small>
              )}
            </div>

            <div className="mb-3">
            <input
                type={ showPassword ? "text" : "password"}
                className="form-control"
                placeholder="كلمة مرور"
                              {...register("password", { required: "كلمة المرور مطلوبة" })}
                              onMouseEnter={() => setShowPassword(true)}
                              onMouseLeave={() => setShowPassword(false)}
              />
              {errors.password && (
                <small className="text-danger">{errors.password.message}</small>
              )}
            </div>

            {loader ? (
              <div className="d-flex justify-content-center align-item-center row mt-4">
                <div className="spinner-border" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
              </div>
            ) : (
              <button type="submit" className="btn btn-primary w-100 mb-4 mt-3">
                تسجيل الدخول
              </button>
            )}

            <div className="text-center mt-3">
              {/* navigate to register  onClick={() => navigate("/register")} */}
              <p>في حالة عدم التسجيل من قبل</p>
              <button
                type="button"
                className="btn btn-warning w-100"
                onClick={() => navigate("/register")}
              >
                اضغط هنا
              </button>
            </div>
          </form>
        </div>
      </div>
      <ToastContainer position="top-center" rtl autoClose={3000} />
    </div>
  );
};


export default Login;

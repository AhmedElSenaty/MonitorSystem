import React from "react";
import { useForm } from "react-hook-form";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
// import { useNavigate } from "react-router-dom";
import "./Login.css"; // for custom styles

const Login = () => {
  // const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm();

  //TODO: post method
  const onSubmit = async (data) => {
    try {
      //change url
      const res = await axios.get(`http://localhost:3001/users`, {
        params: {
          email: data.email,
          password: data.password
        }
      });

      if (res.data.length > 0) {
        toast.success("تم تسجيل الدخول بنجاح");
        // Proceed with navigation or state update
      } else {
        toast.error("بيانات الدخول غير صحيحة");
      }
    } catch (error) {
      toast.error("حدث خطأ أثناء محاولة الدخول");
      console.error(error);
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
      <div className="d-flex shadow rounded overflow-hidden login-container" style={{ maxWidth: 900, width: "100%", height: "70%" }}>
        {/* Left Side: Image */}
        <div className="login-left d-none d-md-block" style={{ maxWidth: 500, width: "100%" }} />

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
              {errors.email && <small className="text-danger">{errors.email.message}</small>}
            </div>

            <div className="mb-3">
              <input
                type="password"
                className="form-control"
                placeholder="كلمة مرور"
                {...register("password", { required: "كلمة المرور مطلوبة" })}
              />
              {errors.password && <small className="text-danger">{errors.password.message}</small>}
            </div>

            <button type="submit" className="btn btn-primary w-100 mb-4 mt-3">تسجيل الدخول</button>

            <div className="text-center mt-3">
              {/* navigate to register  onClick={() => navigate("/register")} */}
              <p>في حالة عدم التسجيل من قبل</p>
              <button type="button" className="btn btn-warning w-100">اضغط هنا</button>
            </div>
          </form>
        </div>
      </div>
      <ToastContainer position="top-center" rtl autoClose={3000} />
    </div>
    
  );
};


export default Login;

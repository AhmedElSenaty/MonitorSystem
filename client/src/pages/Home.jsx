
import "../pages/login/Login.css"; // for custom styles



const Home = () => {
    return (
        <div className="d-flex justify-content-center align-items-center vh-100 bg-light ">
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
                    <h3 className="mb-4 text-center fw-bold pb-2 pt-3">مرحبا بكم في نظام تسجيل الملاحظين</h3>
                    <h4 className="mb-4 text-center fw-bold pb-5 pt-3">جامعة حلوان</h4>
                </div>
            </div>
        </div>
    );
}

export default Home;
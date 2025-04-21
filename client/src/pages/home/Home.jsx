import React from 'react';
import './Home.css'; // Optional, for custom styles
import { Link } from 'react-router';
const Home = () => {
    return (
        <div className="home-page d-flex justify-content-center align-items-start pt-5 text-dark  text-center">
            <div className="container">
                <img
                    src="/assets/helwan-logo.png"
                    alt="Background"
                    className='p-4 rounded-5 '
                    style={{ zIndex: -1, backgroundColor: '#19355A' }}
                    width={150}
                    height={150}
                />
                <h1 className="display-2 fw-bolder">مرحبًا بك في نظام تسجيل الملاحظين</h1>
                <p className="lead fw-bold">هذه الصفحة الرئيسية لموقعنا. استمتع بتجربتك!</p>
                <Link to={"/login"} >
                    <span className="btn rounded-3 btn-warning mt-3 px-4">ابداء الان</span>
                </Link>
            </div>
        </div>
    );
};

export default Home;

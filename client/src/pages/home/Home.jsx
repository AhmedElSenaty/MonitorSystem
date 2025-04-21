import React from 'react';
import { Link } from 'react-router-dom'; // Correct import
import './Home.css';

const Home = () => {
    return (
        <div className="home-page position-relative d-flex justify-content-center align-items-center text-white text-center">
            <div className="overlay position-absolute top-0 start-0 w-100 h-100" />
            <div className="container position-relative z-2">
                <h1 className="display-4 fw-bold ">مرحبًا بك في نظام تسجيل الملاحظين</h1>
                <p className="lead fw-semibold">هذه الصفحة الرئيسية لموقعنا. استمتع بتجربتك!</p>
                <Link to="/login">
                    <span className="btn btn-warning mt-3 px-4 rounded-3">ابدأ الآن</span>
                </Link>
            </div>
        </div>
    );
};

export default Home;

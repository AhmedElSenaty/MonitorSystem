import '../node_modules/bootstrap/dist/css/bootstrap.min.css';
import '../node_modules/bootstrap/dist/js/bootstrap.min.js';
import '../node_modules/bs-stepper/dist/css/bs-stepper.min.css';
import "bootstrap-icons/font/bootstrap-icons.css";
import "./App.css";


import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';

import Navbar from "./components/Navbar";
import Footer from "./components/footer";
import RegisterForm from './pages/register/Register';
import Login from "./pages/login/Login";
import PersonalInfoPortal from "./pages/profile/Profile";
import Requests from "./components/Tables/Requests";
import Faculties from "./components/Tables/Faculties";
import Admins from './components/Tables/Admins';
import Managers from './components/Tables/Managers';
import Employees from './components/Tables/Employees';
import Home from './pages/home/Home';
import FacultyRequests from './components/Tables/FacultyRequests';

const App = () => {
    // const base = "/HU-FingerPrint2";
    const base = "";
    return (
        <BrowserRouter>
            <Navbar />
            <ToastContainer position="top-center" />
            <Routes>
                <Route path={base} element={<Home />} />
                <Route path='/' element={<Home />} />
                <Route path={`${base}/register`} element={<RegisterForm />} />
                <Route path={`${base}/login`} element={<Login />} />
                <Route path={`${base}/profile/:id?/:reqID?`} element={<PersonalInfoPortal />} />
                <Route path={`${base}/requests`} element={<Requests />} />
                <Route path={`${base}/faculties/:empID?`} element={<Faculties />} />
                <Route path={`${base}/admins`} element={<Admins />} />
                <Route path={`${base}/managers`} element={<Managers />} />
                <Route path={`${base}/faculty/requestes`} element={<FacultyRequests />} />
                <Route path={`${base}/employees`} element={<Employees />} />
                <Route path={`${base}/NotAuthourized`} element={<NotAuthourized />} />
                <Route path="/*" element={<NotFound />} />

            </Routes>
            <Footer />
        </BrowserRouter>
    );
};

export default App;

const UnderDevelopment = () => {
    return (
        <div className='h-screen flex items-center justify-center m-5 text-center'>
            <h1 className='alert alert-primary text-3xl font-bold'>Under Development</h1>
        </div>
    )
}
const NotFound = () => {
    return (
        <div className='h-screen vh-100 flex items-center justify-center m-5 text-center'>
            <h1 className='alert alert-danger text-3xl font-bold'>Not Found <strong>404</strong></h1>
        </div>
    )
}
const NotAuthourized = () => {
    return (
        <div className='vh-100 h-screen flex items-center justify-center m-5 text-center'>
            <h1 className='alert alert-warning text-3xl font-bold'>Not Authourized <strong>401</strong></h1>
        </div>
    )
}
export const NotLoaded = ({ reload }) => {
    return (
        <div className='vh-100 h-screen flex items-center justify-center m-5 text-center'>
            {/* <h1 className='alert alert-warning text-3xl font-bold'>Error: Faild To Load Data  <strong>500</strong></h1> */}
            <h2 className='alert alert-warning text-3xl font-bold'>حدث خطأ اثناء تحميل البيانات</h2>
            <button className='btn btn-primary w-25' onClick={reload}>
                <i className="bi bi-arrow-clockwise fs-4">  اعد التحميل </i>
            </button>
        </div>
    )
}

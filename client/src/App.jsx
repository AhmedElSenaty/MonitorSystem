import '../node_modules/bootstrap/dist/css/bootstrap.min.css';
import '../node_modules/bs-stepper/dist/css/bs-stepper.min.css';
import "bootstrap-icons/font/bootstrap-icons.css";
import "./App.css";


import { BrowserRouter, Route, Routes } from 'react-router-dom';
import {ToastContainer} from 'react-toastify';

import Navbar from "./components/Navbar";
import Footer from "./components/footer";
import RegisterForm from './pages/register/Register';
import Login from "./pages/login/Login";
import PersonalInfoPortal from "./pages/profile/Profile";
import Requests from "./components/Tables/Requests";
import Faculties from "./components/Tables/Faculties";
import Admins from './components/Tables/Admins';

const App = () => {
    return (
        <BrowserRouter>
            <Navbar />
            <ToastContainer position="top-center" />
            <Routes>
                <Route index element={<Login />} />
                <Route path="/register" element={<RegisterForm />} />
                <Route path="/login" element={<Login />} />
                <Route path="/profile/:id?/:reqID?" element={<PersonalInfoPortal />} />
                <Route path="/requests" element={<Requests />} />
                <Route path="/faculties/:empID?" element={<Faculties />} />
                <Route path="/admins" element={<Admins />} />
                <Route path="/NotAuthourized" element={<NotAuthourized />} />
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
        <div className='h-screen flex items-center justify-center m-5 text-center'>
            <h1 className='alert alert-danger text-3xl font-bold'>Not Found <strong>404</strong></h1>
        </div>
    )
}
const NotAuthourized = () => {
    return (
        <div className='h-screen flex items-center justify-center m-5 text-center'>
            <h1 className='alert alert-warning text-3xl font-bold'>Not Authourized <strong>401</strong></h1>
        </div>
    )
}
export const NotLoaded = () => {
    return (
        <div className='h-screen flex items-center justify-center m-5 text-center'>
            <h1 className='alert alert-warning text-3xl font-bold'>Error: Faild To Load Data  <strong>500</strong></h1>
        </div>
    )
}

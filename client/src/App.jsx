import '../node_modules/bootstrap/dist/css/bootstrap.min.css';
import '../node_modules/bs-stepper/dist/css/bs-stepper.min.css';
import "bootstrap-icons/font/bootstrap-icons.css";
import "./App.css";


import { BrowserRouter, Route, Routes } from 'react-router-dom';

import Navbar from "./components/Navbar";
import Footer from "./components/footer";
import RegisterForm from './pages/register/Register';
import Login from "./pages/login/Login";
import PersonalInfoPortal from "./pages/profile/Profile";
import Requests from "./components/Tables/Requests";
// import Faculties from "./components/Tables/Faculties";


const App = () => {
    return (
        <BrowserRouter>
            <Navbar />
            <Routes>
                <Route path="/" element={<UnderDevelopment />} />
                <Route path="/register" element={<RegisterForm />} />
                <Route path="/login" element={<Login />} />
                <Route path="/profile" element={<PersonalInfoPortal />} />
                <Route path="/requests" element={<Requests />} />
                <Route path="/faculties" element={<Faculties />} />
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

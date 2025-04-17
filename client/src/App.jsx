import '../node_modules/bootstrap/dist/css/bootstrap.min.css';
import '../node_modules/bs-stepper/dist/css/bs-stepper.min.css';
import "bootstrap-icons/font/bootstrap-icons.css";
import "./App.css";

import { BrowserRouter, Route, Routes } from 'react-router-dom';

import Navbar from "./components/Navbar";
import RegisterForm from './pages/register/Register';
import Login from "./pages/login/Login";


const App = () => {
    return (
        <BrowserRouter>
            <Navbar />
            <Routes>
                <Route path="/" element={<UnderDevelopment />} />
                <Route path="/register" element={<RegisterForm />} />
                <Route path="/login" element={<Login/>} />
            </Routes>
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

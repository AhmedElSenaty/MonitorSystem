import '../node_modules/bootstrap/dist/css/bootstrap.min.css';
import '../node_modules/bs-stepper/dist/css/bs-stepper.min.css';
import "bootstrap-icons/font/bootstrap-icons.css";
import "./App.css";
import 'bootstrap/dist/css/bootstrap.min.css';
// import Login from "./components/login/Login";
// import Faculties from "./components/Tables/Faculties";
import Admins from "./components/Tables/Admins";


const App = () => {
    return (
        <>
        {/* <Login/> */}
        {/* <Faculties/> */}
        <Admins/>
        </>
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

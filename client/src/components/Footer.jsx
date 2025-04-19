
const Footer = () => {
    return (
        <div
            className="d-flex flex-column justify-content-center align-items-center text-white text-center px-3"
            style={{ backgroundColor: '#19355A', minHeight: '5em' }}
            dir="rtl"
        >
            <div className="d-flex gap-2 flex-wrap justify-content-center">
                <span className="text-white text-decoration-none">جميع الحقوق محفوظه لمركز الاتصالات وتكنولوجيا المعلومات - جامعة حلوان </span>
                <span>&copy; 2025</span>
            </div>
        </div>
    );
};



export default Footer

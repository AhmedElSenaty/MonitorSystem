/* eslint-disable no-unused-vars */
import React, { useState, useRef, useEffect } from "react";
import { Modal, Button } from 'react-bootstrap';
import axios from "axios";
import { useNavigate, useParams } from "react-router";
import { toast } from "react-toastify"

const PersonalInfoPortal = () => {
    const navigate = useNavigate();
    const { id } = useParams();

    // useEffect(() => {
    //     if (!id) {
    //         toast.error("يرجى تسجيل الدخول",{rtl: true});
    //         navigate("/login");
    //     }
    // }, [id]);

    const originalData = {
        name: "احمد محمد عمر",
        address: "القاهرة الجديدة",
        degree: "خريج",
        job: "معيد",
        ssn: "123456789",
        phone: "0100100100",
        email: "7x8e9@example.com",
        gender: "ذكر",
        DOB: "01/01/2000",
    };
    const [isEditing, setIsEditing] = useState(false);
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState({ ...originalData });

    const fileInputs = {
        personal: useRef(),
        degree: useRef(),
        idFront: useRef(),
        idBack: useRef(),
    };
    const [files, setFiles] = useState({
        personal: null,
        degree: null,
        idFront: null,
        idBack: null,
    });

    const handleChange = (field, value) =>
        setData((prev) => ({ ...prev, [field]: value }));

    const startEdit = () => setIsEditing(true);
    const cancelEdit = () => {
        setData({ ...originalData });
        setIsEditing(false);
    };
    const role = "employee";
    // const role = "admin";

    const isAdmin = role === "admin";
    const isEmployee = role === "employee";

    const requests = [
        { status: "تم القبول", notes: "لا يوجد ملاحظات" },
        { status: "تحت المراجعة", notes: "لا يوجد ملاحظات" },
        { status: "تم الرفض", notes: "الصورة غير واضحة" },
        { status: "تحت المراجعة", notes: "لا يوجد ملاحظات" },
    ];

    const [request, setRequest] = useState(requests[0]);
    const statusClass = (s) =>
        s === "تم القبول"
            ? "text-success"
            : s === "تحت المراجعة"
                ? "text-warning"
                : "text-danger";


    // Modal state for adding notes
    const [showModal, setShowModal] = useState(false);
    const [currentRequest, setCurrentRequest] = useState(null);
    const [noteText, setNoteText] = useState('');

    const openModal = (request) => {
        setCurrentRequest(request);
        setNoteText(request.notes || '');
        setShowModal(true);
    };
    const closeModal = () => {
        setShowModal(false);
        setCurrentRequest(null);
        setNoteText('');
    };
    const saveNote = () => {
        if (currentRequest) {
            currentRequest.notes = noteText;
        }
        closeModal();
    };

    // Validation logic matching RegisterForm
    const validateData = () => {
        const errors = {};
        if (!data.name.trim()) errors.name = 'الاسم مطلوب';
        if ((data.name.trim().match(/ /g) || []).length < 3) errors.name = 'الاسم يجب ان يحتوي على اربع كلمات على الاقل';
        if (!data.ssn.trim()) errors.ssn = 'الرقم القومي مطلوب';
        if (!/^\d{14}$/.test(data.ssn)) errors.ssn = 'الرقم القومي يجب أن يكون 14 رقمًا';
        if (!/^01[0-9]{9}$/.test(data.phone)) errors.phone = 'رقم الهاتف غير صالح';
        if (!/\S+@\S+\.\S+/.test(data.email)) errors.email = 'البريد الإلكتروني غير صالح';
        if (!data.address.trim()) errors.address = 'العنوان مطلوب';
        if (!data.degree.trim()) errors.degree = 'المؤهل مطلوب';
        if (!data.job.trim()) errors.job = 'الوظيفة مطلوبة';
        if (!data.gender.trim()) errors.gender = 'النوع مطلوب';
        if (!/^\d{2}\/\d{2}\/\d{4}$/.test(data.DOB)) errors.DOB = 'تاريخ الميلاد بصيغة DD/MM/YYYY';
        return errors;
    };
    // Improved file handler with immediate validation
    const handleFile = (type, file) => {
        const MAX_FILE_SIZE = 1 * 1024 * 1024; // 1MB
        const ALLOWED_FILE_TYPES = ['image/jpeg', 'image/jpg'];

        if (!file) return;
        const label = type === 'personal' ? 'الصورة الشخصية' :
            type === 'degree' ? 'صورة المؤهل' :
                type === 'idFront' ? 'صورة البطاقة (وجه)' : 'صورة البطاقة (ظهر)';
        if (!ALLOWED_FILE_TYPES.includes(file.type)) {
            toast.error(`${label}: نوع الملف غير مدعوم \n(jpg, jpeg فقط)`, { rtl: true,autoClose: 5000 });
            return;
        }
        if (file.size > MAX_FILE_SIZE) {
            toast.error(`${label}: حجم الملف كبير جدًا \n( 1MB أقصى حجم)`, { rtl: true,autoClose: 5000 });
            return;
        }
        setFiles(prev => ({ ...prev, [type]: file }));
    };

    const saveEdit = async () => {
        setLoading(true);
        const errors = validateData();
        if (Object.keys(errors).length > 0) {
            Object.values(errors).forEach(msg => toast.error(msg, { rtl: true }));
            setLoading(false);
            return;
        }

        const formData = new FormData();
        Object.entries(data).forEach(([key, value]) => formData.append(key, value));
        Object.entries(files).forEach(([key, file]) => {
            if (file) formData.append(key, file);
        });

        try {
            const response = await axios.get("http://localhost:3000/users?_delay=10000").then((res) => res.data);
            console.log(response);
            // TODO: change url
            // const response = await axios.post("http://localhost:3000/users?_delay=1000s", formData, {
            //     headers: {
            //         'Content-Type': 'multipart/form-data'
            //     }
            // });
            toast.success("تم تحديث البيانات بنجاح", { rtl: true });
            setIsEditing(false);
        } catch (error) {
            console.error("Error updating profile:", error);
            toast.error("حدث خطأ أثناء تحديث البيانات.", { rtl: true });
        } finally {
            setLoading(false);
        }
    };



    return (
        <div
            dir="rtl"
            className="container-fluid p-0"
            style={{ backgroundColor: "#EBEFF5" }}
        >
            <div className="container py-4 w-100">
                {/* Personal Data Table */}
                <div className="row justify-content-center mb-5">
                    <div className="col-12 col-lg-12">
                        {/* Personal Data Section */}
                        <div className="d-flex justify-content-between align-items-center mb-3">
                            <h2>البيانات الشخصية</h2>
                            {!isEditing && isEmployee ? (
                                <button className="btn btn-primary px-5" onClick={startEdit}>
                                    تعديل
                                </button>
                            ) : (
                                isEmployee && (
                                    <div className="d-flex">
                                        {!loading && (
                                            <>
                                                <button
                                                    className="btn btn-success me-1 mx-2 px-3"
                                                    onClick={saveEdit}
                                                >
                                                    حفظ
                                                </button>
                                                <button
                                                    className="btn btn-danger mx-2 px-3"
                                                    onClick={cancelEdit}
                                                >
                                                    إلغاء
                                                </button>
                                            </>
                                        )}
                                        {loading && (
                                            <div className="spinner-border text-primary" role="status">
                                                <span className="visually-hidden">Loading...</span>
                                            </div>
                                        )}
                                    </div>
                                )
                            )}
                        </div>
                        <div className="bg-white rounded shadow-lg">
                            <table
                                className="table mb-0 w-100"
                                style={{ borderRadius: "8px", overflow: "hidden" }}
                            >
                                <tbody>
                                    <tr>
                                        <td
                                            style={{ backgroundColor: "#ECECF1" }}
                                            className=" text-center"
                                        >
                                            الرقم المسلسل
                                        </td>
                                        <td className="text-center">100001</td>
                                        <td
                                            style={{ backgroundColor: "#ECECF1" }}
                                            className=" text-center"
                                        >
                                            الرقم القومي
                                        </td>
                                        <td className="text-center">
                                            {isEditing ? (
                                                <input
                                                    className="form-control text-center"
                                                    value={data.ssn}
                                                    onChange={(e) => handleChange("ssn", e.target.value)}
                                                />
                                            ) : (
                                                <span>{data.ssn}</span>
                                            )}
                                        </td>
                                    </tr>
                                    <tr>
                                        <td
                                            style={{ backgroundColor: "#ECECF1" }}
                                            className=" text-center"
                                        >
                                            الاسم
                                        </td>
                                        <td className="text-center">
                                            {isEditing ? (
                                                <input
                                                    className="form-control text-center"
                                                    value={data.name}
                                                    onChange={(e) => handleChange("name", e.target.value)}
                                                />
                                            ) : (
                                                <span>{data.name}</span>
                                            )}
                                        </td>
                                        <td
                                            style={{ backgroundColor: "#ECECF1" }}
                                            className=" text-center"
                                        >
                                            العنوان
                                        </td>
                                        <td className="text-center">
                                            {isEditing ? (
                                                <input
                                                    className="form-control text-center"
                                                    value={data.address}
                                                    onChange={(e) =>
                                                        handleChange("address", e.target.value)
                                                    }
                                                />
                                            ) : (
                                                <span>{data.address}</span>
                                            )}
                                        </td>
                                    </tr>
                                    <tr>
                                        <td
                                            style={{ backgroundColor: "#ECECF1" }}
                                            className=" text-center"
                                        >
                                            الهاتف
                                        </td>
                                        <td className="text-center">
                                            {isEditing ? (
                                                <input
                                                    className="form-control text-center"
                                                    value={data.phone}
                                                    onChange={(e) =>
                                                        handleChange("phone", e.target.value)
                                                    }
                                                />
                                            ) : (
                                                <span>{data.phone}</span>
                                            )}
                                        </td>
                                        <td
                                            style={{ backgroundColor: "#ECECF1" }}
                                            className=" text-center"
                                        >
                                            المؤهل
                                        </td>
                                        <td className="text-center">
                                            {isEditing ? (
                                                <input
                                                    className="form-control text-center"
                                                    value={data.degree}
                                                    onChange={(e) =>
                                                        handleChange("degree", e.target.value)
                                                    }
                                                />
                                            ) : (
                                                <span>{data.degree}</span>
                                            )}
                                        </td>
                                    </tr>
                                    <tr>
                                        <td
                                            style={{ backgroundColor: "#ECECF1" }}
                                            className=" text-center"
                                        >
                                            البريد الالكتروني
                                        </td>
                                        <td className="text-center">
                                            {isEditing ? (
                                                <input
                                                    className="form-control text-center"
                                                    value={data.email}
                                                    onChange={(e) =>
                                                        handleChange("email", e.target.value)
                                                    }
                                                />
                                            ) : (
                                                <span>{data.email}</span>
                                            )}
                                        </td>
                                        <td
                                            style={{ backgroundColor: "#ECECF1" }}
                                            className=" text-center"
                                        >
                                            الوظيفة
                                        </td>
                                        <td className="text-center">
                                            {isEditing ? (
                                                <input
                                                    className="form-control text-center"
                                                    value={data.job}
                                                    onChange={(e) => handleChange("job", e.target.value)}
                                                />
                                            ) : (
                                                <span>{data.job}</span>
                                            )}
                                        </td>
                                    </tr>
                                    <tr>
                                        <td
                                            style={{ backgroundColor: "#ECECF1" }}
                                            className=" text-center"
                                        >
                                            النوع
                                        </td>
                                        <td className="text-center">
                                            <span>{data.gender}</span>
                                        </td>
                                        <td
                                            style={{ backgroundColor: "#ECECF1" }}
                                            className=" text-center"
                                        >
                                            تاريخ الميلاد
                                        </td>
                                        <td className="text-center">
                                            <span>{data.DOB}</span>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                {/* Attachments Section */}
                <h2 className="mb-3">المرفقات</h2>
                <div className="row row-cols-1 row-cols-md-2 row-cols-lg-2 g-4 mb-5 justify-content-center">
                    {[
                        { type: "degree", label: "صورة المؤهل" },
                        { type: "personal", label: "صورة الشخصية" },
                        { type: "idFront", label: "صورة البطاقة وجه" },
                        { type: "idBack", label: "صورة البطاقة ظهر" },
                    ].map(({ type, label }) => (
                        <div key={type} className="col d-flex justify-content-center">
                            <div
                                className="card shadow-sm p-3 text-center"
                                style={{ width: "100%" }}
                            >
                                <div className="fw-bold mb-2">{label}</div>

                                {isAdmin && (
                                    <div
                                        className="mx-auto mb-2"
                                        style={{
                                            width: "100%",
                                            height: "150px",
                                            backgroundColor: files[type] ? "transparent" : "#EFF1F5",
                                            border: "1px dashed #CFB53B",
                                            borderRadius: "8px",
                                            position: "relative",
                                        }}
                                    >
                                        {files[type] ? (
                                            <img
                                                src={URL.createObjectURL(files[type])}
                                                alt={label}
                                                className="img-fluid"
                                                style={{ maxHeight: "100%", maxWidth: "100%" }}
                                            />
                                        ) : (
                                            <i
                                                className="bi bi-card-image text-secondary"
                                                style={{ fontSize: "2.5rem", lineHeight: "150px" }}
                                            ></i>
                                        )}
                                    </div>
                                )}
                                {isEmployee && (
                                    <>
                                        <div
                                            className="mx-auto mb-2"
                                            style={{
                                                width: "100%",
                                                height: "150px",
                                                backgroundColor: files[type]
                                                    ? "transparent"
                                                    : "#EFF1F5",
                                                border: "1px dashed #CFB53B",
                                                borderRadius: "8px",
                                                cursor: "pointer",
                                                position: "relative",
                                            }}
                                            onClick={() => fileInputs[type].current.click()}
                                        >
                                            {files[type] ? (
                                                <img
                                                    src={URL.createObjectURL(files[type])}
                                                    alt={label}
                                                    className="img-fluid"
                                                    style={{ maxHeight: "100%", maxWidth: "100%" }}
                                                />
                                            ) : (
                                                <i
                                                    className="bi bi-card-image text-secondary"
                                                    style={{ fontSize: "2.5rem", lineHeight: "150px" }}
                                                ></i>
                                            )}
                                            <input
                                                type="file"
                                                accept="image/jpeg, image/jpg"
                                                ref={fileInputs[type]}
                                                style={{ display: "none" }}
                                                onChange={(e) => handleFile(type, e.target.files[0])}
                                            />
                                        </div>
                                        <button
                                            className="btn"
                                            style={{
                                                border: "1px solid #CFB53B",
                                                color: "#CFB53B",
                                                borderRadius: "5px",
                                                width: "100%",
                                            }}
                                            onClick={() => fileInputs[type].current.click()}
                                        >
                                            تعديل
                                        </button>
                                    </>
                                )}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Requests Section */}
                <h2 className="mb-3">حالة الطلب</h2>
                <div className="row justify-content-center">
                    <div className="col-12 col-lg-12">
                        <table className="table table-bordered text-center mb-0 w-100 shadow-lg">
                            <thead className="bg-light">
                                <tr>
                                    <th>الحالة</th>
                                    <th>ملاحظات</th>
                                    <th>تحكم</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr className="align-middle">
                                    <td className={statusClass(request.status)}>
                                        {request.status}
                                    </td>
                                    <td dir="rtl" className="text-break" style={{ whiteSpace: 'pre-wrap', maxWidth: '300px' }}>
                                        {request.notes || <span className="text-muted">لا توجد ملاحظات</span>}
                                    </td>
                                    <td>
                                        {/* TODO: add events to redirect use to the tables page */}
                                        {isEmployee && (
                                            <button
                                                className="btn btn-outline-primary btn-main btn-sm"
                                                onClick={() => navigate('/faculties')}
                                                disabled={request.status === "تحت المراجعة" || request.status === "تم الرفض"}
                                                style={{ backgroundColor: '#19355A', cursor: request.status === "تحت المراجعة" || request.status === "تم الرفض" ? "not-allowed" : "pointer" }}
                                            >
                                                عرض الكليات
                                            </button>
                                        )}
                                        {isAdmin && request.status === "تم الرفض" && (
                                            <button style={{ backgroundColor: '#19355A' }} className="btn btn-outline-primary btn-main btn-sm" onClick={() => openModal(request)}>
                                                اضف ملاحظة
                                            </button>
                                        )}
                                        {isAdmin && (
                                            <>
                                                {request.status === "تحت المراجعة" && (
                                                    <>
                                                        {/* TODO: add events to add requests to the database */}
                                                        <button className="btn btn-outline-success btn-sm mx-2">
                                                            قبول
                                                        </button>
                                                        <button className="btn btn-outline-danger btn-sm mx-2">
                                                            رفض
                                                        </button>
                                                    </>
                                                )}
                                                {request.status === "تم القبول" && (
                                                    <button className="btn btn-outline-primary btn-sm" onClick={() => navigate("/faculties")}>
                                                        اضف كليات
                                                    </button>
                                                )}
                                            </>
                                        )}
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Notes Modal */}
                <Modal show={showModal} onHide={closeModal} dialogClassName="modal-lg text-end" dir="rtl">
                    <Modal.Header className="flex-row-reverse " >
                        <button type="button" className="btn-close" aria-label="إغلاق" onClick={closeModal}></button>
                        <Modal.Title style={{ marginLeft: '68%' }}>إضافة / تعديل ملاحظة</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <textarea
                            className="form-control"
                            rows={5}
                            value={noteText}
                            onChange={e => setNoteText(e.target.value)}
                            dir="rtl"
                        />
                    </Modal.Body>
                    <Modal.Footer className="flex-row-reverse">
                        <Button variant="danger" onClick={closeModal}>إلغاء</Button>
                        <Button variant="success" onClick={saveNote}>حفظ التغييرات</Button>
                    </Modal.Footer>
                </Modal>

            </div>
        </div>
    );
};

export default PersonalInfoPortal;

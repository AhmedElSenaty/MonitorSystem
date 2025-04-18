import { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashCan, faChevronRight, faPlus, faFileExcel } from '@fortawesome/free-solid-svg-icons';
import { faSquare as faSquareRegular, faSquareCheck as faSquareCheckRegular } from '@fortawesome/free-regular-svg-icons';
import {  toast } from 'react-toastify';
import './Tables.css';

const Faculties = () => {
    const navigate = useNavigate();
    const [faculties, setFaculties] = useState([]);
    const [checkedFaculties, setCheckedFaculties] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [newFacultyName, setNewFacultyName] = useState('');
    const userId = 1; // assume userId is 1

    // const role = 'superadmin';
    // const role = 'admin';
    const role = 'employee';

    const isSuperAdmin = role === 'superadmin' ;
    const isAdmin =  role === 'admin';
    const isEmployee = role === 'employee';


    useEffect(() => {
        fetchData();
    }, []);
    const downloadFile = async (url, fileName) => {
        try {
            const response = await axios.get(url, {
                responseType: 'blob',
            });
            const blob = new Blob([response.data], { type: response.headers['content-type'] });
            const link = document.createElement('a');
            link.href = window.URL.createObjectURL(blob);
            link.download = fileName;
            link.click();
        } catch (error) {
            toast.error("حدث خطأ أثناء تحميل الملف", { rtl: true });
            console.error("Download error:", error);
        }
    };

    const fetchData = async () => {
        try {
            const [facultiesRes, userFacsRes] = await Promise.all([
                axios.get(`http://localhost:3000/faculties`),
                axios.get(`http://localhost:3000/userFaculties?userId=${userId}`)
            ]);
            setFaculties(facultiesRes.data);
            setCheckedFaculties(userFacsRes.data.map((f) => f.facultyId));
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    };

    const toggleCheck = (facultyId) => {
        if (checkedFaculties.includes(facultyId)) {
            setCheckedFaculties(checkedFaculties.filter(id => id !== facultyId));
        } else {
            if (checkedFaculties.length >= 4) {
                toast.error("لا يمكنك اختيار أكثر من ٤ كليات", { rtl: true });
                return;
            }
            setCheckedFaculties([...checkedFaculties, facultyId]);
        }
    };

    const handleSave = async () => {
        try {
            const existing = await axios.get(`http://localhost:3000/userFaculties?userId=${userId}`);
            const deleteReqs = existing.data.map(entry =>
                axios.delete(`http://localhost:3000/userFaculties/${entry.id}`)
            );
            await Promise.all(deleteReqs);

            const postReqs = checkedFaculties.map(facultyId =>
                axios.post(`http://localhost:3000/userFaculties`, {
                    userId,
                    facultyId
                })
            );
            await Promise.all(postReqs);

            toast.success("تم الحفظ بنجاح", { rtl: true });
        } catch (error) {
            toast.error(" حدث خطأ أثناء الحفظ", { rtl: true });
            console.error("Error saving:", error);
        }
    };

    const handleDelete = async (facultyId) => {
        try {
            await axios.delete(`http://localhost:3000/faculties/${facultyId}`);
            fetchData();
            toast.success(" تم حذف بنجاح", { rtl: true });
        } catch (error) {
            toast.error(" حدث خطأ أثناء الحذف", { rtl: true });
            console.error("Error deleting:", error);
        }
    };

    const handleAddFaculty = async () => {
        if (!newFacultyName.trim()) return;
        try {
            await axios.post(`http://localhost:3000/faculties`, {
                name: newFacultyName
            });
            setShowModal(false);
            setNewFacultyName('');
            fetchData();
            toast.success(" تمت إضافة الكلية", { rtl: true });
        } catch (error) {
            toast.error(" حدث خطأ أثناء الإضافة", { rtl: true });
            console.error("Error adding faculty:", error);
        }
    };

    return (
        <div dir='rtl' className='p-5 bg-light vh-100'>
            {/* TODO: onClick={() => navigate(-1)} */}
            <button type="button" className="btn btn-outline-primary mb-3" onClick={() => navigate(-1)} >
                <FontAwesomeIcon icon={faChevronRight} className="ms-2" />
                رجوع
            </button>

            <h2 style={{ color: "#19355A" }} className="mb-4">الكليات</h2>
            {!isEmployee && (

                <div className="mb-3 d-flex gap-2" style={{ justifySelf: "end" }}>
                    {isAdmin && (
                        
                <button className="btn btn-outline-warning rounded-0" onClick={handleSave}>حفظ</button>
                    )}
                {isSuperAdmin && (    
                    <button className="btn btn-primary rounded-0" onClick={() => setShowModal(true)}>
                        <FontAwesomeIcon icon={faPlus} className='ms-2' />
                        اضف كلية
                    </button>
                )}
                <button
                    className="btn btn-outline-success rounded-0"
                    onClick={() => downloadFile("http://localhost:3000/faculties/export", "كل_الكليات.xlsx")}
                >
                    <FontAwesomeIcon icon={faFileExcel} className="ms-2" />
                    تصدير الكل
                </button>
            </div>
            )}

            <div className="table-responsive">
                <table className="table table-hover text-end">
                    <thead className="table-secondary">
                        <tr>
                            <th>رقم مسلسل</th>
                            <th className='w-25 text-break'>الكلية</th>
                            <th className="text-center">تحكم</th>
                        </tr>
                    </thead>
                    <tbody>
                        {faculties.map(faculty => (
                            <tr key={faculty.id}>
                                <td>{faculty.id}</td>
                                <td  className="text-break">{faculty.name}</td>
                                <td className="text-center fs-5" style={{ alignContent: "center" }}>
                                    
                                    {isSuperAdmin || isAdmin && (
                                    <FontAwesomeIcon icon={faFileExcel}
                                            title="تصدير الكلية"
                                            className="btn btn-outline-success  mx-1"
                                            onClick={() => downloadFile(`http://localhost:3000/faculties/${faculty.id}/export`, `الكلية_${faculty.name}.xlsx`)}
                                            />
                                    )}
                                    {!isSuperAdmin && (
                                    <FontAwesomeIcon
                                        className="btn btn-outline-primary  mx-1"
                                        icon={checkedFaculties.includes(faculty.id) ? faSquareCheckRegular : faSquareRegular}
                                        onClick={() => {
                                            if(isAdmin)
                                                toggleCheck(faculty.id)
                                        }}
                                        style={{ cursor: isAdmin ? 'pointer' : 'not-allowed' , marginLeft: '20px' }}
                                        
                                    />
                                    )}
                                    {isSuperAdmin && (
                                    <FontAwesomeIcon
                                        icon={faTrashCan}
                                        className="btn btn-outline-danger  mx-1"
                                        onClick={() => handleDelete(faculty.id)}
                                        style={{ cursor: 'pointer', marginLeft: '10px' }}
                                    />
                                    )}
                                </td>

                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Add Faculty Modal */}
            {showModal && (
                <div className="modal d-block" tabIndex="-1" style={{ backgroundColor: "rgba(0,0,0,0.4)" }}>
                    <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content">
                            <div className="modal-header">
                                <button type="button" className="btn-close ms-0" onClick={() => setShowModal(false)}></button>
                                <h5 className="modal-title">إضافة كلية جديدة</h5>
                            </div>
                            <div className="modal-body">
                                <input
                                    type="text"
                                    className="form-control"
                                    value={newFacultyName}
                                    onChange={(e) => setNewFacultyName(e.target.value)}
                                    placeholder="اسم الكلية"
                                />
                            </div>
                            <div className="modal-footer">
                                <button className="btn btn-secondary" onClick={() => setShowModal(false)}>إغلاق</button>
                                <button className="btn btn-primary" onClick={handleAddFaculty}>إضافة</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

        </div>
    );
};

export default Faculties;

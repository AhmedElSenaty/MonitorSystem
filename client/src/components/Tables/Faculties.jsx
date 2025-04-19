/* eslint-disable no-unused-vars */
import { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashCan, faChevronRight, faPlus, faFileExcel } from '@fortawesome/free-solid-svg-icons';
import { faSquare as faSquareRegular, faSquareCheck as faSquareCheckRegular } from '@fortawesome/free-regular-svg-icons';
import {  ToastContainer,toast } from 'react-toastify';
import './Tables.css';
import { useAuth } from '../../Context/AuthContext';


const Faculties = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const { empID } = useParams();
    const [faculties, setFaculties] = useState([]);
    const [checkedFaculties, setCheckedFaculties] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [newFacultyName, setNewFacultyName] = useState('');
    

    // const role = 'superadmin';
    // const role = 'admin';
    // const role = 'employee';
    const role = user.role === null ? '' : user.role.toLowerCase();

    const isSuperAdmin = role === 'superadmin' ;
    const isAdmin =  role === 'admin';
    const isEmployee = role === 'employee';


    useEffect(() => {
        const fetchData = async () => {
            try {
                const [facultiesRes, userFacsRes] = await Promise.all([
                    axios.get('https://localhost:7057/api/Department/List', { headers: { Authorization: `Bearer ${user.token}` } }),
                    axios.get(`https://localhost:7057/api/Department/ByEmployee/${empID}`, { headers: { Authorization: `Bearer ${user.token}` } })
                ]);
                if (facultiesRes.data === null) return;
                setFaculties(facultiesRes.data.data);
                if (userFacsRes.data === null) return;
                setCheckedFaculties(userFacsRes.data.data.map(faculty => faculty.id));
                
            } catch (error) {
                // console.error("Error fetching data:", error);
            }
        };
        const fetchEmpData = async () => {
            try {
                const [userFacsRes] = await Promise.all([
                    axios.get(`https://localhost:7057/api/Department/ByEmployee/${empID}`, { headers: { Authorization: `Bearer ${user.token}` } })
                ]);
                if (userFacsRes.data === null) return;

                setFaculties(userFacsRes.data.data);
                setCheckedFaculties(userFacsRes.data.data.map(faculty => faculty.id));
                
            } catch (error) {
                // console.error("Error fetching data:", error);
            }
        };
        if (user.role.toLowerCase() == 'employee') {
            fetchEmpData();
        } else {
            
            fetchData();
        }
    }, []);

    /*
    const downloadExcelFromApi = async () => {
  try {
    const res = await axios.get('https://your-api/endpoint', {
      // if you need headers or params, include them here
    });
    
    // 1. Pull out the info
    const { fileContents: base64, contentType, fileDownloadName } = res.data.file;
    
    // 2. Decode base64 to a byte array
    const binaryString = window.atob(base64);
    const len = binaryString.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    
    // 3. Build a Blob from the byte array
    const blob = new Blob([bytes], { type: contentType });
    
    // 4. Create a temporary link and click it
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = fileDownloadName;            // e.g. "كشف المراقبين على كل الكليات.xlsx"
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(link.href);              // clean up
  } catch (err) {
    console.error('Download failed', err);
    // show a toast or other error UI
  }
};
    */
    const downloadFile = async (url, fileName) => {
        try {
            const res = await axios.get(url, {
                headers: { Authorization: `Bearer ${user.token}` },
            });

            // 1. Pull out the info
            const { fileContents: base64, contentType, fileDownloadName } = res.data.file;

            // 2. Decode base64 to a byte array
            const binaryString = window.atob(base64);
            const len = binaryString.length;
            const bytes = new Uint8Array(len);
            for (let i = 0; i < len; i++) {
                bytes[i] = binaryString.charCodeAt(i);
            }

            // 3. Build a Blob from the byte array
            const blob = new Blob([bytes], { type: contentType });

            // 4. Create a temporary link and click it
            const link = document.createElement('a');
            link.href = URL.createObjectURL(blob);
            link.download = fileDownloadName;            // e.g. "كشف المراقبين على كل الكليات.xlsx"
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(link.href);              // clean up
        } catch (err) {
            // console.error('Download failed', err);
            // show a toast or other error UI
            toast.error("حدث خطأ أثناء تحميل الملف", { rtl: true });
        }
    };
        
    

    // TODO: Make API CALL
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
            await axios.put(`https://localhost:7057/api/Department/UpdateEmployeeDepartments`, {
                departmentsIds: checkedFaculties,
                employeeId: empID
            },{
                headers: {
                    Authorization: `Bearer ${user.token}`
                }
            });
            

            toast.success("تم الحفظ بنجاح", { rtl: true });
        } catch (error) {
            toast.error(" حدث خطأ أثناء الحفظ", { rtl: true });
            console.error("Error saving:", error);
        }
    };

    const handleDelete = async (facultyId) => {
        try {
            await axios.delete(`https://localhost:7057/api/Department/${facultyId}`, {
                headers: {
                    Authorization: `Bearer ${user.token}`
                }
            });
            toast.success(" تم حذف بنجاح", { rtl: true });
            setFaculties(faculties.filter(faculty => faculty.id !== facultyId));
        } catch (error) {
            toast.error(" حدث خطأ أثناء الحذف", { rtl: true });
            console.error("Error deleting:", error);
        }
    };

    const handleAddFaculty = async () => {
        if (!newFacultyName.trim()) return;
        try {
            const res = await axios.post(`https://localhost:7057/api/Department`, {
                name: newFacultyName
            }, {
                headers: {
                    Authorization: `Bearer ${user.token}`
                }
            });
            setShowModal(false);
            setNewFacultyName('');
            setFaculties([res.data.data,...faculties]);
            
            toast.success(" تمت إضافة الكلية", { rtl: true });
        } catch (error) {
            toast.error(" حدث خطأ أثناء الإضافة", { rtl: true });
            console.error("Error adding faculty:", error);
        }
    };

    return (
        <div dir='rtl' className='p-5 bg-light  '>
            <ToastContainer position='top-center'/>
            {/* TODO: onClick={() => navigate(-1)} */}
            <button type="button" className="btn btn-outline-primary mb-3" onClick={() => navigate(-1)} >
                <FontAwesomeIcon icon={faChevronRight} className="ms-2" />
                رجوع
            </button>

            <h2 style={{ color: "#19355A" }} className="mb-4">الكليات</h2>
            {!isEmployee && (

                <div className="mb-3 d-flex gap-2" style={{ justifySelf: "end" }}>
                    {(isAdmin || isSuperAdmin) && empID && (
                      
                      
                <button className="btn btn-outline-warning rounded-0" onClick={handleSave}>حفظ</button>
                    )}
                    {(isSuperAdmin && !empID) && (    
                    <button className="btn btn-primary rounded-0" onClick={() => setShowModal(true)}>
                        <FontAwesomeIcon icon={faPlus} className='ms-2' />
                        اضف كلية
                    </button>
                    )}
                    {!empID && (
                        <button
                            className="btn btn-outline-success rounded-0"
                            onClick={() => downloadFile("https://localhost:7057/api/Reports/employee-departments-report", "كل_الكليات.xlsx")}
                        >
                            <FontAwesomeIcon icon={faFileExcel} className="ms-2" />
                            تصدير الكل
                        </button>
                    )}
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
                        {faculties.map((faculty, index) => (
                            <tr key={faculty.id}>
                                <td>{faculty.id}</td>
                                <td  className="text-break">{faculty.name}</td>
                                <td className="text-center fs-5" style={{ alignContent: "center" }}>
                                    
                                    {(isSuperAdmin || isAdmin) && !empID && (
                                    <FontAwesomeIcon icon={faFileExcel}
                                            title="تصدير الكلية"
                                            className="btn btn-outline-success  mx-1"
                                            onClick={() => downloadFile(`https://localhost:7057/api/Reports/employee-departments-report/?departmentId=${faculty.id}`, `الكلية_${faculty.name}.xlsx`)}
                                            />
                                    )}
                                    {  (empID) && (
                                    <FontAwesomeIcon
                                        className="btn btn-outline-primary  mx-1"
                                        icon={checkedFaculties.includes(faculty.id) ? faSquareCheckRegular : faSquareRegular}
                                        onClick={() => {
                                            if(isAdmin || isSuperAdmin)
                                                toggleCheck(faculty.id)
                                        }}
                                        style={{ cursor: (isAdmin || isSuperAdmin) ? 'pointer' : 'not-allowed' , marginLeft: '20px' }}
                                        
                                    />
                                    )}
                                    {(isSuperAdmin && !empID) && (
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

import { useEffect, useState } from 'react';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashCan } from '@fortawesome/free-solid-svg-icons';
import { faPenToSquare as faPenRegular } from '@fortawesome/free-regular-svg-icons';
import { toast, ToastContainer } from 'react-toastify';
import './Tables.css';
import { useAuth } from '../../Context/AuthContext';
import { useNavigate } from 'react-router-dom';
import LogoSpinner from '../spinner/LogoSpinner';
import { NotLoaded } from '../../App';
import { api } from './../../data/api';

const Employees = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [errPage, setErrPage] = useState(false);
    const [admins, setAdmins] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [selectedAdmin, setSelectedAdmin] = useState(null);
    const [AdminID, setAdminID] = useState(0);
    const [newAdminMail, setNewAdminMail] = useState('');
    const [newAdminPass, setNewAdminPass] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [searchTerm, setSearchTerm] = useState('');
    const [reloading, setReloading] = useState(true);

    useEffect(() => {
        if (user.role === null || user.role.toLowerCase() === 'employee' || user.role.toLowerCase() === 'admin') {
            navigate('/');
            return;
        }
    }, [])
    const [adminsPerPage, setAdminsPerPage] = useState(5);

    


    const fetchData = async () => {
        try {
            const res = await api.get(`/api/Employee`,
                {
                    params: {
                        PageIndex: currentPage,
                        PageSize: adminsPerPage,
                        SearchByEmployeeName: isNaN(searchTerm) ? searchTerm : '',
                        SearchByEmployeeSSN: isNaN(searchTerm) ? '' : searchTerm,
                    }
                }
            );

            const formatted = res.data.data.employees.map(r => ({
                            id: r.id,
                            name: r.fullName,
                            empId: r.guid,
                        }));
            setAdmins(formatted);
            setTotalPages((res.data.data.totalCount / adminsPerPage) > 0? Math.ceil(res.data.data.totalCount / adminsPerPage): 1);
        } catch (error) {
            console.error("Error fetching data:", error);
            setErrPage(true);
            if (error.response?.status == 401) {
                toast.error(error.response.data.Data, { rtl: true });
                navigate('/');
            }
        } finally {
            setReloading(false);
            setLoading(false);
        }
    };
    useEffect(() => {
        fetchData();
    }, [currentPage, searchTerm, reloading, adminsPerPage]);

    // useEffect(() => {
    //     const fetchData = async () => {
            

    //         try {
    //             const res = await axios.get('${base}/api/Request', {
    //                 params: {
    //                     PageIndex: currentPage,
    //                     PageSize: adminsPerPage,
    //                     SearchByEmployeeName: isNaN(searchTerm) ? searchTerm : '',
    //                     SearchByEmployeeSSN: isNaN(searchTerm) ? '' : searchTerm,
    //                 },
    //                 headers: {
    //                     Authorization: `Bearer ${user.token}`
    //                 }
    //             });

    //             // API responds { status, message, data: { requests: [...] }, errors }
    //             const apiData = res.data?.data;
                
                
    //             setCurrentPage(apiData.metadata.pagination.pageIndex);
    //             setTotalPages(apiData.metadata.pagination.totalPages);
    //             const formatted = apiData.requests.map(r => ({
    //                 id: r.id,
    //                 name: r.employeeName,
    //                 empId: r.employeeID,
    //             }));

    //             setAdmins(formatted);
    //         } catch (error) {
    //             console.error('Error fetching data:', error);
    //             if (error.response?.data?.message && (user.role !== null || user.role.toLowerCase() !== 'employee')) {
    //                 toast.error(error.response.data.message, { rtl: true });
    //             } else {
    //                 toast.error('حدث خطأ أثناء جلب البيانات', { rtl: true });
    //             }
    //             setErrPage(true);
    //         } finally {
    //             setLoading(false);
    //         }
    //     };

    //     fetchData();
    // }, [currentPage, searchTerm]);
    

    const handleEdit = (admin, id) => {
        setSelectedAdmin(admin);
        setAdminID(id);
        // setNewAdminMail(admin.mail);
        setNewAdminPass(admin.pass);
        setIsEditing(true);
        setShowModal(true);
    };

    const handleDelete = async (adminId) => {
        setAdminID(adminId);
        try {
            console.log(adminId)
            await api.delete(`/api/Admin/${adminId}`);
            fetchData();
            toast.success("تم الحذف بنجاح", { rtl: true });
        } catch (error) {
            toast.error("حدث خطأ أثناء الحذف", { rtl: true });
            console.error("Error deleting:", error);
        }
    };

    const handleAddOrUpdateAdmin = async () => {
        // if (!newAdminMail.trim()) return;
        try {
            if (isEditing && selectedAdmin && AdminID !== 0) {
                try {
                    
                    await api.post(`/api/Account/admin-reset-password`, {
                        userId: AdminID,
                        password: newAdminPass,
                    });
                    toast.success("تم التحديث بنجاح", { rtl: true });
                }catch (error) {
                    error.response.data.errors.forEach(err => {

                        toast.error(err, { rtl: true });
                    })
                    console.error("Error saving admin:", error);
                }
            } else {
                try {
                    
                    await api.post(`/api/Account/RegisterAdmin`, {
                        username: newAdminMail,
                        password: newAdminPass,
                    });
                
                    toast.success("تمت الإضافة بنجاح", { rtl: true });
                } catch (error) {
                    error.response.data.errors.forEach(err => {
                        
                        toast.error(err, { rtl: true });
                    })
                    console.error("Error saving admin:", error);
                }
            }

            setShowModal(false);
            setNewAdminMail('');
            setNewAdminPass('');
            setIsEditing(false);
            setSelectedAdmin(null);
            fetchData();
        } catch (error) {
            toast.error("حدث خطأ أثناء الحفظ", { rtl: true });
            console.error("Error saving admin:", error);
        }
    };

    return (
        <>
            {loading && <LogoSpinner />}
            {errPage && <NotLoaded reload={() => { setErrPage(false); setLoading(true); setReloading(true); }} />}
            {!loading && !errPage && (
                <div dir='rtl' className='p-4 bg-light min-vh-100'>
                    <ToastContainer position='top-center'/>
                    <h2 style={{ color: "#19355A" }} className="mb-4">المستخدمين</h2>

                    <div className="mb-3">
                        <div className="row">
                            <div className="col-12 col-md-6 col-lg-4 ">
                                <input
                                    type="text"
                                    className="form-control"
                                    placeholder="بحث بالاسم أو الرقم القومي....."
                                    value={searchTerm}
                                    onChange={(e) => {
                                        setSearchTerm(e.target.value);
                                        setCurrentPage(1);
                                    }}
                                />
                            </div>
                            <div className="col-12 col-md-6 col-lg-3">
                                <select
                                    className="form-select"
                                    value={adminsPerPage}
                                    onChange={(e) => {
                                        setAdminsPerPage(e.target.value);
                                        setCurrentPage(1);
                                    }}
                                >

                                    <option value="5">اختار عدد الطلبات (5)</option>
                                    <option value="10">10</option>
                                    <option value="15">15</option>
                                    <option value="20">20</option>
                                    <option value="25">25</option>
                                    <option value="30">30</option>
                                    <option value="35">35</option>

                                </select>
                            </div>
                        </div>
                    </div>



                    <div className="table-responsive">
                        <table className="table table-hover text-end table-striped">
                            <thead className="table-secondary">
                                <tr>
                                    <th> الترتيب </th>
                                    <th className='w-25 text-break'>اسم المستخدم</th>
                                    <th className="text-center">تحكم</th>
                                </tr>
                            </thead>
                            <tbody>
                                {admins.length > 0 && admins.map((admin,index) => (
                                    <tr key={index+1}>
                                        <td>{admin.id}</td>
                                        <td className="text-break">{admin.name}</td>
                                        <td className="text-center fs-5" style={{alignContent:"center"}}>
                                            <FontAwesomeIcon
                                                icon={faPenRegular}
                                                onClick={() => handleEdit(admin, admin.empId)}
                                                style={{ cursor: 'pointer' }}
                                                className='btn btn-outline-primary mx-1'
                                            />
                                             <FontAwesomeIcon
                                                icon={faTrashCan}
                                                onClick={() => handleDelete(admin.empId)}
                                                style={{ cursor: 'pointer' }}
                                                className='btn btn-outline-danger mx-1'
                                            /> 
                                        </td>
                                    </tr>
                                ))}
                                {
                                    admins.length === 0 && (
                                        <tr>
                                            <td colSpan="3">لا يوجد مستخدمين</td>
                                        </tr>
                                    )
                                }
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    <div className="d-flex justify-content-center mt-4">
                        <nav>
                            <ul className="pagination flex-wrap">
                                <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                                    <button className={`page-link rounded-end-5  bg-warning ${currentPage === 1 ? 'text-gray' : 'text-dark'}`} onClick={() => setCurrentPage(currentPage - 1)}>السابق</button>
                                </li>
                                <li className="page-item" >
                                    <span className="page-link text-dark bg-white" >
                                        {` ${totalPages} / ${currentPage}  `}
                                    </span>
                                </li>

                                <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                                    <button className={`page-link rounded-start-5  bg-warning ${currentPage === totalPages ? 'text-gray' : 'text-dark'}`} onClick={() => setCurrentPage(currentPage + 1)}>التالي</button>
                                </li>
                            </ul>
                        </nav>
                    </div>

                    {/* Modal */}
                    {showModal && (
                        <div className="modal d-block" tabIndex="-1" style={{ backgroundColor: "rgba(0,0,0,0.4)" }}>
                            <div className="modal-dialog modal-dialog-centered">
                                <div className="modal-content">
                                    <div className="modal-header">
                                        <button type="button" className="btn-close ms-0" onClick={() => setShowModal(false)}></button>
                                        <h5 className="modal-title">{isEditing ? 'تعديل مستخدم' : 'إضافة مستخدم جديد'}</h5>
                                    </div>
                                    <div className="modal-body">
                                        {!isEditing && (
                                            
                                        <input
                                            type="text"
                                            className="form-control"
                                            value={newAdminMail}
                                            onChange={(e) => setNewAdminMail(e.target.value)}
                                            placeholder="اسم المستخدم"
                                        />
                                        )}
                                        <input
                                            type="text"
                                            className="form-control mt-3"
                                            // value={newAdminPass}
                                            onChange={(e) => setNewAdminPass(e.target.value)}
                                            placeholder="كلمة المرور "
                                        />
                                    </div>
                                    <div className="modal-footer">
                                        <button className="btn btn-secondary" onClick={() => setShowModal(false)}>إغلاق</button>
                                        <button className="btn btn-primary" onClick={handleAddOrUpdateAdmin}>
                                            {isEditing ? 'تحديث' : 'إضافة'}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                </div>
            )}
        </>
    );
};

export default Employees;

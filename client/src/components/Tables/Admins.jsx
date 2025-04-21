import { useEffect, useState } from 'react';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashCan, faPlus } from '@fortawesome/free-solid-svg-icons';
import { faPenToSquare as faPenRegular } from '@fortawesome/free-regular-svg-icons';
import { toast, ToastContainer } from 'react-toastify';
import './Tables.css';
import { useAuth } from '../../Context/AuthContext';
import { useNavigate } from 'react-router-dom';
import LogoSpinner from '../spinner/LogoSpinner';
import { NotLoaded } from '../../App';
import { api } from '../../data/api.js';

const Admins = () => {
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
    const [reloading, setReloading] = useState(true);

    useEffect(() => {
        if (user.role === null || user.role.toLowerCase() === 'employee') {
            navigate('/');
            return;
        }
    }, [])
    const adminsPerPage = 10;

    


    const fetchData = async () => {
        try {
            const res = await api.get(`/api/Admin?PageIndex=${currentPage}&PageSize=${adminsPerPage}`,
                
            );
            setAdmins(res.data.data.admins);
            setTotalPages((res.data.data.totalCount / adminsPerPage) > 0? Math.ceil(res.data.data.totalCount / adminsPerPage): 1);
        } catch (error) {
            console.error("Error fetching data:", error);
            if (error.response?.status == 401) {
                toast.error(error.response.data.Data, { rtl: true });
                navigate('/');
                sessionStorage.removeItem('user');
                return;
            }
            setErrPage(true);
        }finally {
            setReloading(false);
            setLoading(false);
        }
    };
    useEffect(() => {
        fetchData();
    }, [currentPage,reloading]);

    

    const handleEdit = (admin, id) => {
        setSelectedAdmin(admin);
        setAdminID(id);
        if (admin.mail !== null) setNewAdminMail(admin.mail);
        setNewAdminPass(admin.pass);
        setIsEditing(true);
        setShowModal(true);
    };

    const handleDelete = async (adminId) => {
        setAdminID(adminId);
        try {
            await api.delete(`/api/Admin/${adminId}`);
            fetchData();
            toast.success("تم الحذف بنجاح", { rtl: true });
        } catch (error) {
            toast.error("حدث خطأ أثناء الحذف", { rtl: true });
            console.error("Error deleting:", error);
            if (error.response?.status == 401) {
                toast.error(error.response.data.Data, { rtl: true });
                navigate('/');
            }
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
                    <h2 style={{ color: "#19355A" }} className="mb-4">المشرفين</h2>

                    <div className="mb-3 d-flex" style={{justifySelf:"end"}}>
                        <button className="btn btn-primary rounded-0" onClick={() => {
                            setIsEditing(false);
                            setNewAdminMail('');
                            setNewAdminPass('');
                            setShowModal(true);
                        }}>
                            <FontAwesomeIcon icon={faPlus} className='ms-2' />
                            اضف مشرف
                        </button>
                    </div>

                    <div className="table-responsive">
                        <table className="table table-hover text-end">
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
                                        <td>{index+1}</td>
                                        <td className="text-break">{admin.username}</td>
                                        <td className="text-center fs-5" style={{alignContent:"center"}}>
                                            <FontAwesomeIcon
                                                icon={faPenRegular}
                                                onClick={() => handleEdit(admin, admin.id)}
                                                style={{ cursor: 'pointer' }}
                                                className='btn btn-outline-primary mx-1'
                                            />
                                            <FontAwesomeIcon
                                                icon={faTrashCan}
                                                onClick={() => handleDelete(admin.id)}
                                                style={{ cursor: 'pointer' }}
                                                className='btn btn-outline-danger mx-1'
                                            />
                                        </td>
                                    </tr>
                                ))}
                                {
                                    admins.length === 0 && (
                                        <tr>
                                            <td colSpan="3" className="text-center">
                                                لا يوجد مشرفين
                                            </td>
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

export default Admins;

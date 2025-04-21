import { useEffect, useState } from 'react';

import { api } from '../../data/api.js'; 
import { useNavigate } from 'react-router-dom';
import './Tables.css';
import { useAuth } from '../../Context/AuthContext';
import { toast } from 'react-toastify';
import LogoSpinner from '../spinner/LogoSpinner';
import { NotLoaded } from '../../App';

const Requests = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [loader, setLoader] = useState(true);
    const [errPage, setErrPage] = useState(false);
    const [reloading, setReloading] = useState(true);

    useEffect(() => {

        if (user === null || user.role === null ) {
            navigate('/');
            return;
         }

        if (user.role.toLowerCase() === 'employee') {
            navigate('/NotAuthourized');
            return;
        }
    }, [])
    
    const [requests, setRequests] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const requestsPerPage = 10;

    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('');


    
    const [totalPages, setTotalPages] = useState(1);

    // TODO: Replace with API CALL
    const [statusCounts, setCount] = useState({
        "تحت المراجعة": 0,
        "تم القبول": 0,
        "تم الرفض": 0,
    });
    



    useEffect(() => {
        const fetchData = async () => {
            const getStatus = (status) => {
                switch (status) {
                    case 'تحت المراجعة': return 1;
                    case 'تم القبول': return 2;
                    case 'تم الرفض': return 3;
                    default: return null;
                }
            };

            try {
                const res = await api.get(`/api/Request`, {
                    params: {
                        PageIndex: currentPage,
                        PageSize: requestsPerPage,
                        SearchByEmployeeName: isNaN(searchTerm) ? searchTerm : '',
                        SearchByEmployeeSSN: isNaN(searchTerm) ? '' : searchTerm,
                        Status: statusFilter === '' ? null : getStatus(statusFilter)
                    }
                });

                // API responds { status, message, data: { requests: [...] }, errors }
                const apiData = res.data?.data;
                if (!apiData || !Array.isArray(apiData.requests)) {
                    toast.error('لا توجد بيانات للطلبات', { rtl: true });
                    setRequests([]);
                    return;
                }
                setCount(
                    {
                        "تحت المراجعة": apiData.requestsStatistics.pendingCount,
                        "تم القبول": apiData.requestsStatistics.approvedCount,
                        "تم الرفض": apiData.requestsStatistics.rejectedCount,
                    }
                );
                setCurrentPage(apiData.metadata.pagination.pageIndex);
                setTotalPages(apiData.metadata.pagination.totalPages);
                const formatted = apiData.requests.map(r => ({
                    id: r.requestId,
                    name: r.employeeName,
                    ssn: r.employeeId,
                    degree: r.degree,
                    gender: r.employeeGender,
                    status: r.status   
                }));

                setRequests(formatted);
            } catch (error) {
                console.error('Error fetching data:', error);
                if (error.response?.status == 401) {
                    toast.error(error.response.data.Data, { rtl: true });
                    navigate('/');
                }
                if (error.response?.data?.message && (user.role !== null || user.role.toLowerCase() !== 'employee')) {
                    toast.error(error.response.data.message, { rtl: true });
                } else {
                    toast.error('حدث خطأ أثناء جلب البيانات', { rtl: true });
                }
                setErrPage(true);
            } finally {
                setReloading(false);
                setLoader(false);
            }
        };

        fetchData();
    }, [currentPage, searchTerm, statusFilter, requestsPerPage,reloading]);




   
    return (
        <>
            {loader && (<LogoSpinner />)}
            {errPage && <NotLoaded reload={() => { setErrPage(false); setLoader(true); setReloading(true); }} />}
            {!loader && !errPage && (
                <div dir="rtl" className="p-4 bg-light min-vh-100">

                    {/* Summary Cards */}
                    <div className="summary mb-4">
                        <div className="row justify-content-end">
                            {["تحت المراجعة", "تم القبول", "تم الرفض"].map((status) => (
                                <div className="col-12 col-sm-6 col-md-4 col-lg-2 mb-3" key={status}>
                                    <div
                                        className={`card status-card text-end border-${status === "تم القبول" ? "success" : status === "تم الرفض" ? "danger" : "warning"} text-${status === "تم القبول" ? "success" : status === "تم الرفض" ? "danger" : "warning"}`}
                                        data-color={status === "تم القبول" ? "success" : status === "تم الرفض" ? "danger" : "warning"}
                                    >
                                        <div className="card-body">
                                            <h6 className="card-title">{status}</h6>
                                            <h4 className="card-text">{statusCounts[status]}</h4>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Search and Filter */}
                    <div className="search mb-4">
                        <div className="row g-2">
                            <div className="col-12 col-md-6 col-lg-3">
                                <input
                                    type="text"
                                    className="form-control"
                                    placeholder="بحث بالاسم أو الرقم القومي..."
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
                                    value={statusFilter}
                                    onChange={(e) => {
                                        setStatusFilter(e.target.value);
                                        setCurrentPage(1);
                                    }}
                                >
                                    <option value="">كل الحالات</option>
                                    <option value="تحت المراجعة">تحت المراجعة</option>
                                    <option value="تم القبول">تم القبول</option>
                                    <option value="تم الرفض">تم الرفض</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Table */}
                    <div className="table-responsive">
                        <table className="table table-hover text-end">
                            <thead className="table-secondary">
                                <tr>
                                    <th className="w-25">الإسم</th>
                                    <th className="w-25 text-break">نوع</th>
                                    <th className="w-25 text-break">المؤهل</th>
                                    <th className="w-25 text-break">الحالة</th>
                                    <th className="text-center" style={{ minWidth: "80px" }}>تحكم</th>
                                </tr>
                            </thead>
                            <tbody>
                                {requests.length > 0 && requests.map(request => (
                                    <tr key={request.id}>
                                        <td>{request.name}</td>
                                        <td className="text-break">{request.gender}</td>
                                        <td className="text-break">{request.degree}</td>
                                        <td className="text-break" style={{ color: request.status === 'تحت المراجعة' ? '#AD8700' : request.status === 'تم القبول' ? 'green' : 'red' }}>
                                            {request.status}
                                        </td>
                                        <td className="text-center">
                                            <button className="btn btn-primary" onClick={() => navigate(`/profile/${request.ssn}/${request.id}`)}>عرض</button>
                                        </td>
                                    </tr>
                                ))}
                                {
                                    requests.length === 0 && (
                                        <tr>
                                            <td colSpan="5">لا يوجد بيانات</td>
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
                </div>

            )}
        </>
    );
};

export default Requests;

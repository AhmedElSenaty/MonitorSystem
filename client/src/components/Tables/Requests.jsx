import { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Tables.css';
import { useAuth } from '../../Context/AuthContext';
import { toast } from 'react-toastify';

const Requests = () => {
    const navigate = useNavigate();
    const { user } = useAuth();

    useEffect(() => {
        if (user.role === null || user.role.toLowerCase() === 'employee') {
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
            const getStatus = (stateus) => {
                switch (stateus) {
                    case 'تحت المراجعة': return 1;
                    case 'تم القبول': return 2;
                    case 'تم الرفض': return 3;
                    default: return null;
                }
            };

            try {
                const res = await axios.get('https://localhost:7057/api/Request', {
                    params: {
                        PageIndex: currentPage,
                        PageSize: requestsPerPage,
                        SearchByEmployeeName: isNaN(searchTerm) ? searchTerm : '',
                        SearchByEmployeeSSN: isNaN(searchTerm) ? '' : searchTerm,
                        Status: statusFilter === '' ? null : getStatus(statusFilter)
                    },
                    headers: {
                        Authorization: `Bearer ${user.token}`
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
                if (error.response?.data?.message && (user.role !== null || user.role.toLowerCase() !== 'employee')) {
                    toast.error(error.response.data.message, { rtl: true });
                } else {
                    toast.error('حدث خطأ أثناء جلب البيانات', { rtl: true });
                }
            }
        };

        fetchData();
    }, [currentPage, searchTerm, statusFilter, requestsPerPage]);




   
    return (
        <div dir='rtl' className='p-4 bg-light min-vh-100'>

            <div className="summary">
                <div className="row mb-4 justify-content-end">
                    <div className="col-md-2 mb-2 ">
                        <div className="card border-warning text-end ">
                            <div className="card-body shadow-sm">
                                <h6 className="card-title text-warning">تحت المراجعة</h6>
                                <h4 className="card-text">{statusCounts["تحت المراجعة"]}</h4>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-2 mb-2 ">
                        <div className="card border-success text-end ">
                            <div className="card-body shadow-sm">
                                <h6 className="card-title text-success">تم القبول</h6>
                                <h4 className="card-text">{statusCounts["تم القبول"]}</h4>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-2 mb-2 ">
                        <div className="card border-danger text-end ">
                            <div className="card-body shadow-sm">
                                <h6 className="card-title text-danger">تم الرفض</h6>
                                <h4 className="card-text">{statusCounts["تم الرفض"]}</h4>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="search">
            <div className="mb-4 row">
                <div className="col-md-3 mb-2">
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
                <div className="col-md-3">
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

            <div >
                <table className="table table-hover text-end">
                    <thead className="table-secondary">
                        <tr>
                            <th className='w-25'>الإسم</th>
                            <th className='w-25 text-break'>نوع</th>
                            <th className="w-25 text-break">المؤهل</th>
                            <th className="w-25 text-break">الحالة</th>
                            <th className="text-center" style={{minWidth:"80px"}}>تحكم</th>
                        </tr>
                    </thead>
                    <tbody>
                        {requests.map(request => (
                            <tr key={request.id}>
                                <td>{request.name}</td>
                                <td className="text-break">{request.gender}</td>
                                <td className="text-break">{request.degree}</td>
                                <td className="text-break" style={{ color: request.status === 'تحت المراجعة' ? '#AD8700' : request.status === 'تم القبول' ? 'green' : 'red'}}>{request.status}</td>
                                <td className="text-center" style={{alignContent:"center"}}>
                                    {/* TODO: onClick={() => navigate(`/staff/${request.id}`)} */}
                                    <button className="btn btn-primary" onClick={() => navigate(`/profile/${request.ssn}/${request.id}`)}>عرض</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Pagination */}
            <div className="d-flex justify-content-center mt-4">
                <nav>
                    <ul className="pagination">
                        <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                            <button className="page-link rounded-0" onClick={() => setCurrentPage(currentPage - 1)}>السابق</button>
                        </li>
                        {[...Array(totalPages)].map((_, index) => (
                            <li key={index} className={`page-item ${currentPage === index + 1 ? 'active' : ''}`} >
                                <button className="page-link" onClick={() => setCurrentPage(index + 1)}>
                                    {index + 1}
                                </button>
                            </li>
                        ))}
                        <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                            <button className="page-link rounded-0" onClick={() => setCurrentPage(currentPage + 1)}>التالي</button>
                        </li>
                    </ul>
                </nav>
            </div>

        </div>
    );
};

export default Requests;

import { useEffect, useState } from 'react';
import axios from 'axios';
// import { useNavigate } from 'react-router-dom';
import './Tables.css';

const Requests = () => {
    // const navigate = useNavigate();
    const [requests, setRequests] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const requestsPerPage = 10;

    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('');




    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const res = await axios.get(`http://localhost:3000/requests`);
            setRequests(res.data);
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    };

    const statusCounts = {
        "تحت المراجعة": requests.filter(r => r.status === "تحت المراجعة").length,
        "تم القبول": requests.filter(r => r.status === "تم القبول").length,
        "تم الرفض": requests.filter(r => r.status === "تم الرفض").length,
    };
    



    // Pagination logic
    const indexOfLastRequest= currentPage * requestsPerPage;
    const indexOfFirstRequest = indexOfLastRequest - requestsPerPage;

    const filteredRequests = requests.filter(r =>
        r.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (r.ssn && r.ssn.includes(searchTerm))
    );
    
    const totalPages = Math.ceil(filteredRequests.length / requestsPerPage);
    const currentRequests = filteredRequests.slice(indexOfFirstRequest, indexOfLastRequest);
    

    return (
        <div dir='rtl' className='p-4 bg-light min-vh-100'>

            <div className="summary">
                <div className="row mb-4 justify-content-end">
                    <div className="col-md-2 mb-2">
                        <div className="card border-warning text-end">
                            <div className="card-body">
                                <h6 className="card-title text-warning">تحت المراجعة</h6>
                                <h4 className="card-text">{statusCounts["تحت المراجعة"]}</h4>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-2 mb-2">
                        <div className="card border-success text-end">
                            <div className="card-body">
                                <h6 className="card-title text-success">تم القبول</h6>
                                <h4 className="card-text">{statusCounts["تم القبول"]}</h4>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-2 mb-2">
                        <div className="card border-danger text-end">
                            <div className="card-body">
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
                        {currentRequests.map(request => (
                            <tr key={request.id}>
                                <td>{request.name}</td>
                                <td className="text-break">{request.gender}</td>
                                <td className="text-break">{request.degree}</td>
                                <td className="text-break" style={{ color: request.status === 'تحت المراجعة' ? '#AD8700' : request.status === 'تم القبول' ? 'green' : 'red'}}>{request.status}</td>
                                <td className="text-center" style={{alignContent:"center"}}>
                                    {/* TODO: onClick={() => navigate(`/staff/${request.id}`)} */}
                                    <button className="btn btn-primary" >عرض</button>
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
                            <li key={index} className={`page-item ${currentPage === index + 1 ? 'active' : ''}`}>
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

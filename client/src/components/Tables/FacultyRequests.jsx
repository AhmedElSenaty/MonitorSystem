import { useEffect, useState } from 'react';

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFileExcel } from "@fortawesome/free-solid-svg-icons";

import { api } from '../../data/api.js'; 
import { useNavigate } from 'react-router-dom';
import './Tables.css';
import { useAuth } from '../../Context/AuthContext';
import { toast } from 'react-toastify';
import LogoSpinner from '../spinner/LogoSpinner';
import { NotLoaded } from '../../App';

const FacultyRequests = () => {
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
    const requestsPerPage = 5;

    const [searchTerm, setSearchTerm] = useState('');


    
    const [totalPages, setTotalPages] = useState(1);

    



    useEffect(() => {
        const fetchData = async () => {
            

            try {
                // TODO: change URL
                const res = await api.get(`/api/Request`, {
                    params: {
                        PageIndex: currentPage,
                        PageSize: requestsPerPage,
                        SearchByEmployeeName: isNaN(searchTerm) ? searchTerm : '',
                        SearchByEmployeeSSN: isNaN(searchTerm) ? '' : searchTerm
                    }
                });

                // API responds { status, message, data: { requests: [...] }, errors }
                const apiData = res.data?.data;
                if (!apiData || !Array.isArray(apiData.requests)) {
                    toast.error('لا توجد بيانات للطلبات', { rtl: true });
                    setRequests([]);
                    return;
                }



                setCurrentPage(apiData.metadata.pagination.pageIndex);
                setTotalPages(apiData.metadata.pagination.totalPages);
                // const getFaculties = async (empid) => {
                //     const userFac = await api.get(`/api/Department/ByEmployee/${empid}`);
                //     const userFacData = userFac.data?.data ;
                //     const fac = userFacData.map(f => f.name);
                //     // console.log(fac);
                //     return fac;
                // }
                // const formatted = apiData.requests.map((r) => {
                    
                
                //     getFaculties(r.employeeId).then((faculties) => {
                //         setUserFaculties(faculties);
                //     })
                    
                //     const record = {
                //         id: r.requestId,
                //         name: r.employeeName,
                //         ssn: r.employeeId,
                //         degree: r.degree,
                //         gender: r.employeeGender,
                //         status: r.status,
                //         faculties: userFacuilties??[],
                //     }
                //     console.log('record');
                //     console.log(record);
                //     return record;
                // }
                // );
                
                const getFaculties = async (empid) => {
                    // TODO: change URL 
                    const userFac = await api.get(`/api/Department/ByEmployee/${empid}`);
                    return userFac.data?.data?.map(f => f.name) ?? [];
                };
                const formatted = await Promise.all(
                    apiData.requests.map(async (r) => {
                        const faculties = await getFaculties(r.employeeId);
                        return {
                            id: r.requestId,
                            name: r.employeeName,
                            ssn: r.employeeId,
                            degree: r.degree,
                            phone: r.phone,
                            gender: r.employeeGender,
                            status: r.status,
                            faculties: faculties,
                        };
                    })
                );
                // console.log(formatted);
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
    }, [currentPage, searchTerm, requestsPerPage,reloading]);

    const downloadFile = async (url, fileName) => {
        try {
            const res = await api.get(url);
    
            // 1. Pull out the info
            const {
            fileContents: base64,
            contentType,
            fileDownloadName,
            } = res.data.file || fileName;
            
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
            const link = document.createElement("a");
            link.href = URL.createObjectURL(blob);
            link.download = fileDownloadName; // e.g. "كشف المراقبين على كل الكليات.xlsx"
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(link.href); // clean up
            } catch (err) {
            console.error('Download failed', err);
            // show a toast or other error UI
            toast.error("حدث خطأ أثناء تحميل الملف", { rtl: true });
            }
        };



    return (
        <>
            {loader && (<LogoSpinner />)}
            {errPage && <NotLoaded reload={() => { setErrPage(false); setLoader(true); setReloading(true); }} />}
            {!loader && !errPage && (
                <div dir="rtl" className="p-4 bg-light min-vh-100">

                    <h2 style={{ color: "#19355A" }} className="mb-4">
                                طلبات الكلية
                    </h2>

                    {/* Search and Export */}
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
                        </div>
                        <div className="col-auto">
                        <button
                            className="btn btn-outline-success rounded-0 w-100"
                            onClick={() =>
                                downloadFile(
                                `/api/Reports/employee-departments-report`,
                                "مراقبين_الكلية.xlsx"
                            )
                            }
                        >
                            <FontAwesomeIcon icon={faFileExcel} className="ms-2" />
                            تصدير الكل
                        </button>
                        </div>
                    </div>

                    {/* Table */}
                    <div className="table-responsive">
                        <table className="table table-hover text-end align-middle table-striped">
                            <thead className="table-secondary">
                                <tr>
                                    <th className="w-25">الإسم</th>
                                    <th className="d-none d-md-table-cell text-break">نوع</th>
                                    <th className="text-break">المؤهل</th>
                                    <th className="w-25 text-break">الكليات</th>
                                    <th className="d-none d-md-table-cell text-break">الهاتف</th>
                                    <th className="text-center" style={{ minWidth: "80px" }}>تحكم</th>
                                </tr>
                            </thead>
                            <tbody>
                                {requests.length > 0 ? (
                                    requests.map((request, index) => (
                                        <tr key={index}>
                                            <td>{request.name}</td>
                                            <td className="d-none d-md-table-cell text-break">{request.gender}</td>
                                            <td className="text-break">{request.degree}</td>
                                            <td className="text-break" style={{ maxWidth: "200px", whiteSpace: "normal", wordWrap: "break-word" }}>
                                                {request.faculties.length > 0
                                                    ? request.faculties.map((f, i) => (
                                                        <span key={i} style={{ display: "inline-block" }}>
                                                            {f}
                                                            {i !== request.faculties.length - 1 && ', '}
                                                        </span>
                                                    ))
                                                    : <span>لا يوجد كليات</span>}
                                            </td>
                                            <td className="d-none d-md-table-cell text-break">
                                                {request.phone}
                                            </td>
                                            <td className="text-center">
                                                <button className="btn btn-primary" onClick={() => navigate(`/profile/${request.ssn}/${request.id}`)}>عرض</button>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="6" className="text-center">لا يوجد بيانات</td>
                                    </tr>
                                )}
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

export default FacultyRequests;
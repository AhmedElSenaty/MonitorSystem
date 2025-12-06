import { useEffect, useState } from "react";
import { api } from "../../data/api.js";
import { useNavigate } from "react-router-dom";
import "../css/Tables.css";
import "../css/RequestsTable.css";
import { useAuth } from "../../Context/AuthContext";
import { toast } from "react-toastify";
import LogoSpinner from "../../components/spinner/LogoSpinner";
import { NotLoaded } from "../../App";

import FacultyRequestsFilters from "./FacultyRequestsFilters";
import FacultyRequestsTable from "./FacultyRequestsTable";

const FacultyRequests = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [loader, setLoader] = useState(true);
  const [errPage, setErrPage] = useState(false);
  const [reloading, setReloading] = useState(true);

  const [deptID, setDeptID] = useState(0);
  const [deptName, setDeptName] = useState("");

  const [requests, setRequests] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [requestsPerPage, setRequestsPerPage] = useState(5);
  const [searchTerm, setSearchTerm] = useState("");
  const [totalPages, setTotalPages] = useState(1);

  // 🔐 حماية الصفحة
  useEffect(() => {
    if (!user || !user.role) {
      navigate("/");
      return;
    }

    if (user.role.toLowerCase() !== "manager") {
      navigate("/NotAuthourized");
      return;
    }
  }, [user, navigate]);

  // 📥 تحميل بيانات الطلبات
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await api.get(`/api/Request/ApprovedColleage`, {
          params: {
            PageIndex: currentPage,
            PageSize: Number(requestsPerPage),
            SearchByEmployeeName: isNaN(searchTerm) ? searchTerm : "",
            SearchByEmployeeSSN: isNaN(searchTerm) ? "" : searchTerm,
          },
        });

        const apiData = res.data?.data;
        if (!apiData || !Array.isArray(apiData.requests)) {
          toast.error("لا توجد بيانات للطلبات", { rtl: true });
          setRequests([]);
          return;
        }

        setCurrentPage(apiData.metadata.pagination.pageIndex);
        setTotalPages(apiData.metadata.pagination.totalPages);
        setDeptID(apiData.departmentId);
        setDeptName(apiData.departmentName);

        const formatted = apiData.requests.map((r) => ({
          id: r.requestId,
          name: r.employeeName,
          ssn: r.employeeId,
          degree: r.degree,
          phone: r.phoneNumber,
          gender: r.employeeGender,
        }));

        setRequests(formatted);
        setErrPage(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        if (error.response?.status === 401) {
          toast.error(error.response.data.Data, { rtl: true });
          navigate("/");
        } else if (
          error.response?.data?.message &&
          user?.role &&
          user.role.toLowerCase() !== "employee"
        ) {
          toast.error(error.response.data.message, { rtl: true });
        } else {
          toast.error("حدث خطأ أثناء جلب البيانات", { rtl: true });
        }
        setErrPage(true);
      } finally {
        setReloading(false);
        setLoader(false);
      }
    };

    fetchData();
  }, [currentPage, searchTerm, requestsPerPage, reloading, navigate, user]);

  // 📁 تحميل ملف الـ Excel
  const downloadFile = async (url, defaultFileName) => {
    try {
      const res = await api.get(url);

      const {
        fileContents: base64,
        contentType,
        fileDownloadName,
      } = res.data.file || defaultFileName;

      const binaryString = window.atob(base64);
      const len = binaryString.length;
      const bytes = new Uint8Array(len);
      for (let i = 0; i < len; i++) {
        bytes[i] = binaryString.charCodeAt(i);
      }

      const blob = new Blob([bytes], { type: contentType });

      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = fileDownloadName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(link.href);
    } catch (err) {
      console.error("Download failed", err);
      toast.error("حدث خطأ أثناء تحميل الملف", { rtl: true });
    }
  };

  // 🧠 Handlers
  const handleSearchChange = (value) => {
    setSearchTerm(value);
    setCurrentPage(1);
  };

  const handlePageSizeChange = (value) => {
    setRequestsPerPage(value);
    setCurrentPage(1);
  };

  const handleViewProfile = (ssn, requestId) => {
    navigate(`/profile/${ssn}/${requestId}`);
  };

  const handleExportAll = () => {
    if (!deptID) {
      toast.error("لم يتم تحديد الكلية بعد", { rtl: true });
      return;
    }
    downloadFile(
      `/api/Reports/employee-departments-report?departmentId=${deptID}`,
      "مراقبين_الكلية.xlsx"
    );
  };

  return (
    <>
      {loader && <LogoSpinner />}

      {errPage && (
        <NotLoaded
          reload={() => {
            setErrPage(false);
            setLoader(true);
            setReloading(true);
          }}
        />
      )}

      {!loader && !errPage && (
        <div dir="rtl" className="p-4 min-vh-100">
          <h2 style={{ color: "#19355A" }} className="mb-4">
            مراقبين {deptName}
          </h2>

          {/* 🔍 البحث + التصدير + حجم الصفحة */}
          <FacultyRequestsFilters
            searchTerm={searchTerm}
            requestsPerPage={requestsPerPage}
            onSearchChange={handleSearchChange}
            onPageSizeChange={handlePageSizeChange}
            onExportAll={handleExportAll}
            isRequestsShowed={requests.length > 0}
          />

          {/* 📋 الجدول */}
          <FacultyRequestsTable
            requests={requests}
            onViewProfile={handleViewProfile}
          />

          {/* 📄 Pagination */}
          <div className="d-flex justify-content-center mt-4">
            <nav>
              <ul className="pagination flex-wrap">
                <li
                  className={`page-item ${currentPage === 1 ? "disabled" : ""}`}
                >
                  <button
                    className={`page-link rounded-end-5  bg-warning ${
                      currentPage === 1 ? "text-gray" : "text-dark"
                    }`}
                    onClick={() => setCurrentPage(currentPage - 1)}
                  >
                    السابق
                  </button>
                </li>
                <li className="page-item">
                  <span className="page-link text-dark bg-white">
                    {` ${totalPages} / ${currentPage}  `}
                  </span>
                </li>

                <li
                  className={`page-item ${
                    currentPage === totalPages ? "disabled" : ""
                  }`}
                >
                  <button
                    className={`page-link rounded-start-5  bg-warning ${
                      currentPage === totalPages ? "text-gray" : "text-dark"
                    }`}
                    onClick={() => setCurrentPage(currentPage + 1)}
                  >
                    التالي
                  </button>
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

import { useEffect, useState } from "react";
import { api } from "../../data/api.js";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../Context/AuthContext.jsx";
import { toast } from "react-toastify";
import "../css/RequestsTable.css";
import "../css/Tables.css";

import { NotLoaded } from "../../App.jsx";
import RequestsSummary from "./RequestsSummary.jsx";
import RequestsFilters from "./RequestsFilters.jsx";
import RequestsTable from "./RequestsTable.jsx";
import LogoSpinner from "../../components/spinner/LogoSpinner.jsx";

import {
  degreeMap,
  employeeTypeMap,
  mapStatusToCode,
} from "../../utils/mappers.js";

const Requests = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [loader, setLoader] = useState(true);
  const [errPage, setErrPage] = useState(false);
  const [reloading, setReloading] = useState(true);

  const [requests, setRequests] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [requestsPerPage, setRequestsPerPage] = useState(10);

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [degreeFilter, setDegreeFilter] = useState("");
  const [employeeTypeFilter, setEmployeeTypeFilter] = useState("");

  const [departments, setDepartments] = useState([]);
  const [departmentFilter, setDepartmentFilter] = useState("");

  const [totalPages, setTotalPages] = useState(1);
  const [statusCounts, setCount] = useState({
    "تحت المراجعة": 0,
    "تم القبول": 0,
    "تم الرفض": 0,
  });

  // "" = افتراضي، "open" = فتح الكل، "close" = غلق الكل
  const [editMode, setEditMode] = useState("");
  const [resultsVisible, setResultsVisible] = useState(null); // true/false لظهور النتائج للجميع

  /* 🔐 حماية الصفحة حسب نوع المستخدم */
  useEffect(() => {
    if (!user || !user.role) {
      navigate("/");
      return;
    }

    if (user.role.toLowerCase() === "employee") {
      navigate("/NotAuthourized");
      return;
    }
  }, [user, navigate]);

  /* 📥 1) تحميل الطلبات */
  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const res = await api.get(`/api/Request`, {
          params: {
            PageIndex: currentPage,
            PageSize: Number(requestsPerPage),
            SearchByEmployeeName: isNaN(searchTerm) ? searchTerm : "",
            SearchByEmployeeSSN: isNaN(searchTerm) ? "" : searchTerm,
            Status: statusFilter ? mapStatusToCode(statusFilter) : null,
            degreeType: degreeFilter || null,
            employeeType: employeeTypeFilter || null,
            departmentId: departmentFilter || null,
          },
        });

        console.log("Aaaaaaa ");
        const apiData = res.data?.data;
        if (!apiData || !Array.isArray(apiData.requests)) {
          toast.error("لا توجد بيانات للطلبات", { rtl: true });
          setRequests([]);
          return;
        }

        // إحصائيات الحالات
        setCount({
          "تحت المراجعة": apiData.requestsStatistics.pendingCount,
          "تم القبول": apiData.requestsStatistics.approvedCount,
          "تم الرفض": apiData.requestsStatistics.rejectedCount,
        });

        setCurrentPage(apiData.metadata.pagination.pageIndex);
        setTotalPages(apiData.metadata.pagination.totalPages);

        // جلب الكليات لكل موظف
        const getFaculties = async (empid) => {
          const userFac = await api.get(`/api/Department/ByEmployee/${empid}`);
          return userFac.data?.data?.map((f) => f.name) ?? [];
        };

        const formatted = await Promise.all(
          apiData.requests.map(async (r) => {
            const faculties = await getFaculties(r.employeeId);
            return {
              id: r.requestId,
              name: r.employeeName,
              ssn: r.employeeId,
              degree: r.degree,
              gender: r.employeeGender,
              status: r.status,
              faculties,
              employeeType: r.employeeType,
              canEdit: r.canEdit,
            };
          })
        );

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

    fetchRequests();
  }, [
    currentPage,
    searchTerm,
    statusFilter,
    requestsPerPage,
    reloading,
    degreeFilter,
    employeeTypeFilter,
    navigate,
    user,
    departmentFilter,
  ]);

  /* ⚙️ 2) تحميل إعدادات النظام (مرة واحدة) */
  useEffect(() => {
    const fetchSystemSettings = async () => {
      try {
        const [editModeRes, resultModeRes] = await Promise.all([
          api.get("/api/SystemData/GetSysEditMode"),
          api.get("/api/SystemData/GetSysShowResultMode"),
        ]);

        const modeVal = editModeRes.data?.data; // 0 أو 1 أو 2
        if (modeVal === 1) setEditMode("open");
        else if (modeVal === 2) setEditMode("close");
        else setEditMode("");

        const resVal = resultModeRes.data?.data;
        if (resVal === true) setResultsVisible(true);
        else if (resVal === false) setResultsVisible(false);
        else setResultsVisible(null);
      } catch (error) {
        console.error("Error fetching system settings:", error);
      }
    };

    fetchSystemSettings();
  }, []);

  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const res = await api.get("/api/Department/List");
        const data = res.data?.data;

        if (Array.isArray(data)) {
          setDepartments(data); // [{id, name}, ...]
        } else {
          setDepartments([]);
        }
      } catch (error) {
        console.error("Error fetching departments list:", error);
        toast.error("حدث خطأ أثناء جلب قائمة الكليات", { rtl: true });
      }
    };

    fetchDepartments();
  }, []);

  /* 🔁 Toggle edit لموظف واحد */
  const handleToggleEdit = async (employeeId, index) => {
    try {
      const res = await api.put("/api/Employee/ToggleEdit", null, {
        params: { employeeId },
      });

      const newValue = res.data?.data; // bool: true/false
      setRequests((prev) => {
        const copy = [...prev];
        copy[index] = { ...copy[index], canEdit: newValue };
        return copy;
      });

      toast.success("تم تبديل حالة السماح بالتعديل", { rtl: true });
    } catch (error) {
      console.error(error);
      toast.error("تعذر تغيير حالة السماح بالتعديل.", { rtl: true });
    }
  };

  /* 🌍 فتح/إغلاق التعديل لكل الموظفين */
  const handleChangeEditMode = async (value) => {
    setEditMode(value);

    try {
      let modeInt = 0;
      if (value === "open") modeInt = 1;
      else if (value === "close") modeInt = 2;

      const res = await api.put("/api/Employee/ToggleAllEdit", null, {
        params: { mode: modeInt },
      });

      const newMode = res.data?.data;

      if (newMode === 1) {
        setRequests((prev) => prev.map((r) => ({ ...r, canEdit: true })));
      } else if (newMode === 2) {
        setRequests((prev) => prev.map((r) => ({ ...r, canEdit: false })));
      }

      toast.success(res.data?.message || "تم تحديث إعدادات التعديل", {
        rtl: true,
      });
      setReloading((prev) => !prev);
    } catch (error) {
      console.error(error);
      toast.error("تعذر تغيير وضع التعديل العام.", { rtl: true });
    }
  };

  /* 👀 إظهار/إخفاء نتائج الطلبات لكل الموظفين */
  const handleToggleResultsVisibility = async () => {
    try {
      const res = await api.put("/api/Request/ToggleResultsVisibility");
      const newValue = res.data?.data; // true or false
      setResultsVisible(newValue);

      toast.success(
        newValue
          ? "✅ تم إظهار نتائج الطلبات لجميع الموظفين."
          : "🙈 تم إخفاء نتائج الطلبات عن جميع الموظفين.",
        { rtl: true }
      );
    } catch (error) {
      console.error(error);
      toast.error("تعذر تغيير حالة إظهار نتائج الطلبات.", { rtl: true });
    }
  };

  // Handlers للـ Filters
  const handleSearchChange = (value) => {
    setSearchTerm(value);
    setCurrentPage(1);
  };

  const handleStatusFilterChange = (value) => {
    setStatusFilter(value);
    setCurrentPage(1);
  };

  const handleDegreeFilterChange = (value) => {
    setDegreeFilter(value);
    setCurrentPage(1);
  };

  const handleEmployeeTypeFilterChange = (value) => {
    setEmployeeTypeFilter(value);
    setCurrentPage(1);
  };

  const handlePageSizeChange = (value) => {
    setRequestsPerPage(value);
    setCurrentPage(1);
  };

  const handleViewProfile = (ssn, requestId) => {
    navigate(`/profile/${ssn}/${requestId}`);
  };

  const handleDepartmentFilterChange = (value) => {
    setDepartmentFilter(value);
    setCurrentPage(1);
  };

  console.log(departmentFilter);

  const [exporting, setExporting] = useState(false);

  // 📁 تحميل ملف Excel (نفس فكرة Faculties)
  const downloadFile = async (url, fileName) => {
    try {
      const res = await api.get(url);

      const {
        fileContents: base64,
        contentType,
        fileDownloadName,
      } = res.data.file;

      const binaryString = window.atob(base64);
      const len = binaryString.length;
      const bytes = new Uint8Array(len);
      for (let i = 0; i < len; i++) {
        bytes[i] = binaryString.charCodeAt(i);
      }

      const blob = new Blob([bytes], { type: contentType });

      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = fileDownloadName || fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(link.href);
    } catch (err) {
      toast.error("حدث خطأ أثناء تحميل الملف", { rtl: true });
    }
  };

  // 🎯 تصدير التقرير حسب الفلاتر الحالية
  const handleExportReport = async () => {
    try {
      setExporting(true);

      const params = new URLSearchParams();

      if (departmentFilter) {
        params.append("departmentId", departmentFilter);
      }
      if (statusFilter) {
        params.append("status", mapStatusToCode(statusFilter));
      }
      if (degreeFilter) {
        params.append("degreeType", degreeFilter);
      }
      if (employeeTypeFilter) {
        params.append("employeeType", employeeTypeFilter);
      }

      const queryString = params.toString();
      const url = `/api/Reports/employee-departments-report${
        queryString ? `?${queryString}` : ""
      }`;

      await downloadFile(url, "تقرير_الموظفين.xlsx");
    } catch (error) {
      console.error(error);
      toast.error("تعذر تحميل تقرير الطلبات.", { rtl: true });
    } finally {
      setExporting(false);
    }
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
        <div
          dir="rtl"
          className="p-4 min-vh-100"
          style={{ marginBottom: "5rem" }}
        >
          {/* 🔹 Summary + Global Actions */}
          <RequestsSummary
            statusCounts={statusCounts}
            editMode={editMode}
            resultsVisible={resultsVisible}
            onChangeEditMode={handleChangeEditMode}
            onToggleResultsVisibility={handleToggleResultsVisibility}
          />

          {/* 🔍 Search & Filters */}
          <RequestsFilters
            searchTerm={searchTerm}
            statusFilter={statusFilter}
            degreeFilter={degreeFilter}
            employeeTypeFilter={employeeTypeFilter}
            requestsPerPage={requestsPerPage}
            onSearchChange={handleSearchChange}
            onStatusFilterChange={handleStatusFilterChange}
            onDegreeFilterChange={handleDegreeFilterChange}
            onEmployeeTypeFilterChange={handleEmployeeTypeFilterChange}
            onPageSizeChange={handlePageSizeChange}
            degreeMap={degreeMap}
            employeeTypeMap={employeeTypeMap}
            // 👇 الجديد
            departments={departments}
            departmentFilter={departmentFilter}
            onDepartmentFilterChange={handleDepartmentFilterChange}
            onExportReport={handleExportReport} // 👈 الجديد
            isExporting={exporting} // 👈 هنا
          />

          {/* 📋 Table */}
          <RequestsTable
            requests={requests}
            onToggleEdit={handleToggleEdit}
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

export default Requests;

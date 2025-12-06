import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";

import "../css/Tables.css";
import { useAuth } from "../../Context/AuthContext";
import LogoSpinner from "../../components/spinner/LogoSpinner";
import { NotLoaded } from "../../App";
import { api } from "../../data/api.js";

import FacultiesHeader from "./FacultiesHeader";
import FacultiesTable from "./FacultiesTable";
import FacultyModal from "./FacultyModal";

const Faculties = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { empID } = useParams();

  const [faculties, setFaculties] = useState([]);
  const [checkedFaculties, setCheckedFaculties] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [newFacultyName, setNewFacultyName] = useState("");

  const [loading, setLoading] = useState(true);
  const [errPage, setErrPage] = useState(false);
  const [reloading, setReloading] = useState(true);

  const role = user?.role ? user.role.toLowerCase() : "";
  const isSuperAdmin = role === "superadmin";
  const isAdmin = role === "admin";
  const isEmployee = role === "employee";

  // 🔐 حماية + تحميل البيانات
  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!user || !user.role) {
          navigate("/");
          return;
        }

        // لو المستخدم Employee نجيب كلياته فقط
        if (user.role?.toLowerCase() === "employee") {
          const res = await api.get(`/api/Department/ByEmployee/${empID}`);
          if (!res.data) throw new Error(res);
          setFaculties(res.data.data);
          setCheckedFaculties(res.data.data.map((f) => f.id));
          return;
        }

        // Admin/SuperAdmin: كل الكليات + كليات الموظف
        const [facultiesRes, userFacsRes] = await Promise.all([
          api.get(`/api/Department`, {
            params: {
              pageIndex: 1, // أو 0 حسب ما الـ API عندك متعود
              pageSize: 30, // 🔹 هنا خليتها 30 بدل الديفولت 10
            },
          }),
          api.get(`/api/Department/ByEmployee/${empID}`),
        ]);

        if (!facultiesRes.data) throw new Error(facultiesRes);
        if (!userFacsRes.data) throw new Error(userFacsRes);

        setFaculties(facultiesRes.data.data.departments);
        setCheckedFaculties(userFacsRes.data.data.map((f) => f.id));
      } catch (error) {
        console.error("Error fetching data:", error.message || error);
        if (error.response?.status === 401) {
          toast.error(error.response.data.Data, { rtl: true });
          navigate("/");
          return;
        }
        setErrPage(true);
      } finally {
        setReloading(false);
        setLoading(false);
      }
    };

    fetchData();
  }, [reloading, empID, user, navigate]);

  // 📁 تحميل ملف Excel
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

  // ✅ Toggle اختيار كلية
  const toggleCheck = (facultyId) => {
    if (checkedFaculties.includes(facultyId)) {
      setCheckedFaculties((prev) => prev.filter((id) => id !== facultyId));
    } else {
      if (checkedFaculties.length >= 4) {
        toast.error("لا يمكنك اختيار أكثر من ٤ كليات", { rtl: true });
        return;
      }
      setCheckedFaculties((prev) => [...prev, facultyId]);
    }
  };

  // 💾 حفظ ربط الكليات بالموظف
  const handleSave = async () => {
    try {
      await api.put(`/api/Department/UpdateEmployeeDepartments`, {
        departmentsIds: checkedFaculties,
        employeeId: empID,
      });
      toast.success("تم الحفظ بنجاح", { rtl: true });
    } catch (error) {
      error.response?.data?.errors?.forEach((err) =>
        toast.error(err, { rtl: true })
      );
      console.error("Error saving:", error);
    }
  };

  // 🗑️ حذف كلية
  const handleDelete = async (facultyId) => {
    try {
      await api.delete(`/api/Department/${facultyId}`);
      toast.success("تم الحذف بنجاح", { rtl: true });
      setFaculties((prev) => prev.filter((f) => f.id !== facultyId));
    } catch (error) {
      toast.error("حدث خطأ أثناء الحذف", { rtl: true });
      console.error("Error deleting:", error);
    }
  };

  // ➕ إضافة كلية
  const handleAddFaculty = async () => {
    if (!newFacultyName.trim()) return;
    try {
      const res = await api.post(`/api/Department`, {
        name: newFacultyName,
      });

      setShowModal(false);
      setNewFacultyName("");
      setFaculties((prev) => [res.data.data, ...prev]);

      toast.success("تمت إضافة الكلية", { rtl: true });
    } catch (error) {
      toast.error("حدث خطأ أثناء الإضافة", { rtl: true });
      console.error("Error adding faculty:", error);
    }
  };

  // 📤 Export الكل
  const handleExportAll = () => {
    downloadFile(`/api/Reports/employee-departments-report`, "كل_الكليات.xlsx");
  };

  // 📤 Export كلية واحدة
  const handleExportFaculty = (faculty) => {
    downloadFile(
      `/api/Reports/employee-departments-report/?departmentId=${faculty.id}`,
      `الكلية_${faculty.name}.xlsx`
    );
  };

  return (
    <>
      <ToastContainer position="top-center" />

      {loading && <LogoSpinner />}

      {errPage && (
        <NotLoaded
          reload={() => {
            setErrPage(false);
            setLoading(true);
            setReloading(true);
          }}
        />
      )}

      {!loading && !errPage && (
        <div
          dir="rtl"
          className="container-fluid p-4"
          style={{ marginBottom: "3rem" }}
        >
          <FacultiesHeader
            isEmployee={isEmployee}
            isAdmin={isAdmin}
            isSuperAdmin={isSuperAdmin}
            hasEmpId={!!empID}
            facultiesCount={faculties.length}
            onBack={() => navigate(-1)}
            onSave={handleSave}
            onAddFaculty={() => setShowModal(true)}
            onExportAll={handleExportAll}
          />

          <FacultiesTable
            faculties={faculties}
            isEmployee={isEmployee}
            isAdmin={isAdmin}
            isSuperAdmin={isSuperAdmin}
            hasEmpId={!!empID}
            checkedFaculties={checkedFaculties}
            onToggleCheck={toggleCheck}
            onExportFaculty={handleExportFaculty}
            onDeleteFaculty={handleDelete}
          />

          <FacultyModal
            show={showModal}
            title="إضافة كلية جديدة"
            facultyName={newFacultyName}
            onFacultyNameChange={setNewFacultyName}
            onClose={() => setShowModal(false)}
            onSave={handleAddFaculty}
          />
        </div>
      )}
    </>
  );
};

export default Faculties;

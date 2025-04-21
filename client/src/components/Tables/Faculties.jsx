/* eslint-disable no-unused-vars */
import { useEffect, useState } from "react";

import { useNavigate, useParams } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faTrashCan,
  faChevronRight,
  faPlus,
  faFileExcel,
} from "@fortawesome/free-solid-svg-icons";
import {
  faSquare as faSquareRegular,
  faSquareCheck as faSquareCheckRegular,
} from "@fortawesome/free-regular-svg-icons";
import { ToastContainer, toast } from "react-toastify";
import "./Tables.css";
import { useAuth } from "../../Context/AuthContext";
import LogoSpinner from "../spinner/LogoSpinner";
import { NotLoaded } from "../../App";
import { api } from "../../data/api.js";

const Faculties = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { empID } = useParams();
  const [faculties, setFaculties] = useState([]);
  const [checkedFaculties, setCheckedFaculties] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [errPage, setErrPage] = useState(false);
  const [newFacultyName, setNewFacultyName] = useState("");
    
    const [reloading, setReloading] = useState(true);
  // const role = 'superadmin';
  // const role = 'admin';
  // const role = 'employee';
  const role = user.role === null ? "" : user.role.toLowerCase();

  const isSuperAdmin = role === "superadmin";
  const isAdmin = role === "admin";
  const isEmployee = role === "employee";

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [facultiesRes, userFacsRes] = await Promise.all([
          api.get(`/api/Department/List` ),
          api.get(`/api/Department/ByEmployee/${empID}` ),
        ]);
        if (facultiesRes.data === null) throw new Error(facultiesRes);
        setFaculties(facultiesRes.data.data);
        if (userFacsRes.data === null) throw new Error(userFacsRes);
        setCheckedFaculties(userFacsRes.data.data.map((faculty) => faculty.id));
      } catch (error) {
        console.error("Error fetching data:", error.message);
        // toast.error(error.message, { rtl: false });
        if (error.response?.status == 401) {
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
    const fetchEmpData = async () => {
      try {
        const [userFacsRes] = await Promise.all([
          api.get(`/api/Department/ByEmployee/${empID}` ),
        ]);
        if (userFacsRes.data === null) {
          throw new Error(userFacsRes);
        }

        setFaculties(userFacsRes.data.data);
        setCheckedFaculties(userFacsRes.data.data.map((faculty) => faculty.id));
      } catch (error) {
        console.error("Error fetching data:", error.message);
        // toast.error(error.message, { rtl: false });
        if (error.response?.status == 401) {
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

    if (
      user.role !== null &&
      user.role.toLowerCase() == "employee" &&
      empID !== null
    ) {
      fetchEmpData();
    } else {
      if (empID !== null) {
        fetchData();
      } else {
        setLoading(false);
        navigate(-1);
      }
    }
  }, [reloading]);

  const downloadFile = async (url, fileName) => {
    try {
      const res = await api.get(url);

      // 1. Pull out the info
      const {
        fileContents: base64,
        contentType,
        fileDownloadName,
      } = res.data.file;

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
      // console.error('Download failed', err);
      // show a toast or other error UI
      toast.error("حدث خطأ أثناء تحميل الملف", { rtl: true });
    }
  };

  // TODO: Make API CALL
  const toggleCheck = (facultyId) => {
    if (checkedFaculties.includes(facultyId)) {
      setCheckedFaculties(checkedFaculties.filter((id) => id !== facultyId));
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
      await api.put(
        `/api/Department/UpdateEmployeeDepartments`,
        {
          departmentsIds: checkedFaculties,
          employeeId: empID,
        }
      );

      toast.success("تم الحفظ بنجاح", { rtl: true });
    } catch (error) {
      toast.error(" حدث خطأ أثناء الحفظ", { rtl: true });
      console.error("Error saving:", error);
    }
  };

  const handleDelete = async (facultyId) => {
    try {
      await api.delete(`/api/Department/${facultyId}`);
      toast.success(" تم حذف بنجاح", { rtl: true });
      setFaculties(faculties.filter((faculty) => faculty.id !== facultyId));
    } catch (error) {
      toast.error(" حدث خطأ أثناء الحذف", { rtl: true });
      console.error("Error deleting:", error);
    }
  };

  const handleAddFaculty = async () => {
    if (!newFacultyName.trim()) return;
    try {
      const res = await api.post(
        `/api/Department`,
        {
          name: newFacultyName,
        }
      );
      setShowModal(false);
      setNewFacultyName("");
      setFaculties([res.data.data, ...faculties]);

      toast.success(" تمت إضافة الكلية", { rtl: true });
    } catch (error) {
      toast.error(" حدث خطأ أثناء الإضافة", { rtl: true });
      console.error("Error adding faculty:", error);
    }
  };

  return (
    <>
      <ToastContainer position="top-center" />
          {loading && <LogoSpinner />}
          {errPage && <NotLoaded reload={() => { setErrPage(false); setLoading(true); setReloading(true); }} />}
      {!loading && !errPage && (
        <div dir="rtl" className="container-fluid p-4 bg-light">
          {/* Back Button */}
          <div className="mb-3">
            <button
              type="button"
              className="btn btn-outline-primary"
              onClick={() => navigate(-1)}
            >
              <FontAwesomeIcon icon={faChevronRight} className="ms-2" />
              رجوع
            </button>
          </div>

          {/* Title */}
          <h2 style={{ color: "#19355A" }} className="mb-4">
            الكليات
          </h2>

          {/* Action Buttons */}
          {!isEmployee && (
            <div className="row mb-3 justify-content-start justify-content-md-start g-2">
              {(isAdmin || isSuperAdmin) && empID && (
                <div className="col-auto">
                  <button
                    className="btn btn-outline-warning rounded-0 w-100"
                    onClick={handleSave}
                  >
                    حفظ
                  </button>
                </div>
              )}
              {isSuperAdmin && !empID && (
                <div className="col-auto">
                  <button
                    className="btn btn-primary rounded-0 w-100"
                    onClick={() => setShowModal(true)}
                  >
                    <FontAwesomeIcon icon={faPlus} className="ms-2" />
                    اضف كلية
                  </button>
                </div>
              )}
              {!empID && faculties.length > 0 && (
                <div className="col-auto">
                  <button
                    className="btn btn-outline-success rounded-0 w-100"
                    onClick={() =>
                      downloadFile(
                        `/api/Reports/employee-departments-report`,
                        "كل_الكليات.xlsx"
                      )
                    }
                  >
                    <FontAwesomeIcon icon={faFileExcel} className="ms-2" />
                    تصدير الكل
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Table */}
          <div className="table-responsive">
            <table className="table table-hover text-end align-middle">
              <thead className="table-secondary">
                <tr>
                  <th className="w-25">رقم مسلسل</th>
                  <th className="w-50 text-break">الكلية</th>
                  <th className="text-center w-25">تحكم</th>
                </tr>
              </thead>
              <tbody>
                {faculties.length > 0 && faculties.map((faculty) => (
                  <tr key={faculty.id}>
                    <td>{faculty.id}</td>
                    <td className="text-break">{faculty.name}</td>
                    <td className="text-center fs-5">
                      {(isSuperAdmin || isAdmin) && !empID && (
                        <FontAwesomeIcon
                          icon={faFileExcel}
                          title="تصدير الكلية"
                          className="btn btn-outline-success mx-1"
                          onClick={() =>
                            downloadFile(
                              `/api/Reports/employee-departments-report/?departmentId=${faculty.id}`,
                              `الكلية_${faculty.name}.xlsx`
                            )
                          }
                        />
                      )}

                      {empID && (
                        <FontAwesomeIcon
                          className="btn btn-outline-primary mx-1"
                          icon={
                            checkedFaculties.includes(faculty.id)
                              ? faSquareCheckRegular
                              : faSquareRegular
                          }
                          onClick={() => {
                            if (isAdmin || isSuperAdmin)
                              toggleCheck(faculty.id);
                          }}
                          style={{
                            cursor:
                              isAdmin || isSuperAdmin
                                ? "pointer"
                                : "not-allowed",
                          }}
                        />
                      )}

                      {isSuperAdmin && !empID && (
                        <FontAwesomeIcon
                          icon={faTrashCan}
                          className="btn btn-outline-danger mx-1"
                          onClick={() => handleDelete(faculty.id)}
                          style={{ cursor: "pointer" }}
                        />
                      )}
                    </td>
                  </tr>
                ))}
                              {faculties.length === 0 && (
                                <tr>
                                  <td colSpan="3" className="text-center">
                                     لا يوجد كليات
                                  </td>
                                </tr>
                              )}
              </tbody>
            </table>
          </div>

          {/* Modal */}
          {showModal && (
            <div
              className="modal d-block"
              tabIndex="-1"
              style={{ backgroundColor: "rgba(0,0,0,0.4)" }}
            >
              <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content">
                  <div className="modal-header">
                    <button
                      type="button"
                      className="btn-close ms-0"
                      onClick={() => setShowModal(false)}
                    ></button>
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
                    <button
                      className="btn btn-secondary"
                      onClick={() => setShowModal(false)}
                    >
                      إغلاق
                    </button>
                    <button
                      className="btn btn-primary"
                      onClick={handleAddFaculty}
                    >
                      إضافة
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

export default Faculties;

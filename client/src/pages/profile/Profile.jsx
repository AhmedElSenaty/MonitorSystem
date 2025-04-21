/* eslint-disable no-unused-vars */
import React, { useState, useRef, useEffect } from "react";
import { Modal, Button, Toast } from "react-bootstrap";

import { useNavigate, useParams } from "react-router";
import { ToastContainer, toast } from "react-toastify";
import { useAuth } from "../../Context/AuthContext";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronRight } from "@fortawesome/free-solid-svg-icons";
import LogoSpinner from "../../components/spinner/LogoSpinner";
import { NotLoaded } from "../../App";
import { api } from "../../data/api";

const PersonalInfoPortal = () => {
  const { user, setUser } = useAuth();
  const navigate = useNavigate();
  const { id, reqID } = useParams();

    const [reloading, setReloading] = useState(true);
  let originalData = {
    id: "",
    name: "",
    address: "",
    degree: "",
    job: "",
    ssn: "",
    phone: "",
    email: "",
    gender: "",
    DOB: "",
    age: "",
  };
  const [loader, setLoader] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errPage, setErrPage] = useState(false);
  const [data, setData] = useState({ ...originalData });
  const [orgdata, setOrgData] = useState({ ...originalData });
  const [zoomedImage, setZoomedImage] = useState({ ...originalData });

  const fileInputs = {
    personal: useRef(),
    degree: useRef(),
    idFront: useRef(),
    idBack: useRef(),
  };
  const [files, setFiles] = useState({
    personal: null,
    degree: null,
    idFront: null,
    idBack: null,
  });

  const approve = async () => {
    try {
      const res = await api.put(
        `/api/Request/ChangeStatus`,
        {
          requestId: reqID * 1,
          newStatus: 2,
        }
      );
      toast.success(res.data.message, { rtl: true, autoClose: 5000 });
      navigate(`/faculties/${id}`);
    } catch (error) {
      console.log(error);
    }
  };
  const reject = async () => {
    try {
      const res = await api.put(
        `/api/Request/ChangeStatus`,
        {
          requestId: reqID,
          newStatus: 3,
        }
      );
      toast.success(res.data.message, { rtl: true, autoClose: 5000 });
      setRequest({ ...request, status: "تم الرفض" });
    } catch (error) {
      console.log(error);
    }
  };

  let requests = [
    { status: "تم القبول", notes: "لا يوجد ملاحظات" },
    { status: "تحت المراجعة", notes: "لا يوجد ملاحظات" },
    { status: "تم الرفض", notes: "الصورة غير واضحة" },
    { status: "تحت المراجعة", notes: "لا يوجد ملاحظات" },
  ];

  const [role, setRole] = useState("");
  const isSuperAdmin = role === "superadmin";
  const isAdmin = role === "admin";
  const isEmployee = role === "employee";
  const [request, setRequest] = useState(requests[1]);
  const statusClass = (s) =>
    s === "تم القبول"
      ? "text-success"
      : s === "تحت المراجعة"
      ? "text-warning"
      : "text-danger";

  useEffect(() => {
    if (!id) {
      // toast.error("يرجى تسجيل الدخول",{rtl: true});
      navigate(-1);
      return;
    }
    if (!user) navigate(-1);

    if (user.role !== null) {
      setRole(user.role.toLowerCase());
    } else {
      navigate("/login");
    }

    const fetchData = async () => {
      try {
        const response = await api.get(`/api/Request/${id}`);
        setData({
          name: response.data.data.employeeInformation.name,
          address: response.data.data.employeeInformation.address,
          degree: response.data.data.employeeInformation.degree,
          job: response.data.data.employeeInformation.job,
          ssn: response.data.data.employeeInformation.ssn,
          phone: response.data.data.employeeInformation.phone,
          email: response.data.data.employeeInformation.email,
          gender: response.data.data.employeeInformation.gender,
          DOB: response.data.data.employeeInformation.dob,
          age: response.data.data.employeeInformation.age,
          id: response.data.data.employeeInformation.id,
        });
        setOrgData(data);
        setFiles({
          personal: response.data.data.employeeImagesDto.personalImage,
          degree: response.data.data.employeeImagesDto.degreeImage,
          idFront: response.data.data.employeeImagesDto.ssnFrontImage,
          idBack: response.data.data.employeeImagesDto.ssnBackImage,
        });
        setRequest(response.data.data.requestStatus);
      } catch (error) {
        console.error("Error fetching data:", error);
        if (error.response?.status == 401) {
          toast.error(error.response.data.Data, { rtl: true });
          navigate("/");
        }
        setErrPage(true);
      } finally {
          setReloading(false);
        setLoader(false);
      }
    };
    if (user.role !== null) fetchData();
  }, [id, user.token, navigate,reloading]);

  const handleChange = (field, value) =>
    setData((prev) => ({ ...prev, [field]: value }));

  const startEdit = () => {
    setOrgData(data);
    setIsEditing(true);
  };
  const cancelEdit = () => {
    setData(orgdata);
    setIsEditing(false);
  };
  // const role = "employee";
  // const role = "admin";

  // Modal state for adding notes
  const [showModal, setShowModal] = useState(false);
  const [showImgModal, setShowImgModal] = useState(false);
  const [currentRequest, setCurrentRequest] = useState(null);
  const [noteText, setNoteText] = useState("");

  const openModal = (request) => {
    setCurrentRequest(request);
    setNoteText(request.notes || "");
    setShowModal(true);
  };
  const closeModal = () => {
    setShowModal(false);
    setCurrentRequest(null);
    setNoteText("");
  };
  const closeImgModal = () => setShowImgModal(false);
  const saveNote = async () => {
    try {
      const res = await api.put(
        `/api/Request/AddNote`,
        {
          requestId: reqID,
          note: noteText,
        }
      );
      toast.success("تم حفظ الملاحظات", { rtl: true, autoClose: 5000 });
      setRequest({ ...request, notes: noteText });
    } catch (error) {
      console.error(error);
    }

    closeModal();
  };

  // Validation logic matching RegisterForm
  const validateData = () => {
    const errors = {};
    if (!data.name.trim()) errors.name = "الاسم مطلوب";
    if ((data.name.trim().match(/ /g) || []).length < 3)
      errors.name = "الاسم يجب ان يحتوي على اربع كلمات على الاقل";
    if (!data.ssn.trim()) errors.ssn = "الرقم القومي مطلوب";
    if (!/^\d{14}$/.test(data.ssn))
      errors.ssn = "الرقم القومي يجب أن يكون 14 رقمًا";
    if (!/^01[0-9]{9}$/.test(data.phone)) errors.phone = "رقم الهاتف غير صالح";
    if (!/\S+@\S+\.\S+/.test(data.email))
      errors.email = "البريد الإلكتروني غير صالح";
    if (!data.address.trim()) errors.address = "العنوان مطلوب";
    if (!data.degree.trim()) errors.degree = "المؤهل مطلوب";
    if (!data.job.trim()) errors.job = "الوظيفة مطلوبة";
    if (!data.gender.trim()) errors.gender = "النوع مطلوب";

    return errors;
  };
  // Improved file handler with immediate validation
  const handleFile = (type, file) => {
    setShowImgModal(false);
    const MAX_FILE_SIZE = 1 * 1024 * 1024; // 1MB
    const ALLOWED_FILE_TYPES = ["image/jpeg", "image/jpg"];

    if (!file) return;
    const label =
      type === "personal"
        ? "الصورة الشخصية"
        : type === "degree"
        ? "صورة المؤهل"
        : type === "idFront"
        ? "صورة البطاقة (وجه)"
        : "صورة البطاقة (ظهر)";
    if (!ALLOWED_FILE_TYPES.includes(file.type)) {
      toast.error(`${label}: نوع الملف غير مدعوم \n(jpg, jpeg فقط)`, {
        rtl: true,
        autoClose: 5000,
      });
      return;
    }
    if (file.size > MAX_FILE_SIZE) {
      toast.error(`${label}: حجم الملف كبير جدًا \n( 1MB أقصى حجم)`, {
        rtl: true,
        autoClose: 5000,
      });
      return;
    }
    const updateProfile = async () => {
      let formData = new FormData();
      formData.append("Image", file);
      setZoomedImage(file);
      try {
        /*
                degreeImage
                personalImage
                ssnBackImage
                ssnFrontImage
                */
        const getIdentifier = (type) => {
          switch (type) {
            case "degree":
              return "Degree";
            case "personal":
              return "PersonalImage";
            case "idFront":
              return "SSNFront";
            case "idBack":
              return "SSNBack";
          }
        };
        const response = await api.put(
          `/api/Request/UpdateRequestAssets`,
          formData,
          {
            params: {
              Identifier: getIdentifier(type),
            }
          }
        );
        toast.success("تم تحديث البيانات بنجاح", { rtl: true });

        setFiles((prev) => ({ ...prev, [type]: file }));
      } catch (error) {
        console.error("Error updating profile:", error);
        toast.error("حدث خطأ أثناء تحديث البيانات.", { rtl: true });
      }
    };
    updateProfile();
  };

  const saveEdit = async () => {
    setLoading(true);
    const errors = validateData();
    if (Object.keys(errors).length > 0) {
      Object.values(errors).forEach((msg) => toast.error(msg, { rtl: true }));
      setLoading(false);
      return;
    }

    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) =>
      formData.append(key.toLowerCase(), value)
    );

    try {
      // TODO: change url
      const response = await api.put(
        `/api/Request/UpdateRequestData`,
        {
          ...data,
          gender: data.gender === "ذكر" ? 1 : 0,
        }
      );
      toast.success("تم تحديث البيانات بنجاح", { rtl: true });
      setIsEditing(false);
    } catch (error) {
      console.error(error.response.data.errors);
      Object.values(error.response.data.errors).forEach((msg) =>
        toast.error(msg, { rtl: true })
      );
      // toast.error("حدث خطأ أثناء تحديث البيانات.", { rtl: true });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <ToastContainer position={"top-center"} />
      {loader && <LogoSpinner />}
          {errPage && <NotLoaded reload={() => { setErrPage(false); setLoader(true); setReloading(true); }} />}
      {!loader && !errPage && (
        <div
          dir="rtl"
          className="container-fluid p-0"
          style={{ backgroundColor: "#EBEFF5" }}
        >
          <div className="container py-4 w-100">
            {(isAdmin || isSuperAdmin) && (
              <button
                type="button"
                className="btn btn-outline-primary mb-3"
                onClick={() => navigate(-1)}
              >
                <FontAwesomeIcon icon={faChevronRight} className="ms-2" />
                رجوع
              </button>
            )}

            {/* Personal Data Table */}
            <div className="row justify-content-center mb-5">
              <div className="col-12 col-lg-12">
                {/* Personal Data Section */}
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <h2>البيانات الشخصية</h2>
                  {!isEditing && isEmployee ? (
                    <button
                      className="btn btn-primary px-5"
                      onClick={startEdit}
                    >
                      تعديل
                    </button>
                  ) : (
                    isEmployee && (
                      <div className="d-flex">
                        {!loading && (
                          <>
                            <button
                              className="btn btn-success me-1 mx-2 px-3"
                              onClick={saveEdit}
                            >
                              حفظ
                            </button>
                            <button
                              className="btn btn-danger mx-2 px-3"
                              onClick={cancelEdit}
                            >
                              إلغاء
                            </button>
                          </>
                        )}
                        {loading && (
                          <div
                            className="spinner-border text-primary"
                            role="status"
                          >
                            <span className="visually-hidden">Loading...</span>
                          </div>
                        )}
                      </div>
                    )
                  )}
                </div>

                {/* DESKTOP: full table */}
                <div className="d-none d-md-block  rounded shadow-lg table-responsive">
                  <table
                    className="table mb-0"
                    style={{
                      borderRadius: "8px",
                      overflow: "hidden",
                      whiteSpace: "nowrap",
                    }}
                  >
                    <tbody>
                      <tr>
                        <td
                          className="text-center"
                          style={{ backgroundColor: "#cdcdcd" }}
                        >
                          الرقم المسلسل
                        </td>
                        <td className="text-center">{data.id}</td>
                        <td
                          className="text-center"
                          style={{ backgroundColor: "#cdcdcd" }}
                        >
                          الرقم القومي
                        </td>
                        <td className="text-center">
                          {isEditing ? (
                            <input
                              className="form-control text-center"
                              value={data.ssn}
                              onChange={(e) =>
                                handleChange("ssn", e.target.value)
                              }
                            />
                          ) : (
                            <span>{data.ssn}</span>
                          )}
                        </td>
                      </tr>
                      <tr>
                        <td
                          className="text-center"
                          style={{ backgroundColor: "#cdcdcd" }}
                        >
                          الاسم
                        </td>
                        <td className="text-center">
                          {isEditing ? (
                            <input
                              className="form-control text-center"
                              value={data.name}
                              onChange={(e) =>
                                handleChange("name", e.target.value)
                              }
                            />
                          ) : (
                            <span>{data.name}</span>
                          )}
                        </td>
                        <td
                          className="text-center"
                          style={{ backgroundColor: "#cdcdcd" }}
                        >
                          العنوان
                        </td>
                        <td className="text-center">
                          {isEditing ? (
                            <input
                              className="form-control text-center"
                              value={data.address}
                              onChange={(e) =>
                                handleChange("address", e.target.value)
                              }
                            />
                          ) : (
                            <span>{data.address}</span>
                          )}
                        </td>
                      </tr>
                      <tr>
                        <td
                          className="text-center"
                          style={{ backgroundColor: "#cdcdcd" }}
                        >
                          الهاتف
                        </td>
                        <td className="text-center">
                          {isEditing ? (
                            <input
                              className="form-control text-center"
                              value={data.phone}
                              onChange={(e) =>
                                handleChange("phone", e.target.value)
                              }
                            />
                          ) : (
                            <span>{data.phone}</span>
                          )}
                        </td>
                        <td
                          className="text-center"
                          style={{ backgroundColor: "#cdcdcd" }}
                        >
                          المؤهل
                        </td>
                        <td className="text-center">
                          {isEditing ? (
                            <input
                              className="form-control text-center"
                              value={data.degree}
                              onChange={(e) =>
                                handleChange("degree", e.target.value)
                              }
                            />
                          ) : (
                            <span>{data.degree}</span>
                          )}
                        </td>
                      </tr>
                      <tr>
                        <td
                          className="text-center"
                          style={{ backgroundColor: "#cdcdcd" }}
                        >
                          البريد الالكتروني
                        </td>
                        <td className="text-center">
                          {isEditing ? (
                            <input
                              className="form-control text-center"
                              value={data.email}
                              onChange={(e) =>
                                handleChange("email", e.target.value)
                              }
                            />
                          ) : (
                            <span>{data.email}</span>
                          )}
                        </td>
                        <td
                          className="text-center"
                          style={{ backgroundColor: "#cdcdcd" }}
                        >
                          الوظيفة
                        </td>
                        <td className="text-center">
                          {isEditing ? (
                            <input
                              className="form-control text-center"
                              value={data.job}
                              onChange={(e) =>
                                handleChange("job", e.target.value)
                              }
                            />
                          ) : (
                            <span>{data.job}</span>
                          )}
                        </td>
                      </tr>
                      <tr>
                        <td
                          className="text-center"
                          style={{ backgroundColor: "#cdcdcd" }}
                        >
                          النوع
                        </td>
                        <td className="text-center">
                          <span>{data.gender}</span>
                        </td>
                        <td
                          className="text-center"
                          style={{ backgroundColor: "#cdcdcd" }}
                        >
                          تاريخ الميلاد
                        </td>
                        <td className="text-center">
                          <span>{data.DOB}</span>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                {/* MOBILE: two-column table */}
                <div className="d-block d-md-none  rounded shadow-lg table-responsive">
                  <table
                    className="table mb-0"
                    style={{ borderRadius: "8px", overflow: "hidden" }}
                  >
                    <tbody>
                      <tr>
                        <td
                          className="text-center"
                          style={{ backgroundColor: "#cdcdcd" }}
                        >
                          الرقم المسلسل
                        </td>
                        <td className="text-center">{data.id}</td>
                      </tr>
                      <tr>
                        <td
                          className="text-center"
                          style={{ backgroundColor: "#cdcdcd" }}
                        >
                          الرقم القومي
                        </td>
                        <td className="text-center">
                          {isEditing ? (
                            <input
                              className="form-control text-center"
                              value={data.ssn}
                              onChange={(e) =>
                                handleChange("ssn", e.target.value)
                              }
                            />
                          ) : (
                            <span>{data.ssn}</span>
                          )}
                        </td>
                      </tr>
                      <tr>
                        <td
                          className="text-center"
                          style={{ backgroundColor: "#cdcdcd" }}
                        >
                          الاسم
                        </td>
                        <td className="text-center">
                          {isEditing ? (
                            <input
                              className="form-control text-center"
                              value={data.name}
                              onChange={(e) =>
                                handleChange("name", e.target.value)
                              }
                            />
                          ) : (
                            <span>{data.name}</span>
                          )}
                        </td>
                      </tr>
                      <tr>
                        <td
                          className="text-center"
                          style={{ backgroundColor: "#cdcdcd" }}
                        >
                          العنوان
                        </td>
                        <td className="text-center">
                          {isEditing ? (
                            <input
                              className="form-control text-center"
                              value={data.address}
                              onChange={(e) =>
                                handleChange("address", e.target.value)
                              }
                            />
                          ) : (
                            <span>{data.address}</span>
                          )}
                        </td>
                      </tr>
                      <tr>
                        <td
                          className="text-center"
                          style={{ backgroundColor: "#cdcdcd" }}
                        >
                          الهاتف
                        </td>
                        <td className="text-center">
                          {isEditing ? (
                            <input
                              className="form-control text-center"
                              value={data.phone}
                              onChange={(e) =>
                                handleChange("phone", e.target.value)
                              }
                            />
                          ) : (
                            <span>{data.phone}</span>
                          )}
                        </td>
                      </tr>
                      <tr>
                        <td
                          className="text-center"
                          style={{ backgroundColor: "#cdcdcd" }}
                        >
                          المؤهل
                        </td>
                        <td className="text-center">
                          {isEditing ? (
                            <input
                              className="form-control text-center"
                              value={data.degree}
                              onChange={(e) =>
                                handleChange("degree", e.target.value)
                              }
                            />
                          ) : (
                            <span>{data.degree}</span>
                          )}
                        </td>
                      </tr>
                      <tr>
                        <td
                          className="text-center"
                          style={{ backgroundColor: "#cdcdcd" }}
                        >
                          البريد الالكتروني
                        </td>
                        <td className="text-center">
                          {isEditing ? (
                            <input
                              className="form-control text-center"
                              value={data.email}
                              onChange={(e) =>
                                handleChange("email", e.target.value)
                              }
                            />
                          ) : (
                            <span>{data.email}</span>
                          )}
                        </td>
                      </tr>
                      <tr>
                        <td
                          className="text-center"
                          style={{ backgroundColor: "#cdcdcd" }}
                        >
                          الوظيفة
                        </td>
                        <td className="text-center">
                          {isEditing ? (
                            <input
                              className="form-control text-center"
                              value={data.job}
                              onChange={(e) =>
                                handleChange("job", e.target.value)
                              }
                            />
                          ) : (
                            <span>{data.job}</span>
                          )}
                        </td>
                      </tr>
                      <tr>
                        <td
                          className="text-center"
                          style={{ backgroundColor: "#cdcdcd" }}
                        >
                          النوع
                        </td>
                        <td className="text-center">
                          <span>{data.gender}</span>
                        </td>
                      </tr>
                      <tr>
                        <td
                          className="text-center"
                          style={{ backgroundColor: "#cdcdcd" }}
                        >
                          تاريخ الميلاد
                        </td>
                        <td className="text-center">
                          <span>{data.DOB}</span>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* Attachments Section */}
            <h2 className="mb-3">المرفقات</h2>
            <div className="row row-cols-1 row-cols-md-2 row-cols-lg-2 g-4 mb-5 justify-content-center">
              {[
                { type: "degree", label: "صورة المؤهل" },
                { type: "personal", label: "صورة الشخصية" },
                { type: "idFront", label: "صورة البطاقة وجه" },
                { type: "idBack", label: "صورة البطاقة ظهر" },
              ].map(({ type, label }) => (
                <div key={type} className="col d-flex justify-content-center">
                  <div
                    className="card shadow-sm p-3 text-center"
                    style={{ width: "100%" }}
                  >
                    <div className="fw-bold mb-2">{label}</div>

                    {(isAdmin || isSuperAdmin) && (
                      <div
                        className="mx-auto mb-2"
                        style={{
                          width: "100%",
                          height: "150px",
                          backgroundColor: files[type]
                            ? "transparent"
                            : "#EFF1F5",
                          border: "1px dashed #CFB53B",
                          borderRadius: "8px",
                          position: "relative",
                        }}
                      >
                        {files[type] ? (
                          <img
                            src={
                              typeof files[type] === "string"
                                ? `${files[type]}`
                                : URL.createObjectURL(files[type])
                            }
                            alt={label}
                            className="img-fluid"
                            style={{
                              maxHeight: "100%",
                              maxWidth: "100%",
                              cursor: "zoom-in",
                            }}
                            onClick={() => {
                              setZoomedImage(files[type]);
                              setShowImgModal(true);
                            }}
                          />
                        ) : (
                          <i
                            className="bi bi-card-image text-secondary"
                            style={{ fontSize: "2.5rem", lineHeight: "150px" }}
                          ></i>
                        )}
                      </div>
                    )}
                    {isEmployee && (
                      <>
                        <div
                          className="mx-auto mb-2"
                          style={{
                            width: "100%",
                            height: "150px",
                            backgroundColor: files[type]
                              ? "transparent"
                              : "#EFF1F5",
                            border: "1px dashed #CFB53B",
                            borderRadius: "8px",

                            position: "relative",
                          }}
                          // onClick={() => fileInputs[type].current.click()}
                          // onClick={() => {
                          //     setZoomedImage(files[type])
                          //     setShowImgModal(true);
                          // }}
                        >
                          {files[type] ? (
                            <img
                              src={
                                typeof files[type] === "string"
                                  ? `${files[type]}`
                                  : URL.createObjectURL(files[type])
                              }
                              alt={label}
                              className="img-fluid"
                              style={{ maxHeight: "100%", maxWidth: "100%" }}
                            />
                          ) : (
                            <i
                              className="bi bi-card-image text-secondary"
                              style={{
                                fontSize: "2.5rem",
                                lineHeight: "150px",
                              }}
                            ></i>
                          )}
                          <input
                            type="file"
                            accept="image/jpeg, image/jpg"
                            ref={fileInputs[type]}
                            style={{ display: "none" }}
                            onChange={(e) =>
                              handleFile(type, e.target.files[0])
                            }
                          />
                        </div>
                        <button
                          className="btn btn-outline-warning"
                          style={{
                            borderRadius: "5px",
                            width: "100%",
                          }}
                          onClick={() => fileInputs[type].current.click()}
                        >
                          تعديل
                        </button>
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Requests Section */}
            <h2 className="mb-3">حالة الطلب</h2>
            <div className="row justify-content-center">
              <div className="col-12 col-lg-12">
                <div className="table-responsive shadow-lg rounded">
                  <table className="table table-bordered text-center mb-0 w-100">
                    <thead className="bg-light">
                      <tr>
                        <th>الحالة</th>
                        <th>ملاحظات</th>
                        <th>تحكم</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="align-middle">
                        <td className={`${statusClass(request.status)} w-25`}>
                          {request.status}
                        </td>
                        <td
                          dir="rtl"
                          className="text-break w-50"
                          style={{ whiteSpace: "pre-wrap", maxWidth: "300px" }}
                        >
                          {request.notes || (
                            <span className="text-muted">لا توجد ملاحظات</span>
                          )}
                        </td>
                        <td className="w-25">
                          {isEmployee && (
                            <button
                              className="btn btn-outline-primary btn-main btn-sm mt-1"
                              onClick={() => navigate(`/faculties/${id}`)}
                              disabled={
                                request.status === "تحت المراجعة" ||
                                request.status === "تم الرفض"
                              }
                              style={{
                                backgroundColor: "#19355A",
                                cursor:
                                  request.status === "تحت المراجعة" ||
                                  request.status === "تم الرفض"
                                    ? "not-allowed"
                                    : "pointer",
                              }}
                            >
                              عرض الكليات
                            </button>
                          )}
                          {(isAdmin || isSuperAdmin) &&
                            (request.status === "تم الرفض" ||
                              request.status === "تحت المراجعة") && (
                              <button
                                style={{ backgroundColor: "#19355A" }}
                                className="btn btn-outline-primary btn-main btn-sm mt-1"
                                onClick={() => openModal(request)}
                              >
                                اضف ملاحظة
                              </button>
                            )}
                          {(isAdmin || isSuperAdmin) && (
                            <>
                              {request.status === "تحت المراجعة" && (
                                <>
                                  <button
                                    className="btn btn-outline-success btn-sm mx-2 mt-2"
                                    onClick={approve}
                                  >
                                    قبول
                                  </button>
                                  <button
                                    className="btn btn-outline-danger btn-sm mx-2 mt-2"
                                    onClick={reject}
                                  >
                                    رفض
                                  </button>
                                </>
                              )}
                              {request.status === "تم القبول" && (
                                <button
                                  className="btn btn-outline-primary btn-sm mt-2"
                                  onClick={() => navigate(`/faculties/${id}`)}
                                >
                                  اضف كليات
                                </button>
                              )}
                            </>
                          )}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* Notes Modal */}
            <Modal
              show={showModal}
              onHide={closeModal}
              dialogClassName="modal-lg text-end"
              dir="rtl"
            >
              <Modal.Header className="flex-row-reverse ">
                <button
                  type="button"
                  className="btn-close"
                  aria-label="إغلاق"
                  onClick={closeModal}
                ></button>
                <Modal.Title style={{ marginLeft: "68%" }}>
                  إضافة / تعديل ملاحظة
                </Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <textarea
                  className="form-control"
                  rows={5}
                  value={noteText}
                  onChange={(e) => setNoteText(e.target.value)}
                  dir="rtl"
                />
              </Modal.Body>
              <Modal.Footer className="flex-row-reverse">
                <Button variant="danger" onClick={closeModal}>
                  إلغاء
                </Button>
                <Button variant="success" onClick={saveNote}>
                  حفظ التغييرات
                </Button>
              </Modal.Footer>
            </Modal>
            {/* zoomed image Modal */}
            <Modal
              show={showImgModal}
              onHide={closeImgModal}
              dialogClassName="modal-lg text-end"
            >
              <Modal.Header
                closeButton
                className="flex-row-reverse "
              ></Modal.Header>
              <Modal.Body className="d-flex justify-content-center align-items-center">
                <img
                  src={zoomedImage}
                  alt="zoomed Image"
                  className="img-fluid"
                  style={{ maxHeight: "100%", maxWidth: "100%" }}
                />
              </Modal.Body>
            </Modal>
          </div>
        </div>
      )}
    </>
  );
};

export default PersonalInfoPortal;

import React, { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import { useNavigate, useParams } from "react-router";
import { useAuth } from "../../Context/AuthContext";
import LogoSpinner from "../../components/spinner/LogoSpinner";
import { NotLoaded } from "../../App";
import { api } from "../../data/api";
import { degreeOptions } from "../../constants/degreeOptions";
import { employeeTypeOptions } from "../../constants/employeeOptions";
// sections
import BackBar from "../../components/BackBar/BackBar";
import PersonalInfoTable from "./sections/PersonalInfoTable";
import AttachmentsSection from "./sections/AttachmentsSection";
import RequestStatusPanel from "./sections/RequestStatusPanel";
import NotesModal from "./modals/NotesModal";
import ImageModal from "./modals/ImageModal";
import AvailabilitySection from "./sections/AvailabilitySection";
import RelativesSection from "./sections/RelativesSection";
import AdminCommentSection from "./sections/AdminCommentSection";

const originalData = {
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
  employeeType: "",

  availabilityDays: [],
  hasRelatives: false,
  relativesCount: 0,
  relatives: [], // [{ name, relation, department }]

  // 🔹 NEW: internal comment (غير ظاهر للموظف)
  adminComment: "",
};

const PersonalInfoPortal = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { id, reqID } = useParams();

  const [role, setRole] = useState("");
  const isSuperAdmin = role === "superadmin";
  const isAdmin = role === "admin";
  const isManager = role === "manager";
  const isEmployee = role === "employee";
  const [canEdit, setCanEdit] = useState(false);
  const [savingAdminComment, setSavingAdminComment] = useState(false);

  const [loader, setLoader] = useState(true);
  const [errPage, setErrPage] = useState(false);

  // data
  const [data, setData] = useState({ ...originalData });
  const [orgData, setOrgData] = useState({ ...originalData });
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);

  // images
  const [files, setFiles] = useState({
    personal: null,
    degree: null,
    idFront: null,
    idBack: null,
  });

  // request
  const [request, setRequest] = useState({ status: "تحت المراجعة", notes: "" });

  // modals
  const [showNoteModal, setShowNoteModal] = useState(false);
  const [noteText, setNoteText] = useState("");
  const [showImgModal, setShowImgModal] = useState(false);
  const [zoomedImage, setZoomedImage] = useState(null);

  // 🔹 NEW: which tab is active
  const [activeTab, setActiveTab] = useState("info"); // "info" | "availability" | "relatives" | "attachments" | "status"

  // ---------------------------------------
  // bootstrap
  // ---------------------------------------
  useEffect(() => {
    if (!id || !user) {
      navigate(-1);
      return;
    }
    setRole(user?.role?.toLowerCase?.() || "");
    const load = async () => {
      try {
        const res = await api.get(`/api/Request/${id}`);
        const e = res.data.data.employeeInformation;
        const imgs = res.data.data.employeeImagesDto;

        // ⬇️ if backend sends these fields, grab them:
        const extra = res.data.data.extraInfo || {};
        // adjust: maybe they’re directly under data instead of .extraInfo

        console.log(res);

        setCanEdit(!!e.canEdit);
        const newData = {
          id: e.id,
          name: e.name,
          address: e.address,
          degree: e.degree,
          job: e.job,
          ssn: e.ssn,
          phone: e.phone,
          email: e.email,
          gender: e.gender,
          DOB: e.dob,
          age: e.age,
          employeeType: e.employeeType,

          availabilityDays: extra.availabilityDays || [], // ["السبت","الأحد"]
          hasRelatives: extra.hasRelatives ?? true,
          relativesCount: extra.relativesCount || 1,
          relatives: extra.relatives || [],

          // 🔹 NEW
          adminComment: e.adminComment || "", // or res.data.data.adminComment
        };

        setData(newData);
        setOrgData(newData);

        setFiles({
          personal: imgs.personalImage,
          degree: imgs.degreeImage,
          idFront: imgs.ssnFrontImage,
          idBack: imgs.ssnBackImage,
        });

        setRequest(res.data.data.requestStatus);

        setLoader(false);
      } catch (err) {
        setErrPage(true);
        setLoader(false);
        if (err.response?.status === 401) {
          toast.error(err.response.data.Data, { rtl: true });
          navigate("/");
        }
      }
    };
    load();
    // eslint-disable-next-line
  }, [id]);

  // ---------------------------------------
  // handlers
  // ---------------------------------------

  const startEdit = () => {
    // لو مش موظف أو السيستم قافل التعديل → منع
    if (!isEmployee || !canEdit) {
      toast.error("غير مسموح بتعديل البيانات في الوقت الحالي.", {
        rtl: true,
      });
      return;
    }

    setOrgData(data);
    setIsEditing(true);
  };

  const handleChange = (field, value) =>
    setData((prev) => ({ ...prev, [field]: value }));

  const cancelEdit = () => {
    setData(orgData);
    setIsEditing(false);
  };

  const validateData = () => {
    const errors = {};
    if (!data.name.trim()) errors.name = "الاسم مطلوب";
    if ((data.name.trim().match(/ /g) || []).length < 3)
      errors.name = "الاسم يجب ان يحتوي على اربع كلمات على الاقل";
    if (!/^\d{14}$/.test(data.ssn))
      errors.ssn = "الرقم القومي يجب أن يكون 14 رقمًا";
    if (!/^01[0-9]{9}$/.test(data.phone)) errors.phone = "رقم الهاتف غير صالح";
    if (!/\S+@\S+\.\S+/.test(data.email))
      errors.email = "البريد الإلكتروني غير صالح";
    if (!data.address.trim()) errors.address = "العنوان مطلوب";
    if (!data.degree.trim()) errors.degree = "المؤهل مطلوب";
    if (!data.job.trim()) errors.job = "الوظيفة مطلوبة";
    if (!String(data.gender).trim()) errors.gender = "النوع مطلوب";
    return errors;
  };

  // 🔹 حفظ البيانات الشخصية فقط (TAB 1)
  const savePersonal = async () => {
    if (!canEdit || !isEmployee) {
      toast.error("غير مسموح بتعديل البيانات الشخصية في الوقت الحالي.", {
        rtl: true,
      });
      return;
    }

    setLoading(true);
    const errs = validateData(); // نفس الفالديشن اللي عندك
    if (Object.keys(errs).length) {
      Object.values(errs).forEach((m) => toast.error(m, { rtl: true }));
      setLoading(false);
      return;
    }

    console.log("before endpoint =>>>", data);

    try {
      await api.put("/api/Employee/UpdateEmployeePersonal", {
        employeeId: data.id,
        name: data.name,
        address: data.address,
        phone: data.phone,
        email: data.email,
        job: data.job,
        degree: data.degree, // enum name
        employeeType: data.employeeType, // enum name
        ssn: data.ssn,
      });

      toast.success("تم تحديث البيانات الشخصية", { rtl: true });
      setIsEditing(false);
    } catch (err) {
      const msgs =
        err?.response?.data?.errors ||
        err?.response?.data?.message ||
        err?.message;
      if (Array.isArray(msgs))
        msgs.forEach((m) => toast.error(m, { rtl: true }));
      else toast.error(String(msgs || "حدث خطأ أثناء التحديث."), { rtl: true });
    } finally {
      setLoading(false);
    }
  };

  // 🔹 حفظ أيام التفرغ فقط (TAB 2)
  const saveAvailability = async () => {
    if (!canEdit || !isEmployee) {
      toast.error("غير مسموح بتعديل أيام التفرغ في الوقت الحالي.", {
        rtl: true,
      });
      return;
    }

    if (!data.availabilityDays || data.availabilityDays.length === 0) {
      toast.error("اختر يوم تفرغ واحد على الأقل", { rtl: true });
      return;
    }

    setLoading(true);
    try {
      await api.put("/api/Employee/UpdateEmployeeAvailability", {
        employeeId: data.id,
        availabilityDays: data.availabilityDays,
      });

      toast.success("تم تحديث أيام التفرغ", { rtl: true });
      setIsEditing(false);
    } catch (err) {
      const msgs =
        err?.response?.data?.errors ||
        err?.response?.data?.message ||
        err?.message;
      if (Array.isArray(msgs))
        msgs.forEach((m) => toast.error(m, { rtl: true }));
      else toast.error(String(msgs || "حدث خطأ أثناء التحديث."), { rtl: true });
    } finally {
      setLoading(false);
    }
  };

  // 🔹 حفظ بيانات الأقارب فقط (TAB 3)
  const saveRelatives = async () => {
    if (!canEdit || !isEmployee) {
      toast.error("غير مسموح بتعديل بيانات الأقارب في الوقت الحالي.", {
        rtl: true,
      });
      return;
    }

    if (data.hasRelatives) {
      if (
        !Number.isInteger(+data.relativesCount) ||
        +data.relativesCount <= 0
      ) {
        toast.error("أدخل عدد الأقارب بشكل صحيح", { rtl: true });
        return;
      }
      if (data.relatives.length !== +data.relativesCount) {
        toast.error("أكمل بيانات جميع الأقارب", { rtl: true });
        return;
      }
      for (let i = 0; i < data.relatives.length; i++) {
        const r = data.relatives[i];
        if (!r.name?.trim() || !r.relation?.trim() || !r.department?.trim()) {
          toast.error(`أكمل بيانات القريب رقم ${i + 1}`, { rtl: true });
          return;
        }
      }
    }

    setLoading(true);
    try {
      await api.put("/api/Employee/UpdateEmployeeRelatives", {
        employeeId: data.id,
        hasRelatives: data.hasRelatives,
        relativesCount: data.relativesCount,
        relatives: data.relatives,
      });

      toast.success("تم تحديث بيانات الأقارب", { rtl: true });
      setIsEditing(false);
    } catch (err) {
      const msgs =
        err?.response?.data?.errors ||
        err?.response?.data?.message ||
        err?.message;
      if (Array.isArray(msgs))
        msgs.forEach((m) => toast.error(m, { rtl: true }));
      else toast.error(String(msgs || "حدث خطأ أثناء التحديث."), { rtl: true });
    } finally {
      setLoading(false);
    }
  };

  // image update (same flow)
  const updateImage = async (type, file) => {
    if (!canEdit || !isEmployee) {
      toast.error("غير مسموح بتعديل الصور في الوقت الحالي.", { rtl: true });
      return;
    }

    const MAX = 1024 * 1024;
    const ALLOWED = ["image/jpeg", "image/jpg"];
    const labelMap = {
      personal: "الصورة الشخصية",
      degree: "صورة المؤهل",
      idFront: "صورة اصل البطاقة (وجه)",
      idBack: "صورة اصل البطاقة (ظهر)",
    };
    if (!file) return;
    if (!ALLOWED.includes(file.type)) {
      toast.error(`${labelMap[type]}: نوع الملف غير مدعوم (jpg, jpeg)`, {
        rtl: true,
      });
      return;
    }
    if (file.size > MAX) {
      toast.error(`${labelMap[type]}: 1MB الحد الأقصى`, { rtl: true });
      return;
    }
    const idMap = {
      degree: "Degree",
      personal: "PersonalImage",
      idFront: "SSNFront",
      idBack: "SSNBack",
    };
    try {
      const fd = new FormData();
      fd.append("Image", file);
      await api.put(`/api/Employee/UpdateEmployeeImages`, fd, {
        params: { Identifier: idMap[type] },
      });
      setFiles((prev) => ({ ...prev, [type]: file }));
      toast.success("تم تحديث الصورة", { rtl: true });
    } catch (err) {
      console.log(err);
      const msgs =
        err?.response?.data?.errors ||
        err?.response?.data?.message ||
        err?.message;
      toast.error(msgs[0], { rtl: true });
    }
  };

  // notes
  const saveNote = async () => {
    try {
      await api.put(`/api/Request/AddNote`, {
        requestId: reqID,
        note: noteText,
      });
      setRequest((r) => ({ ...r, notes: noteText }));
      toast.success("تم حفظ الملاحظات", { rtl: true });
      setShowNoteModal(false);
    } catch {
      toast.error("تعذر حفظ الملاحظات.", { rtl: true });
    }
  };

  // approve / reject
  const reject = async (isAfterAccept = false) => {
    try {
      const res = await api.put(`/api/Request/ChangeStatus`, {
        requestId: reqID,
        newStatus: isAfterAccept ? 4 : 3, // 👈 4 = رفض بعد القبول
      });
      toast.success(res.data.message, { rtl: true });
      setRequest((r) => ({
        ...r,
        status: isAfterAccept ? "تم الرفض بعد القبول" : "تم الرفض",
      }));
    } catch {
      /* noop */
    }
  };

  const saveAdminComment = async () => {
    if (!isAdmin && !isSuperAdmin) return;

    if (!data.id) {
      toast.error("لا يوجد موظف محدد لحفظ التعليق.", { rtl: true });
      return;
    }

    setSavingAdminComment(true);

    try {
      console.log(data.id);
      console.log(data.adminComment);
      await api.put("/api/Employee/UpdateAdminComment", {
        employeeId: data.id,
        comment: data.adminComment,
      });

      toast.success("تم حفظ تعليق المشرف بنجاح", { rtl: true });
    } catch (err) {
      const msgs =
        err?.response?.data?.errors ||
        err?.response?.data?.message ||
        err?.message;

      if (Array.isArray(msgs))
        msgs.forEach((m) => toast.error(m, { rtl: true }));
      else
        toast.error(String(msgs || "حدث خطأ أثناء حفظ التعليق."), {
          rtl: true,
        });
    } finally {
      setSavingAdminComment(false);
    }
  };

  return (
    <>
      <ToastContainer position="top-center" />
      {loader && <LogoSpinner />}
      {errPage && (
        <NotLoaded
          reload={() => {
            setErrPage(false);
            setLoader(true);
            window.location.reload();
          }}
        />
      )}
      {!loader && !errPage && (
        <div
          dir="rtl"
          className="container-fluid p-0"
          style={{ backgroundColor: "#EBEFF5" }}
        >
          <div className="container py-4 w-100">
            {(isAdmin || isSuperAdmin || isManager) && (
              <BackBar onBack={() => navigate(-1)} />
            )}

            {/* 🔹 Tabs Header */}
            <ul
              className="nav nav-tabs mb-3 justify-content-end"
              role="tablist"
            >
              <li className="nav-item" role="presentation">
                <button
                  type="button"
                  className={`nav-link ${activeTab === "info" ? "active" : ""}`}
                  onClick={() => setActiveTab("info")}
                >
                  البيانات الشخصية
                </button>
              </li>
              {(isAdmin || isSuperAdmin) && (
                <li className="nav-item" role="presentation">
                  <button
                    type="button"
                    className={`nav-link ${
                      activeTab === "admin" ? "active" : ""
                    }`}
                    onClick={() => setActiveTab("admin")}
                  >
                    تعليق داخلي
                  </button>
                </li>
              )}
              <li className="nav-item" role="presentation">
                <button
                  type="button"
                  className={`nav-link ${
                    activeTab === "availability" ? "active" : ""
                  }`}
                  onClick={() => setActiveTab("availability")}
                >
                  أيام التفرغ
                </button>
              </li>

              <li className="nav-item" role="presentation">
                <button
                  type="button"
                  className={`nav-link ${
                    activeTab === "relatives" ? "active" : ""
                  }`}
                  onClick={() => setActiveTab("relatives")}
                >
                  الأقارب
                </button>
              </li>

              <li className="nav-item" role="presentation">
                <button
                  type="button"
                  className={`nav-link ${
                    activeTab === "attachments" ? "active" : ""
                  }`}
                  onClick={() => setActiveTab("attachments")}
                >
                  المرفقات
                </button>
              </li>

              {!isManager && (
                <li className="nav-item" role="presentation">
                  <button
                    type="button"
                    className={`nav-link ${
                      activeTab === "status" ? "active" : ""
                    }`}
                    onClick={() => setActiveTab("status")}
                  >
                    حالة الطلب
                  </button>
                </li>
              )}
            </ul>

            {/* 🔹 تنبيه في حالة عدم السماح بالتعديل */}
            {isEmployee && !canEdit && (
              <div className="alert alert-warning text-center" role="alert">
                لا يمكنك تعديل البيانات في الوقت الحالي. سيتم فتح التعديل خلال
                فترات محددة من قبل الإدارة.
              </div>
            )}

            {/* 🔹 Tabs Content */}
            <div className="tab-content mt-3">
              {activeTab === "info" && (
                <div className="tab-pane fade show active">
                  <PersonalInfoTable
                    data={data}
                    isEditing={isEditing}
                    isEmployee={isEmployee}
                    degreeOptions={degreeOptions}
                    employeeTypeOptions={employeeTypeOptions}
                    onChange={handleChange}
                    onStartEdit={startEdit}
                    onSave={savePersonal}
                    onCancel={cancelEdit}
                    saving={loading}
                    canEdit={canEdit}
                  />
                </div>
              )}

              {activeTab === "admin" && (isAdmin || isSuperAdmin) && (
                <div className="tab-pane fade show active">
                  <AdminCommentSection
                    comment={data.adminComment || ""}
                    onChange={(v) => handleChange("adminComment", v)}
                    onSave={saveAdminComment}
                    saving={savingAdminComment}
                  />
                </div>
              )}

              {activeTab === "availability" && (
                <div className="tab-pane fade show active">
                  <AvailabilitySection
                    selectedDays={data.availabilityDays}
                    disabled={!isEmployee || !canEdit}
                    onToggle={(day) =>
                      setData((prev) => {
                        const exists = prev.availabilityDays.includes(day);
                        return {
                          ...prev,
                          availabilityDays: exists
                            ? prev.availabilityDays.filter((d) => d !== day)
                            : [...prev.availabilityDays, day],
                        };
                      })
                    }
                    onSave={saveAvailability}
                    onCancel={cancelEdit}
                  />
                </div>
              )}

              {activeTab === "relatives" && (
                <div className="tab-pane fade show active">
                  <RelativesSection
                    hasRelatives={data.hasRelatives}
                    relativesCount={data.relativesCount}
                    relatives={data.relatives}
                    disabled={!isEmployee || !canEdit}
                    onChangeHasRelatives={(val) =>
                      setData((prev) => ({
                        ...prev,
                        hasRelatives: val,
                        relativesCount: val ? prev.relativesCount || 1 : 0,
                        relatives: val
                          ? prev.relatives.length
                            ? prev.relatives
                            : [
                                {
                                  name: "",
                                  relation: "",
                                  department: "",
                                },
                              ]
                          : [],
                      }))
                    }
                    onChangeCount={(val) =>
                      setData((prev) => {
                        const n = parseInt(val || "0", 10);
                        if (!Number.isFinite(n) || n < 0) return prev;

                        if (n === 0) {
                          return { ...prev, relativesCount: 0, relatives: [] };
                        }

                        const newRelatives = [...prev.relatives];

                        if (n > newRelatives.length) {
                          for (let i = newRelatives.length; i < n; i++) {
                            newRelatives.push({
                              name: "",
                              relation: "",
                              department: "",
                            });
                          }
                        } else if (n < newRelatives.length) {
                          newRelatives.length = n;
                        }

                        return {
                          ...prev,
                          relativesCount: n,
                          relatives: newRelatives,
                        };
                      })
                    }
                    onChangeRelative={(idx, key, value) =>
                      setData((prev) => {
                        const arr = [...prev.relatives];
                        arr[idx] = { ...arr[idx], [key]: value };
                        return { ...prev, relatives: arr };
                      })
                    }
                    onAddRelative={() =>
                      setData((prev) => {
                        const newRelatives = [
                          ...prev.relatives,
                          { name: "", relation: "", department: "" },
                        ];
                        return {
                          ...prev,
                          relatives: newRelatives,
                          relativesCount: newRelatives.length,
                        };
                      })
                    }
                    onDeleteRelative={(idx) =>
                      setData((prev) => {
                        const newRelatives = prev.relatives.filter(
                          (_, i) => i !== idx
                        );
                        return {
                          ...prev,
                          relatives: newRelatives,
                          relativesCount: newRelatives.length,
                        };
                      })
                    }
                    onSave={saveRelatives}
                    onCancel={cancelEdit}
                    saving={loading}
                  />
                </div>
              )}

              {activeTab === "attachments" && (
                <div className="tab-pane fade show active">
                  <h2 className="mb-3">المرفقات</h2>
                  <AttachmentsSection
                    files={files}
                    isEmployee={isEmployee}
                    onPick={(file) => setZoomedImage(file)}
                    onZoom={(src) => {
                      setZoomedImage(src);
                      setShowImgModal(true);
                    }}
                    onUpdateImage={updateImage}
                  />
                </div>
              )}

              {activeTab === "status" && !isManager && (
                <div className="tab-pane fade show active">
                  <RequestStatusPanel
                    request={request}
                    isEmployee={isEmployee}
                    isAdmin={isAdmin || isSuperAdmin}
                    onOpenFaculties={() => navigate(`/faculties/${id}`)}
                    onOpenNotes={() => {
                      setNoteText(request.notes || "");
                      setShowNoteModal(true);
                    }}
                    onReject={reject}
                    onRejectAfterAccept={() => reject(true)} // 👈 هنا
                  />
                </div>
              )}
            </div>

            {/* Modals */}
            <NotesModal
              show={showNoteModal}
              noteText={noteText}
              setNoteText={setNoteText}
              onClose={() => setShowNoteModal(false)}
              onSave={saveNote}
            />
            <ImageModal
              show={showImgModal}
              src={
                typeof zoomedImage === "string"
                  ? zoomedImage
                  : zoomedImage
                  ? URL.createObjectURL(zoomedImage)
                  : ""
              }
              onClose={() => setShowImgModal(false)}
            />
          </div>
        </div>
      )}
    </>
  );
};

export default PersonalInfoPortal;

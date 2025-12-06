/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useMemo, useRef, useState } from "react";
import Stepper from "bs-stepper";
import "bs-stepper/dist/css/bs-stepper.min.css";

import "./register.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import { api } from "../../data/api";
import { useAuth } from "../../Context/AuthContext";

// Steps
import StepPersonal from "./steps/StepPersonal";
import StepUploads from "./steps/StepUploads";
import StepAvailability from "./steps/StepAvailability";
import StepRelativesAndConsent from "./steps/StepRelativesAndConsent";

// Color constants
const PRIMARY = "#19355a";
const PRIMARY_HOVER = "#27285d";
const SECONDARY = PRIMARY;
const SECONDARY_HOVER = "#ad8700";

const DAYS = [
  "السبت",
  "الأحد",
  "الإثنين",
  "الثلاثاء",
  "الأربعاء",
  "الخميس",
  "الجمعة",
];

const RegisterForm = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  // stepper
  const stepperRef = useRef(null);
  const [stepper, setStepper] = useState(null);

  const [loader, setLoader] = useState(false);
  const [birthDate, setBirthDate] = useState("");
  const [errors, setErrors] = useState([]);

  // form pieces
  const [form, setForm] = useState({
    name: "",
    email: "",
    address: "",
    phone: "",
    ssn: "",
    job: "",
    degree: "",
    employeeType: "",
    password: "",
    confirmPassword: "",
    gender: "",
    age: "",
  });

  const [files, setFiles] = useState({
    personal: null,
    degree: null,
    backId: null,
    frontId: null,
  });

  // new: availability & relatives & consent
  const [availability, setAvailability] = useState(
    DAYS.reduce((acc, d) => ({ ...acc, [d]: false }), {})
  );
  const [hasRelatives, setHasRelatives] = useState(false);
  const [relativesCount, setRelativesCount] = useState(0);
  const [relatives, setRelatives] = useState([]); // [{name, relation, department}]
  const [agreed, setAgreed] = useState(false);
  const [showTerms, setShowTerms] = useState(false);

  useEffect(() => {
    if (user?.isLoggedIn) {
      switch (user.role?.toLowerCase()) {
        case "admin":
          navigate("/requests");
          break;
        case "superadmin":
          navigate("/admins");
          break;
        case "employee":
          navigate(`/profile/${user.id}`);
          break;
        default:
          break;
      }
    }
  }, []);

  useEffect(() => {
    if (stepperRef.current) {
      setStepper(new Stepper(stepperRef.current, { linear: false }));
    }
  }, []);

  // ---- helpers / validation ----
  const isValidPassword = (password) =>
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\W).{6,}$/.test(password);

  const extractFromSSN = (ssn) => {
    if (!/^\d{14}$/.test(ssn)) return {};
    const century = ssn[0] === "2" ? 1900 : 2000;
    const year = century + parseInt(ssn.slice(1, 3), 10);
    const month = parseInt(ssn.slice(3, 5), 10) - 1;
    const day = parseInt(ssn.slice(5, 7), 10);
    const age = new Date().getFullYear() - year;
    const gender = parseInt(ssn[12]) % 2 === 0 ? "أنثى" : "ذكر";
    const birthDT = new Date(year, month, day + 1).toISOString().split("T")[0];
    setBirthDate(birthDT);
    return { age, gender };
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    let updated = { ...form };
    if (name === "ssn") {
      const info = extractFromSSN(value);
      updated = { ...updated, ssn: value, ...info };
    } else {
      updated[name] = value;
    }
    setForm(updated);
    // field-level validation
    setErrors(
      validate(
        [
          name,
          name === "ssn" ? "gender" : "",
          name === "ssn" ? "age" : "",
        ].filter(Boolean)
      )
    );
  };

  const validate = (fields) => {
    const newErrors = { ...errors };
    const setErr = (f, msg) => (newErrors[f] = msg);

    if (fields.includes("name")) {
      if (!form.name.trim()) setErr("name", "الاسم مطلوب");
      else if ((form.name.trim().match(/ /g) || []).length < 3)
        setErr("name", "الاسم يجب أن يحتوي على أربع كلمات على الأقل");
      else delete newErrors.name;
    }
    if (fields.includes("email")) {
      if (!form.email.includes("@")) setErr("email", "بريد إلكتروني غير صالح");
      else delete newErrors.email;
    }
    if (fields.includes("address")) {
      if (!form.address.trim()) setErr("address", "العنوان مطلوب");
      else delete newErrors.address;
    }
    if (fields.includes("phone")) {
      if (!/^\d{10,15}$/.test(form.phone))
        setErr("phone", "رقم الهاتف غير صالح");
      else delete newErrors.phone;
    }
    if (fields.includes("ssn")) {
      if (!/^\d{14}$/.test(form.ssn)) setErr("ssn", "الرقم القومي غير صالح");
      else delete newErrors.ssn;
    }
    if (fields.includes("job")) {
      if (!form.job.trim()) setErr("job", "الوظيفة مطلوبة");
      else delete newErrors.job;
    }
    if (fields.includes("degree")) {
      if (!form.degree.trim()) setErr("degree", "المؤهل العلمي مطلوب");
      else delete newErrors.degree;
    }
    if (fields.includes("employeeType")) {
      if (!form.employeeType.trim()) setErr("employeeType", "نوع الموظف مطلوب");
      else delete newErrors.employeeType;
    }
    if (fields.includes("password")) {
      if (!isValidPassword(form.password))
        setErr("password", "كلمة المرور ضعيفة");
      else delete newErrors.password;
    }
    if (fields.includes("confirmPassword")) {
      if (form.password !== form.confirmPassword)
        setErr("confirmPassword", "كلمتا المرور غير متطابقتين");
      else delete newErrors.confirmPassword;
    }
    return newErrors;
  };

  const validateStep1 = () => {
    const required = [
      "name",
      "email",
      "address",
      "phone",
      "ssn",
      "job",
      "degree",
      "employeeType",
      "password",
      "confirmPassword",
    ];
    const v = validate(required);
    setErrors(v);
    return Object.keys(v).filter((k) => required.includes(k)).length === 0;
  };

  const validateStep2 = () => {
    // Optional to force uploads; currently not required by your code
    return true;
  };

  const validateStep3 = () => {
    const anySelected = Object.values(availability).some(Boolean);
    if (!anySelected) {
      toast.error("الرجاء اختيار يوم تفرغ واحد على الأقل", { rtl: true });
      return false;
    }
    return true;
  };

  const validateStep4 = () => {
    if (hasRelatives) {
      if (!Number.isInteger(+relativesCount) || +relativesCount <= 0) {
        toast.error("أدخل عدد الأقارب بشكل صحيح", { rtl: true });
        return false;
      }
      if (relatives.length !== +relativesCount) {
        toast.error("أكمل بيانات جميع الأقارب", { rtl: true });
        return false;
      }
      for (let i = 0; i < relatives.length; i++) {
        const r = relatives[i];
        if (!r.name?.trim() || !r.relation?.trim() || !r.department?.trim()) {
          toast.error(`أكمل بيانات القريب رقم ${i + 1}`, { rtl: true });
          return false;
        }
      }
    }
    if (!agreed) {
      toast.error("يجب الموافقة على الشروط قبل الإرسال", { rtl: true });
      return false;
    }
    return true;
  };

  const handleNext = (currentIdx) => {
    // currentIdx: 1..4
    let ok = true;
    if (currentIdx === 1) ok = validateStep1();
    if (currentIdx === 2) ok = validateStep2();
    if (currentIdx === 3) ok = validateStep3();
    if (!ok) return;
    stepper?.next();
  };

  const handlePrevious = () => stepper?.previous();

  // file previews
  const filePreviews = useMemo(() => {
    const previews = {};
    Object.entries(files).forEach(([key, file]) => {
      if (file) previews[key] = URL.createObjectURL(file);
    });
    return previews;
  }, [files]);

  const handleFileUpload = (e, type) => {
    const file = e.target.files[0];
    if (!file) return;
    const isJpg = file.type === "image/jpeg" || file.type === "image/jpg";
    const isLt1M = file.size <= 1024 * 1024;
    if (!isJpg) return toast.error("الملف يجب أن يكون JPG.", { rtl: true });
    if (!isLt1M)
      return toast.error("حجم الملف يجب أن لا يتجاوز 1MB.", { rtl: true });
    setFiles((prev) => ({ ...prev, [type]: file }));
    toast.success(`تم اختيار الملف: ${file.name}`, { rtl: true });
  };

  const handleSubmit = async (e) => {
    // e.preventDefault();

    // step validations...
    if (!validateStep1()) {
      toast.error("يرجى استكمال البيانات الشخصية في الخطوة (1)", { rtl: true });
      stepper.to(1);
      return;
    }
    if (!validateStep2()) {
      toast.error("يرجى رفع الملفات المطلوبة في الخطوة (2)", { rtl: true });
      stepper.to(2);
      return;
    }
    if (!validateStep3()) {
      toast.error("يرجى اختيار يوم واحد على الأقل في الخطوة (3)", {
        rtl: true,
      });
      stepper.to(3);
      return;
    }
    if (!validateStep4()) {
      toast.error(
        "يرجى استكمال بيانات الأقارب أو الموافقة على الشروط في الخطوة (4)",
        { rtl: true }
      );
      stepper.to(4);
      return;
    }

    setLoader(true);
    try {
      const fd = new FormData();

      // ---- FILES (keys must match DTO)
      if (files.frontId) fd.append("SSNFrontImage", files.frontId);
      if (files.backId) fd.append("SSNBackImage", files.backId);
      if (files.personal) fd.append("PersonalImage", files.personal);
      if (files.degree) fd.append("DegreeImage", files.degree);

      // ---- SCALARS: APPEND (no params). NAMES MUST MATCH DTO (PascalCase)
      fd.append("Email", form.email || "");
      fd.append("Password", form.password || "");
      fd.append("Name", form.name || "");
      fd.append("Age", String(form.age ?? "")); // string ok
      fd.append("SSN", form.ssn || "");
      fd.append("Phone", form.phone || "");
      fd.append("Address", form.address || "");
      fd.append("Degree", form.degree || ""); // send enum **name**
      fd.append("Job", form.job || "");
      fd.append("Gender", String(form.gender === "ذكر" ? 1 : 0));
      fd.append("EmployeeType", form.employeeType || ""); // send enum **name**

      // ---- AVAILABILITY: repeated keys -> List<string>
      const selectedDays = Object.entries(availability)
        .filter(([, v]) => v)
        .map(([d]) => d);
      selectedDays.forEach((d) => fd.append("AvailabilityDays", d));

      // ---- RELATIVES: indexed keys -> List<RelativeDto>
      fd.append("HasRelatives", String(Boolean(hasRelatives)));
      fd.append("RelativesCount", String(relativesCount || 0));
      if (hasRelatives) {
        relatives.forEach((r, i) => {
          fd.append(`Relatives[${i}].Name`, r.name || "");
          fd.append(`Relatives[${i}].Relation`, r.relation || "");
          fd.append(`Relatives[${i}].Department`, r.department || "");
        });
      }

      // ---- TERMS
      fd.append("TermsAgreed", String(Boolean(agreed)));

      // DEBUG: see exactly what is being sent
      // for (const [k, v] of fd.entries()) console.log(k, v);

      // IMPORTANT: single config, NO custom Content-Type header
      await api.post("/api/Account/RegisterEmployee", fd);

      toast.success("تم تقديم الطلب بنجاح 🎉", { rtl: true });
      navigate("/login");
    } catch (err) {
      const msgs =
        err?.response?.data?.errors ||
        err?.response?.data?.message ||
        err?.message;
      if (Array.isArray(msgs)) {
        setErrors(msgs);
        // msgs.forEach((m) => toast.error(m, { rtl: true }));
      } else
        toast.error(String(msgs || "حدث خطأ أثناء الإرسال."), { rtl: true });
    } finally {
      setLoader(false);
    }
  };

  return (
    <>
      <ToastContainer position="top-center" />
      <div className="container mt-5" style={{ marginBottom: "5rem" }}>
        <div className="card shadow p-4">
          <h2 className="text-center text-primary mb-3">تقديم طلب</h2>
          {errors.length > 0 && (
            <div
              style={{
                background: "#ffe5e5",
                color: "#c00",
                padding: "12px",
                borderRadius: "8px",
                marginTop: "16px",
                border: "1px solid #ffbbbb",
                direction: "rtl",
              }}
            >
              {errors.map((err, i) => (
                <div
                  key={i}
                  style={{ marginBottom: "4px", fontWeight: "bold" }}
                >
                  • {err}
                </div>
              ))}
            </div>
          )}

          <p className="text-center text-muted">
            يمكنك تقديم طلبك من خلال النموذج التالي
          </p>

          <div ref={stepperRef} className="bs-stepper" dir="rtl">
            <div className="bs-stepper-header" role="tablist">
              <div className="step" data-target="#step1">
                <button type="button" className="step-trigger" role="tab">
                  <span
                    className="bs-stepper-circle"
                    style={{ color: "white", backgroundColor: PRIMARY }}
                  >
                    1
                  </span>
                  <span className="bs-stepper-label">بيانات شخصية</span>
                </button>
              </div>
              <div className="line"></div>

              <div className="step" data-target="#step2">
                <button type="button" className="step-trigger" role="tab">
                  <span
                    className="bs-stepper-circle"
                    style={{ color: "white", backgroundColor: PRIMARY }}
                  >
                    2
                  </span>
                  <span className="bs-stepper-label">مرفقات</span>
                </button>
              </div>
              <div className="line"></div>

              <div className="step" data-target="#step3">
                <button type="button" className="step-trigger" role="tab">
                  <span
                    className="bs-stepper-circle"
                    style={{ color: "white", backgroundColor: PRIMARY }}
                  >
                    3
                  </span>
                  <span className="bs-stepper-label">أيام التفرغ</span>
                </button>
              </div>
              <div className="line"></div>

              <div className="step" data-target="#step4">
                <button type="button" className="step-trigger" role="tab">
                  <span
                    className="bs-stepper-circle"
                    style={{ color: "white", backgroundColor: PRIMARY }}
                  >
                    4
                  </span>
                  <span className="bs-stepper-label">الأقارب + الشروط</span>
                </button>
              </div>
            </div>

            <div className="bs-stepper-content card shadow p-4 register-card">
              {/* Step 1 */}
              <div id="step1" className="content dstepper-block">
                <StepPersonal
                  PRIMARY={PRIMARY}
                  form={form}
                  errors={errors}
                  birthDate={birthDate}
                  onChange={handleFormChange}
                  onNext={() => handleNext(1)}
                />
              </div>

              {/* Step 2 */}
              <div id="step2" className="content">
                <StepUploads
                  PRIMARY={PRIMARY}
                  SECONDARY={SECONDARY}
                  files={files}
                  previews={filePreviews}
                  onUpload={handleFileUpload}
                  onBack={handlePrevious}
                  onNext={() => handleNext(2)}
                />
              </div>

              {/* Step 3 - Availability */}
              <div id="step3" className="content">
                <StepAvailability
                  PRIMARY={PRIMARY}
                  availability={availability}
                  setAvailability={setAvailability}
                  onBack={handlePrevious}
                  onNext={() => handleNext(3)}
                />
              </div>

              {/* Step 4 - Relatives + Consent */}
              <div id="step4" className="content">
                <StepRelativesAndConsent
                  PRIMARY={PRIMARY}
                  hasRelatives={hasRelatives}
                  setHasRelatives={setHasRelatives}
                  relativesCount={relativesCount}
                  setRelativesCount={setRelativesCount}
                  relatives={relatives}
                  setRelatives={setRelatives}
                  agreed={agreed}
                  setAgreed={setAgreed}
                  showTerms={showTerms}
                  setShowTerms={setShowTerms}
                  onBack={handlePrevious}
                  onSubmit={handleSubmit}
                  loading={loader}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="col-12 col-md-12 w-100 d-flex align-item-center justify-content-center">
          <button
            style={{
              backgroundColor: SECONDARY_HOVER,
              borderColor: SECONDARY_HOVER,
            }}
            className="col-5 btn btn-primary my-3"
            dir="rtl"
            onClick={() => navigate("/login")}
          >
            العودة لتسجيل الدخول
          </button>
        </div>
      </div>
    </>
  );
};

export default RegisterForm;

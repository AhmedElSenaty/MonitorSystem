/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState, useRef, useMemo } from "react";
import Stepper from "bs-stepper";
import axios from "axios";
import './register.css';
import { ToastContainer, toast } from "react-toastify";
import { useNavigate } from "react-router-dom";


// Color constants
const PRIMARY = '#19355a';
const PRIMARY_HOVER = '#27285d';
const SECONDARY = PRIMARY;
const SECONDARY_HOVER = '#ad8700';
const RegisterForm = () => {

    const stepperRef = useRef(null);
    const [stepper, setStepper] = useState(null);
    const [loader, setLoader] = useState(false);
    const [birthDate, setBirthDate] = useState("");
    const navigate = useNavigate();

    const [form, setForm] = useState({
        name: "",
        email: "",
        address: "",
        phone: "",
        ssn: "",
        job: "",
        degree: "",
        password: "",
        confirmPassword: "",
        gender: "",
        age: "",
    });
    const [errors, setErrors] = useState({});
    const [files, setFiles] = useState({
        personal: null,
        degree: null,
        backId: null,
        frontId: null,
    });

    useEffect(() => {
        if (stepperRef.current) {
            setStepper(new Stepper(stepperRef.current));
        }
    }, []);

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
        const birthDT = new Date(year, month, day + 1).toISOString().split('T')[0];
        setBirthDate(birthDT);
        return { age, gender};
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name === "ssn") {
            const info = extractFromSSN(value);
            setForm((prev) => ({ ...prev, ssn: value, ...info }));
        } else {
            setForm((prev) => ({ ...prev, [name]: value }));
        }
    };
    // Log files state whenever it changes
    useEffect(() => {

        const newErrors = validate([
            "name",
            "email",
            "address",
            "phone",
            "ssn",
            "job",
            "degree",
            "password",
            "confirmPassword",
        ]);
        setErrors(newErrors);

    }, [form]);
    const handleFileUpload = (e, type) => {
        const file = e.target.files[0];
        if (!file) return;
        const isJpg = file.type === "image/jpeg" || file.type === "image/jpg";
        const isLt1M = file.size <= 1024 * 1024;
        if (!isJpg) return toast.error("الملف يجب أن يكون JPG.",{rtl: true});
        if (!isLt1M) return toast.error("حجم الملف يجب أن لا يتجاوز 1MB.",{rtl: true});
        const updated = { ...files, [type]: file };
        setFiles(updated);
        toast.success(`تم اختيار الملف: ${file.name}`);
    };
    const validate = (fields) => {
        const newErrors = {};
        if (fields.includes("name")) {
            if (!form.name.trim()) {
                newErrors.name = "الاسم مطلوب";
            } else if ((form.name.trim().match(/ /g) || []).length < 3) {
                newErrors.name = "الاسم يجب أن يحتوي على أربع كلمات على الأقل";
            }
        }
        if (fields.includes("email") && !form.email.includes("@"))
            newErrors.email = "بريد إلكتروني غير صالح";
        if (fields.includes("address") && !form.address.trim())
            newErrors.address = "العنوان مطلوب";
        if (fields.includes("phone") && !/^\d{10,15}$/.test(form.phone))
            newErrors.phone = "رقم الهاتف غير صالح";
        if (fields.includes("ssn") && !/^\d{14}$/.test(form.ssn))
            newErrors.ssn = "الرقم القومي غير صالح";
        if (fields.includes("job") && !form.job.trim())
            newErrors.job = "الوظيفة مطلوبة";
        if (fields.includes("degree") && !form.degree.trim())
            newErrors.degree = "المؤهل العلمي مطلوب";
        if (fields.includes("password") && !isValidPassword(form.password))
            newErrors.password = "كلمة المرور ضعيفة";
        if (
            fields.includes("confirmPassword") &&
            form.password !== form.confirmPassword
        )
            newErrors.confirmPassword = "كلمتا المرور غير متطابقتين";
        return newErrors;
    };

    const handleNext = () => {
        const newErrors = validate([
            "name",
            "email",
            "address",
            "phone",
            "ssn",
            "job",
            "degree",
            "password",
            "confirmPassword",
        ]);
        setErrors(newErrors);
        if (Object.keys(newErrors).length === 0) {
            stepper.next();
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoader(true);
        const newErrors = validate([
            "name",
            "email",
            "address",
            "phone",
            "ssn",
            "job",
            "degree",
            "password",
            "confirmPassword",
        ]);
        setErrors(newErrors);
        if (Object.keys(newErrors).length) return;

        const data = new FormData();
        Object.entries(form).forEach(([k, v]) => data.append(k, v));
        Object.entries(files).forEach(([k, f]) => f && data.append(k, f));

        try {
            const res = await axios.post(
              "http://localhost:3000/register",
              data,
              {
                headers: { "Content-Type": "multipart/form-data" },
              }
            );
            console.log(res);
            toast.success("تم تقديم الطلب بنجاح 🎉");
        } catch (err) {
            console.error(err);
            toast.error("حدث خطأ أثناء الإرسال.");
        } finally {
            setLoader(false);
        }
    };
    const filePreviews = useMemo(() => {
        const previews = {};
        Object.entries(files).forEach(([key, file]) => {
            if (file) {
                previews[key] = URL.createObjectURL(file);
            }
        });
        return previews;
    }, [files]);

    return (
        <>
            <ToastContainer position="top-center" />
        <div className="container mt-5">
          <div className="card shadow p-4">
            <h2 className="text-center text-primary mb-3">تقديم طلب</h2>
            <p className="text-center text-muted">
              يمكنك تقديم طلبك من خلال النموذج التالي
            </p>
            <div ref={stepperRef} className="bs-stepper" dir="rtl">
              <div className="bs-stepper-header" role="tablist">
                <div className="step" data-target="#personal-part">
                  <button type="button" className="step-trigger" role="tab">
                    <span
                      style={{ color: "white", backgroundColor: PRIMARY }}
                      className="bs-stepper-circle"
                    >
                      1
                    </span>
                    <span className="bs-stepper-label">
                      ادخل بياناتك الشخصية
                    </span>
                  </button>
                </div>
                <div className="line"></div>
                <div className="step" data-target="#extra-part">
                  <button type="button" className="step-trigger" role="tab">
                    <span
                      style={{ color: "white", backgroundColor: PRIMARY }}
                      className="bs-stepper-circle"
                    >
                      2
                    </span>
                    <span className="bs-stepper-label">بيانات إضافية</span>
                  </button>
                </div>
              </div>

              <div className="bs-stepper-content">
                {/* Step 1 */}
                <div id="personal-part" className="content dstepper-block">
                  <form>
                    <div className="row mb-3">
                      <div className="col-md-4 my-1 my-sm-2">
                        <input
                          name="name"
                          type="text"
                          className={`form-control ${
                            errors.name ? "is-invalid" : ""
                          }`}
                          placeholder="الاسم"
                          value={form.name}
                          onChange={handleChange}
                        />
                        {errors.name && (
                          <div className="invalid-feedback">{errors.name}</div>
                        )}
                      </div>
                      <div className="col-md-4 my-1 my-sm-2">
                        <input
                          name="email"
                          type="email"
                          className={`form-control ${
                            errors.email ? "is-invalid" : ""
                          }`}
                          placeholder="البريد الإلكتروني"
                          value={form.email}
                          onChange={handleChange}
                        />
                        {errors.email && (
                          <div className="invalid-feedback">{errors.email}</div>
                        )}
                      </div>
                      <div className="col-md-4 my-1 my-sm-2">
                        <input
                          name="address"
                          type="text"
                          className={`form-control ${
                            errors.address ? "is-invalid" : ""
                          }`}
                          placeholder="العنوان"
                          value={form.address}
                          onChange={handleChange}
                        />
                        {errors.address && (
                          <div className="invalid-feedback">
                            {errors.address}
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="row mb-3">
                      <div className="col-md-4 my-1 my-sm-2">
                        <input
                          name="phone"
                          type="text"
                          className={`form-control ${
                            errors.phone ? "is-invalid" : ""
                          }`}
                          placeholder="الهاتف"
                          value={form.phone}
                          onChange={handleChange}
                        />
                        {errors.phone && (
                          <div className="invalid-feedback">{errors.phone}</div>
                        )}
                      </div>
                      <div className="col-md-4 my-1 my-sm-2">
                        <input
                          name="ssn"
                          type="text"
                          className={`form-control ${
                            errors.ssn ? "is-invalid" : ""
                          }`}
                          placeholder="الرقم القومي"
                          value={form.ssn}
                          onChange={handleChange}
                        />
                        {errors.ssn && (
                          <div className="invalid-feedback">{errors.ssn}</div>
                        )}
                      </div>
                      <div className="col-md-4 my-1 my-sm-2">
                        <input
                          name="job"
                          type="text"
                          className={`form-control ${
                            errors.job ? "is-invalid" : ""
                          }`}
                          placeholder="الوظيفة"
                          value={form.job}
                          onChange={handleChange}
                        />
                        {errors.job && (
                          <div className="invalid-feedback">{errors.job}</div>
                        )}
                      </div>
                    </div>
                    <div className="row mb-3">
                      <div className="col-md-4 my-1 my-sm-2">
                        <input
                          name="degree"
                          type="text"
                          className={`form-control ${
                            errors.degree ? "is-invalid" : ""
                          }`}
                          placeholder="المؤهل"
                          value={form.degree}
                          onChange={handleChange}
                        />
                        {errors.degree && (
                          <div className="invalid-feedback">
                            {errors.degree}
                          </div>
                        )}
                      </div>
                      <div className="col-md-4 my-1 my-sm-2">
                        <input
                          name="password"
                          type="password"
                          className={`form-control ${
                            errors.password ? "is-invalid" : ""
                          }`}
                          placeholder="كلمة مرور"
                          value={form.password}
                          onChange={handleChange}
                        />
                        {errors.password && (
                          <div className="invalid-feedback">
                            {errors.password}
                          </div>
                        )}
                      </div>
                      <div className="col-md-4 my-1 my-sm-2">
                        <input
                          name="confirmPassword"
                          type="password"
                          className={`form-control ${
                            errors.confirmPassword ? "is-invalid" : ""
                          }`}
                          placeholder="تأكيد كلمة مرور"
                          value={form.confirmPassword}
                          onChange={handleChange}
                        />
                        {errors.confirmPassword && (
                          <div className="invalid-feedback">
                            {errors.confirmPassword}
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="row mb-4">
                      <div className="col-md-4 my-1 my-sm-2">
                        <select
                          name="gender"
                          className="form-select"
                          value={form.gender}
                        onChange={handleChange}
                        disabled
                        >
                          <option value="">الجنس</option>
                          <option value="ذكر">ذكر</option>
                          <option value="أنثى">أنثى</option>
                        </select>
                      </div>
                      <div className="col-md-4 my-1 my-sm-2">
                        <input
                          name="age"
                          type="number"
                          className="form-control"
                          placeholder="العمر"
                          value={form.age}
                                                readOnly
                                                disabled
                        />
                      </div>
                      <div className="col-md-4 my-1 my-sm-2">
                        <input
                          name="DOB"
                          type="date"
                          className="form-control"
                          placeholder="تاريخ الميلاد"
                          value={birthDate}
                                                readOnly
                                                disabled
                        />
                      </div>
                    </div>
                    <button
                      type="button"
                      className="btn btn-primary w-100"
                      onClick={handleNext}
                      style={{ backgroundColor: PRIMARY }}
                    >
                      التالي
                    </button>
                  </form>
                </div>

                {/* Step 2 */}
                <div id="extra-part" className="content">
                  <div className="row text-center">
                    {[
                      { label: "صورة شخصية", key: "personal" },
                      { label: "صورة المؤهل", key: "degree" },
                      { label: "صورة البطاقة من الخلف", key: "backId" },
                      { label: "صورة البطاقة من الأمام", key: "frontId" },
                    ].map((item) => (
                      <div className="col-6 col-md-3 mb-4" key={item.key}>
                        <div
                          className="border rounded p-3 h-100 d-flex flex-column align-items-center"
                          style={{
                            borderColor: SECONDARY,
                            borderStyle: "dashed",
                          }}
                        >
                          {files[item.key] ? (
                            <>
                              <img
                                src={filePreviews[item.key]}
                                alt={item.label}
                                className="img-fluid mb-2"
                                style={{ maxHeight: "150px" }}
                              />
                            </>
                          ) : (
                            <>
                              <i
                                className="bi bi-cloud-arrow-up-fill mb-2"
                                style={{ fontSize: "2rem", color: SECONDARY }}
                              />
                              <p
                                className="mb-1 text-wrap text-center"
                                style={{ flex: 1 }}
                              >
                                {files[item.key]?.name || item.label}
                              </p>
                              <p className="text-muted small">
                                يمكنك تحميل صورة بصيغة JPG
                              </p>
                            </>
                          )}
                          <p
                            className="mb-1 text-wrap text-center"
                            style={{ flex: 1 }}
                          ></p>
                          <button
                            type="button"
                            className="btn btn-sm mt-auto"
                            style={{
                              backgroundColor: SECONDARY,
                              borderColor: SECONDARY,
                              color: "#fff",
                            }}
                            onClick={() =>
                              document.getElementById(item.key).click()
                            }
                          >
                            رفع الصورة
                          </button>
                          <input
                            id={item.key}
                            type="file"
                            accept="image/jpeg"
                            className="d-none"
                            onChange={(e) => handleFileUpload(e, item.key)}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="d-flex justify-content-center align-item-center row mt-4">
                    <button
                      type="button"
                      className="btn btn-outline-primary col-8 col-md-5 mx-2 my-1 backBTN"
                      onClick={() => stepper.previous()}
                      style={{ color: PRIMARY, textAlign: "center" }}
                    >
                      رجوع
                    </button>
                    <button
                      type="button"
                      className="btn btn-primary col-8 col-md-5 mx-2 my-1"
                      onClick={handleSubmit}
                      style={{ color: "white", backgroundColor: PRIMARY }}
                    >
                      تقديم الطلب
                    </button>
                  </div>

                  {loader && (
                    <div className="d-flex justify-content-center align-item-center row mt-4">
                      <div class="spinner-border" role="status">
                        <span class="visually-hidden">Loading...</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
          <div className="col-12 col-md-12 w-100 d-flex align-item-center justify-content-center">
            <button
              style={{ backgroundColor: SECONDARY_HOVER , borderColor: SECONDARY_HOVER }}
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

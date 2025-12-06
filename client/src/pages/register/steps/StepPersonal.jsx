import React, { useState } from "react";

const StepPersonal = ({
  PRIMARY,
  form,
  errors,
  birthDate,
  onChange,
  onNext,
}) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <form>
      <div className="row mb-3">
        <div className="col-md-4 my-1 my-sm-2">
          <input
            name="name"
            type="text"
            className={`form-control ${errors.name ? "is-invalid" : ""}`}
            placeholder="الاسم الرباعي"
            value={form.name}
            onChange={onChange}
          />
          {errors.name && <div className="invalid-feedback">{errors.name}</div>}
        </div>
        <div className="col-md-4 my-1 my-sm-2">
          <input
            name="email"
            type="email"
            className={`form-control ${errors.email ? "is-invalid" : ""}`}
            placeholder="البريد الإلكتروني"
            value={form.email}
            onChange={onChange}
          />
          {errors.email && (
            <div className="invalid-feedback">{errors.email}</div>
          )}
        </div>
        <div className="col-md-4 my-1 my-sm-2">
          <input
            name="address"
            type="text"
            className={`form-control ${errors.address ? "is-invalid" : ""}`}
            placeholder="العنوان"
            value={form.address}
            onChange={onChange}
          />
          {errors.address && (
            <div className="invalid-feedback">{errors.address}</div>
          )}
        </div>
      </div>

      <div className="row mb-3">
        <div className="col-md-4 my-1 my-sm-2">
          <input
            name="phone"
            type="text"
            className={`form-control ${errors.phone ? "is-invalid" : ""}`}
            placeholder="الهاتف"
            value={form.phone}
            onChange={onChange}
          />
          {errors.phone && (
            <div className="invalid-feedback">{errors.phone}</div>
          )}
        </div>
        <div className="col-md-4 my-1 my-sm-2">
          <input
            name="ssn"
            type="text"
            className={`form-control ${errors.ssn ? "is-invalid" : ""}`}
            placeholder="الرقم القومي"
            value={form.ssn}
            onChange={onChange}
          />
          {errors.ssn && <div className="invalid-feedback">{errors.ssn}</div>}
        </div>
        <div className="col-md-4 my-1 my-sm-2">
          <input
            name="job"
            type="text"
            className={`form-control ${errors.job ? "is-invalid" : ""}`}
            placeholder="الوظيفة"
            value={form.job}
            onChange={onChange}
          />
          {errors.job && <div className="invalid-feedback">{errors.job}</div>}
        </div>
      </div>

      <div className="row mb-3">
        <div className="col-md-4 my-1 my-sm-2">
          <select
            name="degree"
            className={`form-select ${errors.degree ? "is-invalid" : ""}`}
            value={form.degree}
            onChange={onChange}
          >
            <option value="">اختر المؤهل العلمي</option>
            {/* <option value="Illiterate">أمي</option> */}
            <option value="Diploma">دبلوم</option>
            <option value="SecondarySchool">ثانوية عامة</option>
            <option value="AboveIntermediate">فوق المتوسط</option>
            <option value="UniversityDegree">مؤهل عالي</option>
            <option value="PostgraduateStudies">دراسات عليا</option>
          </select>
          {errors.degree && (
            <div className="invalid-feedback">{errors.degree}</div>
          )}
        </div>

        <div className="col-md-4 my-1 my-sm-2">
          <select
            name="employeeType"
            className={`form-select ${errors.employeeType ? "is-invalid" : ""}`}
            value={form.employeeType}
            onChange={onChange}
          >
            <option value="">اختر نوع الموظف</option>
            {/* <option value="MwazfFeElGam3a">موظف في الجامعة</option> */}
            <option value="Mwazf3alaElM3a4FeElGam3a">
              موظف على المعاش في الجامعة
            </option>
            <option value="MwazfMenEl5areg">موظف من الخارج</option>
          </select>
          {errors.employeeType && (
            <div className="invalid-feedback">{errors.employeeType}</div>
          )}
        </div>

        <div className="col-md-4 my-1 my-sm-2">
          <input
            name="password"
            type={showPassword ? "text" : "password"}
            className={`form-control ${errors.password ? "is-invalid" : ""}`}
            placeholder="كلمة المرور"
            value={form.password}
            onChange={onChange}
            onMouseEnter={() => setShowPassword(true)}
            onMouseLeave={() => setShowPassword(false)}
          />
          {errors.password && (
            <div className="invalid-feedback">{errors.password}</div>
          )}
        </div>

        <div className="col-md-4 my-1 my-sm-2">
          <input
            name="confirmPassword"
            type={showPassword ? "text" : "password"}
            className={`form-control ${
              errors.confirmPassword ? "is-invalid" : ""
            }`}
            placeholder="تأكيد كلمة المرور"
            value={form.confirmPassword}
            onChange={onChange}
            onMouseEnter={() => setShowPassword(true)}
            onMouseLeave={() => setShowPassword(false)}
          />
          {errors.confirmPassword && (
            <div className="invalid-feedback">{errors.confirmPassword}</div>
          )}
        </div>
      </div>

      <div className="row mb-4">
        <div className="col-md-4 my-1 my-sm-2">
          <select
            name="gender"
            className="form-select"
            value={form.gender}
            onChange={onChange}
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
        onClick={onNext}
        style={{ backgroundColor: PRIMARY }}
      >
        التالي
      </button>
    </form>
  );
};

export default StepPersonal;

import React, { useEffect } from "react";
import { isFourPartName } from "../../../helpers/registerHelper";
import { toast } from "react-toastify";

const StepRelativesAndConsent = ({
  PRIMARY,
  hasRelatives,
  setHasRelatives,
  relativesCount,
  setRelativesCount,
  relatives,
  setRelatives,
  agreed,
  setAgreed,
  showTerms,
  setShowTerms,
  onBack,
  onSubmit,
  loading,
}) => {
  // عدد الأقارب كرقم آمن
  const safeCount = Number.isFinite(+relativesCount) ? +relativesCount : 0;

  // keep relatives array length in sync with relativesCount
  useEffect(() => {
    const n = parseInt(relativesCount || 0, 10);
    if (!Number.isFinite(n) || n < 0) return;
    if (n === 0) {
      setRelatives([]);
      return;
    }
    setRelatives((prev) => {
      const arr = [...prev];
      while (arr.length < n)
        arr.push({ name: "", relation: "", department: "" });
      while (arr.length > n) arr.pop();
      return arr;
    });
  }, [relativesCount, setRelatives]);

  // --- modal UX: esc to close + lock scroll
  useEffect(() => {
    if (showTerms) {
      const onKey = (e) => e.key === "Escape" && setShowTerms(false);
      document.addEventListener("keydown", onKey);
      const prev = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.removeEventListener("keydown", onKey);
        document.body.style.overflow = prev;
      };
    }
  }, [showTerms, setShowTerms]);

  const updateRelative = (idx, key, value) => {
    setRelatives((prev) => {
      const arr = [...prev];
      arr[idx] = { ...arr[idx], [key]: value };
      return arr;
    });
  };

  // زر إضافة قريب جديد (نفس فكرة RelativesSection)
  const handleAddOne = () => {
    const next = (safeCount || 0) + 1;
    setRelativesCount(String(next));
  };

  // حذف قريب واحد
  const deleteRelative = (idx) => {
    setRelatives((prev) => {
      const arr = prev.filter((_, i) => i !== idx);
      setRelativesCount(arr.length ? String(arr.length) : "0");
      return arr;
    });
  };

  // نفس منطق التحقق قبل الحفظ: كل الأسماء رباعية
  const handleSubmitClick = () => {
    if (hasRelatives) {
      const invalid = relatives.some((r) => !isFourPartName(r.name));
      if (invalid) {
        toast.error(
          "❌ يرجى التأكد من أن جميع أسماء الأقارب مكتوبة رباعياً قبل تقديم الطلب.",
          {
            rtl: true,
            autoClose: 4000,
          }
        );
        return;
      }
    }

    onSubmit();
  };

  return (
    <>
      <div className="mb-3">
        <label className="form-label">
          هل لديك أقارب يعملون/يدرسون في الجامعة؟
        </label>
        <div>
          <div className="form-check form-check-inline">
            <input
              className="form-check-input"
              type="radio"
              name="hasRelatives"
              id="relYes"
              checked={hasRelatives === true}
              onChange={() => {
                setHasRelatives(true);
                if (!relativesCount || relativesCount === "0") {
                  setRelativesCount("1");
                }
              }}
            />
            <label className="form-check-label" htmlFor="relYes">
              نعم
            </label>
          </div>
          <div className="form-check form-check-inline">
            <input
              className="form-check-input"
              type="radio"
              name="hasRelatives"
              id="relNo"
              checked={hasRelatives === false}
              onChange={() => {
                setHasRelatives(false);
                setRelativesCount("0");
                setRelatives([]);
              }}
            />
            <label className="form-check-label" htmlFor="relNo">
              لا
            </label>
          </div>
        </div>
      </div>

      {hasRelatives && (
        <>
          {/* عدد الأقارب + زر إضافة واحد (زي RelativesSection) */}
          <div className="row mb-3 align-items-end">
            <div className="col-12 col-md-6 mb-2 mb-md-0">
              <label className="form-label">عدد الأقارب</label>
              <div className="input-group">
                <input
                  type="number"
                  className="form-control text-center"
                  min="1"
                  disabled={true}
                  value={relativesCount || ""}
                  onChange={(e) => setRelativesCount(e.target.value)}
                />
              </div>
            </div>

            <div className="col-12 col-md-6 text-start text-md-end mt-2 mt-md-0">
              <button
                type="button"
                className="btn btn-sm btn-outline-primary"
                onClick={handleAddOne}
              >
                <i className="bi bi-plus-lg ms-1" />
                إضافة قريب جديد
              </button>
            </div>
          </div>

          {relatives.map((r, i) => {
            const nameInvalid = r.name && !isFourPartName(r.name);
            return (
              <div
                key={i}
                className="border rounded p-3 mb-2 position-relative"
              >
                {/* زر حذف القريب المحدد */}
                <button
                  type="button"
                  className="btn btn-sm btn-outline-danger position-absolute"
                  style={{ top: "8px", left: "8px" }}
                  onClick={() => deleteRelative(i)}
                  title="حذف هذا القريب"
                >
                  <i className="bi bi-trash" />
                </button>

                <div className="row g-2">
                  <div className="col-md-4">
                    <label className="form-label">الاسم رباعي*</label>
                    <input
                      className={`form-control ${
                        nameInvalid ? "is-invalid" : ""
                      }`}
                      value={r.name}
                      onChange={(e) =>
                        updateRelative(i, "name", e.target.value)
                      }
                    />
                    {nameInvalid && (
                      <div className="invalid-feedback">
                        يجب إدخال الاسم رباعي (4 أسماء مفصولة بمسافة).
                      </div>
                    )}
                  </div>
                  <div className="col-md-4">
                    <label className="form-label">القرابة*</label>
                    <input
                      className="form-control"
                      placeholder="أخ/أخت/أب/أم/ابن/ابنة/زوج/زوجة ..."
                      value={r.relation}
                      onChange={(e) =>
                        updateRelative(i, "relation", e.target.value)
                      }
                    />
                  </div>
                  <div className="col-md-4">
                    <label className="form-label">الكلية / القسم*</label>
                    <input
                      className="form-control"
                      value={r.department}
                      onChange={(e) =>
                        updateRelative(i, "department", e.target.value)
                      }
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </>
      )}

      <hr className="my-3" />

      {/* Terms & consent */}

      <div className="form-check mb-2">
        <input
          className="form-check-input"
          type="checkbox"
          id="agreeCheck"
          checked={agreed}
          onChange={(e) => setAgreed(e.target.checked)}
        />
        <label className="form-check-label" htmlFor="agreeCheck">
          أوافق على{" "}
          <a
            href="/terms"
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-link p-0 align-baseline"
          >
            الشروط والأحكام
          </a>
        </label>
      </div>

      {/* <div className="form-check mb-2">
        <input
          className="form-check-input"
          type="checkbox"
          id="agreeCheck"
          checked={agreed}
          onChange={(e) => setAgreed(e.target.checked)}
        />
        <label className="form-check-label" htmlFor="agreeCheck">
          أوافق على{" "}
          <button
            type="button"
            className="btn btn-link p-0 align-baseline"
            onClick={() => setShowTerms(true)}
          >
            الشروط والأحكام
          </button>
        </label>
      </div> */}

      <div className="d-flex justify-content-center row mt-3">
        <button
          type="button"
          className="btn btn-outline-primary col-8 col-md-5 mx-2 my-1"
          onClick={onBack}
        >
          رجوع
        </button>
        <button
          type="button"
          className="btn btn-primary col-8 col-md-5 mx-2 my-1"
          onClick={handleSubmitClick}
          disabled={loading || !agreed}
          style={{ backgroundColor: agreed ? PRIMARY : "#888" }}
        >
          {loading ? "جاري الإرسال..." : "تقديم الطلب"}
        </button>
      </div>

      {/* Pure React Modal (no Bootstrap JS required) */}
      {/* {showTerms && (
        <>
          <div
            className="terms-overlay"
            onClick={() => setShowTerms(false)}
            aria-hidden="true"
          />
          <div
            className="terms-card"
            role="dialog"
            aria-modal="true"
            dir="rtl"
            style={{ borderTopColor: PRIMARY }}
          >
            <div className="terms-header">
              <h5 className="m-0">الشروط والأحكام</h5>
              <button
                type="button"
                className="btn-close btn-close-white"
                aria-label="Close"
                onClick={() => setShowTerms(false)}
              />
            </div>
            <div className="terms-body">
              <ul className="mb-0">
                <li>أقر بصحة جميع البيانات والمستندات المقدمة.</li>
                <li>أوافق على استخدام بياناتي لأغراض التوظيف داخل الجامعة.</li>
                <li>ألتزم بإبلاغ الإدارة بأي تغيير في البيانات.</li>
              </ul>
            </div>
            <div className="terms-footer">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => setShowTerms(false)}
              >
                إغلاق
              </button>
              <button
                type="button"
                className="btn btn-primary"
                style={{ backgroundColor: PRIMARY }}
                onClick={() => {
                  setAgreed(true);
                  setShowTerms(false);
                }}
              >
                موافق
              </button>
            </div>
          </div>
        </>
      )} */}
    </>
  );
};

export default StepRelativesAndConsent;

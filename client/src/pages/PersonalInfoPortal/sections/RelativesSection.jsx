import { isFourPartName } from "../../../helpers/registerHelper";
import { toast } from "react-toastify";
const RelativesSection = ({
  hasRelatives,
  relativesCount,
  relatives,
  disabled,
  onChangeHasRelatives,
  onChangeCount,
  onChangeRelative,
  onAddRelative,
  onDeleteRelative,
  onSave,
  onCancel,
  saving,
}) => {
  const safeCount = Number.isFinite(+relativesCount) ? +relativesCount : 0;

  const handleAddOne = () => {
    if (disabled) return;
    const next = (safeCount || 0) + 1;
    onChangeCount(String(next));
    onAddRelative;
  };
  const handleSaveClick = () => {
    // لو في أقارب
    if (hasRelatives) {
      // تأكد إن كل الأسماء رباعية
      const invalid = relatives.some((r) => !isFourPartName(r.name));

      if (invalid) {
        toast.error(
          "❌ يرجى التأكد من أن جميع أسماء الأقارب مكتوبة رباعياً قبل الحفظ.",
          {
            rtl: true,
            autoClose: 4000,
          }
        );
        return; // إيقاف الحفظ
      }
    }

    onSave(); // لو كله تمام → احفظ
  };

  return (
    <div className="mt-4" style={{ marginBottom: "5rem" }}>
      <h2 className="mb-3">بيانات الأقارب</h2>

      <div className="mb-3">
        <label className="form-label">
          هل لديك أقارب يعملون/ يدرسون في الجامعة؟
        </label>
        <div>
          <div className="form-check form-check-inline">
            <input
              className="form-check-input"
              type="radio"
              name="hasRelatives"
              id="relYes"
              disabled={disabled}
              checked={hasRelatives === true}
              onChange={() => !disabled && onChangeHasRelatives(true)}
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
              disabled={disabled}
              checked={hasRelatives === false}
              onChange={() => !disabled && onChangeHasRelatives(false)}
            />
            <label className="form-check-label" htmlFor="relNo">
              لا
            </label>
          </div>
        </div>
      </div>

      {hasRelatives && (
        <>
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
                  onChange={(e) => !disabled && onChangeCount(e.target.value)}
                />
              </div>
            </div>

            {/* زر إضافة واحد صريح */}
            <div className="col-12 col-md-6 text-start text-md-end mt-2 mt-md-0">
              <button
                type="button"
                className="btn btn-sm btn-outline-primary"
                disabled={disabled}
                onClick={handleAddOne}
              >
                <i className="bi bi-plus-lg ms-1" />
                إضافة قريب جديد
              </button>
            </div>
          </div>

          {relatives.map((r, i) => (
            <div key={i} className="border rounded p-3 mb-2 position-relative">
              {/* زر حذف القريب المحدد */}
              {!disabled && (
                <button
                  type="button"
                  className="btn btn-sm btn-outline-danger position-absolute"
                  style={{ top: "8px", left: "8px" }}
                  onClick={() => onDeleteRelative && onDeleteRelative(i)}
                  title="حذف هذا القريب"
                >
                  <i className="bi bi-trash" />
                </button>
              )}

              <div className="row g-2">
                <div className="col-md-4">
                  <label className="form-label">الاسم رباعي*</label>
                  <input
                    className="form-control"
                    disabled={disabled}
                    value={r.name}
                    onChange={(e) =>
                      !disabled && onChangeRelative(i, "name", e.target.value)
                    }
                  />
                </div>
                <div className="col-md-4">
                  <label className="form-label">القرابة*</label>
                  <input
                    className="form-control"
                    disabled={disabled}
                    value={r.relation}
                    onChange={(e) =>
                      !disabled &&
                      onChangeRelative(i, "relation", e.target.value)
                    }
                  />
                </div>
                <div className="col-md-4">
                  <label className="form-label">الكلية / القسم*</label>

                  <input
                    className="form-control"
                    disabled={disabled}
                    value={r.department}
                    onChange={(e) =>
                      !disabled &&
                      onChangeRelative(i, "department", e.target.value)
                    }
                  />
                </div>
              </div>
            </div>
          ))}
        </>
      )}

      {!disabled && (
        <div className="d-flex justify-content-center row mt-4">
          <button
            type="button"
            className="btn btn-outline-secondary col-8 col-md-4 mx-2 my-1"
            onClick={onCancel}
            disabled={saving}
          >
            إلغاء
          </button>
          <button
            type="button"
            className="btn btn-primary col-8 col-md-4 mx-2 my-1"
            onClick={handleSaveClick}
            disabled={saving}
          >
            {saving ? (
              <>
                <span
                  className="spinner-border spinner-border-sm me-2"
                  role="status"
                  aria-hidden="true"
                />
                جاري الحفظ...
              </>
            ) : (
              "حفظ بيانات الأقارب"
            )}
          </button>
        </div>
      )}
    </div>
  );
};

export default RelativesSection;

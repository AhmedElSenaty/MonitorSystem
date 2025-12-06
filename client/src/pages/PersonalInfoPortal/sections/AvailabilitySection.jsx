// sections/AvailabilitySection.jsx
const AvailabilitySection = ({
  selectedDays,
  disabled,
  onToggle,
  onSave,
  onCancel,
}) => {
  const DAYS = [
    "السبت",
    "الأحد",
    "الإثنين",
    "الثلاثاء",
    "الأربعاء",
    "الخميس",
    "الجمعة",
  ];

  return (
    <div className="mt-4">
      <h2 className="mb-3">أيام التفرغ</h2>
      <div className="row g-3">
        {DAYS.map((d) => (
          <div className="col-6 col-md-3" key={d}>
            <button
              type="button"
              disabled={disabled}
              onClick={() => !disabled && onToggle(d)}
              className={`btn w-100 ${
                selectedDays.includes(d)
                  ? "btn-primary"
                  : "btn-outline-secondary"
              }`}
            >
              {d}
            </button>
          </div>
        ))}
      </div>

      {!disabled && (
        <div className="d-flex justify-content-center row mt-4">
          <button
            type="button"
            className="btn btn-outline-secondary col-8 col-md-4 mx-2 my-1"
            onClick={onCancel}
          >
            إلغاء
          </button>
          <button
            type="button"
            className="btn btn-primary col-8 col-md-4 mx-2 my-1"
            onClick={onSave}
          >
            حفظ أيام التفرغ
          </button>
        </div>
      )}
    </div>
  );
};
export default AvailabilitySection;

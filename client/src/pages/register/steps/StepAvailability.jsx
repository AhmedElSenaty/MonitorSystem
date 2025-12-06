import React from "react";

const StepAvailability = ({
  PRIMARY,
  availability,
  setAvailability,
  onBack,
  onNext,
}) => {
  const days = Object.keys(availability);

  const toggle = (d) => setAvailability((prev) => ({ ...prev, [d]: !prev[d] }));

  return (
    <>
      <h5 className="mb-3">
        اختر أيام التفرغ المتاحة لديك (اختر يومًا واحدًا على الأقل)
      </h5>

      <div className="row g-3">
        {days.map((d) => (
          <div className="col-6 col-md-3" key={d}>
            <div
              role="button"
              tabIndex={0}
              onClick={() => toggle(d)}
              onKeyDown={(e) => e.key === "Enter" && toggle(d)}
              className={`form-check border rounded p-3 text-center shadow-sm ${
                availability[d] ? "bg-primary text-white" : "bg-light"
              }`}
              style={{
                cursor: "pointer",
                transition: "0.2s ease",
                borderColor: availability[d] ? PRIMARY : "#ccc",
              }}
            >
              <input
                className="form-check-input me-2"
                type="checkbox"
                id={`day-${d}`}
                checked={availability[d]}
                onChange={() => toggle(d)}
                style={{ cursor: "pointer" }}
              />
              <label
                className="form-check-label fw-semibold"
                htmlFor={`day-${d}`}
                style={{ cursor: "pointer" }}
              >
                {d}
              </label>
            </div>
          </div>
        ))}
      </div>

      <div className="d-flex justify-content-center row mt-4">
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
          onClick={onNext}
          style={{ backgroundColor: PRIMARY }}
        >
          التالي
        </button>
      </div>
    </>
  );
};

export default StepAvailability;

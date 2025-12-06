import React from "react";

const StepUploads = ({
  PRIMARY,
  SECONDARY,
  files,
  previews,
  onUpload,
  onBack,
  onNext,
}) => {
  const items = [
    { label: "صورة شخصية", key: "personal" },
    { label: "صورة المؤهل", key: "degree" },
    { label: "صورة اصل البطاقة من الخلف", key: "backId" },
    { label: "صورة اصل البطاقة من الأمام", key: "frontId" },
  ];

  return (
    <>
      <div className="row text-center">
        {items.map((item) => (
          <div className="col-6 col-md-3 mb-4" key={item.key}>
            <div
              className="border rounded p-3 h-100 d-flex flex-column align-items-center"
              style={{ borderColor: SECONDARY, borderStyle: "dashed" }}
            >
              {files[item.key] ? (
                <img
                  src={previews[item.key]}
                  alt={item.label}
                  className="img-fluid mb-2"
                  style={{ maxHeight: "150px" }}
                />
              ) : (
                <>
                  <i
                    className="bi bi-cloud-arrow-up-fill mb-2"
                    style={{ fontSize: "2rem", color: SECONDARY }}
                  />
                  <p className="mb-1 text-wrap text-center" style={{ flex: 1 }}>
                    {files[item.key]?.name || item.label}
                  </p>
                  <p className="text-muted small">
                    يمكنك تحميل صورة بصيغة JPG (حتى 1MB)
                  </p>
                </>
              )}
              <button
                type="button"
                className="btn btn-sm mt-auto"
                style={{
                  backgroundColor: SECONDARY,
                  borderColor: SECONDARY,
                  color: "#fff",
                }}
                onClick={() => document.getElementById(item.key).click()}
              >
                رفع الصورة
              </button>
              <input
                id={item.key}
                type="file"
                accept="image/jpeg"
                className="d-none"
                onChange={(e) => onUpload(e, item.key)}
              />
            </div>
          </div>
        ))}
      </div>

      <div className="d-flex justify-content-center row mt-4">
        <button
          type="button"
          className="btn btn-outline-primary col-8 col-md-5 mx-2 my-1"
          onClick={onBack}
          style={{ textAlign: "center" }}
        >
          رجوع
        </button>
        <button
          type="button"
          className="btn btn-primary col-8 col-md-5 mx-2 my-1"
          onClick={onNext}
          style={{ color: "white", backgroundColor: PRIMARY }}
        >
          التالي
        </button>
      </div>
    </>
  );
};

export default StepUploads;

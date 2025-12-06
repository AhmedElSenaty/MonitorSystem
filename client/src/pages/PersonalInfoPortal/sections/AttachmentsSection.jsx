import React, { useRef } from "react";

const AttachmentCard = ({
  type,
  label,
  value,
  isEmployee,
  onZoom,
  onUpdateImage,
}) => {
  const ref = useRef();
  const src =
    typeof value === "string" ? value : value ? URL.createObjectURL(value) : "";

  return (
    <div className="col d-flex justify-content-center">
      <div className="card shadow-sm p-3 text-center" style={{ width: "100%" }}>
        <div className="fw-bold mb-2">{label}</div>
        <div
          className="mx-auto mb-2"
          style={{
            width: "100%",
            height: "150px",
            backgroundColor: value ? "transparent" : "#EFF1F5",
            border: "1px dashed #CFB53B",
            borderRadius: "8px",
            position: "relative",
          }}
        >
          {value ? (
            <img
              src={src}
              alt={label}
              className="img-fluid"
              style={{ maxHeight: "100%", maxWidth: "100%", cursor: "zoom-in" }}
              onClick={() => onZoom(src)}
            />
          ) : (
            <i
              className="bi bi-card-image text-secondary"
              style={{ fontSize: "2.5rem", lineHeight: "150px" }}
            />
          )}
          <input
            type="file"
            accept="image/jpeg, image/jpg"
            ref={ref}
            style={{ display: "none" }}
            onChange={(e) => onUpdateImage(type, e.target.files[0])}
          />
        </div>
        {isEmployee && (
          <button
            className="btn btn-outline-warning"
            style={{ borderRadius: 5, width: "100%" }}
            onClick={() => ref.current.click()}
          >
            تعديل
          </button>
        )}
      </div>
    </div>
  );
};

const AttachmentsSection = ({ files, isEmployee, onZoom, onUpdateImage }) => {
  const items = [
    { type: "degree", label: "صورة المؤهل", value: files.degree },
    { type: "personal", label: "صورة الشخصية", value: files.personal },
    { type: "idFront", label: "صورة البطاقة وجه", value: files.idFront },
    { type: "idBack", label: "صورة البطاقة ظهر", value: files.idBack },
  ];
  return (
    <div className="row row-cols-1 row-cols-md-2 row-cols-lg-2 g-4 mb-5 justify-content-center">
      {items.map((it) => (
        <AttachmentCard
          key={it.type}
          {...it}
          isEmployee={isEmployee}
          onZoom={onZoom}
          onUpdateImage={onUpdateImage}
        />
      ))}
    </div>
  );
};

export default AttachmentsSection;

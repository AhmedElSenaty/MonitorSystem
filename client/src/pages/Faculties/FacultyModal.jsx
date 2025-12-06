const FacultyModal = ({
  show,
  title,
  facultyName,
  onFacultyNameChange,
  onClose,
  onSave,
}) => {
  if (!show) return null;

  return (
    <div
      className="modal d-block"
      tabIndex="-1"
      style={{ backgroundColor: "rgba(0,0,0,0.4)" }}
    >
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header">
            <button
              type="button"
              className="btn-close ms-0"
              onClick={onClose}
            ></button>
            <h5 className="modal-title">{title}</h5>
          </div>
          <div className="modal-body">
            <input
              type="text"
              className="form-control"
              value={facultyName}
              onChange={(e) => onFacultyNameChange(e.target.value)}
              placeholder="اسم الكلية"
            />
          </div>
          <div className="modal-footer">
            <button className="btn btn-secondary" onClick={onClose}>
              إغلاق
            </button>
            <button className="btn btn-primary" onClick={onSave}>
              إضافة
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FacultyModal;

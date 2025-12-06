const AdminCommentSection = ({ comment, onChange, onSave, saving }) => {
  return (
    <div className="card">
      <div className="card-header">
        تعليق داخلي على الموظف (غير ظاهر للموظف)
      </div>

      <div className="card-body">
        <div className="mb-3">
          <label className="form-label">تعليق المشرف / مدير النظام</label>
          <textarea
            className="form-control"
            rows="5"
            value={comment}
            onChange={(e) => onChange(e.target.value)}
            disabled={saving}
          />

          <small className="text-muted d-block mt-2">
            هذا التعليق مرئي فقط للمشرفين ومدير النظام، ولن يظهر للموظف إطلاقًا.
          </small>
        </div>

        <button
          type="button"
          className="btn btn-primary"
          onClick={onSave}
          disabled={saving}
        >
          {saving ? "جاري الحفظ..." : "حفظ التعليق"}
        </button>
      </div>
    </div>
  );
};

export default AdminCommentSection;

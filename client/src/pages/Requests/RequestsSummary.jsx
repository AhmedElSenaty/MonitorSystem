const RequestsSummary = ({
  statusCounts,
  editMode,
  resultsVisible,
  onChangeEditMode,
  onToggleResultsVisibility,
}) => {
  const getEditModeLabel = () => {
    if (editMode === "open") return "فتح التعديل لكل الموظفين";
    if (editMode === "close") return "إغلاق التعديل لكل الموظفين";
    return "";
  };

  const getEditModeBadgeClass = () => {
    if (editMode === "open") return "bg-success";
    if (editMode === "close") return "bg-danger";
    return "bg-secondary";
  };

  const getResultsLabel = () => {
    if (resultsVisible === true) return "النتائج ظاهرة للمدراء و للموظفين";
    if (resultsVisible === false) return "النتائج مخفية عن المدراء و الموظفين ";
    return "حسب إعدادات النظام";
  };

  const getResultsBadgeClass = () => {
    if (resultsVisible === true) return "bg-info";
    if (resultsVisible === false) return "bg-dark";
    return "bg-secondary";
  };

  return (
    <div className="summary mb-4">
      {/* شريط علوي للإعدادات العامة */}
      <div className="card shadow-sm border-0 mb-3">
        <div className="card-body">
          <div className="d-flex flex-column flex-lg-row justify-content-between gap-3 align-items-start align-items-lg-center">
            {/* العنوان + حالة الإعدادات */}
            <div>
              <h5 className="mb-1 fw-bold">طلبات التعيين</h5>

              <div className="d-flex flex-column flex-sm-row gap-2 mt-1">
                <small className="text-muted">
                  وضع التعديل:&nbsp;
                  <span className={`badge ${getEditModeBadgeClass()}`}>
                    {getEditModeLabel()}
                  </span>
                </small>

                <small className="text-muted">
                  حالة عرض النتائج:&nbsp;
                  <span className={`badge ${getResultsBadgeClass()}`}>
                    {getResultsLabel()}
                  </span>
                </small>
              </div>
            </div>

            {/* الأكشنات العامة */}
            <div className="d-flex flex-wrap gap-2">
              <select
                className="form-select form-select-sm w-auto"
                value={editMode}
                onChange={(e) => onChangeEditMode(e.target.value)}
              >
                <option value="">اختر</option>
                <option value="open">فتح التعديل لكل الموظفين</option>
                <option value="close">إغلاق التعديل لكل الموظفين</option>
              </select>

              <button
                type="button"
                className={`btn btn-sm d-flex align-items-center gap-1 ${
                  resultsVisible ? "btn-info" : "btn-outline-secondary"
                }`}
                onClick={onToggleResultsVisibility}
              >
                <i className="bi bi-eye" />
                {resultsVisible === false
                  ? "إظهار نتائج الطلبات للموظفين"
                  : "إخفاء نتائج الطلبات عن الموظفين"}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* كروت الإحصائيات */}
      <div className="row mt-1">
        {["تحت المراجعة", "تم القبول", "تم الرفض"].map((status) => (
          <div className="col-12 col-sm-6 col-md-4 col-lg-4 mb-3" key={status}>
            <div
              className={`
                card status-card h-100 text-end border-0 shadow-sm
                ${
                  status === "تم القبول"
                    ? "status-card-success"
                    : status === "تم الرفض"
                    ? "status-card-danger"
                    : "status-card-warning"
                }
              `}
            >
              <div className="card-body py-3">
                <h6 className="card-title mb-1">{status}</h6>
                <h3 className="card-text fw-bold mb-0">
                  {statusCounts[status]}
                </h3>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RequestsSummary;

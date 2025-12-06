const RequestsTable = ({ requests, onToggleEdit, onViewProfile }) => {
  return (
    <div className="requests-table-wrapper table-responsive">
      <table className="table table-hover text-end align-middle table-striped">
        <thead className="table-secondary">
          <tr>
            <th className="w-25">الإسم</th>
            <th className="d-none d-md-table-cell text-break">نوع</th>
            <th className="text-break">المؤهل</th>
            <th className="text-break">نوع الموظف</th>
            <th className="w-25 text-break">الكليات</th>
            <th className="d-none d-md-table-cell text-break">الحالة</th>
            <th className="text-center" style={{ minWidth: "140px" }}>
              الإجراءات
            </th>
          </tr>
        </thead>
        <tbody>
          {requests.length > 0 ? (
            requests.map((request, index) => (
              <tr key={index}>
                <td data-label="الإسم">{request.name}</td>

                <td
                  className="d-none d-md-table-cell text-break"
                  data-label="النوع"
                >
                  {request.gender}
                </td>

                <td className="text-break" data-label="المؤهل">
                  {request.degree}
                </td>

                <td className="text-break" data-label="نوع الموظف">
                  {request.employeeType}
                </td>

                <td
                  className="text-break"
                  data-label="الكليات"
                  style={{
                    maxWidth: "200px",
                    whiteSpace: "normal",
                    wordWrap: "break-word",
                  }}
                >
                  {request.faculties.length > 0 ? (
                    request.faculties.map((f, i) => (
                      <span key={i} style={{ display: "inline-block" }}>
                        {f}
                        {i !== request.faculties.length - 1 && ", "}
                      </span>
                    ))
                  ) : (
                    <span>لا يوجد كليات</span>
                  )}
                </td>

                <td
                  className="d-none d-md-table-cell text-break"
                  data-label="الحالة"
                  style={{
                    color:
                      request.status === "تحت المراجعة"
                        ? "#AD8700"
                        : request.status === "تم القبول"
                        ? "green"
                        : "red",
                  }}
                >
                  {request.status}
                </td>

                <td className="text-center" data-label="الإجراءات">
                  <div className="d-flex flex-column flex-md-row justify-content-center gap-2">
                    <button
                      type="button"
                      className={`btn btn-sm ${
                        request.canEdit ? "btn-danger" : "btn-success"
                      } w-100 w-md-auto`}
                      onClick={() => onToggleEdit(request.ssn, index)}
                    >
                      {request.canEdit ? "إغلاق التعديل" : "فتح التعديل"}
                    </button>

                    <button
                      type="button"
                      className="btn btn-sm btn-primary w-100 w-md-auto"
                      onClick={() => onViewProfile(request.ssn, request.id)}
                    >
                      عرض
                    </button>
                  </div>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="7" className="text-center">
                لا يوجد بيانات
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default RequestsTable;

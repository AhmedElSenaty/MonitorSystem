const FacultyRequestsTable = ({ requests, onViewProfile }) => {
  return (
    <div className="faculty-requests-table-wrapper table-responsive">
      <table className="table table-hover text-end align-middle table-striped">
        <thead className="table-secondary">
          <tr>
            <th className="w-25">الإسم</th>
            <th className="d-none d-md-table-cell text-break">نوع</th>
            <th className="text-break">المؤهل</th>
            <th className="d-none d-md-table-cell text-break">الهاتف</th>
            <th className="text-center" style={{ minWidth: "80px" }}>
              تحكم
            </th>
          </tr>
        </thead>
        <tbody>
          {requests.length > 0 ? (
            requests.map((request, index) => (
              <tr key={index}>
                <td>{request.name}</td>

                <td className="d-none d-md-table-cell text-break">
                  {request.gender}
                </td>

                <td className="text-break">{request.degree}</td>

                <td className="d-none d-md-table-cell text-break">
                  {request.phone}
                </td>

                <td className="text-center">
                  <button
                    className="btn btn-primary btn-sm"
                    onClick={() => onViewProfile(request.ssn, request.id)}
                  >
                    عرض
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5" className="text-center">
                لا يوجد بيانات
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default FacultyRequestsTable;

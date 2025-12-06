const statusClass = (s) =>
  s === "تم القبول"
    ? "text-success"
    : s === "تحت المراجعة"
    ? "text-warning"
    : "text-danger";


const RequestStatusPanel = ({
  request,
  isEmployee,
  isAdmin,
  onOpenFaculties,
  onOpenNotes,
  onReject,
  onRejectAfterAccept, // 👈 جديد
}) => {
  return (
    <>
      <h2 className="mb-3">حالة الطلب</h2>
      <div className="row justify-content-center">
        <div className="col-12 col-lg-12">
          <div className="table-responsive shadow-lg rounded">
            <table className="table table-bordered text-center mb-0 w-100">
              <thead className="">
                <tr>
                  <th>الحالة</th>
                  <th>ملاحظات</th>
                  <th>تحكم</th>
                </tr>
              </thead>
              <tbody>
                <tr className="align-middle">
                  <td className={`${statusClass(request.status)} w-25`}>
                    {request.status}
                  </td>
                  <td
                    dir="rtl"
                    className="text-break w-50"
                    style={{ whiteSpace: "pre-wrap", maxWidth: 300 }}
                  >
                    {request.notes || (
                      <span className="text-muted">لا توجد ملاحظات</span>
                    )}
                  </td>
                  <td className="w-25">
                    {(isEmployee || isAdmin) && (
                      <button
                        className="btn btn-outline-primary btn-main btn-sm mt-1"
                        onClick={onOpenFaculties}
                        disabled={
                          request.status === "تحت المراجعة" ||
                          request.status === "تم الرفض"
                        }
                        style={{ backgroundColor: "#19355A" }}
                      >
                        عرض الكليات
                      </button>
                    )}
                    {isAdmin &&
                      (request.status === "تم الرفض" ||
                        request.status === "تحت المراجعة" ||
                        request.status === "تم الرفض بعد القبول" ||
                        request.status === "تم القبول") && (
                        <>
                          <button
                            style={{ backgroundColor: "#19355A" }}
                            className="btn btn-outline-primary btn-main btn-sm mt-1 mx-1"
                            onClick={onOpenNotes}
                          >
                            اضف ملاحظة
                          </button>
                          {request.status === "تحت المراجعة" && (
                            <>
                              <button
                                className="btn btn-outline-success btn-sm mx-2 mt-2"
                                onClick={onOpenFaculties}
                              >
                                قبول
                              </button>
                              <button
                                className="btn btn-outline-danger btn-sm mx-2 mt-2"
                                onClick={onReject}
                              >
                                رفض
                              </button>
                            </>
                          )}
                          {(request.status === "تم الرفض" ||
                            request.status === "تم الرفض بعد القبول") && (
                            <button
                              style={{ backgroundColor: "#AD8700" }}
                              className="btn btn-outline-warning btn-main-s btn-sm mt-1 mx-1"
                              onClick={onOpenFaculties}
                            >
                              قبول مره اخري
                            </button>
                          )}
                          {/* ✅ تم القبول → رفض بعد القبول */}
                          {request.status === "تم القبول" && (
                            <button
                              className="btn btn-outline-danger btn-sm mx-2 mt-2"
                              onClick={onRejectAfterAccept}
                            >
                              رفض بعد القبول
                            </button>
                          )}
                        </>
                      )}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
};

export default RequestStatusPanel;

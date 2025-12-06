import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChevronRight,
  faPlus,
  faFileExcel,
} from "@fortawesome/free-solid-svg-icons";

const FacultiesHeader = ({
  isEmployee,
  isAdmin,
  isSuperAdmin,
  hasEmpId,
  facultiesCount,
  onBack,
  onSave,
  onAddFaculty,
  onExportAll,
}) => {
  return (
    <>
      {/* زر الرجوع */}
      <div className="mb-3">
        <button
          type="button"
          className="btn btn-outline-primary"
          onClick={onBack}
        >
          <FontAwesomeIcon icon={faChevronRight} className="ms-2" />
          رجوع
        </button>
      </div>

      {/* العنوان */}
      <h2 style={{ color: "#19355A" }} className="mb-4">
        الكليات
      </h2>

      {/* أزرار الأكشن */}
      {!isEmployee && (
        <div className="row mb-3 justify-content-start g-2">
          {(isAdmin || isSuperAdmin) && hasEmpId && (
            <div className="col-auto">
              <button
                className="btn btn-outline-warning rounded-0 w-100"
                onClick={onSave}
              >
                حفظ
              </button>
            </div>
          )}

          {isSuperAdmin && !hasEmpId && (
            <div className="col-auto">
              <button
                className="btn btn-primary rounded-0 w-100"
                onClick={onAddFaculty}
              >
                <FontAwesomeIcon icon={faPlus} className="ms-2" />
                اضف كلية
              </button>
            </div>
          )}

          {!hasEmpId && facultiesCount > 0 && (
            <div className="col-auto">
              <button
                className="btn btn-outline-success rounded-0 w-100"
                onClick={onExportAll}
              >
                <FontAwesomeIcon icon={faFileExcel} className="ms-2" />
                تصدير الكل
              </button>
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default FacultiesHeader;

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFileExcel } from "@fortawesome/free-solid-svg-icons";

const FacultyRequestsFilters = ({
  searchTerm,
  requestsPerPage,
  onSearchChange,
  onPageSizeChange,
  onExportAll,
  isRequestsShowed,
}) => {
  return (
    <div className="search mb-4">
      <div className="row g-2">
        <div className="col-12 col-md-6 col-lg-3">
          <input
            type="text"
            className="form-control"
            placeholder="بحث بالاسم أو الرقم القومي..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>

        <div className="col-auto">
          <button
            disabled={!isRequestsShowed}
            className="btn btn-outline-success rounded-0"
            type="button"
            onClick={onExportAll}
          >
            <FontAwesomeIcon icon={faFileExcel} className="ms-2" />
            تصدير الكل
          </button>
        </div>

        <div className="col-12 col-md-6 col-lg-3">
          <select
            className="form-select"
            value={requestsPerPage}
            onChange={(e) => onPageSizeChange(e.target.value)}
          >
            <option value="10">اختار عدد الطلبات (10)</option>
            <option value="15">15</option>
            <option value="20">20</option>
            <option value="25">25</option>
            <option value="30">30</option>
            <option value="35">35</option>
          </select>
        </div>
      </div>
    </div>
  );
};

export default FacultyRequestsFilters;

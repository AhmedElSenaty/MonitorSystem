import { useMemo } from "react";
import Select from "react-select";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFileExcel } from "@fortawesome/free-solid-svg-icons";

const RequestsFilters = ({
  searchTerm,
  statusFilter,
  degreeFilter,
  employeeTypeFilter,
  requestsPerPage,
  onSearchChange,
  onStatusFilterChange,
  onDegreeFilterChange,
  onEmployeeTypeFilterChange,
  onPageSizeChange,
  degreeMap,
  employeeTypeMap,
  departments,
  departmentFilter,
  onDepartmentFilterChange,
  onExportReport,
  isExporting, // 👈 جديد
}) => {
  const deptOptions = useMemo(() => {
    if (!departments) return [];
    return departments.map((d) => ({
      value: d.id,
      label: d.name,
    }));
  }, [departments]);

  const customStyles = {
    control: (base) => ({
      ...base,
      direction: "rtl",
      textAlign: "right",
      minHeight: "38px",
    }),
    menu: (base) => ({
      ...base,
      direction: "rtl",
      textAlign: "right",
    }),
    option: (base) => ({
      ...base,
      textAlign: "right",
    }),
  };

  return (
    <div className="search mb-4">
      <div className="row g-2">
        {/* بحث بالاسم / الرقم القومي */}
        <div className="col-12 col-md-6 col-lg-2">
          <input
            type="text"
            className="form-control"
            placeholder="بحث بالاسم أو الرقم القومي..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>

        {/* حالة الطلب */}
        <div className="col-12 col-md-6 col-lg-2">
          <select
            className="form-select"
            value={statusFilter}
            onChange={(e) => onStatusFilterChange(e.target.value)}
          >
            <option value="">كل الحالات</option>
            <option value="تحت المراجعة">تحت المراجعة</option>
            <option value="تم القبول">تم القبول</option>
            <option value="تم الرفض">تم الرفض</option>
          </select>
        </div>

        {/* المؤهل */}
        <div className="col-12 col-md-6 col-lg-2">
          <select
            className="form-select"
            value={degreeFilter}
            onChange={(e) => onDegreeFilterChange(e.target.value)}
          >
            <option value="">كل المؤهلات</option>
            {Object.entries(degreeMap).map(([key, value]) => (
              <option key={key} value={key}>
                {value}
              </option>
            ))}
          </select>
        </div>

        {/* نوع الموظف */}
        <div className="col-12 col-md-6 col-lg-2">
          <select
            className="form-select"
            value={employeeTypeFilter}
            onChange={(e) => onEmployeeTypeFilterChange(e.target.value)}
          >
            <option value="">كل أنواع الموظفين</option>
            {Object.entries(employeeTypeMap).map(([key, value]) => (
              <option key={key} value={key}>
                {value}
              </option>
            ))}
          </select>
        </div>

        {/* الكلية — React Select */}
        <div className="col-12 col-md-6 col-lg-2">
          <Select
            isClearable
            styles={customStyles}
            placeholder="اختر الكلية..."
            options={deptOptions}
            value={deptOptions.find((x) => x.value == departmentFilter) || null}
            onChange={(opt) => onDepartmentFilterChange(opt?.value || "")}
          />
        </div>

        {/* عدد النتائج + زر Excel مع لودينج */}
        <div className="col-12 col-md-6 col-lg-2 d-flex align-items-center gap-2">
          <select
            className="form-select"
            value={requestsPerPage}
            onChange={(e) => onPageSizeChange(Number(e.target.value))}
          >
            <option value={10}>العدد (10)</option>
            <option value={15}>15</option>
            <option value={20}>20</option>
            <option value={25}>25</option>
            <option value={30}>30</option>
            <option value={35}>35</option>
          </select>

          <button
            type="button"
            className="btn btn-outline-success d-flex align-items-center justify-content-center"
            title="تصدير التقرير إلى Excel"
            onClick={onExportReport}
            disabled={isExporting} // 👈 يقفل الزر وقت اللودينج
            style={{ width: "42px", height: "38px" }} // عشان الحجم يثبت
          >
            {isExporting ? (
              <span
                className="spinner-border spinner-border-sm"
                role="status"
                aria-hidden="true"
              />
            ) : (
              <FontAwesomeIcon icon={faFileExcel} />
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default RequestsFilters;
